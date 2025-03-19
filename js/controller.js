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
        let amiibosName = await fetch("https://www.amiiboapi.com/api/amiibo/?name=" + recherche)
        .then((element) => element.json())
        .catch((err) => console.error(err));

        let amiibosGameSeries = await fetch("https://www.amiiboapi.com/api/amiibo/?gameseries=" +recherche)
        .then((elementSeries) => elementSeries.json())
        .catch((err) => console.error(err));

        let amiibosCharacter = await fetch("https://www.amiiboapi.com/api/amiibo/?character=" + recherche)
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
        div.innerHTML = "";
        let i = 1;
        amiibos.forEach(amiibo => {
            console.log("processing :" + i + "/" + amiibos.length);
            i++;
            div.innerHTML += '<article class="amiibo"><div class="top"><img src=' + amiibo["image"] +' alt=""><button class="button_myFavorite"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16"><path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/></svg></button></div><div class="bottom"><h3>' + amiibo["name"] + '</h3><button class="button_myCollec"><img src="../img/amiibo.svg" alt=""></button></div></article>'
        });
        
    }

    filterAmiibo(filters,amiibos){

    }

    async showAmiiboBySeries(){

    }

    addToCollection(amiibo){
        this._collection[amiibo["gameSeries"]] = amiibo;
    }

    addToFavorites(amiibo){
        this._favorites.push(amiibo);
    }
}