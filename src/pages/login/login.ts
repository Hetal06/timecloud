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
	
	LOGIN_URL: string = "http://localhost:4000/mobileLogin";
	
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
			// console.log(this.login.controls.email.value, "", this.login.controls.pwd.value);

			this.data = {
				email: this.login.controls.email.value,
				pwd: this.login.controls.pwd.value
			}
			// console.log("this.data -===========>"+ JSON.stringify(this.data));
			this.http.post(this.LOGIN_URL, this.data, { headers: this.contentHeader })
				// .map(res => res.json())
				// .subscribe(
				// data => this.authSuccess(data),
				// err => this.error = err
				// );			
				.map(res => res.json())
				.subscribe(
				data => {
					console.log("line 73------data---------->"+ JSON.stringify(data));
					this.authSuccess(data)
				},
				err => this.error = err
				);

		} else {
			this.showAlert();
		}
		
				
			// }
		// 	}
		// }
				
		// });
	
	}

	// checkNetworkWithWindow() {
	// 	console.log("connetion wondow method");
		
	// 	// if (window.navigator.onLine){
	// 	// 	return window.navigator.onLine;
	// 	// }else{
	// 	// 	this.showAlert();	
	// 	// }
		

	// }
	showAlert() {
		// console.log("connetion alert call");
		let alert = this.alertCtrl.create({
			title: 'No Network',
			subTitle: 'Please turn on your network connection to use the service !',
			buttons: ['OK']
		})
		alert.present();
	}

	// checkConnection(network) {
	// 	console.log("check connections");
	// 	this.platform.ready().then(()=>{

	// 		this.networkState = navigator.connection.type;
	// 		this.states = [];
	// 		this.states[Connection.UNKNOWN] = 'Unknown connection';
	// 		this.states[Connection.ETHERNET] = 'Ethernet connection';
	// 		this.states[Connection.WIFI] = 'WiFi connection';
	// 		this.states[Connection.CELL_2G] = 'Cell 2G connection';
	// 		this.states[Connection.CELL_3G] = 'Cell 3G connection';
	// 		this.states[Connection.CELL_4G] = 'Cell 4G connection';
	// 		this.states[Connection.CELL] = 'Cell generic connection';
	// 		this.states[Connection.NONE] = 'No network connection';
			

	// 		network(this.networkState);
	// 		console.log(this.states[this.networkState]);
	// 	})
		
	// }


	authSuccess(data) {
		this.error = null;
		console.log("authSuccess data", data);
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
