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
const Assembly_1 = require("./Assembly");
const Part_1 = require("./Part");
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
    (0, typeorm_1.OneToOne)((type) => Assembly_1.Assembly, { cascade: true, eager: true, nullable: true }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Assembly_1.Assembly)
], Project.prototype, "mainAssembly", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)((type) => Part_1.Part, { cascade: true }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Project.prototype, "individual_parts", void 0);
Project = __decorate([
    (0, typeorm_1.Entity)()
], Project);
exports.Project = Project;
//# sourceMappingURL=Project.js.map