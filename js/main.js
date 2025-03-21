import { view } from "./view/viewMain.js";
import { Controller } from "./controller.js";

let controller = new Controller();

//récupération de la valeur recherché
const params = new URLSearchParams(window.location.search); 
const search = params.get("search");

let newSearch = async function() {
    const nouvelleURL = "main.html?search=" + view.inputSearch.value;
    history.replaceState({}, "", nouvelleURL);
    amiibos = await controller.findAmiiboFromWord(view.inputSearch.value);
    controller.showAmiibos(view.listAmiibo, amiibos);
    view.nbResults.textContent = Number.parseInt(amiibos.length);
}

//ajout de la valeur dans la barre de recherche
view.inputSearch.value = search;

let amiibos = await controller.findAmiiboFromWord(search);

await controller.showAmiibos(view.listAmiibo, amiibos);

view.nbResults.textContent = Number.parseInt(amiibos.length);

view.amiibos = document.querySelectorAll(".amiibo");
view.amiibos.forEach((amiibo) => {
    console.log(amiibo.children[0]);
});

view.amiibos.forEach((amiibo) => {
    console.log(amiibo.querySelector(".button_myFavorite"));
    // Boutons favoris
    let favorite = amiibo.querySelector(".button_myFavorite");
    favorite.addEventListener("click", () => {
        // Changement de couleur 
        const svg = favorite.querySelector("svg"); 
        if (svg.style.color === "black") {
            svg.style.color = "#273791"; // Remet à la couleur d'origine
        } else {
            svg.style.color = "#273791"; // Change en couleur 
        }

        // Ajout dans les favoris
        let id = amiibo.getAttribute('id');

        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

        // Vérifie si l'ID est déjà dans les favoris
        if (favorites.includes(id)) {
            // Si l'ID est déjà là, on le supprime (toggle)
            favorites = favorites.filter(favId => favId !== id);
        } else {
            // Sinon, on l'ajoute
            favorites.push(id);
        }

        // Sauvegarde la nouvelle liste dans le Local Storage
        localStorage.setItem("favorites", JSON.stringify(favorites));

        console.log("Favorites updated:", favorites); // Pour vérifier dans la console
    });

    // Boutons collection
    let collection = amiibo.querySelector(".button_myCollec");
    collection.addEventListener("click", () => {
        // Changement de couleur 
        const img = collection.querySelector("img"); 
        if (img.getAttribute('src') === "../img/amiibo_black.svg") {
            img.setAttribute('src',"../img/amiibo.svg"); // Remet à la couleur d'origine
        } else {
            img.setAttribute('src',"../img/amiibo_black.svg"); // Change en couleur 
        }

        // Ajout dans la collection
        let id = amiibo.getAttribute('id');

        let myCollection = JSON.parse(localStorage.getItem("collection")) || [];
        if (myCollection.includes(id)) {
            myCollection = myCollection.filter(favId => favId !== id); // Supprime
        } else {
            myCollection.push(id); // Ajoute
        }
        
        // Sauvegarde dans localStorage
        localStorage.setItem("collection", JSON.stringify(myCollection));
        
        console.log("Collection updated:", myCollection);
        
    });
});

view.btnSearch.addEventListener("click", async function () {
    newSearch();
});

view.inputSearch.addEventListener("keydown", async function(event){
    if(event.key == "Enter"){
        newSearch();
    }
});