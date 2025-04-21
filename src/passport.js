import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "./db.js";
import { suggestUsernamePassport } from "./controllers/user.js";


/*export default function configurePassport(passport) {
  console.log("Here is the google client id from passport");
  console.log(process.env.GOOGLE_CLIENT_ID);
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        const usernameSuggestions = await suggestUsernamePassport(
          profile.emails[0].value,
          profile.displayName
        );
        try {
          const user = await prisma.user.findUnique({
            where: {
              id: profile.id,
            },
          });
          if (user) {
            done(null, user);
          } else {
            const newUser = await prisma.user.create({
              data: {
                id: profile.id,
                name: profile.displayName,
                username: usernameSuggestions[0],
                email: profile.emails[0].value,
                password: "",
                description: "",
                title: "Mr",
                verified: profile.emails[0].verified,
              },
            });
            done(null, newUser);
          }
        } catch (e) {
          console.log(e);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    done(null, user);
  });
}*/

export default function configurePassport(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        const usernameSuggestions = await suggestUsernamePassport(
          profile.emails[0].value,
          profile.displayName
        );
        const role = "User"
        try {
          const account = await prisma.account.findUnique({
            where: {
              id: profile.id,
            },
          });
          if (account) {
            done(null, account);
          } else {
            const newAccount = await prisma.account.create({
              data: {
                id: profile.id,
                username: usernameSuggestions[0],
                email: profile.emails[0].value,
                password: "",
                mobileNumber: null, 
                role: role,
				        wallet: {
					        create: {},
				        },
                ledgerAccount: {
                  create: {
                    name: profile.displayName,
                  },
                },
                user: role === "User" ? {
                  create: {
                    name: profile.displayName,
                    description: "",
                    title: "Mr",
                  },
                } : undefined,
                company: role === "Company" ? {
                  create: {
                    name: profile.displayName,
                    description: "",
                    website: "",
                    founded: new Date(),
                    type: "Public",
                    hqLocation: "",
                    industry: "",
                  },
                } : undefined,
              },
            });
            done(null, newAccount);
          }
        } catch (e) {
          console.log(e);
        }
      }
    )
  );

  passport.serializeUser((account, done) => {
    done(null, account.id);
  });
  passport.deserializeUser(async (id, done) => {
    const account = await prisma.account.findUnique({
      where: {
        id: id,
      },
    });
    done(null, account);
  });
}