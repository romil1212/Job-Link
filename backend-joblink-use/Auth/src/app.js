import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";

import authRouter from "./routes/auth.routes.js";
import {
  publicProblemRouter,
  adminProblemRouter,
} from "./routes/problem.routes.js";
import {
  publicTestCaseRouter,
  adminTestCaseRouter,
  adminTestCaseIdRouter
} from "./routes/testCase.routes.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/error.middleware.js";

const app = express();

// Updated Helmet configuration to permit Cross-Origin requests from React
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS configuration to allow local React frontend access
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(passport.initialize());

app.use(morgan("dev"));

app.use(
  express.json({
    limit: "10kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

import { submissionRouter } from "./routes/submission.routes.js";

// Auth API Routes
app.use("/api/auth", authRouter);

// Problem Management Routes
app.use("/api/problems", publicProblemRouter);
app.use("/api/problems", publicTestCaseRouter);
app.use("/api/admin/problems", adminProblemRouter);
app.use("/api/admin", adminTestCaseRouter);
app.use("/api/admin/test-cases", adminTestCaseIdRouter);

// Submissions Routes
app.use("/api/submissions", submissionRouter);

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

export default app; 