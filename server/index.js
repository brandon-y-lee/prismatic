import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.js";
import clientRoutes from "./routes/client.js";
import projectRoutes from "./routes/projects.js";
import fundRoutes from "./routes/funds.js";
import nordigenRoutes from "./routes/nordigen.js";
import plaidRoutes from "./routes/plaid.js";
import assistantRoutes from "./routes/assistant.js";
import generalRoutes from "./routes/general.js";
import managementRoutes from "./routes/management.js";
import salesRoutes from "./routes/sales.js";
import parcelRoutes from './routes/parcels.js';

/* CONFIGURATION */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/client", clientRoutes);
app.use("/projects", projectRoutes);
app.use("/funds", fundRoutes);
app.use("/nordigen", nordigenRoutes);
app.use("/plaid", plaidRoutes);
app.use("/assistant", assistantRoutes);
app.use("/general", generalRoutes);
app.use("/management", managementRoutes);
app.use("/sales", salesRoutes);
app.use('/parcels', parcelRoutes);
app.use('/data', express.static('./data'));


/* MONGOOSE SETUP */
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});