"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadPartThumbnail = void 0;
const data_source_1 = require("../data-source");
const Part_1 = require("../entity/Part");
const Onshape_1 = require("../util/Onshape");
const loadPartThumbnail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    //Load the part object from the database with this id
    const loaded = yield data_source_1.AppDataSource.createQueryBuilder(Part_1.Part, "part")
        .innerJoinAndSelect("part.project", "project")
        .where("part.id = :id", { id: id })
        .getOne();
    //Load the thumbnail from Onshape
    loaded.thumbnail = yield Onshape_1.Onshape.getThumbnailForElement(loaded.project.onshape_id, loaded.project.default_workspace, loaded.onshape_id);
    yield data_source_1.AppDataSource.manager.save(loaded);
    //Send the thumbnail to the client
    res.status(200).send(loaded.thumbnail);
});
exports.loadPartThumbnail = loadPartThumbnail;
//# sourceMappingURL=part.controller.js.map