import { Component, Injectable } from '@angular/core';
import { NavController, NavParams, AlertController, Platform,LoadingController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { EmployeesPage } from '../employees/employees';
// import { Network } from 'ionic-native';
// import { JwtHelper } from 'angular2-jwt';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

declare var navigator: any;
// declare var device;
declare var Connection: any;

// import {Http,Headers} from '@angular/http';


@Component({
		selector: 'page-password',
		templateUrl: 'password.html',
})

@Injectable()
export class PasswordPage {
	private password: FormGroup;
	public pwd: AbstractControl;
	public submitAttempt: boolean = false;
	public networkState: any;
	public states: any;
  public map: any;
	public passwordLocal:any;
	public flag : boolean;
	public loading :any;


  passwords: {pwd?: string } = {};
	data: any;
	user: String;
	error: string;


	constructor(public navCtrl: NavController,
		public navParams: NavParams,
		private formBuilder: FormBuilder,
		public alertCtrl: AlertController,
		public http: Http,
		public platform: Platform,
		public loadingCtrl: LoadingController
	) {
		this.flag = true;
		this.password = formBuilder.group({
			'pwd': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
		});
		this.pwd = this.password.controls['pwd'];
		}

	passwordForm() {
		this.passwordLocal = localStorage.getItem("loginPwd");
		this.submitAttempt = true;
		this.pwd = this.password.controls['pwd'];

		this.data = {
			pwd: this.password.controls.pwd.value
		}

		console.log("line 57",this.data.pwd,"localStorage",this.passwordLocal);
			if(this.data.pwd == this.passwordLocal){
				localStorage.setItem("flag", JSON.stringify(flag));
			 	console.log("line 66",JSON.parse(localStorage.getItem("flag")));
				this.navCtrl.push(EmployeesPage);
			}else{
				var flag = false;
				localStorage.setItem("flag", JSON.stringify(flag));
			 	console.log("line 71",JSON.parse(localStorage.getItem("flag")));
				let alert = this.alertCtrl.create({
	      subTitle: 'Your Password Is Incorrect',
	      buttons: ['OK']
	    });
	    alert.present();

			this.loading = this.loadingCtrl.create({
			    content: 'Please wait...'
			  });

			  this.loading.present();
				this.navCtrl.push(PasswordPage);
				this.loading.dismiss();
				}
	}
}
