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
var LogEntry_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogEntry = void 0;
const typeorm_1 = require("typeorm");
const Compound_1 = require("./Compound");
const Part_1 = require("./Part");
const class_transformer_1 = require("class-transformer");
let LogEntry = LogEntry_1 = class LogEntry {
    static createLogEntry(type, quantity, message, author) {
        const logEntry = new LogEntry_1();
        logEntry.type = type;
        logEntry.quantity = quantity;
        logEntry.message = message;
        logEntry.author = author;
        logEntry.date = new Date(Date.now());
        return logEntry;
    }
    addToPart(part) {
        this.part = part;
        if (part.logEntries == undefined) {
            part.logEntries = [];
        }
        part.logEntries.push(this);
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], LogEntry.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LogEntry.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], LogEntry.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], LogEntry.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LogEntry.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LogEntry.prototype, "author", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => Compound_1.Compound, compound => compound.logEntries),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Compound_1.Compound)
], LogEntry.prototype, "compound", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => Part_1.Part, part => part.logEntries),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Part_1.Part)
], LogEntry.prototype, "part", void 0);
LogEntry = LogEntry_1 = __decorate([
    (0, typeorm_1.Entity)()
], LogEntry);
exports.LogEntry = LogEntry;
//# sourceMappingURL=LogEntry.js.map