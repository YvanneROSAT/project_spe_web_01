import { removeUndefinedFromObject } from "@/helpers";
import { cspForPublicStats } from "@/middlewares/csp";
import { requireAuth } from "@/middlewares/requireAuth";
import { validateRequest } from "@/middlewares/validateRequest";
import {
  CreateProductResponse,
  createProductSchema,
  ProductsResponse,
  setProductSchema,
  SingleProductResponse,
} from "common";
import { Router } from "express";
import z from "zod";
import { ProductNotFoundError } from "./products.errors";
import { singleProductParamsSchema } from "./products.schemas";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  getPublicStats,
  PRODUCTS_PER_PAGE,
  updateProduct,
} from "./products.service";

const router: Router = Router();

router.get(
  "/",
  validateRequest({
    query: z.object({
      search: z.string().optional(),
      page: z.coerce.number().optional(),
    }),
  }),
  async function (req, res) {
    const { search, page } = req.query;

    const products = await getProducts(search, page);

    res.json({
      products,
      pageSize: PRODUCTS_PER_PAGE,
    } satisfies ProductsResponse);
  }
);
router.post(
  "/new",
  validateRequest({
    body: createProductSchema,
  }),
  requireAuth,
  async function (req, res) {
    const productId = await createProduct(req.body);

    res.json({ id: productId } satisfies CreateProductResponse);
  }
);

// URL de statistiques publiques (accessible à toutes les IP) - AVANT /:productId
router.get(
  "/stats",
  cspForPublicStats(), // CSP désactivé pour cette route
  async function (req, res) {
    const stats = await getPublicStats();

    res.json(stats);
  }
);

router.get(
  "/:productId",
  validateRequest({
    params: singleProductParamsSchema,
  }),
  async function (req, res) {
    const product = await getProductById(req.params.productId);
    if (!product) {
      throw new ProductNotFoundError();
    }

    res.json({ product } satisfies SingleProductResponse);
  }
);

router.put(
  "/:productId",
  validateRequest({
    params: singleProductParamsSchema,
    body: setProductSchema,
  }),
  requireAuth, // todo: determine who can update products
  async function (req, res) {
    const { productId } = req.params;
    const fieldsToUpdate = removeUndefinedFromObject(req.body);

    const success = await updateProduct(productId, fieldsToUpdate);
    if (!success) {
      throw new ProductNotFoundError();
    }

    res.send();
  }
);
router.delete(
  "/:productId",
  validateRequest({
    params: singleProductParamsSchema,
  }),
  requireAuth, // todo: determine who can delete products
  async function (req, res) {
    const { productId } = req.params;

    const success = await deleteProduct(productId);
    if (!success) {
      throw new ProductNotFoundError();
    }

    res.send();
  }
);

export default router;
