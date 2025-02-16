import { Router } from "express";
import docusign from "docusign-esign";
import fs from "fs";
import path from "path";
import prisma from "./db.js";

const docusignRouter = Router();

function makeRecipientViewRequest(name, email) {
	const viewRequest = new docusign.RecipientViewRequest();

	viewRequest.returnUrl = `${process.env.FRONTEND}/userHome`;
	viewRequest.authenticationMethod = "none";

	viewRequest.email = email;
	viewRequest.userName = name;
	//viewRequest.clientUserId = 1000;

	return viewRequest;
}

function makeEnvelopeCompany(name, email, company, data) {
	const env = new docusign.EnvelopeDefinition();
	env.templateId = process.env.TEMPLATE_ID_DOCUSIGN;

	const companyText = docusign.Text.constructFromObject({
		tabLabel: "company_name",
		value: company,
	});

	const dateText = docusign.Text.constructFromObject({
		tabLabel: "date",
		value: data.date,
	});

	const priceNumber = docusign.Text.constructFromObject({
		tabLabel: "price",
		value: data.price.toString(),
	});

	const equityNumber = docusign.Text.constructFromObject({
		tabLabel: "equity",
		value: data.equity.toString(),
	});

	const tabs = docusign.Tabs.constructFromObject({
		textTabs: [companyText, dateText],
		numberTabs: [priceNumber, equityNumber],
	});

	const signer1 = docusign.TemplateRole.constructFromObject({
		email: email,
		name: name,
		tabs: tabs,
		//clientUserId: 1000,
		roleName: "Applicant 1",
	});
	env.templateRoles = [signer1];
	env.status = "sent";

	return env;
}

function makeEnvelopeInvestors(investors) {
	const env = new docusign.EnvelopeDefinition();
	env.templateId = process.env.TEMPLATE_ID_INVESTORS_DOCUSIGN;
	env.status = "sent";

	const signers = investors.map((investor, index) => {
		return docusign.TemplateRole.constructFromObject({
			email: investor.email,
			name: investor.name,
			roleName: `Applicant ${index}`,
		});
	});
	env.templateRoles = signers;
	return env;
}

function getEnvelopeApi(req) {
	const dsApiClient = new docusign.ApiClient();
	dsApiClient.setBasePath(process.env.BASE_PATH_DOCUSIGN);
	dsApiClient.addDefaultHeader(
		"Authorization",
		"Bearer " + req.session.access_token,
	);
	return new docusign.EnvelopesApi(dsApiClient);
}

async function checkDocuSignToken(req) {
	if (req.session.access_token && Date.now() < req.session.expires_at) {
		console.log("re-using access_token ");
	} else {
		console.log("generating a new access token");
		const dsApiClient = new docusign.ApiClient();
		dsApiClient.setBasePath(process.env.BASE_PATH_DOCUSIGN);
		const results = await dsApiClient.requestJWTUserToken(
			process.env.INTEGRATION_KEY,
			process.env.USER_ID_DOCUSIGN,
			"openid, signature",
			fs.readFileSync(path.join("./src", "private.key")),
			3600,
		);
		req.session.access_token = results.body.access_token;
		req.session.expires_at = Date.now() + (results.body.expires_in - 60) * 1000;
	}
}

docusignRouter.post("/docusigninvestor", async (req, res) => {
	try {
		const { raisingFundsId } = req.body;
		await checkDocuSignToken(req);
		const eventNotification = new docusign.EventNotification();
		eventNotification.url =
			"https://d79c-156-213-237-58.ngrok-free.app/webhook";
		eventNotification.loggingEnabled = "true";
		eventNotification.requireAcknowledgment = "true";
		eventNotification.format = "json";
		eventNotification.envelopeEvents = [
			// { envelopeEventStatusCode: "sent" },
			// { envelopeEventStatusCode: "delivered" },
			{ envelopeEventStatusCode: "completed" },
			{ envelopeEventStatusCode: "declined" },
			//{ envelopeEventStatusCode: "voided" },
		];
		eventNotification.recipientEvents = [
			//{ recipientEventStatusCode: "Sent" },
			//{ recipientEventStatusCode: "Delivered" },
			{ recipientEventStatusCode: "Completed" },
			{ recipientEventStatusCode: "Declined" },
			//{ recipientEventStatusCode: "AutoResponded" },
		];

		const envelopesApi = getEnvelopeApi(req);
		const completedRaisingFunds = await prisma.raising_Funds.findUnique({
			where: { id: raisingFundsId },
			include: {
				fundraisers: {
					include: {
						investorUser: true,
						investorCompany: true,
					},
				},
			},
		});

		if (!completedRaisingFunds) {
			return res.status(404).json({ message: "Raising funds not found" });
		}
		const totalRaised = completedRaisingFunds.fundraisers.reduce(
			(sum, fundraiser) => sum + fundraiser.fundingAmount,
			0,
		);

		const isComplete =
			totalRaised >= completedRaisingFunds.fundingAmount ||
			completedRaisingFunds.remainingPortions === 0;

		if (!isComplete) {
			return res
				.status(400)
				.json({ message: "Raising funds is not yet complete" });
		}

		const investors = completedRaisingFunds.fundraisers.map((fundraiser) => ({
			name: fundraiser.investorUser?.name || fundraiser.investorCompany?.name,
			email:
				fundraiser.investorUser?.email || fundraiser.investorCompany?.email,
		}));

		if (investors.length === 0) {
			return res
				.status(400)
				.json({ message: "No investors found for this raising fund" });
		}

		const envelope = makeEnvelopeInvestors(investors);

		const results = await envelopesApi.createEnvelope(
			process.env.ACCOUNT_ID_DOCUSIGN,
			{
				envelopeDefinition: envelope,
			},
		);

		const recipientViews = await Promise.all(
			investors.map(async (investor, index) => {
				const viewRequest = makeRecipientViewRequest(
					investor.name,
					investor.email,
					index + 1,
				);
				return envelopesApi.createRecipientView(
					process.env.ACCOUNT_ID_DOCUSIGN,
					results.envelopeId,
					{ recipientViewRequest: viewRequest },
				);
			}),
		);
		res
			.status(200)
			.json({ redirectUrls: recipientViews.map((view) => view.url) });
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: "Error generating access token" });
	}
});

