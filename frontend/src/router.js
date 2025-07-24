import { Cart } from '../../../src/views/cart.js'
import { Logout } from '../../../src/views/logout.js'
import { AddProduct } from './views/add-product.js'
import { Dashboard } from './views/dashboard.js'
import { ConfirmDeleteProduct } from './views/delete-product.js'
import { EditProduct } from './views/edit-product.js'
import { Home } from './views/home.js'
import { Login } from './views/login.js'
import { ProductDetail } from './views/product-details.js'
import { ProductList } from './views/products.js'
import { Register } from './views/register.js'

const routes = {
  '#/': Home,
  '#/login': Login,
  '#/register': Register,
  '#/products': ProductList,
  '#/product': ProductDetail,
  '#/cart': Cart,
  '#/dashboard': Dashboard,
  '#/logout': Logout,
  '#/add-product': AddProduct,
  '#/edit-product': EditProduct,
  '#/delete-product': ConfirmDeleteProduct,
}

export function router() {
  const app = document.getElementById('app')
  const hash = location.hash || '#/'

  if (routes[hash]) {
    app.innerHTML = routes[hash]()
    return
  }

  for (const path in routes) {
    if (path !== '' && hash.startsWith(path + '/')) {
      const param = hash.slice(path.length + 1)
      app.innerHTML = routes[path](param)
      return
    }
  }

  app.innerHTML = '<h1>Page introuvable</h1>'
}
