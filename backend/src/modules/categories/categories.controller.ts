import { Controller } from "@/types";
import { CategoriesResponse } from "common";
import { Request, Response } from "express";
import { getCategories } from "./categories.service";

export default {
  handleGetCategories: async function (req: Request, res: Response) {
    const categories = await getCategories();

    res.json({ categories } satisfies CategoriesResponse);
  },
} satisfies Controller;
