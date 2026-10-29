import express from "express";
import medlexiconRoutes from "./main/routes.js";
import bodypartsrouter from "./body-parts/routes.js";
import medicinesrouter from "./medicines/routes.js";
import { errorHandler } from "./shared/error-handler.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "MedLexicon API is running"
    });
});

app.use("/api/medlexicon", medlexiconRoutes);
app.use("/api/body-parts", bodypartsrouter);
app.use("/api/medicines", medicinesrouter);

app.use(errorHandler);

export default app;