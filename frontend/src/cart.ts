import { productSchema, type Product } from "common";
import z from "zod";
import { getFromLocalStorage } from "./local-storage";

const CART_KEY = "cart";

export function getCart(): Product[] {
  return getFromLocalStorage(CART_KEY, z.array(productSchema)) ?? [];
}

export function addToCart(product: Product) {
  const cart = getCart();
  if (cart.some((p) => p.id === product.id)) {
    return;
  }

  cart.push(product);

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function removeFromCart(productId: string) {
  const cart = getCart();
  const filtered = cart.filter((p) => p.id !== productId);

  localStorage.setItem(CART_KEY, JSON.stringify(filtered));
}
