"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_express_utils_1 = require("inversify-express-utils");
var jwt = require("jsonwebtoken");
var config = require("config");
var inversify_1 = require("inversify");
var AuthMiddleware = /** @class */ (function (_super) {
    __extends(AuthMiddleware, _super);
    function AuthMiddleware() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AuthMiddleware.prototype.handler = function (request, response, next) {
        if (request.headers.authorization) {
            var token = request.headers.authorization;
            try {
                if (jwt.verify(token, config.get('SUPER_SECRET'))) {
                    console.log('Authenticated');
                    return next();
                }
            }
            catch (error) {
                return next(response.status(401).json({ message: 'Nicht berechtigt' }));
            }
        }
        console.log('Not authenticated');
        return next(response.status(401).json({ message: 'Nicht berechtigt' }));
    };
    AuthMiddleware = __decorate([
        inversify_1.injectable()
    ], AuthMiddleware);
    return AuthMiddleware;
}(inversify_express_utils_1.BaseMiddleware));
exports.default = AuthMiddleware;
//# sourceMappingURL=authMiddleware.js.map