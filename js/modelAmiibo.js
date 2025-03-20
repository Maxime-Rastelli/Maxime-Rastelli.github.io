export class Amiibo{
    
    _amiibo;

    _favorite = false;

    _collection = false;

    getAmiibo(){
        return this._amiibo;
    }

    isInFavorite(){
        return this._favorite;
    }

    isInCollection(){
        return this._collection;
    }
}