"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const common_2 = require("@nestjs/common");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const sessions_module_1 = require("./sessions/sessions.module");
const signal_data_module_1 = require("./signal-data/signal-data.module");
const focus_aid_module_1 = require("./focus-aid/focus-aid.module");
const baseline_module_1 = require("./baseline/baseline.module");
const app_controller_1 = require("./app.controller");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const bigint_serializer_interceptor_1 = require("./common/interceptors/bigint-serializer.interceptor");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            sessions_module_1.SessionsModule,
            signal_data_module_1.SignalDataModule,
            focus_aid_module_1.FocusAidModule,
            baseline_module_1.BaselineModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            {
                provide: core_1.APP_FILTER,
                useClass: http_exception_filter_1.AllExceptionsFilter,
            },
            {
                provide: core_1.APP_PIPE,
                useClass: common_2.ValidationPipe,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: bigint_serializer_interceptor_1.BigIntSerializerInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map