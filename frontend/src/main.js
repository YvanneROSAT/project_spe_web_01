import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { router } from './router.js'

if (!location.hash) {
  location.hash = '#/';
}

window.addEventListener('hashchange', router)
window.addEventListener('load', router)
router();
