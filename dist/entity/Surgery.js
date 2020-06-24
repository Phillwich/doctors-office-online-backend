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
var typeorm_1 = require("typeorm");
var Surgery = /** @class */ (function () {
    function Surgery() {
    }
    __decorate([
        typeorm_1.ObjectIdColumn(),
        __metadata("design:type", typeorm_1.ObjectID)
    ], Surgery.prototype, "_id", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Surgery.prototype, "name", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Surgery.prototype, "description", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Surgery.prototype, "email", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Surgery.prototype, "plz", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Surgery.prototype, "city", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Surgery.prototype, "phone", void 0);
    Surgery = __decorate([
        typeorm_1.Entity()
    ], Surgery);
    return Surgery;
}());
exports.Surgery = Surgery;
//# sourceMappingURL=Surgery.js.map