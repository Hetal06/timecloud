import { Injectable, } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';



@Injectable()
export class PincodeServicePage {
	data: any;
	loginId = localStorage.getItem("userId");
	loginToken = localStorage.getItem("loginToken");
  GetEmployeeOwnData_URL:string = "http://192.241.230.86:4000/employeeHomeData";
	GetEmployee_URL: string = "http://192.241.230.86:4000/employeeHomeData";
	contentHeader: Headers = new Headers({ "Content-Type": "application/json", "Authorization": this.loginId });

	constructor(public http: Http) {

  }

  load(): Observable<any> {
	return this.http.get(this.GetEmployee_URL, {headers: this.contentHeader })
		  .map(data => data.json());
  }

}
