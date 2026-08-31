import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import config from "./config.js";
import axios from "axios";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_LOGIN_CLIENT_ID,
      clientSecret: config.GOOGLE_LOGIN_CLIENT_SECRET,
      callbackURL: `${config.SERVER_URL}/api/auth/google/callback`,
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google profile:", profile);

        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("Google account email not found"), null);
        }

        const googleUser = {
          googleId: profile.id,
          email,
          fullName: profile.displayName,
          firstName: profile.name?.givenName,
          lastName: profile.name?.familyName,
          profilePicture: profile.photos?.[0]?.value,
        };

        return done(null, googleUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.use(
    new GitHubStrategy(
        {
            clientID: config.GITHUB_CLIENT_ID,
            clientSecret: config.GITHUB_CLIENT_SECRET,
            callbackURL: config.GITHUB_CALLBACK_URL,
        },

        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log("GitHub profile:", profile);

                let email =
                    profile.emails?.[0]?.value ||
                    profile._json?.email;

                // GitHub may not return email in profile
                if (!email) {
                    const response = await axios.get(
                        "https://api.github.com/user/emails",
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                                Accept: "application/vnd.github+json",
                            },
                        }
                    );

                    console.log(
                        "GitHub emails:",
                        response.data
                    );

                    const primaryEmail =
                        response.data.find(
                            (email) =>
                                email.primary &&
                                email.verified
                        );

                    email = primaryEmail?.email;
                }

                if (!email) {
                    return done(
                        new Error(
                            "GitHub account email not found"
                        ),
                        null
                    );
                }

                const githubUser = {
                    githubId: profile.id,

                    email,

                    fullName:
                        profile.displayName ||
                        profile.username,

                    username:
                        profile.username,

                    profilePicture:
                        profile.photos?.[0]?.value,

                    firstName:
                        profile.name?.givenName,

                    lastName:
                        profile.name?.familyName,
                };

                console.log(
                    "GitHub user:",
                    githubUser
                );

                return done(null, githubUser);

            } catch (error) {
                console.error(
                    "GitHub OAuth error:",
                    error.response?.data ||
                    error.message
                );

                return done(error, null);
            }
        }
    )
);
export default passport;