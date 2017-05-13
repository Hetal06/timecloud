import { Injectable, } from '@angular/core';
import { Http, Headers } from '@angular/http';
// import { NavController } from 'ionic-angular';
// import {  AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
// import { LoginPage } from '../pages/login/login';


@Injectable()
export class EmployeeServicePage {
	data: any;
	loginId = localStorage.getItem("userId");
	loginToken = localStorage.getItem("loginToken");

	GetEmployee_URL: string = "http://localhost:4000/employeeHomeData";
	contentHeader: Headers = new Headers({ "Content-Type": "application/json", "Authorization": this.loginId });


	// CheckIn_URL: String = "localhost:3000/userCurrentCheckin";

	constructor(public http: Http) {
		
  }

  load(): Observable<any> {
  	// let body={
			// "token"=localStorage.getItem(loginToken)
  	// }
	return this.http.get(this.GetEmployee_URL, {headers: this.contentHeader })
		  .map(data => data.json());
  }

 

}
