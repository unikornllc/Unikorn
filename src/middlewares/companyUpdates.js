const allowedFields = [
	"name",
	"email",
	"username",
	"description",
	"website",
	"founded",
	"hqlocation",
	"hunter",
	"industry",
	"type",
	"board_members",
	"advisors",
	"activities",
	"founders",
	"key_employees",
	"product_information",
	"financials",
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidURL(string) {
	try {
		new URL(string);
		return true;
	} catch (_) {
		return false;
	}
}

export const validateUpdateCompanyProfile = (req, res, next) => {
	const { fieldName, fieldValue } = req.body;

	if (typeof fieldName !== "string") {
		return res.status(400).json({ error: "fieldName must be a string" });
	}

	if (!allowedFields.includes(fieldName)) {
		return res.status(400).json({ error: "Invalid field name" });
	}

	switch (fieldName) {
		case "name":
		case "username":
		case "description":
		case "hqlocation":
		case "industry":
		case "type":
			if (typeof fieldValue !== "string") {
				return res.status(400).json({ error: `${fieldName} must be a string` });
			}
			break;

		case "website":
			if (typeof fieldValue !== "string") {
				return res.status(400).json({ error: "website must be a string" });
			}
			if (!isValidURL(fieldValue)) {
				return res
					.status(400)
					.json({ error: "Invalid URL format for website" });
			}
			break;

		case "email":
			if (typeof fieldValue !== "string") {
				return res.status(400).json({ error: "email must be a string" });
			}
			if (!emailRegex.test(fieldValue)) {
				return res.status(400).json({ error: "Invalid email format" });
			}
			break;

		case "founded":
			if (isNaN(Date.parse(fieldValue))) {
				return res.status(400).json({ error: "Invalid date for founded" });
			}
			break;

		case "hunter":
			if (typeof fieldValue !== "boolean") {
				return res.status(400).json({ error: "hunter must be a boolean" });
			}
			break;

		case "board_members":
		case "advisors":
			if (
				!Array.isArray(fieldValue) ||
				!fieldValue.every((item) => typeof item === "string")
			) {
				return res
					.status(400)
					.json({ error: `${fieldName} must be an array of strings` });
			}
			break;

		case "activities":
			if (!Array.isArray(fieldValue)) {
				return res.status(400).json({ error: "activities must be an array" });
			}
			for (const activity of fieldValue) {
				if (typeof activity !== "object") {
					return res
						.status(400)
						.json({ error: "Each activity must be an object" });
				}
				if (
					typeof activity.title !== "string" ||
					typeof activity.description !== "string"
				) {
					return res.status(400).json({
						error: "Each activity must have title and description as strings",
					});
				}
			}
			break;

		case "founders":
			if (!Array.isArray(fieldValue)) {
				return res.status(400).json({ error: "founders must be an array" });
			}
			for (const founder of fieldValue) {
				if (typeof founder !== "object") {
					return res
						.status(400)
						.json({ error: "Each founder must be an object" });
				}
				if (
					typeof founder.name !== "string" ||
					typeof founder.role !== "string" ||
					typeof founder.crunch_base_link !== "string"
				) {
					return res.status(400).json({
						error:
							"Each founder must have name, role, and crunch_base_link as strings",
					});
				}
				// Validate that crunch_base_link is a valid URL
				if (!isValidURL(founder.crunch_base_link)) {
					return res.status(400).json({
						error: `Invalid URL format for founder's crunch_base_link: ${founder.crunch_base_link}`,
					});
				}
			}
			break;

		case "key_employees":
			if (!Array.isArray(fieldValue)) {
				return res
					.status(400)
					.json({ error: "key_employees must be an array" });
			}
			for (const employee of fieldValue) {
				if (typeof employee !== "object") {
					return res
						.status(400)
						.json({ error: "Each key_employee must be an object" });
				}
				if (
					typeof employee.name !== "string" ||
					typeof employee.role !== "string"
				) {
					return res.status(400).json({
						error: "Each key_employee must have name and role as strings",
					});
				}
			}
			break;

		case "product_information":
			if (!Array.isArray(fieldValue)) {
				return res
					.status(400)
					.json({ error: "product_information must be an array" });
			}
			for (const product of fieldValue) {
				if (typeof product !== "object") {
					return res
						.status(400)
						.json({ error: "Each product_information item must be an object" });
				}
				if (
					typeof product.product !== "string" ||
					typeof product.market !== "string"
				) {
					return res.status(400).json({
						error:
							"Each product_information item must have product and market as strings",
					});
				}
				if (
					!Array.isArray(product.partnerships) ||
					!product.partnerships.every((partner) => typeof partner === "string")
				) {
					return res.status(400).json({
						error: "partnerships must be an array of strings",
					});
				}
			}
			break;

		case "financials":
			if (typeof fieldValue !== "object" || Array.isArray(fieldValue)) {
				return res.status(400).json({ error: "financials must be an object" });
			}
			const { valuation, investors, total_funding_amount, funding_rounds } =
				fieldValue;

			if (typeof valuation !== "number" || valuation < 0) {
				return res
					.status(400)
					.json({ error: "valuation must be a non-negative number" });
			}
			if (
				!Array.isArray(investors) ||
				!investors.every((inv) => typeof inv === "string")
			) {
				return res
					.status(400)
					.json({ error: "investors must be an array of strings" });
			}
			if (
				typeof total_funding_amount !== "number" ||
				total_funding_amount < 0
			) {
				return res.status(400).json({
					error: "total_funding_amount must be a non-negative number",
				});
			}
			if (!Array.isArray(funding_rounds)) {
				return res
					.status(400)
					.json({ error: "funding_rounds must be an array" });
			}
			for (const round of funding_rounds) {
				if (typeof round !== "object") {
					return res
						.status(400)
						.json({ error: "Each funding_round must be an object" });
				}
				if (
					typeof round.type !== "string" ||
					typeof round.funding_amount !== "number"
				) {
					return res.status(400).json({
						error:
							"Each funding_round must have type as string and funding_amount as number",
					});
				}
				if (isNaN(Date.parse(round.round_date))) {
					return res
						.status(400)
						.json({ error: "Invalid date for funding_round.round_date" });
				}
				if (
					!Array.isArray(round.lead_investors) ||
					!round.lead_investors.every((inv) => typeof inv === "string")
				) {
					return res
						.status(400)
						.json({ error: "lead_investors must be an array of strings" });
				}
			}
			break;

		default:
			return res.status(400).json({ error: "Invalid field" });
	}

	next();
};