docusignRouter.post("/docusign", async (req, res) => {
	try {
		await checkDocuSignToken(req);
		const eventNotification = new docusign.EventNotification();
		eventNotification.url =
			"https://d79c-156-213-237-58.ngrok-free.app/webhook";
		eventNotification.loggingEnabled = "true";
		eventNotification.requireAcknowledgment = "true";
		eventNotification.format = "json";
		eventNotification.envelopeEvents = [
			// { envelopeEventStatusCode: "sent" },
			// { envelopeEventStatusCode: "delivered" },
			{ envelopeEventStatusCode: "completed" },
			{ envelopeEventStatusCode: "declined" },
			//{ envelopeEventStatusCode: "voided" },
		];
		eventNotification.recipientEvents = [
			//{ recipientEventStatusCode: "Sent" },
			//{ recipientEventStatusCode: "Delivered" },
			{ recipientEventStatusCode: "Completed" },
			{ recipientEventStatusCode: "Declined" },
			//{ recipientEventStatusCode: "AutoResponded" },
		];

		const company = await prisma.company_Profile.findUnique({
			where: { username: req.body.username },
		});

		if (!company) {
			return res.status(404).json({ message: "Company not found" });
		}
		const existingFund = await prisma.raising_Funds.findFirst({
			where: {
				companyId: company.id,
				status: { in: ["Pending", "Active"] },
			},
		});

		if (existingFund) {
			return res.status(400).json({
				message: "Company already has a pending or active raising fund",
			});
		}
		const envelopesApi = getEnvelopeApi(req);
		const envelope = makeEnvelopeCompany(
			req.body.name,
			req.body.email,
			req.body.company,
			req.body.data,
		);

		const results = await envelopesApi.createEnvelope(
			process.env.ACCOUNT_ID_DOCUSIGN,
			{
				envelopeDefinition: envelope,
			},
		);

		await prisma.raising_Funds.create({
			data: {
				equityPercentage: req.body.data.equity,
				fundingAmount: req.body.data.price,
				pricePerPortion: req.body.data.price / 10,
				totalPortions: 10,
				remainingPortions: 10,
				status: "Pending",
				date: new Date(req.body.data.date),
				envelopeId: results.envelopeId,
				company: { connect: { id: company.id } },
			},
		});
		const viewRequest = makeRecipientViewRequest(req.body.name, req.body.email);
		const recipientViewRequest = await envelopesApi.createRecipientView(
			process.env.ACCOUNT_ID_DOCUSIGN,
			results.envelopeId,
			{ recipientViewRequest: viewRequest },
		);

		res.status(200).json({ redirectUrl: recipientViewRequest.url });
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: "Error generating access token" });
	}
});

docusignRouter.post("/webhook", async (req, res) => {
	res.sendStatus(200);
	await checkDocuSignToken(req);
	// Handle the notification data
	const notification = req.body;
	// For debugging purposes, you can log the notification

	console.log("Received webhook notification:", JSON.stringify(notification));

	// Check for envelope status
	const envelopeStatus = notification.event;
	const envelopeId = notification.data.envelopeId;
	if (notification && envelopeStatus === "envelope-completed") {
		await prisma.raising_Funds.updateMany({
			where: { envelopeId },
			data: { status: "Active" },
		});
		console.log(
			`Envelope ${envelopeId} has been completed. Downloading the signed document...`,
		);
		downloadSignedDocument(envelopeId, req);
	} else if (envelopeStatus === "envelope-declined") {
		// Delete the record
		await prisma.raising_Funds.deleteMany({
			where: { envelopeId },
		});
		console.log(
			`Raising_Funds record for envelope ${envelopeId} deleted due to decline.`,
		);
	}
});

// Function to download the signed document from the completed envelope
async function downloadSignedDocument(envelopeId, req) {
	if (!envelopeId) {
		console.error("Envelope ID is required to download the signed document.");
		return;
	}

	const envelopesApi = getEnvelopeApi(req);

	try {
		// List documents in the envelope
		const results = await envelopesApi.listDocuments(
			process.env.ACCOUNT_ID_DOCUSIGN,
			envelopeId,
		);
		const documents = results.envelopeDocuments;

		for (const doc of documents) {
			// Skip the certificate of completion if you don't need it
			if (doc.documentId === "certificate") {
				continue;
			}

			// Get the document
			const document = await envelopesApi.getDocument(
				process.env.ACCOUNT_ID_DOCUSIGN,
				envelopeId,
				doc.documentId,
				null,
			);

			// Save the document
			const filePath = path.resolve("./src/documents", `signed_${doc.name}`);
			fs.writeFileSync(filePath, document, { encoding: "binary" });
			console.log(`Document ${doc.name} saved at ${filePath}`);
		}
	} catch (error) {
		console.error("Error downloading signed document:", error);
	}
}

export default docusignRouter;
