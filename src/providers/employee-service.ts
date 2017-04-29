import { Injectable, } from '@angular/core';
import { Http, Headers } from '@angular/http';
// import {  AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';



@Injectable()
export class EmployeeServicePage {
	data: any;
	loginId = localStorage.getItem("loginId");
	GetEmployee_URL: string = "http://192.241.230.86/employeeHomeData";
	contentHeader: Headers = new Headers({ "Content-Type": "application/json", "Authorization": this.loginId });

	// CheckIn_URL: String = "localhost:3000/userCurrentCheckin";

	constructor( public http: Http) {
		console.log("emploee  Service Ctrl");
  }

  load(): Observable<any> {
	return this.http.get(this.GetEmployee_URL, {headers: this.contentHeader })
		  .map(data => data.json());
  }

 

}
