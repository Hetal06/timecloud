import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';

//pages
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { EmployeesPage } from '../pages/employees/employees';
import { Offline } from '../providers/offline';
// import { SchedulePage } from '../pages/schedule/schedule';
import { TerminalModePage } from '../pages/terminalMode/terminalMode';
import { SessionDetailPage } from '../pages/session-detail/session-detail';
import { UserCheckinsPage } from '../pages/userCheckins/userCheckins';
import {PasswordPage} from '../pages/password/password';
import {SettingPage} from '../pages/setting/setting';
// import { OrderrByPipe } from '../pipes/orderBy';
//providers
import { UserData } from '../providers/user-data';
import { ConferenceData } from '../providers/conference-data';
import { EmployeeServicePage } from '../providers/employee-service';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { GoogleMaps} from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    EmployeesPage,
    TerminalModePage,
    SessionDetailPage,
    UserCheckinsPage,
    PasswordPage,
    SettingPage

    // OrderrByPipe

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
    UserCheckinsPage,
    PasswordPage,
    SettingPage

    // LogoutPage
  ],
  providers: [
    GoogleMaps,
    ConferenceData,
    EmployeeServicePage,
    Offline,
    StatusBar,
    UserData,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation
  ]
})
export class AppModule {}
