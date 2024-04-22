"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
var Part_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Part = void 0;
const typeorm_1 = require("typeorm");
const data_source_1 = require("../data-source");
const Project_1 = require("./Project");
const class_transformer_1 = require("class-transformer");
const LogEntry_1 = require("./LogEntry");
let Part = Part_1 = class Part {
    static getPartsInDB() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_source_1.AppDataSource.createQueryBuilder(Part_1, "part")
                .getMany();
        });
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Part.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.ManyToOne)((type) => Project_1.Project),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Project_1.Project)
], Part.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Part.prototype, "number", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Part.prototype, "material", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Part.prototype, "thumbnail", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Part.prototype, "onshape_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Part.prototype, "quantityNeeded", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Part.prototype, "quantityInStock", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Part.prototype, "quantityRequested", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => LogEntry_1.LogEntry, entry => entry.part, { cascade: true }),
    __metadata("design:type", Array)
], Part.prototype, "logEntries", void 0);
Part = Part_1 = __decorate([
    (0, typeorm_1.Entity)()
], Part);
exports.Part = Part;
//# sourceMappingURL=Part.js.map