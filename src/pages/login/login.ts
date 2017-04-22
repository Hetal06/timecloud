import { Component, Injectable } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { TabsPage } from '../tabs/tabs';
// import { JwtHelper } from 'angular2-jwt';
import { Http, Headers } from '@angular/http';
// import {Http,Headers} from '@angular/http';

@IonicPage()
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
	logins: { email?: string, pwd?: string } = {};
	data: any;
	user: String;
	LOGIN_URL: string = "http://localhost:3000/mobileLogin";
	
	contentHeader: Headers = new Headers({ "Content-Type": "application/json" });
	// jwtHelper: JwtHelper = new JwtHelper();
	error: string;

	constructor(public navCtrl: NavController,
		public navParams: NavParams,
		private formBuilder: FormBuilder,
		public alertCtrl: AlertController,
		public http: Http

		// private http: Http
	) {
		this.login = formBuilder.group({
			'email': ['', Validators.compose([Validators.required, Validators.minLength(5)])],
			'pwd': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
		});


		this.email = this.login.controls['email'];
		this.pwd = this.login.controls['pwd'];


	}



	logForm() {
		console.log("login method work");
		this.submitAttempt = true;

		console.log(this.login.controls.email.value, "", this.login.controls.pwd.value);

		this.data = {
			email: this.login.controls.email.value,
			pwd: this.login.controls.pwd.value
		}

		this.http.post(this.LOGIN_URL, this.data, { headers: this.contentHeader })
			.map(res => res.json())
			.subscribe(
			data => this.authSuccess(data.user),
			err => this.error = err
			);

		

		// console.log("res==", res);
		// console.log("data", data);


	}

	authSuccess(token) {
		this.error = null;
		localStorage.setItem("loginId", token);
		console.log("data", token);
		if(token){
			this.navCtrl.push(TabsPage);
			console.log("success!");
		}else{
			console.log("invalid email and pwd");
		}
		// this.local.set('id_token', token);
		// this.user = this.jwtHelper.decodeToken(token).username;
	}

}
