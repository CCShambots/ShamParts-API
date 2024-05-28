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
var Project_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const typeorm_1 = require("typeorm");
const Part_1 = require("./Part");
const User_1 = require("./User");
const typeorm_2 = require("typeorm");
const Compound_1 = require("./Compound");
const class_transformer_1 = require("class-transformer");
const data_source_1 = require("../data-source");
const LogEntry_1 = require("./LogEntry");
const PartCombine_1 = require("./PartCombine");
let Project = Project_1 = class Project {
    getAllRoles() {
        //Concatenate read, write, and admin roles together
        return this.admin_roles.concat(this.write_roles).concat(this.read_roles);
    }
    userHasAccess(user) {
        //Check if the user has any roles that are included on this project
        return this.getAllRoles().some(role => user.roles.includes(role)) || user.roles.includes('admin');
    }
    userCanWrite(user) {
        //Check if the user has any roles that are included on this project
        return this.write_roles.concat(this.admin_roles).some(role => user.roles.includes(role)) || user.roles.includes('admin');
    }
    userIsAdmin(user) {
        return this.admin_roles.some(role => user.roles.includes(role)) || user.roles.includes('admin');
    }
    static loadProject(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let project = yield data_source_1.AppDataSource.manager
                .createQueryBuilder(Project_1, "project")
                .where("project.name = :name", { name: name })
                .innerJoinAndSelect("project.parts", "part")
                // .leftJoinAndSelect("part.compounds", "compound")
                .getOne();
            let logEntries = yield data_source_1.AppDataSource.manager
                .createQueryBuilder(LogEntry_1.LogEntry, "logEntry")
                .innerJoinAndSelect("logEntry.part", "part")
                .getMany();
            let partCombines = yield data_source_1.AppDataSource.manager
                .createQueryBuilder(PartCombine_1.PartCombine, "partCombine")
                .getMany();
            //Load the log info
            if (project) {
                for (let part of project.parts) {
                    part.logEntries = logEntries.filter(e => e.part.id === part.id);
                    part.part_combines = partCombines.filter(e => e.parent_id === part.id);
                }
            }
            return project;
        });
    }
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
Project = Project_1 = __decorate([
    (0, typeorm_1.Entity)()
], Project);
exports.Project = Project;
//# sourceMappingURL=Project.js.map