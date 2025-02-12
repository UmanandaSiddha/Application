import express from "express";
import ErrorMiddleware from "./middleware/error.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors, { CorsOptions } from "cors";
import helmet from "helmet";
import limiter from "./config/rateLimiter.js";

import user from "./routes/user.routes.js";
import googleRoute from "./routes/google.routes.js";
import plan from "./routes/plan.routes.js";
import sub from "./routes/subscription.routes.js";
import cards from "./routes/card.routes.js";
import donator from "./routes/donator.routes.js";
import admin from "./routes/admin.routes.js";
import contact from "./routes/contact.routes.js";

const app = express();

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            "https://voolata.com",
			"https://admin.voolata.com",
			"https://evoolfoundation.org",
			"https://www.voolata.com",
			"https://www.admin.voolata.com",
			"https://www.evoolfoundation.org",
			"http://localhost:5173",
			"http://localhost:5174",
        ];

        if (!origin || allowedOrigins.includes(origin as string)) {
            callback(null, origin);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
};

app.set('trust proxy', 1);
app.use(cors(corsOptions));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(limiter);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.static("public"));

app.use("/api/v1/user", user);
app.use("/", googleRoute);
app.use("/api/v1/cards", cards);
app.use("/api/v1/plan", plan);
app.use("/api/v1/sub", sub);
app.use("/api/v1/donate", donator);
app.use("/api/v1/contact", contact);
app.use("/api/v1/admin", admin);

app.use(ErrorMiddleware);

export default app;