import { cspForPublicStats } from "@/middlewares/csp";
import { requireAuth } from "@/middlewares/requireAuth";
import { Router } from "express";
import controller from "./products.controller";

const router: Router = Router();

router.get("/", controller.handleGetProducts);
router.post("/new", requireAuth, controller.handleCreateProduct);
// URL de statistiques publiques (accessible à toutes les IP) - AVANT /:productId
// CSP désactivé pour cette route
router.get("/stats", cspForPublicStats(), controller.handleGetProductStats);
router.get("/:productId", controller.handleGetSingleProduct);
router.put("/:productId", requireAuth, controller.handleUpdateProduct);
router.delete("/:productId", requireAuth, controller.handleDeleteProduct);

export default router;
