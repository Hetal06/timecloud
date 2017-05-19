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
	loginToken = localStorage.getItem("loginToken");
	loginId = localStorage.getItem("userId");
	
	contentHeader: Headers = new Headers({ "Content-Type": "application/json" });
	
	constructor(public http: Http, public navCtrl: NavController, public employeeService: EmployeeServicePage, public params: NavParams) {
		
		if(localStorage.getItem("loginToken")) {

			// console.log(JSON.parse(localStorage.getItem("emp_sigle_rec")));
			this.empSingleRec = JSON.parse(localStorage.getItem("emp_sigle_rec"));			
			this.emp_no = this.empSingleRec.employeeNo;
			this.old_status = this.empSingleRec.status;
			// console.log("this.emp_no", this.emp_no);
			} else {
			this.navCtrl.push(LoginPage);
		}

		
	}

	checkInOut(clickUserStatus,clickEmpNo){
		// console.log("employeeList localstorage ", JSON.parse(localStorage.getItem("employeeList")));
		this.employeeList = JSON.parse(localStorage.getItem("employeeList"));

		if (clickUserStatus == 1 || clickUserStatus == 2 || clickUserStatus == 'i' || clickUserStatus == 'I' || clickUserStatus == 'IN') {
			this.checktype = 'I';
		} else {
			if (clickUserStatus == 3) {
				this.checktype = 'Break';
			} else {
				this.checktype = 'O';
			}
		} 
		
		// console.log("-----------\n\n line 40 checkStatus", this.checktype);

		this.dateTime = new Date();
		this.body ={
			"userid": localStorage.getItem('userId'),
			"employeeNo":this.emp_no,
			"checkType": this.checktype,
			"timeIn": moment(this.dateTime).format("YYYY-MM-DD HH:mm:ss")
		}

		
		
		this.http.post('http://localhost:4000/insertCheckins', this.body, { headers: this.contentHeader })
						.subscribe(data => {
							// console.log("line 78 ok",data.json());
							data.json();
							if (data.json()) {
								// this.empStatusUpdate = { "employeeNo": this.emp_no, "checkType": this.checktype, "dateCheckins": moment(this.dateTime).format("YYYY-MM-DD HH:mm:ss") };
					
							// for (var itr = 0; itr < this.employeeList.length  ; itr++) {
									// console.log("=FOR LOOP=", this.employeeList);
									// if (this.emp_no === this.employeeList[itr].employeeNo) {
										// console.log("line 88", this.employeeList[itr]);
										// console.log("------\n\n line 47 body", this.body);
										localStorage.setItem("empStatusUpdate", JSON.stringify(this.body));
										this.navCtrl.push(EmployeesPage);


								// 	}
								// }								
							}

							// console.log("--------\n\n line 65 currentUserStatus", this.checktype,this.emp_no);
							
						},error =>{
							console.log("line 62 error");
						});
			
		 
	}

	cancleBtn(){
		// console.log("cancle func");
		this.navCtrl.push(EmployeesPage);
	}

}
