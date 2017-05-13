import { Component, Injectable } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { EmployeesPage } from '../employees/employees';

// import { JwtHelper } from 'angular2-jwt';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';


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
	logins: { email?: string, pwd?: string } = {};
	data: any;
	user: String;
	
	LOGIN_URL: string = "http://localhost:4000/mobileLogin";
	
	contentHeader: Headers = new Headers({ "Content-Type": "application/json" });
	// jwtHelper: JwtHelper = new JwtHelper();
	error: string;
	public map: any;
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
		console.log("logout mcd ethod run");
		

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
			data => this.authSuccess(data),
			err => this.error = err
			);
			// .map(res => res.json())
			// .subscribe(
			// data => {
			// 	console.log("line 73------", data.token);
			// 	data => this.authSuccess(data.token)
			// },
			// err => this.error = err
			// );
			

		

		// console.log("res==", res);
		// console.log("data", data);


	}

	authSuccess(data) {
		this.error = null;
		
		localStorage.setItem("loginToken", data.token);
		localStorage.setItem("userId", data.user);
		localStorage.setItem("loginEmail", data.email);
		
		// console.log("----line 97 data", data);
		// console.log("----line 98 data token", data.token);
		 // console.log("----line 99 data user", data.user);
		// console.log("----line 100 data email", data.email);

		// localStorage.setItem("loginId", token);
		
		
		if (localStorage.getItem("loginToken")) {
			console.log("success!");
			this.navCtrl.push(EmployeesPage);
			
		}else{
			// this.navCtrl.push();
			console.log("invalid email and pwd");
		}
		// this.local.set('id_token', token);
		// this.user = this.jwtHelper.decodeToken(token).username;
	}

}
