import { Toast } from "bootstrap";

function makeToast(message: string, ctxClass: string) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toastEl = document.createElement("div");
  toastEl.className = `toast align-items-center text-bg-${ctxClass} border-0`;
  toastEl.setAttribute("role", "alert");
  toastEl.setAttribute("aria-live", "assertive");
  toastEl.setAttribute("aria-atomic", "true");

  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${message}
      </div>
      <button
        type="button"
        class="btn-close btn-close-white me-2 m-auto"
        data-bs-dismiss="toast"
        aria-label="Close"
      ></button>
    </div>
  `;

  container.append(toastEl);

  const toast = new Toast(toastEl, { autohide: true, delay: 4000 });
  toast.show();

  toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
}

export function showErrorToast(message: string) {
  makeToast(message, "danger");
}

export function showSuccessToast(message: string) {
  makeToast(message, "success");
}
