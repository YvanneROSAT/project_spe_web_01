import { requireAuth } from "@/middlewares/requireAuth";
import { validateRequest } from "@/middlewares/validateRequest";
import { Router } from "express";
import { ProductNotFoundError } from "../products/products.errors";
import { singleProductParamsSchema } from "../products/products.schemas";
import { addToCart } from "./cart.service";

export default Router()
  .get("/me", requireAuth)
  .post(
    "/add/:productId",
    requireAuth,
    validateRequest({ params: singleProductParamsSchema }),
    async function (req, res) {
      const { productId } = req.params;

      const success = await addToCart(req.user.userId, productId);
      if (!success) {
        throw new ProductNotFoundError();
      }

      return res.send();
    }
  );
