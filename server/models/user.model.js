const mongoose = require("mongoose");
const httpStatus = require("http-status");
const { omitBy, isNil } = require("lodash");
const bcrypt = require("bcryptjs");
const moment = require("moment-timezone");
const jwt = require("jwt-simple");
const { v4: uuidv4 } = require("uuid");
const APIError = require("../utils/APIError");
const { env, jwtSecret, jwtExpirationInterval } = require("../config/vars");
const { ROLES, PASSWORD_USER_FD, DONOR } = require("../config/constants");

/**
 * User Schema
 * @private
 */
const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            match: /^\S+@\S+\.\S+$/,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 128,
        },
        name: {
            type: String,
            maxlength: 128,
            index: true,
            trim: true,
        },
        services: {
            facebook: String,
            google: String,
        },
        role: {
            type: String,
            enum: ROLES,
            default: DONOR,
        },
        picture: {
            type: String,
            trim: true,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true,
        },
        rating: {
            type: Number,
            default: 0,
            required: true,
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
userSchema.pre("save", async function save(next) {
    try {
        // this.increment();
        if (!this.isModified(PASSWORD_USER_FD)) return next();

        const rounds = env === "test" ? 1 : 10;

        const hash = await bcrypt.hash(this.password, rounds);
        this.password = hash;

        return next();
    } catch (error) {
        return next(error);
    }
});

/**
 * Methods
 */
userSchema.method({
    transform() {
        const transformed = {};
        const fields = [
            "id",
            "name",
            "rating",
            "email",
            "picture",
            "role",
            "createdAt",
        ];

        fields.forEach((field) => {
            transformed[field] = this[field];
        });
        // console.log(transformed["rating"]);

        return transformed;
    },

    token() {
        const playload = {
            exp: moment().add(jwtExpirationInterval, "minutes").unix(),
            iat: moment().unix(),
            sub: this._id,
        };
        return jwt.encode(playload, jwtSecret);
    },

    async passwordMatches(password) {
        return bcrypt.compare(password, this.password);
    },
});

/**
 * Statics
 */
userSchema.statics = {
    /**
     * Get user
     *
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
    async get(id) {
        try {
            let user;

            if (mongoose.Types.ObjectId.isValid(id)) {
                user = await this.findById(id).exec();
            }
            if (user) {
                return user;
            }

            throw new APIError({
                message: "User does not exist",
                status: httpStatus.NOT_FOUND,
            });
        } catch (error) {
            throw error;
        }
    },

    /**
     * Find user by email and tries to generate a JWT token
     *
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
    async findAndGenerateToken(options) {
        const { email, password, refreshObject } = options;
        if (!email)
            throw new APIError({
                message: "An email is required to generate a token",
            });

        const user = await this.findOne({ email }).exec();
        const err = {
            status: httpStatus.UNAUTHORIZED,
            isPublic: true,
        };
        if (password) {
            if (user && (await user.passwordMatches(password))) {
                if (user.isEmailVerified) {
                    return { user, accessToken: user.token() };
                } else {
                    err.message = "User not verified";
                }

                if (!user.isActive && err.message === "") {
                    err.message = "User is not active";
                }
            } else {
                err.message = "Incorrect email or password";
            }
        } else if (refreshObject && refreshObject.userEmail === email) {
            if (moment(refreshObject.expires).isBefore()) {
                err.message = "Invalid refresh token.";
            } else {
                return { user, accessToken: user.token() };
            }
        } else {
            err.message = "Incorrect email or refreshToken";
        }
        throw new APIError(err);
    },

    /**
     * List users in descending order of 'createdAt' timestamp.
     *
     * @param {number} skip - Number of users to be skipped.
     * @param {number} limit - Limit number of users to be returned.
     * @returns {Promise<User[]>}
     */
    list({ page = 1, perPage = 30, name, email, role }) {
        const options = omitBy({ name, email, role }, isNil);

        return this.find(options)
            .sort({ createdAt: -1 })
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec();
    },

    /**
     * Return new validation error
     * if error is a mongoose duplicate key error
     *
     * @param {Error} error
     * @returns {Error|APIError}
     */
    checkDuplicateEmail(error) {
        if (error.name === "MongoError" && error.code === 11000) {
            return new APIError({
                message: '"email" already exists',
                status: httpStatus.CONFLICT,
                isPublic: true,
                stack: error.stack,
            });
        }
        return error;
    },

    async oAuthLogin({ service, id, email, name, picture }) {
        const user = await this.findOne({
            $or: [{ [`services.${service}`]: id }, { email }],
        });
        if (user) {
            user.services[service] = id;
            if (!user.name) user.name = name;
            if (!user.picture) user.picture = picture;
            return user.save();
        }
        const password = uuidv4();
        return this.create({
            services: { [service]: id },
            email,
            password,
            name,
            picture,
        });
    },
};

/**
 * @typedef User
 */
module.exports = mongoose.model("User", userSchema);
