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
