import { view } from "./view/viewMain.js";
import { Controller } from "./controller.js";

let controller = new Controller();

controller.retrieveStateFromClient();

//récupération de la valeur recherché
const params = new URLSearchParams(window.location.search); 
const search = params.get("search");

let newSearch = async function() {
    const nouvelleURL = "main.html?search=" + view.inputSearch.value;
    history.replaceState({}, "", nouvelleURL);
    amiibos = await controller.findAmiiboFromWord(view.inputSearch.value);
    await controller.showAmiibos(view.listAmiibo, amiibos);
    controller.showSeries(view.series, amiibos);
    view.filters = await controller.showSeries(view.series, amiibos);
    resetCheckbox();
    view.nbResults.textContent = Number.parseInt(amiibos.length);
}

let resetCheckbox = function(){
    let filters = document.querySelectorAll("input[type=\"checkbox\"");
    filters.forEach((filter) => {
        filter.checked = false;
    });
}

//ajout de la valeur dans la barre de recherche
view.inputSearch.value = search;

let amiibos = await controller.findAmiiboFromWord(search);
let amiibosFiltered;

await controller.showAmiibos(view.listAmiibo, amiibos);
view.filters = await controller.showSeries(view.series, amiibos);

view.nbResults.textContent = Number.parseInt(amiibos.length);

view.amiibos = document.querySelectorAll(".amiibo");
// view.amiibos.forEach((amiibo) => {
//     console.log(amiibo.children[0]);
// });

view.amiibos.forEach((amiibo) => {
    // console.log(amiibo.querySelector(".button_myFavorite"));
    // Boutons favoris
    let favorite = amiibo.querySelector(".button_myFavorite");
    favorite.addEventListener("click", () => {
        
        // Changement de couleur 
        const svg = favorite.querySelector("svg"); 
        
        if (svg.classList.contains("in")) {
            favorite.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star out" viewBox="0 0 16 16">
                                <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
                            </svg>`; // Remet à la couleur d'origine
        } else {
            favorite.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill in" color="#273791" viewBox="0 0 16 16">
                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                            </svg>`; // Change en couleur 
        }
        console.log(favorite);

        // Ajout dans les favoris
        let id = amiibo.getAttribute('id');

        // Vérifie si l'ID est déjà dans les favoris
        if (controller._favorites.includes(id)) {
            // Si l'ID est déjà là, on le supprime (toggle)
            controller._favorites = controller._favorites.filter(favId => favId !== id);
        } else {
            // Sinon, on l'ajoute
            controller._favorites.push(id);
        }

        // Sauvegarde la nouvelle liste dans le Local Storage
        controller.saveStateToClient();

        console.log("Favorites updated:", controller._favorites); // Pour vérifier dans la console
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

        if (controller._collection.includes(id)) {
            controller._collection = controller._collection.filter(favId => favId !== id); // Supprime
        } else {
            controller._collection.push(id); // Ajoute
        }
        
        // Sauvegarde dans localStorage
        controller.saveStateToClient();
        
        console.log("Collection updated:", controller._collection);
        
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

view.btnFilter.addEventListener("click", async function(){
    controller.resetFilters();
    view.filters.forEach((filter) => {
        if(filter.checked){
            if(filter.name == "Favorites"){
                controller._activeFilters.favorites = true;
            }else if(filter.name == "Collection"){
                controller._activeFilters.collection = true;
            }else if(filter.name == "type"){
                controller._activeFilters.type.push(filter.id);
            }else{
                controller._activeFilters.series.push(filter.id);
                console.log(controller._activeFilters);
            }
        }
    });
    amiibosFiltered = amiibos;
    console.log(amiibosFiltered);
    amiibosFiltered = await controller.filterAmiibo(amiibosFiltered);
    console.log(amiibosFiltered);
    await controller.showAmiibos(view.listAmiibo, amiibosFiltered);
    view.nbResults.textContent = Number.parseInt(amiibosFiltered.length);
});