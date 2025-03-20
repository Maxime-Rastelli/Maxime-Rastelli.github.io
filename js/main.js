import { view } from "./view/viewMain.js";
import { Controller } from "./controller.js";

let controller = new Controller();

const params = new URLSearchParams(window.location.search); 
const search = params.get("search");

let amiibos = await controller.findAmiiboFromWord(search);

controller.showAmiibos(view.listAmiibo, amiibos);

view.nbResults.textContent = Number.parseInt(amiibos.length);