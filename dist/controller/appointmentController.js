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
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_express_utils_1 = require("inversify-express-utils");
var typeorm_1 = require("typeorm");
var ObjectInstance = require('mongodb').ObjectId;
var authMiddleware_1 = require("../middleware/authMiddleware");
var Appointment_1 = require("../entity/Appointment");
var User_1 = require("../entity/User");
var Surgery_1 = require("../entity/Surgery");
var AppointmentController = /** @class */ (function () {
    function AppointmentController() {
        this.appointmentRepository = typeorm_1.getRepository(Appointment_1.Appointment);
        this.surgeryRepository = typeorm_1.getRepository(Surgery_1.Surgery);
        this.userRepository = typeorm_1.getRepository(User_1.User);
    }
    AppointmentController.prototype.createAppointment = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var newAppointment, userId, surgeryId, appointmentCheck, error_1, appointment, error_2, user, error_3, error_4, surgery, error_5, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newAppointment = request.body.appointment;
                        userId = newAppointment.userId;
                        surgeryId = newAppointment.surgeryId;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.appointmentRepository.findOne({ date: newAppointment.date })];
                    case 2:
                        appointmentCheck = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        return [2 /*return*/, response.status(500).json({
                                message: "Fehler beim Auflisten der Termine"
                            })];
                    case 4:
                        if (appointmentCheck) {
                            if (appointmentCheck.surgeryId === surgeryId) {
                                return [2 /*return*/, response.status(400).json({
                                        message: "Dieser Termin ist schon vergeben"
                                    })];
                            }
                        }
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, this.appointmentRepository.save(newAppointment)];
                    case 6:
                        appointment = _a.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        error_2 = _a.sent();
                        return [2 /*return*/, response.status(500).json({
                                message: "Fehler beim hinzufügen eines Termines"
                            })];
                    case 8:
                        _a.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, this.userRepository.findOne(userId)];
                    case 9:
                        user = _a.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        error_3 = _a.sent();
                        return [2 /*return*/, response.status(500).json({
                                message: "Fehler beim Suchen des Nutzers"
                            })];
                    case 11:
                        user.appointments.push(appointment._id);
                        _a.label = 12;
                    case 12:
                        _a.trys.push([12, 14, , 15]);
                        return [4 /*yield*/, this.userRepository.update(userId, user)];
                    case 13:
                        _a.sent();
                        return [3 /*break*/, 15];
                    case 14:
                        error_4 = _a.sent();
                        return [2 /*return*/, response.status(500).json({
                                message: "Fehler beim Aktualisieren des Users"
                            })];
                    case 15:
                        _a.trys.push([15, 17, , 18]);
                        return [4 /*yield*/, this.surgeryRepository.findOne(surgeryId)];
                    case 16:
                        surgery = _a.sent();
                        return [3 /*break*/, 18];
                    case 17:
                        error_5 = _a.sent();
                        return [2 /*return*/, response.status(500).json({
                                message: "Fehler beim Suchen der Arztpraxis"
                            })];
                    case 18:
                        surgery.appointments.push(appointment._id);
                        _a.label = 19;
                    case 19:
                        _a.trys.push([19, 21, , 22]);
                        return [4 /*yield*/, this.surgeryRepository.update(surgeryId, surgery)];
                    case 20:
                        _a.sent();
                        return [3 /*break*/, 22];
                    case 21:
                        error_6 = _a.sent();
                        return [2 /*return*/, response.status(500).json({
                                message: "Fehler beim Aktualisieren der Praxis"
                            })];
                    case 22: return [2 /*return*/, response.status(200).json({
                            message: "Termin wurde erstellt und hinzugefügt"
                        })];
                }
            });
        });
    };
    AppointmentController.prototype.getAppointmentsFromUser = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, user, error_7, appointmentIds, userAppointments, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = request.params.id;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.userRepository.findOne(userId)];
                    case 2:
                        user = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_7 = _a.sent();
                        return [2 /*return*/, response.status(500).json({
                                message: "Fehler beim Suchen des Users"
                            })];
                    case 4:
                        if (!user)
                            return [2 /*return*/, response.status(404).json({ message: "Nutzer nicht gefunden" })];
                        appointmentIds = user.appointments;
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, this.appointmentRepository.findByIds(appointmentIds)];
                    case 6:
                        userAppointments = _a.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        error_8 = _a.sent();
                        return [2 /*return*/, response.status(500).json({
                                message: "Fehler beie Appointments suchen"
                            })];
                    case 8: return [2 /*return*/, response.status(200).json({
                            message: "Appointments gefunden",
                            data: userAppointments
                        })];
                }
            });
        });
    };
    AppointmentController.prototype.deleteAppointment = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var appointmentId, appointmentToDelete, error_9, surgeryId, userId, error_10, user, error_11, index, error_12, surgery, error_13, surgeryIndex, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        appointmentId = request.params.appointmentId;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.appointmentRepository.findOne(appointmentId)];
                    case 2:
                        appointmentToDelete = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_9 = _a.sent();
                        return [2 /*return*/, response.status(500).json({
                                message: "Fehler beim Abfragen des Termins"
                            })];
                    case 4:
                        surgeryId = appointmentToDelete.surgeryId;
                        userId = appointmentToDelete.userId;
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, this.appointmentRepository.delete(appointmentId)];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        error_10 = _a.sent();
                        return [2 /*return*/, response.status(500).json({
                                message: "Fehler beim Löschen des Termins"
                            })];
                    case 8:
                        _a.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, this.userRepository.findOne(userId)];
                    case 9:
                        user = _a.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        error_11 = _a.sent();
                        return [2 /*return*/, response.status(500).json({
                                message: "Fehler beim Laden des Nutzers"
                            })];
                    case 11:
                        index = user.appointments.findIndex(function (element) { return element === new ObjectInstance(appointmentId); });
                        user.appointments.splice(index, 1);
                        _a.label = 12;
                    case 12:
                        _a.trys.push([12, 14, , 15]);
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 13:
                        _a.sent();
                        return [3 /*break*/, 15];
                    case 14:
                        error_12 = _a.sent();
                        return [2 /*return*/, response.status(500).json({
                                message: "Fehler beim speichern des Nutzers"
                            })];
                    case 15:
                        _a.trys.push([15, 17, , 18]);
                        return [4 /*yield*/, this.surgeryRepository.findOne(surgeryId)];
                    case 16:
                        surgery = _a.sent();
                        return [3 /*break*/, 18];
                    case 17:
                        error_13 = _a.sent();
                        return [2 /*return*/, response.status(500).json({
                                message: "Fehler beim Laden der Praxis"
                            })];
                    case 18:
                        surgeryIndex = surgery.appointments.findIndex(function (element) { return element === new ObjectInstance(appointmentId); });
                        surgery.appointments.splice(surgeryIndex, 1);
                        _a.label = 19;
                    case 19:
                        _a.trys.push([19, 21, , 22]);
                        return [4 /*yield*/, this.surgeryRepository.save(surgery)];
                    case 20:
                        _a.sent();
                        return [3 /*break*/, 22];
                    case 21:
                        error_14 = _a.sent();
                        return [2 /*return*/, response.status(500).json({
                                message: "Fehler beim speichern der Praxis"
                            })];
                    case 22: return [2 /*return*/, response.status(200).json({
                            message: "Termin erfolgreich gelöscht"
                        })];
                }
            });
        });
    };
    __decorate([
        inversify_express_utils_1.httpPost("/", authMiddleware_1.default),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AppointmentController.prototype, "createAppointment", null);
    __decorate([
        inversify_express_utils_1.httpGet("/:id", authMiddleware_1.default),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AppointmentController.prototype, "getAppointmentsFromUser", null);
    __decorate([
        inversify_express_utils_1.httpDelete("/:appointmentId", authMiddleware_1.default),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AppointmentController.prototype, "deleteAppointment", null);
    AppointmentController = __decorate([
        inversify_express_utils_1.controller('/appointment'),
        __metadata("design:paramtypes", [])
    ], AppointmentController);
    return AppointmentController;
}());
exports.default = AppointmentController;
//# sourceMappingURL=appointmentController.js.map