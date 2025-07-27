import { Router } from "express";
import controller from "./categories.controller";

const router: Router = Router();

router.get("/", controller.handleGetCategories);

export default router;
