
import { Router } from "express";
import {
    getAll,
    getByTermId
} from "./controller.js";

const bodypartsrouter = Router();

bodypartsrouter.get("/", getAll);
bodypartsrouter.get("/term/:id", getByTermId);

export default bodypartsrouter;
