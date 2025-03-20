import { view } from "./view/viewHomepage.js";

view.btnSearch.addEventListener("click", function () {
    let recherche = "main.html?search=" + view.inputSearch.value;
    window.location.href =  recherche;
});

view.btnGetStarted.addEventListener("click", function () {
    let recherche = "main.html?search=" + view.inputSearch.value;
    window.location.href =  recherche;
})

