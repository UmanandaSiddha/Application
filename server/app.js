import express from "express";
import ErrorMiddleware from "./middleware/error.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import cors from "cors";

import user from "./routes/userRoute.js";
import tree from "./routes/treeRoute.js";
import payment from "./routes/paymentRoute.js";
import personal from "./routes/peronalRoute.js";
import medical from "./routes/medicalRoute.js";
import creator from "./routes/creatorRoute.js";

const app = express();

const corsOptions = {
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:4173",
        "https://umanandasiddha.site",
        "https://www.umanandasiddha.site",
      ];
      const isAllowed = allowedOrigins.includes(origin);
      callback(null, isAllowed ? origin : false);
    },
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
  };

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(fileUpload());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));

app.use("/api/v1/user", user);
app.use("/api/v1/tree", tree);
app.use("/api/v1/pay", payment);
app.use("/api/v1/personal", personal);
app.use("/api/v1/medical", medical);
app.use("/api/v1/creator", creator);

app.use(ErrorMiddleware);

export default app;