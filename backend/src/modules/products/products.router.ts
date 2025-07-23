import { validateRequest } from "@/middlewares/validateRequest";
import { Router } from "express";
import z from "zod";
import { getProducts } from "./products.service";

export default Router().get(
  "/all",
  validateRequest({
    query: z.object({
      page: z.string().transform((page) => parseInt(page)),
    }),
  }),
  async function (req, res) {
    const products = await getProducts();

    res.json({ count: products.length, products }).send();
  }
);
