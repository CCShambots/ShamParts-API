"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const data_source_1 = require("./data-source");
const Part_1 = require("./entity/Part");
const Onshape_1 = require("./util/Onshape");
const node_fs_1 = require("node:fs");
const Process = __importStar(require("process"));
console.log((0, node_fs_1.readdirSync)("./"));
if (!(0, node_fs_1.existsSync)("./config.json")) {
    console.log("Config file not found, copying default config");
    Process.exit(1);
}
data_source_1.AppDataSource.initialize()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    const part = new Part_1.Part();
    part.number = "5907-1";
    part.material = "Aluminum";
    part.weight = 0.5;
    part.quantityNeeded = 10;
    part.quantityInStock = 10;
    part.quantityRequested = 10;
    // await AppDataSource.manager.save(part)
    // console.log("Post has been saved: ", part)
    // const parts = await AppDataSource.manager
    //   .createQueryBuilder(Part, "part")
    //   .getMany();
    // console.log("All parts: ", parts)\
    var res = yield Onshape_1.Onshape.getDocuments();
    console.log(res);
}))
    .catch((error) => console.log("Error: ", error));
//# sourceMappingURL=index.js.map