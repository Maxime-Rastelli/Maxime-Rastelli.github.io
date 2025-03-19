import { view } from "./view/viewMain.js";
import { Controller } from "./controller.js";

let controller = new Controller();

let amiibos = await controller.findAmiiboFromWord("kirby");

controller.showAmiibo(view.listAmiibo, amiibos);