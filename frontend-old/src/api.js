export async function getProducts() {
  const res = await fetch(BACKEND_URL + "/products");
  if (!res.ok) {
    return null;
  }

  return res.json();
}
