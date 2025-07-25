export function Logout() {
  localStorage.removeItem("user")
  setTimeout(() => {
    window.location.hash = "#/"
  }, 100)
  return `<p>Déconnexion...</p>`
}