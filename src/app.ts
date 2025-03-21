import cors from "cors";
import express, { Express } from "express";
import rateLimit from "express-rate-limit";
import requestIp from "request-ip";
import { HttpStatus } from "./enums";
import { ApiError } from "./interfaces/http/utils/ApiError";

const app: Express = express();

app.use(cors());
app.use(requestIp.mw());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5000, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req, res) => {
        return req.clientIp ?? "[IP ADDRESS]";
    },
    handler: (_, __, ___, options) => {
        throw new ApiError(
            options.statusCode || HttpStatus.SERVER_ERROR,
            `There are too many requests. You are only allowed ${options.max
            } requests per ${options.windowMs / 60000} minutes`
        );
    },
});

app.use(limiter);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

export { app };
