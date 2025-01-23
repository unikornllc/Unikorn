import express from "express";
import bodyParser from "body-parser";
import router from "./router.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import configurePassport from "./passport.js";
import { protect } from "./controllers/auth.js";
import {
  createUser,
  verifyUser,
  signIn,
  suggestUsername,
} from "./controllers/user.js";
import { createCompany } from "./controllers/company_profile.js";
import { verifiedUser } from "./middlewares/verified_mail.js";
import {
  confirmPassword,
  checkEmail,
  checkUsername,
} from "./middlewares/signup.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { createJWT } from "./controllers/auth.js";
import crypto from "crypto";
import InMemorySessionStore from "./sessionStore.js";
import InMemoryMessageStore from "./messageStore.js";
import docusign from "docusign-esign";
import fs from "fs";
import path from "path";

const sessionStore = new InMemorySessionStore();
const messageStore = new InMemoryMessageStore();

const randomId = () => crypto.randomBytes(64).toString("hex");
const app = express();
configurePassport(passport);
// const csrfProtection = csrf();

// // initialize session
// app.use(
// 	session({
// 		secret: "my secret",
// 		resave: false,
// 		saveUninitialized: false,
// 		store: store,
// 	}),
// );
// app.use(csrfProtection);

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res, next) => {
  setTimeout(() => {
    next(new Error("hello"));
  }, 1);
});

const cookieOptions = {
  httpOnly: false,
  secure: false,
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: "lax",
};

