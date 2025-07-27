import { getCategories } from "@/api/categories";
import { createProduct } from "@/api/products";
import { extractFormData, html } from "@/helpers";
import type { Page } from "@/types";
import { createProductSchema } from "common";

function validateCreateProductData(
  formData: Record<string, FormDataEntryValue>
) {
  const result = createProductSchema.safeParse(formData);
  if (!result.success) {
    const msg = result.error.issues.map((i) => i.message).join(", ");
    return { success: false, message: `Formulaire invalide: ${msg}` };
  }

  return { success: true, data: result.data };
}

export default {
  html: html`
    <h2>Ajouter un produit</h2>
    <form id="addProductForm">
      <div class="mb-3">
        <label class="form-label" for="productName">Nom</label>
        <input
          type="text"
          class="form-control"
          id="productName"
          name="name"
          placeholder="Chaise"
          required
        />
      </div>
      <div class="mb-3">
        <label class="form-label" for="productDescription">Description</label>
        <textarea
          class="form-control"
          id="productDescription"
          name="description"
          placeholder="Une incroyable chaise pour s'asseoir"
          required
        ></textarea>
      </div>
      <div class="mb-3">
        <label class="form-label" for="productPrice">Prix</label>
        <input
          type="number"
          class="form-control"
          id="productPrice"
          name="price"
          step="0.01"
          min="0"
          max="99999"
          required
        />
      </div>
      <div class="mb-3">
        <label class="form-label" for="categorySelect">Catégorie</label>
        <select id="categorySelect" class="form-control" name="categoryId">
          <option value="loading">Chargement...</option>
        </select>
      </div>

      <button type="submit" class="btn btn-success">Ajouter</button>
    </form>
  `,
  onLoad: async function () {
    const form = document.querySelector<HTMLFormElement>("form#addProductForm");
    if (!form) {
      return;
    }

    const categorySelect = document.querySelector<HTMLSelectElement>(
      "select#categorySelect"
    );
    if (!categorySelect) {
      return;
    }

    const categories = await getCategories();
    categorySelect.innerHTML = categories
      .map(
        (category) => html`
          <option value="${category.id}">${category.label}</option>
        `
      )
      .join("\n");

    async function handleSubmit(event: SubmitEvent) {
      event.preventDefault();
      if (!form) {
        return;
      }

      const rawData = extractFormData(form);
      const result = validateCreateProductData(rawData);

      if (!result.success || !result.data) {
        alert(result.message);
        return;
      }

      const newProductId = await createProduct(result.data);
      if (newProductId) {
        window.location.href = "/product?id=" + newProductId;
      }
    }

    form.addEventListener("submit", handleSubmit);
  },
} satisfies Page;
