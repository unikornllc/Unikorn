import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "./db.js";
import { suggestUsernamePassport } from "./controllers/user.js";

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
}
