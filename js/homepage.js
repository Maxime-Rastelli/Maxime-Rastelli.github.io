import { view } from "./view/viewHomepage.js";

console.log(view.inputSearch);


view.btnSearch.addEventListener("click", function () {
    console.log(view.inputSearch.value);
    let recherche = "main.html?search=" + view.inputSearch.value;
    window.location.href =  recherche;
    console.log(recherche)
})

