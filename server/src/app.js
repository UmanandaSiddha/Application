import express from "express";
import ErrorMiddleware from "./middleware/error.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import limiter from "./config/rateLimiter.js";

import user from "./routes/userRoute.js";
import googleRoute from "./routes/googleRoute.js";
import plan from "./routes/planRoute.js";
import sub from "./routes/subscriptionRoute.js";
import cards from "./routes/cardsRoute.js";
import donator from "./routes/donatorRoute.js";
import admin from "./routes/adminRoutes.js";
import contact from "./routes/contactRoute.js";

const app = express();

const corsOptions = {
	origin: (origin, callback) => {
		const allowedOrigins = [
			"https://voolata.com",
			"https://www.voolata.com",
			"https://admin.voolata.com",
			"https://www.admin.voolata.com",
			"http://localhost:5173",
			"http://localhost:5174",
		];
		const isAllowed = allowedOrigins.includes(origin);
		callback(null, isAllowed ? origin : false);
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