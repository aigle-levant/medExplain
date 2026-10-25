import { Router } from "express";
import { search, getById } from "./controller.js";

const router = Router();

router.get("/", search);
router.get("/:id", getById);

export default router;