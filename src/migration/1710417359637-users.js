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
exports.Users1710417359637 = void 0;
class Users1710417359637 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // this part you will add your self
            yield queryRunner.query(` 
          --Table Definition
          CREATE TABLE "users"  (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "name" character varying NOT NULL,
            "email" character varying NOT NULL,
            "password" character varying NOT NULL,
            "role"  character varying NOT NULL DEFAULT 'user',
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
          )

          
          
          
          
          `),
                undefined;
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // and this part
            yield queryRunner.query(`DROP TABLE "users"`, undefined);
        });
    }
}
exports.Users1710417359637 = Users1710417359637;
//# sourceMappingURL=1710417359637-users.js.map