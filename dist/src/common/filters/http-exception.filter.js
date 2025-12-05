"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const httpError_1 = __importDefault(require("../../utils/httpError"));
let AllExceptionsFilter = class AllExceptionsFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        if (exception instanceof httpError_1.default) {
            return response.status(exception.status).json({
                error: exception.message,
            });
        }
        if (exception instanceof common_1.HttpException) {
            const status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            return response.status(status).json(exceptionResponse);
        }
        const error = exception;
        if (error?.code === 'P2002') {
            return response.status(400).json({
                error: 'A record with this information already exists',
            });
        }
        if (error?.code === 'P2025') {
            return response.status(404).json({
                error: 'Record not found',
            });
        }
        console.error('Unhandled exception:', exception);
        console.error('Error stack:', error?.stack);
        response.status(500).json({
            error: 'Something went wrong!',
            ...(process.env.NODE_ENV === 'development' && {
                details: error?.message,
                stack: error?.stack,
            }),
        });
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
//# sourceMappingURL=http-exception.filter.js.map