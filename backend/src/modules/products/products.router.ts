import { cspForPublicStats } from "@/middlewares/csp";
import { requireAuth } from "@/middlewares/requireAuth";
import { Router } from "express";
import {
  handleCreateProduct,
  handleDeleteProduct,
  handleGetProducts,
  handleGetProductStats,
  handleGetSingleProduct,
  handleUpdateProduct,
} from "./products.controller";

const router: Router = Router();

router.get("/", handleGetProducts);
router.post("/new", requireAuth, handleCreateProduct);

// URL de statistiques publiques (accessible à toutes les IP) - AVANT /:productId
// CSP désactivé pour cette route
router.get("/stats", cspForPublicStats(), handleGetProductStats);

router.get("/:productId", handleGetSingleProduct);
router.put("/:productId", requireAuth, handleUpdateProduct);
router.delete("/:productId", requireAuth, handleDeleteProduct);

export default router;
