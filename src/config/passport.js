import passport from "passport";
import User from "../models/User";
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from "passport-local";

passport.use(
    new LocalStrategy({ usenameField: 'email', passwordField: 'password' }, async (email, password, done) => {
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
    })
)

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