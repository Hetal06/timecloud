import { Component, Injectable } from '@angular/core';
import { NavController, NavParams, AlertController, Platform } from 'ionic-angular';
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
	logins: { email?: string, pwd?: string } = {};
	data: any;
	user: String;

	LOGIN_URL: string = "http://192.241.230.86:4000/mobileLogin";

	contentHeader: Headers = new Headers({ "Content-Type": "application/json" });
	// jwtHelper: JwtHelper = new JwtHelper();
	error: string;
	public map: any;
	constructor(public navCtrl: NavController,
		public navParams: NavParams,
		private formBuilder: FormBuilder,
		public alertCtrl: AlertController,
		public http: Http,
		public platform: Platform

		// private http: Http
	) {

		this.login = formBuilder.group({
			'email': ['', Validators.compose([Validators.required, Validators.minLength(5)])],
			'pwd': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
		});


		this.email = this.login.controls['email'];
		this.pwd = this.login.controls['pwd'];
		console.log("logout mcd ethod run", this.email, "======>\n\n", this.pwd);

		if (localStorage.getItem("loginToken")) {
			console.log("success!");
			this.navCtrl.push(EmployeesPage);
		}

	}




	logForm() {
		this.submitAttempt = true;
		// this.checkNetworkWithWindow();
		 if (window.navigator.onLine) {
			console.log("connection check");
			 console.log(this.login.controls.email.value, "", this.login.controls.pwd.value);
			this.data = {
				email: this.login.controls.email.value,
				pwd: this.login.controls.pwd.value
			}
			console.log("this.data -======81=====>"+ JSON.stringify(this.data));
			localStorage.setItem("loginPwd",this.data.pwd);
			
			this.http.post(this.LOGIN_URL, this.data, { headers: this.contentHeader })
				.map(res => res.json())
				.subscribe(
				data => this.authSuccess(data),
				err => this.error = err
				);

		} else {
			this.showAlert();
		}

	}

	showAlert() {
		// console.log("connetion alert call");
		let alert = this.alertCtrl.create({
			title: 'No Network',
			subTitle: 'Please turn on your network connection to use the service !',
			buttons: ['OK']
		})
		alert.present();
	}

	authSuccess(data) {
		this.error = null;
		console.log("authSuccess data" + data);
		localStorage.setItem("loginToken", data.token);
		localStorage.setItem("userId", data.user);
		localStorage.setItem("loginEmail", data.email);


		if (localStorage.getItem("loginToken")) {
			console.log("success!");
			this.navCtrl.push(EmployeesPage);

		}else{

			console.log("invalid email and pwd");
		}
	}

}
