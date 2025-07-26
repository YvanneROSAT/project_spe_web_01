import addProductPage from "./pages/add-product.page";
import cartRoute from "./pages/cart.page";
import homeRoute from "./pages/home.page";
import loginRoute from "./pages/login.page";
import productRoute from "./pages/product.page";
import productsRoute from "./pages/products.page";
import registerRoute from "./pages/register.page";
import "./style.css";
import type { Page } from "./types";

const app = document.querySelector<HTMLDivElement>("#app");

const routes: Record<string, Page> = {
  "/": homeRoute,
  "/login": loginRoute,
  "/register": registerRoute,
  "/cart": cartRoute,
  "/product": productRoute,
  "/products": productsRoute,
  "/add-product": addProductPage,
  404: { html: `<h1>404</h1><p>Page not found.</p>` },
};
let currentPage: Page | null = null;

export async function router() {
  if (!app) {
    throw new Error("Could not find #app div");
  }

  const path = location.pathname.split("?")[0] || "/";

  await currentPage?.onDestroy?.();

  currentPage = routes[path] || routes[404];

  app.innerHTML = currentPage.html;
  await currentPage.onLoad?.();
}

window.addEventListener("load", router);
