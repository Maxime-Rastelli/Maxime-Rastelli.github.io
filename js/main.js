import { view } from "./view/viewMain.js";
import { Controller } from "./controller.js";

let controller = new Controller();

const params = new URLSearchParams(window.location.search); 
const search = params.get("search");

let newSearch = async function() {
    const nouvelleURL = "main.html?search=" + view.inputSearch.value;
    history.replaceState({}, "", nouvelleURL);
    amiibos = await controller.findAmiiboFromWord(view.inputSearch.value);
    controller.showAmiibos(view.listAmiibo, amiibos);
    view.nbResults.textContent = Number.parseInt(amiibos.length);
}

view.inputSearch.value = search;

let amiibos = await controller.findAmiiboFromWord(search);

controller.showAmiibos(view.listAmiibo, amiibos);

view.nbResults.textContent = Number.parseInt(amiibos.length);

view.btnSearch.addEventListener("click", async function () {
    newSearch();
});

view.inputSearch.addEventListener("keydown", async function(event){
    if(event.key == "Enter"){
        newSearch()
    }
})

