import { removeUndefinedFromObject } from "@/helpers";
import { validateRequest } from "@/middlewares/validateRequest";
import {
  CreateProductResponse,
  createProductSchema,
  ProductsResponse,
  setProductSchema,
  SingleProductResponse,
} from "common";
import { Request, Response } from "express";
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

export async function handleGetAllProducts(req: Request, res: Response) {
  const { query } = await validateRequest(req, {
    query: z.object({
      search: z.string().optional(),
      page: z.coerce.number().optional(),
    }),
  });

  const products = await getProducts(query.search, query.page);

  res.json({
    products,
    pageSize: PRODUCTS_PER_PAGE,
  } satisfies ProductsResponse);
}

export async function handleCreateProduct(req: Request, res: Response) {
  const { body } = await validateRequest(req, {
    body: createProductSchema,
  });

  const productId = await createProduct(body);

  res.json({ id: productId } satisfies CreateProductResponse);
}

export async function handleGetProductStats(req: Request, res: Response) {
  const stats = await getPublicStats();

  res.json(stats);
}

export async function handleGetSingleProduct(req: Request, res: Response) {
  const { params } = await validateRequest(req, {
    params: singleProductParamsSchema,
  });

  const product = await getProductById(params.productId);
  if (!product) {
    throw new ProductNotFoundError();
  }

  res.json({ product } satisfies SingleProductResponse);
}

export async function handleUpdateProduct(req: Request, res: Response) {
  const { params, body } = await validateRequest(req, {
    params: singleProductParamsSchema,
    body: setProductSchema,
  });

  const fieldsToUpdate = removeUndefinedFromObject(body);
  const success = await updateProduct(params.productId, fieldsToUpdate);
  if (!success) {
    throw new ProductNotFoundError();
  }

  res.send();
}

export async function handleDeleteProduct(req: Request, res: Response) {
  const { params } = await validateRequest(req, {
    params: singleProductParamsSchema,
  });

  const success = await deleteProduct(params.productId);
  if (!success) {
    throw new ProductNotFoundError();
  }

  res.send();
}
