import { view } from "./view/viewHomepage.js";

let search = function(){
    view.invalidText.style.visibility = "hidden";
    view.inputSearch.style.border = "none";
    if(view.inputSearch.value == ""){
        view.invalidText.style.visibility = "visible";
        view.inputSearch.style.border = "red solid 2px";
    }else{
        let recherche = "main.html?search=" + view.inputSearch.value;
        window.location.href =  recherche;
    }
}

view.btnSearch.addEventListener("click", function () {
    search();
});

view.btnGetStarted.addEventListener("click", function () {
    search();
})

view.inputSearch.addEventListener("keydown", async function(event){
    if(event.key == "Enter"){
        search();
    }
});

console.log(view.inputSearch.style.display);
