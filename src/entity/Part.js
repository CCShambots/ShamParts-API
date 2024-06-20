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
const PartCombine_1 = require("./PartCombine");
const Compound_1 = require("./Compound");
let Part = Part_1 = class Part {
    setAsignee(asignee) {
        this.asigneeName = asignee.name;
        this.asigneeId = asignee.id;
        //Save user
        data_source_1.AppDataSource.manager.save(asignee);
        //Save part
        data_source_1.AppDataSource.manager.save(this);
    }
    static getPartsInDB() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_source_1.AppDataSource.createQueryBuilder(Part_1, "part")
                .getMany();
        });
    }
    static getPartFromId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_source_1.AppDataSource.createQueryBuilder(Part_1, "part")
                .leftJoinAndSelect("part.project", "project")
                .leftJoinAndSelect("part.logEntries", "logEntries")
                .leftJoinAndSelect("part.part_combines", "part_combines")
                .where("part.id = :id", { id: id })
                .getOne();
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
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", String)
], Part.prototype, "dimension1", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", String)
], Part.prototype, "dimension2", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", String)
], Part.prototype, "dimension3", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Part.prototype, "dimensionsOverride", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Part.prototype, "onshape_element_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Part.prototype, "onshape_part_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Part.prototype, "onshape_document_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Part.prototype, "onshape_wvm_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Part.prototype, "onshape_wvm_type", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => PartCombine_1.PartCombine, combine => combine.parent_part, { cascade: true }),
    __metadata("design:type", Array)
], Part.prototype, "part_combines", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((type) => Compound_1.Compound, compound => compound.parts),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Array)
], Part.prototype, "compounds", void 0);
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
__decorate([
    (0, typeorm_1.Column)({ default: "" }),
    __metadata("design:type", String)
], Part.prototype, "asigneeName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: -1 }),
    __metadata("design:type", Number)
], Part.prototype, "asigneeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "other" }),
    __metadata("design:type", String)
], Part.prototype, "partType", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Part.prototype, "camDone", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { array: true, default: [], nullable: true }),
    __metadata("design:type", Array)
], Part.prototype, "camInstructions", void 0);
Part = Part_1 = __decorate([
    (0, typeorm_1.Entity)()
], Part);
exports.Part = Part;
//# sourceMappingURL=Part.js.map