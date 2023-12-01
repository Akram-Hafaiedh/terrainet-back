import passport from "passport";
import User from "../models/User.js";
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GithubStrategy } from "passport-github2";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// Local strategy
passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'Incorrect email or password', detail: 'Email' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect email or password', detail: 'Password' })
            }
        } catch (error) {
            return done(error);
        }
    }
    )
);
// JWT strategy (for token-based authentication)
passport.use(new JWTStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET_KEY
    },
    async (payload, done) => {
        try {
            const user = await User.findById(payload.user.id);
            if (!user) {
                return done(null, false);
            }
            return done(null, user)
        } catch (error) {
            return done(error, false);
        }
    }
));
// Google OAuth2 strategy
passport.use(new GoogleStrategy(
    {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:4000/auth/google/callback",
        scope: ['profile', 'email', 'openid'],
        prompt: 'select_account',
    },
    (accessToken, refreshToken, profile, done) => {
        // Your Google authentication logic
        // Replace this with your actual user authentication logic
        const user = {
            id: profile.id, // User ID (unique identifier on Google)
            displayName: profile.displayName, // User's display name
            // rawJson: profile._json,
            email: profile.emails[0].value, // User's email address (first email in the array)
            picture: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null, // Array of user's profile pictures
            givenName: profile.name.givenName,// User's first name
            familyName: profile.name.familyName, // User's last name
            locale: profile._json.locale,// User's preferred locale (language and country)
            gender: profile.gender, // User's gender ('male', 'female', 'other')
            birthday: profile._json.birthday, // User's birthday (if available)
            accessToken,
            refreshToken,
        };
        return done(null, user);
    }
));
// Facebook OAuth2 strategy
passport.use(new FacebookStrategy(
    {
        clientID: FACEBOOK_CLIENT_ID,
        clientSecret: FACEBOOK_CLIENT_SECRET,
        callbackURL: 'http://localhost:4000/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'emails', 'photos'],
        // scope: [ 'email', 'user_friends' , 'displayName'],
    },
    (accessToken, refreshToken, profile, done) => {
        // Your Facebook authentication logic
        // Replace this with your actual user authentication logic

        // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
        //     return done(err, user);
        // });
        const user = {
            // profile,
            // User ID (unique identifier on Facebook)
            id: profile.id,
            displayName: profile.displayName,       // User's display name
            email: profile.emails && profile.emails[0].value,  // User's email address (if available)
            picture: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,  // User's profile picture

            // Additional properties available in the raw '_json' object returned by Facebook:
            // rawJson: profile._json,
        };
        return done(null, user);
    }
));

passport.use(
    new GithubStrategy(
        {
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackURL: 'http://localhost:4000/auth/github/callback',
            profileFields: ['id', 'displayName', 'emails', 'photos'],
            // scope: [ 'email', 'user_friends' , 'displayName'],
        },
        (accessToken, refreshToken, profile, done) => {
            // Your Facebook authentication logic
            // Replace this with your actual user authentication logic

            // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
            //     return done(err, user);
            // });
            const user = {

                // profile,
                // User ID (unique identifier on Facebook)
                id: profile.id,
                displayName: profile.displayName,       // User's display name
                email: profile.emails && profile.emails[0].value,  // User's email address (if available)
                picture: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,  // User's profile picture

                // Additional properties available in the raw '_json' object returned by Facebook:
                // rawJson: profile._json,
            };
            return done(null, user);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
})
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
})

export default passport;