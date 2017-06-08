import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {SettingPage} from '../pages/setting/setting';
import { LoginPage } from '../pages/login/login';
import { EmployeesPage } from '../pages/employees/employees';
import { TerminalModePage } from '../pages/terminalMode/terminalMode';
import {PasswordPage} from '../pages/password/password';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  public mode : any;
  public active :boolean;



  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any ,active:boolean}>;
  terminal:Array<{title: string, component: any,active:boolean}>;
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public menu: MenuController) {

    this.initializeApp();
    localStorage.setItem("bTerminalMode","false");
    console.log("login time teminal mode",localStorage.getItem("bTerminalMode"));
    this.mode = 'Terminal Mode';
    this.active=true;

    // localStorage.setItem("flag","true");

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Time Cloud', component: EmployeesPage ,active:true},
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  settingFunc(){
    this.menu.close();
    this.nav.push(SettingPage);
  }

  openPage(page) {
    this.nav.setRoot(page.component);
    this.nav.push(LoginPage);
  }
  logoutApp() { ///<-- call from static button
    console.log("logout successfully");
    localStorage.removeItem("loginToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("employeeList");
    localStorage.clear();
    this.menu.close();
    this.nav.push(LoginPage);

  }

  terminalModeFunc(){
    console.log("u r in terminal mode function");
    this.menu.close();

    if(this.mode == 'Terminal Mode') {
      this.mode = 'Leave Terminal Mode';
      localStorage.setItem("bTerminalMode","true");
      if(this.active == true && this.pages[0].active == true){
        this.active = false;
        this.pages[0].active == false;
      }
      this.nav.push(TerminalModePage);
    }else if(this.mode == 'Leave Terminal Mode' ){
      localStorage.setItem("bTerminalMode","false");
      this.nav.push(PasswordPage);
    }
  }
}
