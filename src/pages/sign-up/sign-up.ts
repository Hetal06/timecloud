import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';
import { UserData } from '../../providers/user-data';
// import { JwtHelper } from 'angular2-jwt';
// import { Http, Headers } from '@angular/http';
// import {Http,Headers} from '@angular/http';

@Component({
	selector: 'page-user',
	templateUrl: 'sign-up.html'
})
export class SignUpPage {
	signup: { username?: string, password?: string } = {};
	submitted = false;

	constructor(public navCtrl: NavController, public userData: UserData) { }

	onSignup(form) {
		this.submitted = true;

		if (form.valid) {
			this.userData.signup(this.signup.username);
			this.navCtrl.push(TabsPage);
		}
	}
}
