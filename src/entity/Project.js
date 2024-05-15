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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const typeorm_1 = require("typeorm");
const Part_1 = require("./Part");
const User_1 = require("./User");
const typeorm_2 = require("typeorm");
const Compound_1 = require("./Compound");
const class_transformer_1 = require("class-transformer");
let Project = class Project {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Project.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "onshape_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "default_workspace", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "assembly_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "assembly_onshape_id", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { array: true }),
    __metadata("design:type", Array)
], Project.prototype, "admin_roles", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { array: true }),
    __metadata("design:type", Array)
], Project.prototype, "write_roles", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { array: true }),
    __metadata("design:type", Array)
], Project.prototype, "read_roles", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => Part_1.Part, part => part.project, { cascade: true }),
    __metadata("design:type", Array)
], Project.prototype, "parts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => Part_1.Part, part => part.project, { cascade: true }),
    __metadata("design:type", Array)
], Project.prototype, "individual_parts", void 0);
__decorate([
    (0, typeorm_2.JoinTable)(),
    (0, typeorm_1.ManyToMany)(type => User_1.User),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Array)
], Project.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => Compound_1.Compound, compound => compound.project, { cascade: true }),
    __metadata("design:type", Array)
], Project.prototype, "compounds", void 0);
Project = __decorate([
    (0, typeorm_1.Entity)()
], Project);
exports.Project = Project;
//# sourceMappingURL=Project.js.map