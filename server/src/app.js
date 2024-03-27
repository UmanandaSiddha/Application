import express from "express";
import ErrorMiddleware from "./middleware/error.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import cors from "cors";

import user from "./routes/userRoute.js";
import payment from "./routes/paymentRoute.js";
import admin from "./routes/adminRoute.js";
import googleRoute from "./routes/googleRoute.js";
import plan from "./routes/planRoute.js";
import sub from "./routes/subscriptionRoute.js";
import cards from "./routes/cardsRoute.js";

const app = express();

const corsOptions = {
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://app.umanandasiddha.site",
        "https://www.app.umanandasiddha.site",
      ];
      const isAllowed = allowedOrigins.includes(origin);
      callback(null, isAllowed ? origin : false);
    },
    // origin: "https://app.umanandasiddha.site",
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
  };

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(fileUpload());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.static("public"));

app.use("/api/v1/user", user);
app.use("/", googleRoute);

app.use("/api/v1/cards", cards);
app.use("/api/v1/pay", payment);
app.use("/api/v1/admin", admin);
app.use("/api/v1/plan", plan);
app.use("/api/v1/sub", sub);

app.use(ErrorMiddleware);

export default app;