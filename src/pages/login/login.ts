import { Component, Injectable } from '@angular/core';
import { NavController, NavParams, AlertController,ToastController, Platform,LoadingController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { EmployeesPage } from '../employees/employees';

// import { Network } from 'ionic-native';
// import { JwtHelper } from 'angular2-jwt';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

declare var navigator: any;
// declare var device;
declare var Connection: any;

// import {Http,Headers} from '@angular/http';


@Component({
		selector: 'page-login',
		templateUrl: 'login.html',
})

@Injectable()
export class LoginPage {
	private login: FormGroup;
	public email: AbstractControl;
	public pwd: AbstractControl;
	public submitAttempt: boolean = false;
	public networkState: any;
	public states: any;
	public alert:any;

	logins: { email?: string, pwd?: string } = {};
	data: any;
	user: String;

	LOGIN_URL: string = "http://192.241.230.86:4000/mobileLogin";

	contentHeader: Headers = new Headers({ "Content-Type": "application/json" });
	error: string;
	public map: any;
	constructor(public navCtrl: NavController,
		public navParams: NavParams,
		private formBuilder: FormBuilder,
		public alertCtrl: AlertController,
		public http: Http,
		public platform: Platform,
		private loadingCtrl: LoadingController,
		private toastCtrl:   ToastController
	) {

		platform.ready().then(() => {
			console.log("canGoBack(1)");
      platform.registerBackButtonAction(() => {
				console.log("canGoBack(2)");
				this.exitAlert();
        });
    });

		this.login = formBuilder.group({
			'email': ['', Validators.compose([Validators.required, Validators.minLength(5)])],
			'pwd': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
		});
		console.log("login page call 1");
		this.email = this.login.controls['email'];
		this.pwd = this.login.controls['pwd'];
		console.log("login page call 2");
		if (localStorage.getItem("loginToken")) {
			console.log("login page call 3");
			this.navCtrl.push(EmployeesPage);
			console.log("login page call 4");
		}
		// else{
		// 	this.navCtrl.push(EmployeesPage);
		// }
	}


	logForm() {
		this.submitAttempt = true;
		 if (window.navigator.onLine) {
			this.data = {
				email: this.login.controls.email.value,
				pwd: this.login.controls.pwd.value
			}
			localStorage.setItem("loginPwd",this.data.pwd);
			this.http.post(this.LOGIN_URL, this.data, { headers: this.contentHeader })
				.map(res => res.json())
				.subscribe(
				data => {
					this.authSuccess(data)
			 },
				err =>{
				 	let alert = this.alertCtrl.create({
					subTitle: 'Invalid Credentials !',
					buttons: ['OK']
				});
				alert.present();
			});
		} else {
			this.showAlert();
		}

	}

	showAlert() {
		let alert = this.alertCtrl.create({
			title: 'No Network',
			subTitle: 'Please turn on your network connection to use the service !',
			buttons: ['OK']
		})
		alert.present();
	}


	authSuccess(data) {
		this.error = null;
		localStorage.setItem("loginToken", data.token);
		localStorage.setItem("userId", data.user);
		localStorage.setItem("loginEmail", data.email);
		localStorage.setItem("bTerminalMode","false");
		if (localStorage.getItem("loginToken")) {
			this.navCtrl.push(EmployeesPage);
		}else{
			console.log("invalid email and pwd");
		}
	}
	exitAlert() {
			this.alert = this.alertCtrl.create({
				title: 'Exit?',
				message: 'Do you want to exit the app?',
				buttons: [
					{
						text: 'Cancel',
						role: 'cancel',
						handler: () => {
							this.alert =null;
						}
					},
					{
						text: 'Exit',
						handler: () => {
							this.platform.exitApp();
						}
					}
				]
			});
			this.alert.present();
		}

}
