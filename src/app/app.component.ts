import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, AlertController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {SettingPage} from '../pages/setting/setting';
import { LoginPage } from '../pages/login/login';
import { EmployeesPage } from '../pages/employees/employees';
import { TerminalModePage } from '../pages/terminalMode/terminalMode';
// import {PasswordPage} from '../pages/password/password';
import { Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  public mode: any;
  public active: boolean;
  public alert: any;
  private password: FormGroup;
  public pwd: AbstractControl;
  public submitAttempt: boolean = false;
  public networkState: any;
  public states: any;
  public map: any;
  public passwordLocal: any;
  public flag: string;

  passwords: { pwd?: string } = {};
  data: any;
  user: String;
  error: string;

  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{ title: string, component: any, active: boolean }>;
  // terminal:Array<{title: string, component: any,active:boolean}>;
  constructor(private formBuilder: FormBuilder, public alertCtrl: AlertController, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public menu: MenuController) {
    this.initializeApp();
    localStorage.setItem("bTerminalMode", "false");
    this.mode = 'Terminal Mode';
    this.active = true;
    this.passwordLocal = localStorage.getItem("loginPwd");
    this.password = formBuilder.group({
      'pwd': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });
    this.pwd = this.password.controls['pwd'];

    this.pages = [
      { title: 'Time Cloud', component: EmployeesPage, active: true },
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  settingFunc() {
    this.menu.close();
    this.nav.push(SettingPage);
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
  logoutApp() { ///<-- call from static button
    localStorage.removeItem("loginToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("employeeList");
    localStorage.clear();
    this.menu.close();
    this.nav.push(LoginPage);
  }

  terminalModeFunc() {
    this.menu.close();

    if (this.mode == 'Terminal Mode') {
      this.mode = 'Leave Terminal Mode';
      localStorage.setItem("bTerminalMode", "true");
      if (this.active == true && this.pages[0].active == true) {
        this.active = false;
        this.pages[0].active == false;
      }
      this.nav.push(TerminalModePage);
    } else if (this.mode == 'Leave Terminal Mode') {
      let prompt = this.alertCtrl.create({
        title: 'Please Enter Password',
        inputs: [
          {
            type: 'password',
            name: 'Password',
            placeholder: 'Password',
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'OK',
            handler: data => {
              if (data.Password == this.passwordLocal) {
                localStorage.setItem("bTerminalMode", "false");
                this.nav.push(EmployeesPage);
                this.mode = 'Terminal Mode';
                this.active = true;
              } else {
                let alert = this.alertCtrl.create({
                  title: "Enter Wrong Password",
                  buttons: ['OK']
                });
                alert.present();
              }
            }
          }
        ]
      });
      prompt.present();
    }
  }
}
