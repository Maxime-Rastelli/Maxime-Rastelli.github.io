export class Controller{
    _favorites = {};

    _collection = {};

    _activeFilters = {
        favorites: false,
        collection: false,
        type: [],
        series: [],
    }

    retrieveStateFromClient(){
        this._favorites = JSON.parse(localStorage.getItem("favorites"));
        this._collection = JSON.parse(localStorage.getItem("collection"));
    }

    saveStateToClient(){
        localStorageStorage.setItem("favorites", JSON.stringify(this._favorites));
        localStorage.setItem("collection", JSON.stringify(this._collection));
    }

    async findAmiiboFromWord(recherche){
        let amiibosName = await fetch("https://www.amiiboapi.com/api/amiibo/?name=" + recherche + "&showusage")
        .then((element) => element.json())
        .catch((err) => console.error(err));

        let amiibosGameSeries = await fetch("https://www.amiiboapi.com/api/amiibo/?gameseries=" +recherche + "&showusage")
        .then((elementSeries) => elementSeries.json())
        .catch((err) => console.error(err));

        let amiibosCharacter = await fetch("https://www.amiiboapi.com/api/amiibo/?character=" + recherche + "&showusage")
        .then((elementChar) => elementChar.json())
        .catch((err) => console.error(err));

        let allAmiibos = [
            ...amiibosName.amiibo || [],   // amiibos correspondant à name
            ...amiibosCharacter.amiibo || [],   // amiibos correspondant à character
            ...amiibosGameSeries.amiibo || []    // amiibos correspondant à gameSeries
        ];

            // Supprimer les doublons en utilisant Map basé sur l'ID unique (tail)
        let uniqueAmiibos = Array.from(new Map(allAmiibos.map(a => [a.tail, a])).values());

        return uniqueAmiibos;
    }

    async showAmiibos(div,amiibos){
        //affichage du chargement de la page
        div.innerHTML = '<div class="loading"><img src="../img/loading.gif" alt="Chargement..."></div>';

        await new Promise(resolve => setTimeout(resolve, 500)); // Petit délai pour simuler le chargement

        div.innerHTML = ""; 

        if(amiibos.length === 0){
            div.innerHTML += `<p>Nothing found</p>`;
        }else{
            let i = 1;
            amiibos.forEach(amiibo => {
                console.log("processing :" + i + "/" + amiibos.length);
                i++;
                // Vérifie si l'ID de l'amiibo est déjà dans les favoris
                let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
                let star=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star out" viewBox="0 0 16 16">
                                <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
                            </svg>`; //svg de l'étoile
                if (favorites.includes(amiibo["tail"])) {
                    star=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill in" color="#273791" viewBox="0 0 16 16">
                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                            </svg>`;
                }

                // Vérifie si l'ID de l'amiibo est déjà dans la collection
                let collection = JSON.parse(localStorage.getItem("collection")) || [];
                let img="../img/amiibo_black.svg"; //couleur de l'étoile
                if (collection.includes(amiibo["tail"])) {
                    img="../img/amiibo.svg";
                }

                div.innerHTML += `<article class="amiibo" id=${amiibo["tail"]}>
                    <div class="top">
                        <img src=${amiibo["image"]} alt="">
                        <button class="button_myFavorite">
                            ${star}
                        </button>
                    </div>
                        <div class="bottom">
                            <h3>${amiibo["name"]}</h3>
                            <button class="button_myCollec">
                                <img src=${img} alt="">
                            </button>
                        </div>
                </article>`;
            });
        }
    }

    filterAmiibo(amiibos){
        let liste_amiibo=[];

        // Filtre categories
        _activeFilters.type.forEach(type => {
            let amiibosCat = fetch("https://www.amiiboapi.com/api/amiibo/?type=" + type)
            .then((element) => element.json())
            .catch((err) => console.error(err));})

        // Filtre serie
        _activeFilters.series.forEach(serie => {
            let amiibosSerie = fetch("https://www.amiiboapi.com/api/amiibo/?gameSeries=" + serie)
            .then((element) => element.json())
            .catch((err) => console.error(err));})

        // Filtres favoris et collection activés
        if(this._activeFilters.favorites==true && this._activeFilters.collection==true){
            amiibos.forEach(amiibo => {
                if(amiibo.isInFavorite()&& amiibo.isInCollection()){
                    liste_amiibo.push(amiibo);
                }
            })}
        
        // Filtres favoris
        else if(this._activeFilters.favorites==true){
            amiibos.forEach(amiibo => {
                if(amiibo.isInFavorite()){
                    liste_amiibo.push(amiibo);
                }
            })}
        // Filtres collection
        else if(this._activeFilters.collection==true){
            amiibos.forEach(amiibo => {
                if(amiibo.isInCollection()){
                    liste_amiibo.push(amiibo);
                }
            })}

    }

    async showAmiiboBySeries(main){

        main.innerHTML = '<div class="loading"><img src="../img/loading.gif" alt="Chargement..."></div>';

        //Recuperation des données
        let idCollec = JSON.parse(localStorage.getItem("collection")) || [];

        // Récupérer les données des amiibos (attendre toutes les requêtes)
        let listeAmiiboCollec = await Promise.all(
            idCollec.map(id => fetch("https://www.amiiboapi.com/api/amiibo/?tail=" + id)
                .then(response => response.json())) // Convertir en JSON
        );
        main.innerHTML = "";

        let serie = new Map();

        listeAmiiboCollec.forEach((amiiboData) => {
            let amiibo = amiiboData.amiibo[0]; // L'API retourne un objet contenant un tableau "amiibo"

            if (!amiibo) return; // Sécurité si l'API ne retourne rien

            let seriesName = amiibo["amiiboSeries"]; // Nom de la série

            if (serie.has(seriesName)) {
                if (!serie.get(seriesName).includes(amiibo)) {
                    serie.get(seriesName).push(amiibo);
                }
            } else {
                serie.set(seriesName, [amiibo]);
            }
        });
        
        for (var [key, value] of serie) {
            for (let i=0; i<value.length;i++){
            console.log(key + " goes " + value[i]["character"]);}
          }// Vérification du résultat
          
        //Affichage
        for (var [nom, amiibos] of serie) {
            let div = document.createElement("div");
            div.classList.add("series");

            let title = document.createElement("h2");
            title.textContent = nom;

            let amiiboList = document.createElement("div");
            amiiboList.classList.add("amiibo_list");

            div.appendChild(title); // Ajouter le titre
            
            await this.showAmiibos(amiiboList,amiibos);

            div.appendChild(amiiboList); // Ajouter la liste d'amiibos
            main.appendChild(div);
          }

    }

    addToCollection(amiibo){
        this._collection[amiibo["gameSeries"]] = amiibo;
    }

    addToFavorites(amiibo){
        this._favorites.push(amiibo);
    }
}