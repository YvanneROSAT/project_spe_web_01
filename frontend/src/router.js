import { AddProduct } from "./views/add-product.js";
import { Cart } from "./views/cart.js";
import { Dashboard } from "./views/dashboard.js";
import { ConfirmDeleteProduct } from "./views/delete-product.js";
import { EditProduct } from "./views/edit-product.js";
import { Home } from "./views/home.js";
import { Login, setupLoginFormHandler } from "./views/login.js";
import { Logout } from "./views/logout.js";
import { ProductDetail } from "./views/product-details.js";
import { ProductList } from "./views/products.js";
import { Register, setupRegisterFormHandler } from "./views/register.js";

const routes = {
  "#/": { getHtml: Home, initFn: null },
  "#/login": { getHtml: Login, initFn: setupLoginFormHandler },
  "#/register": { getHtml: Register, initFn: setupRegisterFormHandler },
  "#/products": { getHtml: ProductList, initFn: null },
  "#/product": { getHtml: ProductDetail, initFn: null },
  "#/cart": { getHtml: Cart, initFn: null },
  "#/dashboard": { getHtml: Dashboard, initFn: null },
  "#/logout": { getHtml: Logout, initFn: null },
  "#/add-product": { getHtml: AddProduct, initFn: null },
  "#/edit-product": { getHtml: EditProduct, initFn: null },
  "#/delete-product": { getHtml: ConfirmDeleteProduct, initFn: null },
};

export function router() {
  const app = document.getElementById("app");
  const hash = location.hash || "#/";
  const route = routes[hash];

  if (route) {
    app.innerHTML = route.getHtml();
    if (route.initFn) {
      route.initFn();
    }

    return;
  }

  for (const path in routes) {
    if (path !== "" && hash.startsWith(path + "/")) {
      const param = hash.slice(path.length + 1);
      app.innerHTML = routes[path].getHtml(param);
      if (route.initFn) {
        route.initFn();
      }

      return;
    }
  }

  app.innerHTML = "<h1>Page introuvable</h1>";
}
