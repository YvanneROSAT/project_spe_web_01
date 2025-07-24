import { removeUndefinedFromObject } from "@/helpers";
import { requireAuth } from "@/middlewares/requireAuth";
import { validateRequest } from "@/middlewares/validateRequest";
import { Router } from "express";
import z from "zod";
import { ProductNotFoundError } from "./products.errors";
import {
  singleProductParamsSchema,
  updateProductSchema,
} from "./products.schemas";
import {
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "./products.service";

export default Router()
  .get(
    "/all",
    validateRequest({
      query: z.object({
        page: z.coerce.number(),
      }),
    }),
    async function (req, res) {
      const products = await getProducts(req.query.page);

      res.json({ count: products.length, products }).send();
    }
  )
  .get(
    "/:productId",
    validateRequest({
      params: singleProductParamsSchema,
    }),
    async function (req, res) {
      const product = await getProductById(req.params.productId);
      if (!product) {
        throw new ProductNotFoundError();
      }

      res.json({ product });
    }
  )
  .patch(
    "/:productId",
    validateRequest({
      params: singleProductParamsSchema,
      body: updateProductSchema,
    }),
    requireAuth, // todo: determine who can update products
    async function (req, res) {
      const productId = req.params.productId;
      const fieldsToUpdate = removeUndefinedFromObject(req.body);

      const success = await updateProduct(productId, fieldsToUpdate);
      if (!success) {
        throw new ProductNotFoundError();
      }

      res.send();
    }
  )
  .delete(
    "/:productId",
    validateRequest({
      params: singleProductParamsSchema,
    }),
    requireAuth, // todo: determine who can delete products
    async function (req, res) {
      const productId = req.params.productId;

      const success = await deleteProduct(productId);
      if (!success) {
        throw new ProductNotFoundError();
      }

      res.send();
    }
  );
