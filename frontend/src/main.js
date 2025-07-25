import "bootstrap/dist/css/bootstrap.min.css";
import { router } from "./router.js";
import "./style.css";
import { Register, setupRegisterFormHandler } from "./views/register.js";

if (!location.hash) {
  location.hash = "#/";
}

window.addEventListener("hashchange", router);
window.addEventListener("load", router);
router();

document.getElementById("app").innerHTML = Register();
setupRegisterFormHandler();
