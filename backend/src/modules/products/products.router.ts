import { validateRequest } from "@/middlewares/validateRequest";
import { Router } from "express";
import z from "zod";
import { getProductById, getProducts } from "./products.service";

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
      params: z.object({
        productId: z.cuid2(),
      }),
    }),
    async function (req, res) {
      const product = await getProductById(req.params.productId);

      res.json({ product });
    }
  )
  .patch(
    "/:productId",
    validateRequest({
      params: z.object({
        productId: z.cuid2(),
      }),
      body: z.object({
        label: z.string().optional(),
        description: z.string().optional(),
        price: z.string().optional(),
        categoryId: z.string().optional(),
      }),
    }),
    async function (req, res) {
      const result = await {};
    }
  );
