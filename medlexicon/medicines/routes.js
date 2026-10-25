
import { Router } from "express";
import {
    search,
    getById
} from "./controller.js";

const medicinesrouter = Router();

medicinesrouter.get("/", search);
medicinesrouter.get("/:id", getById);

export default medicinesrouter;
