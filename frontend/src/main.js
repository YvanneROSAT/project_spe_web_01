import "bootstrap/dist/css/bootstrap.min.css";

import "./components/logout-button.js";

import { router } from "./router.js";
import "./style.css";

if (!location.hash) {
  location.hash = "#/";
}

window.addEventListener("hashchange", router);
window.addEventListener("load", router);
router();
