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
	public old_status: any;
	public checktype: any;
	public empStatusUpdate : any;
	public dateTime: any;
	public employeeList: any;
	public updateStatus: any;
	loginToken = localStorage.getItem("loginToken");
	loginId = localStorage.getItem("userId");

	contentHeader: Headers = new Headers({ "Content-Type": "application/json" });

	constructor(public http: Http, public navCtrl: NavController, public employeeService: EmployeeServicePage, public params: NavParams) {

		if(localStorage.getItem("loginToken")) {
			this.empSingleRec = JSON.parse(localStorage.getItem("emp_sigle_rec"));
			this.emp_no = this.empSingleRec.employeeNo;
			this.old_status = this.empSingleRec.status;
			} else {
			this.navCtrl.push(LoginPage);
		}


	}

	checkInOut(clickUserStatus,clickEmpNo){

		 this.employeeList = JSON.parse(localStorage.getItem("employeeList")).empList;
		 console.log("line 50",this.employeeList);

		if (clickUserStatus == 1 || clickUserStatus == 2 || clickUserStatus == 'i' || clickUserStatus == 'I' || clickUserStatus == 'IN') {
			this.checktype = 'I';
		} else {
			if (clickUserStatus == 'Break') {
				this.checktype = 3;
			} else {
				this.checktype = 'OUT';
			}
		}

		this.dateTime = new Date();
		this.body ={
			"userid": localStorage.getItem('userId'),
			"employeeNo":this.emp_no,
			"checkType": this.checktype,
			"timeIn": moment(this.dateTime).format("YYYY-MM-DD HH:mm:ss")
		}

		this.http.post('http://192.241.230.86:4000/insertCheckins', this.body, { headers: this.contentHeader })
						.subscribe(data => {
							data.json();
							if (data.json()) {
							//
							 for(let i=0;i<this.employeeList.length;i++){
								  	if(this.employeeList[i].employeeNo == this.emp_no ){
										this.employeeList[i].status = this.checktype;
									}
								}
								 localStorage.removeItem("employeeList");
								//  localStorage.setItem("employeeList",JSON.stringify(this.employeeList));
								 localStorage.setItem("employeeList", JSON.stringify({ empList: this.employeeList, addedDate: moment().format("YYYY-MM-DD") }));
								 console.log("line 85---->",localStorage.getItem("employeeList"));
								this.navCtrl.push(EmployeesPage);

							}
						},error =>{
							console.log("line 62 error");
						});

	}

	cancleBtn(){
		this.navCtrl.push(EmployeesPage);
	}

}
