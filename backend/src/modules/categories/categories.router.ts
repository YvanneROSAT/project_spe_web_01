import { CategoriesResponse } from "common";
import { Router } from "express";
import { getCategories } from "./categories.service";

export default Router().get("/", async function (req, res) {
  const categories = await getCategories();

  res.json({ categories } satisfies CategoriesResponse);
});
