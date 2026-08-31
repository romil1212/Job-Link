import dotenv from "dotenv";

dotenv.config();

const requiredEnv = [
    "MONGO_URI",
    "CLIENT_URL",
    "SERVER_URL",
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
    "JWT_ACCESS_EXPIRES",
    "JWT_REFRESH_EXPIRES",
    "GOOGLE_MAIL_CLIENT_ID",
    "GOOGLE_MAIL_CLIENT_SECRET",
    "GOOGLE_REFRESH_TOKEN",
    "GOOGLE_USER",
    "GOOGLE_LOGIN_CLIENT_ID",
    "GOOGLE_LOGIN_CLIENT_SECRET",
    "GITHUB_CLIENT_ID",
    "GITHUB_CLIENT_SECRET",
    "GITHUB_CALLBACK_URL"
];

requiredEnv.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`${key} is not defined in environment variables`);
    }
});

const config = {
    PORT: process.env.PORT || 3000,

    NODE_ENV: process.env.NODE_ENV || "development",

    CLIENT_URL: process.env.CLIENT_URL,
    SERVER_URL: process.env.SERVER_URL,

    MONGO_URI: process.env.MONGO_URI,

    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,

    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES,

    GOOGLE_MAIL_CLIENT_ID: process.env.GOOGLE_MAIL_CLIENT_ID,
    GOOGLE_MAIL_CLIENT_SECRET: process.env.GOOGLE_MAIL_CLIENT_SECRET,

    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
    GOOGLE_USER: process.env.GOOGLE_USER,

    GOOGLE_LOGIN_CLIENT_ID: process.env.GOOGLE_LOGIN_CLIENT_ID,
    GOOGLE_LOGIN_CLIENT_SECRET: process.env.GOOGLE_LOGIN_CLIENT_SECRET,

    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,

    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,

    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
};

export default config;