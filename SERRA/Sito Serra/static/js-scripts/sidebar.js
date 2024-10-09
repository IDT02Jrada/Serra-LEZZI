let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");

closeBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  menuBtnChange(); // chiamata alla funzione per cambiare l'icona del pulsante (opzionale)
});

function menuBtnChange() {
  if (sidebar.classList.contains("open")) {
    closeBtn.classList.replace("bx-menu", "bx-menu-alt-right"); // sostituisce la classe dell'icona
  } else {
    closeBtn.classList.replace("bx-menu-alt-right", "bx-menu"); // ripristina la classe dell'icona
  }
}

console.log("ciao")