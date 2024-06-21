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
var Compound_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compound = void 0;
const typeorm_1 = require("typeorm");
const Project_1 = require("./Project");
const class_transformer_1 = require("class-transformer");
const LogEntry_1 = require("./LogEntry");
const CompoundPart_1 = require("./CompoundPart");
const data_source_1 = require("../data-source");
let Compound = Compound_1 = class Compound {
    setAsignee(asignee) {
        this.asigneeName = asignee.name;
        this.asigneeId = asignee.id;
        //Save user
        data_source_1.AppDataSource.manager.save(asignee);
        //Save compound
        data_source_1.AppDataSource.manager.save(this);
    }
    //Get compound from id
    static getCompoundFromId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_source_1.AppDataSource.createQueryBuilder(Compound_1, "compound")
                .leftJoinAndSelect("compound.project", "project")
                .leftJoinAndSelect("compound.parts", "compoundPart")
                .leftJoinAndSelect("compound.logEntries", "logEntry")
                .where("compound.id = :id", { id })
                .getOne();
        });
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Compound.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Compound.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Compound.prototype, "material", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Compound.prototype, "thickness", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "0" }),
    __metadata("design:type", String)
], Compound.prototype, "xDimension", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "0" }),
    __metadata("design:type", String)
], Compound.prototype, "yDimension", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], Compound.prototype, "thumbnail", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.ManyToOne)(type => Project_1.Project, project => project.compounds),
    __metadata("design:type", Project_1.Project)
], Compound.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => CompoundPart_1.CompoundPart, entry => entry.compound, { cascade: true }),
    __metadata("design:type", Array)
], Compound.prototype, "parts", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Compound.prototype, "camDone", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { array: true }),
    __metadata("design:type", Array)
], Compound.prototype, "camInstructions", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "" }),
    __metadata("design:type", String)
], Compound.prototype, "asigneeName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: true, default: -1 }),
    __metadata("design:type", Number)
], Compound.prototype, "asigneeId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => LogEntry_1.LogEntry, entry => entry.compound, { cascade: true }),
    __metadata("design:type", Array)
], Compound.prototype, "logEntries", void 0);
Compound = Compound_1 = __decorate([
    (0, typeorm_1.Entity)()
], Compound);
exports.Compound = Compound;
//# sourceMappingURL=Compound.js.map