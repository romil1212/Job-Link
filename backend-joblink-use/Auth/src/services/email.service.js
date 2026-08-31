import nodemailer from "nodemailer";
import { google } from "googleapis";
import config from "../config/config.js";
import AppError from "../utils/AppError.js";

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    config.GOOGLE_MAIL_CLIENT_ID,
    config.GOOGLE_MAIL_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: config.GOOGLE_REFRESH_TOKEN,
});

export const sendEmail = async (to, subject, text, html) => {
  const logContext = {
    to,
    subject,
    provider: "gmail-oauth2",
  };

  try {
    const accessToken = await oauth2Client.getAccessToken();

    if (!accessToken?.token) {
      console.error("Email send failed", {
        ...logContext,
        step: "get-access-token",
        message: "Google OAuth did not return an access token",
      });

      throw new AppError("Failed to send email", 500);
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: config.GOOGLE_USER,
        clientId: config.GOOGLE_MAIL_CLIENT_ID,
        clientSecret: config.GOOGLE_MAIL_CLIENT_SECRET,
        refreshToken: config.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const info = await transporter.sendMail({
      from: `"JobLink" <${config.GOOGLE_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent", {
      ...logContext,
      messageId: info.messageId,
    });

    return {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
    };
  } catch (error) {
    if (!error.isOperational) {
      console.error("Email send failed", {
        ...logContext,
        step: "send-mail",
        name: error.name,
        code: error.code,
        command: error.command,
        responseCode: error.responseCode,
        message: error.message,
      });
    }

    throw new AppError("Failed to send email", 500);
  }
};
