import homeRoute from "./routes/home.route";
import loginRoute from "./routes/login.route";
import productRoute from "./routes/product.route";
import productsRoute from "./routes/products.route";
import registerRoute from "./routes/register.route";
import "./style.css";
import type { Route } from "./types";

const app = document.querySelector<HTMLDivElement>("#app");

const routes: Record<string, Route> = {
  "/": homeRoute,
  "/login": loginRoute,
  "/register": registerRoute,
  "/product": productRoute,
  "/products": productsRoute,
  404: { html: `<h1>404</h1><p>Page not found.</p>` },
};
let currentRoute: Route | null = null;

export async function router() {
  if (!app) {
    throw new Error("Could not find #app div");
  }

  const path = location.pathname.split("?")[0] || "/";

  await currentRoute?.onDestroy?.();

  currentRoute = routes[path] || routes[404];

  app.innerHTML = currentRoute.html;
  await currentRoute.onLoad?.();
}

window.addEventListener("load", router);
