import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { Http,Headers} from '@angular/http';
// import { EmployeesPage } from '../employees/employees';
import { EmployeeServicePage } from '../../providers/employee-service';
@Component({
	selector: 'page-userCheckins',
	templateUrl: 'userCheckins.html'
})
export class UserCheckinsPage {
	userInOutRec: any;
	public empSingleRec: any;
	public status: any;
	contentHeader: Headers = new Headers({ "Content-Type": "application/json" });
	constructor(public http: Http, public navCtrl: NavController, public employeeService: EmployeeServicePage, public params: NavParams) {
		console.log("SetTimeCloudPage");
		this.loadUser();
		// navCtrl.params.data
		this.empSingleRec = params.data.emp_sigle_rec;
		this.status = params.data.emp_status;
		console.log("status",this.status);
		console.log("emprec",this.empSingleRec);
	}

loadUser(){
	console.log("loadUser");
	// this.employeeService.load().subscribe(
	// 	data => {
	// 		console.log("line 21", data.EmployeeData);
	// 		for (var i = 0; i < data.EmployeeData.length; ++i) {
	// 			// code...
	// 			console.log(i," -- ",data.EmployeeData[i]);
	// 		}
	// 	});
	// let body={
	// 	userid: "",
	// 	employeeNo: ""
	// }
	// this.http.post('localhost:3000/getUserEmpdata', { body }, { headers: this.contentHeader });
	// 	// .map
	
}




}