// app.use(
// 	session({
// 		secret: randomString.generate({
// 			length: 20,
// 			charset: "alphanumeric",
// 		}),
// 		resave: false,
// 		saveUninitialized: false,
// 		cookie: cookieOptions,
// 		store: sessionStore,
// 	}),
// );

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND}/`,
  }),
  (req, res) => {
    const account = req.user;

    // Create a JWT token
    const token = createJWT({
      id: account.id,
      role: "user",
    });

    res.cookie("token", token, {
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.redirect(`${process.env.FRONTEND}/userHome`);
  }
);
app.get("/auth/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      console.error("Error during logout:", err);
      return next(err);
    }
    res.redirect(`${process.env.FRONTEND}/signin`);
  });
});

function makeRecipientViewRequest(name, email) {
  let viewRequest = new docusign.RecipientViewRequest();

  viewRequest.returnUrl = `${process.env.FRONTEND}/userHome`;
  viewRequest.authenticationMethod = "none";

  // Recipient information must match embedded recipient info
  // we used to create the envelope.
  viewRequest.email = email;
  viewRequest.userName = name;
  viewRequest.clientUserId = 1000;

  return viewRequest;
}

function makeEnvelope(name, email, company) {
  const env = new docusign.EnvelopeDefinition();
  env.templateId = process.env.TEMPLATE_ID_DOCUSIGN;

  const text = docusign.Text.constructFromObject({
    tabLabel: "company_name",
    value: company,
  });

  // Pull together the existing and new tabs in a Tabs object:
  const tabs = docusign.Tabs.constructFromObject({
    textTabs: [text],
  });

  const signer1 = docusign.TemplateRole.constructFromObject({
    email: email,
    name: name,
    tabs: tabs,
    clientUserId: 1000,
    roleName: "Applicant",
  });
  // signer1.emailNotification = new docusign.RecipientEmailNotification();
  // signer1.emailNotification.emailSubject = "Please sign this document";
  // signer1.emailNotification.emailBody = "Please sign the attached document.";
  // signer1.emailNotification.supportLanguage = "en";
  env.templateRoles = [signer1];
  env.status = "sent";

  return env;
}

function getEnvelopeApi(req) {
  const dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath(process.env.BASE_PATH_DOCUSIGN);
  dsApiClient.addDefaultHeader(
    "Authorization",
    "Bearer " + req.session.access_token
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
      3600
    );
    req.session.access_token = results.body.access_token;
    req.session.expires_at = Date.now() + (results.body.expires_in - 60) * 1000;
  }
}
app.post("/docusign", async (req, res) => {
  try {
    await checkDocuSignToken(req);
    const eventNotification = new docusign.EventNotification();
    eventNotification.url = "https://6711-102-40-1-245.ngrok-free.app/webhook";
    eventNotification.loggingEnabled = "true";
    eventNotification.requireAcknowledgment = "true";
    eventNotification.envelopeEvents = [
      // { envelopeEventStatusCode: "sent" },
      // { envelopeEventStatusCode: "delivered" },
      { envelopeEventStatusCode: "completed" },
      // { envelopeEventStatusCode: "declined" },
      //{ envelopeEventStatusCode: "voided" },
    ];
    eventNotification.recipientEvents = [
      //{ recipientEventStatusCode: "Sent" },
      //{ recipientEventStatusCode: "Delivered" },
      { recipientEventStatusCode: "Completed" },
      //{ recipientEventStatusCode: "Declined" },
      //{ recipientEventStatusCode: "AutoResponded" },
    ];

    const envelopesApi = getEnvelopeApi(req);
    const envelope = makeEnvelope(
      req.body.name,
      req.body.email,
      req.body.company
    );

    const results = await envelopesApi.createEnvelope(
      process.env.ACCOUNT_ID_DOCUSIGN,
      {
        envelopeDefinition: envelope,
      }
    );
    console.log("envelope results", results);
    const viewRequest = makeRecipientViewRequest(req.body.name, req.body.email);
    const recipientViewRequest = await envelopesApi.createRecipientView(
      process.env.ACCOUNT_ID_DOCUSIGN,
      results.envelopeId,
      { recipientViewRequest: viewRequest }
    );

    res.status(200).json({ redirectUrl: recipientViewRequest.url });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Error generating access token" });
  }
});

app.post("/webhook", async (req, res) => {
  res.sendStatus(200);
  await checkDocuSignToken(req);
  console.log("im him");
  // Handle the notification data
  const notification = req.body;

  // For debugging purposes, you can log the notification
  console.log("Received webhook notification:", JSON.stringify(notification));

  // Check for envelope status
  const envelopeStatus = notification.event;

  if (notification && envelopeStatus === "envelope-completed") {
    const envelopeId = notification.data.envelopeId;
    console.log(
      `Envelope ${envelopeId} has been completed. Downloading the signed document...`
    );
    downloadSignedDocument(envelopeId, req);
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
      envelopeId
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
        null
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

app.post("/createUser", checkEmail, checkUsername, confirmPassword, createUser);
app.post(
  "/createCompany",
  checkEmail,
  checkUsername,
  confirmPassword,
  createCompany
);
app.get("/verifyUser", verifyUser);
app.post("/signIn", verifiedUser, signIn);
app.get("/checkUsername", checkUsername);
app.get("/checkEmail", checkEmail);
app.get("/suggestUsername", suggestUsername);
app.use(protect, router);
//app.use(router);

server.listen(3002, () => {
  console.log("Server is running on port 3002");
});

io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  console.log(socket.handshake.auth.sessionID);
  if (sessionID) {
    // find existing session
    const session = sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.username = session.username;
      return next();
    }
  }
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  // create new session
  socket.sessionID = randomId();
  socket.userID = randomId();
  socket.username = username;
  next();
});

io.on("connection", async (socket) => {
  sessionStore.saveSession(socket.sessionID, {
    sessionID: socket.sessionID,
    userID: socket.userID,
    username: socket.username,
    connected: "online",
  });

  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
  });

  socket.join(socket.userID);

  const users = [];
  const sessions = sessionStore.findAllSessions();
  const messagesPerUser = new Map();
  messageStore.findMessagesForUser(socket.userID).forEach((message) => {
    const { from, to } = message;
    const otherUser = socket.userID === from ? to : from;
    if (messagesPerUser.has(otherUser)) {
      messagesPerUser.get(otherUser).push(message);
    } else {
      messagesPerUser.set(otherUser, [message]);
    }
  });
  sessions.forEach((session) => {
    users.push({
      userID: session.userID,
      username: session.username,
      connected: session.connected,
      messages: messagesPerUser.get(session.userID) || [],
    });
  });

  console.log("All sessions:", sessions);

  socket.emit("users", users);

  socket.broadcast.emit("user connected", {
    userID: socket.userID,
    username: socket.username,
    connected: "online",
    messages: [],
  });

  socket.on("private message", ({ content, to }) => {
    const message = {
      content,
      from: socket.userID,
      to,
    };
    socket.to(to).to(socket.userID).emit("private message", message);
    messageStore.saveMessage(message);
  });

  socket.on("disconnect", async () => {
    const matchingSockets = await io.in(socket.userID).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      // notify other users
      socket.broadcast.emit("user disconnected", socket.userID);
      // update the connection status of the session
      sessionStore.saveSession(socket.sessionID, {
        sessionID: socket.sessionID,
        userID: socket.userID,
        username: socket.username,
        connected: "offline",
      });
    }
  });
});
export default app;
