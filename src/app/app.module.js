var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
//pages
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { EmployeesPage } from '../pages/employees/employees';
import { Offline } from '../providers/offline';
import { TerminalModePage } from '../pages/terminalMode/terminalMode';
import { SessionDetailPage } from '../pages/session-detail/session-detail';
import { UserCheckinsPage } from '../pages/userCheckins/userCheckins';
//providers
import { UserData } from '../providers/user-data';
import { NetworkServicePage } from '../providers/network-service';
import { ConferenceData } from '../providers/conference-data';
import { EmployeeServicePage } from '../providers/employee-service';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    NgModule({
        declarations: [
            MyApp,
            LoginPage,
            EmployeesPage,
            TerminalModePage,
            SessionDetailPage,
            UserCheckinsPage
            // LogoutPage
        ],
        imports: [
            HttpModule,
            BrowserModule,
            IonicModule.forRoot(MyApp),
            IonicStorageModule.forRoot(MyApp),
        ],
        bootstrap: [IonicApp],
        entryComponents: [
            MyApp,
            LoginPage,
            EmployeesPage,
            TerminalModePage,
            SessionDetailPage,
            UserCheckinsPage
            // LogoutPage
        ],
        providers: [
            NetworkServicePage,
            ConferenceData,
            EmployeeServicePage,
            Offline,
            StatusBar,
            UserData,
            SplashScreen,
            { provide: ErrorHandler, useClass: IonicErrorHandler }
        ]
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map
