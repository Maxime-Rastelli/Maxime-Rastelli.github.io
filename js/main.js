import { view } from "./view/viewMain.js";
import { Controller } from "./controller.js";

let controller = new Controller();

let amiibos = await controller.findAmiiboFromWord("kirby");

controller.showAmiibos(view.listAmiibo, amiibos);

view.nbResults.textContent = Number.parseInt(amiibos.length);