export function toggleMenu() {
    const toggleMenu = document.getElementById("toggleMenu");
    const navbar = document.querySelector(".navbar");
  
    if (toggleMenu && navbar) {
      toggleMenu.addEventListener("click", () => {
        navbar.classList.toggle("activo");
      });
    }
  }