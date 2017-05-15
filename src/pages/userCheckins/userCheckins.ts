import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { Http,Headers} from '@angular/http';
import { EmployeesPage } from '../employees/employees';
import { EmployeeServicePage } from '../../providers/employee-service';
import * as moment from 'moment';
import { LoginPage } from '../login/login';

@Component({
	selector: 'page-userCheckins',
	templateUrl: 'userCheckins.html'
})
export class UserCheckinsPage {
	userInOutRec: any;
	public empSingleRec: any;
	public status: any;
	public user: any;
	public currentUser: any;
	public body: any;
	public data: any;
	public emp_no: any;
	public checkStatus: any;
	public currentUserStatus: any;
	public checktype: any;
	public empStatusUpdate : any;
	public dateTime: any;
	loginToken = localStorage.getItem("loginToken");
	loginId = localStorage.getItem("userId");
	
	contentHeader: Headers = new Headers({ "Content-Type": "application/json" });
	
	constructor(public http: Http, public navCtrl: NavController, public employeeService: EmployeeServicePage, public params: NavParams) {
		
		// this.loadUser();
		// navCtrl.params.data
		if (localStorage.getItem("loginToken")) {
			// console.log("SetTimeCloudPage", localStorage.getItem("loginToken"));
			this.empSingleRec = params.data.emp_sigle_rec;
			// this.status = params.data.emp_status;
			this.emp_no = params.data.emp_sigle_rec.employeeNo;
		} else {
			this.navCtrl.push(LoginPage);
		}


	
		// console.log("status",this.status);
		console.log("emprec", this.emp_no);
		

	}

	checkInOut(clickUserStatus,clickEmpNo){
		if (clickUserStatus == 1 || clickUserStatus == 2 || clickUserStatus == 'i' || clickUserStatus == 'I' || clickUserStatus == 'IN') {
			this.checktype = 'I';
		} else {
			if (clickUserStatus == 3) {
				this.checktype = 'Break';
			} else {
				this.checktype = 'O';
			}
		} 


		// if (clickUserStatus == 'In') {
		// 	this.checktype = 4;
		// } else if (clickUserStatus == 'endBreak') {
		// 	this.checktype = 2
		// } else if (clickUserStatus == 'startBreak') {
		// 	this.checktype = 3
		// } else {
		// 	this.checktype = 'O'
		// }  	
		
		console.log("-----------\n\n line 40 checkStatus", this.checktype);
		// console.log("API USER STATUS", this.user);
		
		// console.log("clickUserStatus", clickUserStatus, clickEmpNo);
		this.dateTime = new Date();
		this.body ={
			"userid": localStorage.getItem('userId'),
			"employeeNo":this.emp_no,
			"checkType": this.checktype,
			"timeIn": moment(this.dateTime).format("YYYY-MM-DD HH:mm:ss")
		}

		console.log("------\n\n line 47 body", this.body);
		
		this.http.post('http://localhost:4000/insertCheckins', this.body, { headers: this.contentHeader })
						.subscribe(data => {
							console.log("line 78 ok",data.json());
							data.json();
							if(data.json()){
								this.empStatusUpdate = { "empId": this.emp_no, "checkType": this.checktype, "dateCheckins": moment(this.dateTime).format("YYYY-MM-DD")};
								localStorage.setItem("empStatusUpdate", JSON.stringify(this.empStatusUpdate));
							}
							this.checktype = clickUserStatus;
							console.log("--------\n\n line 65 currentUserStatus", this.checktype);
						},error =>{
							console.log("line 62 error");
						});
			
		this.navCtrl.push(EmployeesPage, { selectedStatus: clickUserStatus, selectedEmpNo: clickEmpNo });


	}

	cancleBtn(){
		console.log("cancle func");
		this.navCtrl.push(EmployeesPage);
	}

	// loadUser(){
	// console.log("loadUser");
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
	
// }




}
