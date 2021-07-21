const JwtStrategy = require("passport-jwt").Strategy;
const BearerStrategy = require("passport-http-bearer");
const { ExtractJwt } = require("passport-jwt");
const { jwtSecret } = require("./vars");
const authProviders = require("../services/authProviders");
const User = require("../models/user.model");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const jwtOptions = {
    secretOrKey: jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("Bearer"),
};

const jwt = async (payload, done) => {
    try {
        const user = await User.findById(payload.sub);
        if (user) {
            if (user.isEmailVerified === true && user.isActive === true)
                return done(null, user);
            else
                return done(
                    { message: "user not authorised. Contact Admin" },
                    null
                );
        }
        return done(null, false);
    } catch (error) {
        return done(error, false);
    }
};

const oAuth = (service) => async (token, done) => {
    try {
        const userData = await authProviders[service](token);
        const user = await User.oAuthLogin(userData);
        return done(null, user);
    } catch (err) {
        return done(err);
    }
};

exports.jwt = new JwtStrategy(jwtOptions, jwt);
exports.facebook = new BearerStrategy(oAuth("facebook"));
exports.google = new BearerStrategy(oAuth("google"));
