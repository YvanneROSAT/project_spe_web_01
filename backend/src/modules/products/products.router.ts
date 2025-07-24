import { validateRequest } from "@/middlewares/validateRequest";
import { cspForPublicStats } from "@/middlewares/csp";
import { Router } from "express";
import z from "zod";
import { getProductById, getProducts, getPublicStats } from "./products.service";

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
  
  // URL de statistiques publiques (accessible à toutes les IP) - AVANT /:productId
  .get(
    "/stats",
    cspForPublicStats(), // CSP désactivé pour cette route
    async function (req, res) {
      try {
        const stats = await getPublicStats();
        res.json(stats);
      } catch (error) {
        res.status(500).json({ error: 'Erreur interne du serveur' });
      }
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
      res.json({ message: "Modification à implémenter" });
    }
  );
