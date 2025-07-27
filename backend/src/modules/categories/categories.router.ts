import { Router } from "express";
import { handleGetCategories } from "./categories.controller";

const router: Router = Router();

router.get("/", handleGetCategories);

export default router;
