import {
	Component
} from '@angular/core';
import {
	NavController,
	AlertController,
	NavParams
} from 'ionic-angular';
// import { LoginPage } from '../login/login';
import {
	Http,
	Headers
} from '@angular/http';
import {
	Offline
} from '../../providers/offline';
import {
	EmployeeServicePage
} from '../../providers/employee-service';
import {UserCheckinsPage} from '../userCheckins/userCheckins';
import { LoginPage } from '../login/login';
/*
  Generated class for the Employees page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
	selector: 'page-employees',
	templateUrl: 'employees.html'
})
export class EmployeesPage {
	public currentUserStatus: any;
	public set_selected_status: any;
	public employees: any;
	public status: any;
	public body;
	public employeeList: any;
	public employeeCheckIns: any;
	public employeeAttendance: any;
	public empStatusUpdate: any;
	public attandanceCheckIns: any;
	public attandanceCheckType: any;
	public checkins: any;
	loginToken = localStorage.getItem("loginToken");
	loginId = localStorage.getItem("userId");
	loginEmail = localStorage.getItem("loginEmail");
	GetCheckin_URL: string = "http://localhost:4000/currentCheckin";
	contentHeader: Headers = new Headers({ "Content-Type": "application/json", "Authorization": this.loginId });

	data: any;
	select_status: any;
	selected_EmoNo: any;

	constructor(public navCtrl: NavController, private offlineService: Offline, private alertCtrl: AlertController, public http: Http, public employeeService: EmployeeServicePage, public params: NavParams) {
		if (localStorage.getItem("loginToken")) {			
			this.loadEmployee();
			this.select_status = params.get("selectedStatus");
			this.selected_EmoNo = params.data.selectedEmpNo;
		} else {
			this.navCtrl.push(LoginPage);
		}
	}

	loadEmployee() {
		this.employeeService.load().subscribe(
			dataOfEmp => {
				this.employeeList = [];
				// console.log("employee list ----->", this.employees);

				this.http.get(this.GetCheckin_URL, { headers: this.contentHeader })
					.map(data => data.json())
					.subscribe(
					dataOfCheckin => {
						this.employeeCheckIns = dataOfCheckin;
						this.checkins = [];
						// console.log("check in api", this.employeeCheckIns);
						// console.log("================", this.employeeCheckIns[0].checkin);
						if (this.employeeCheckIns.length > 0){

						this.employeeCheckIns.forEach((employeeNoData,key)=>{
							// console.log("employeeNoData=======", employeeNoData.employeeNo);

							// var employeeNo = employeeNoData.employeeNo;
							// this.attandanceCheckIns = ;
							
							
							if (employeeNoData.checkin.length > 0) {
								// console.log("attandanceCheckIns------>", employeeNoData.checkin);

								employeeNoData.checkin.forEach((checkIns) => {
									// console.log("checkins ----forEach--->", checkIns);
									// this.attandanceCheckType = checkIns.checkType;

									var status = '';
									
									if (checkIns.checkType == 1 || checkIns.checkType == 2 || checkIns.checkType == 'i' || checkIns.checkType == 'I') {
										status = 'In';
									} else {
										if (checkIns.checkType == 3) {
											status = 'Break';

										} else {
											status = 'Out';
										}
									}
									// console.log("stutus,, ", status);
									this.checkins.push({
										'employeeNo': employeeNoData.employeeNo,
										'status': status
									})
									// console.log("checkins1,, ", this.checkins);
								})					
							}else{

								
								// console.log("else stutus,, ", status);
								this.checkins.push({
									'employeeNo': employeeNoData.employeeNo,
									'status': 'Out'
								})
								// console.log("checkins1-else,, ", this.checkins);
							}
							console.log(key);
							if (this.employeeCheckIns.length==(key+1)){
								console.log("checkin if------", this.checkins);
							}
						})
							
						
						dataOfEmp.EmployeeData.forEach((emp) => {
							console.log("employee of data ------------------116------------->", emp);	
							// this.employees = emp;
							// this.checkins.forEach((myCheckinData,key) =>{
							// 	console.log(myCheckinData,"-----",key);
							// })			
							for (var i = 0; i < this.checkins.length; i++) {
								console.log(this.checkins[i].employeeNo, "====", this.checkins[i].status);
								if (this.checkins[i].employeeNo == emp.employeeNo) {

									status = this.checkins[i].status;
								}
							}
							this.employeeList.push({
								'employeeNo': emp.employeeNo,
								'firstName': emp.firstName,
								'lastName': emp.lastName,								
								'status': status
							})
							// console.log("push ------employee-->", this.employeeList);
						})

					}

						console.log(JSON.parse(localStorage.getItem("empStatusUpdate")));
						if (localStorage.getItem("empStatusUpdate")) {
							console.log("in if");
							this.empStatusUpdate = JSON.parse(localStorage.getItem("empStatusUpdate"));
							this.employeeList.forEach((checkinForEach)=>{
								console.log("checkinForEach", checkinForEach);
								if (checkinForEach.employeeNo === this.empStatusUpdate.empId) {
									console.log("entry - ", checkinForEach.status, this.empStatusUpdate.checkType);
									checkinForEach.status = this.empStatusUpdate.checkType;
									// this.employeeList[iter].checkin[this.employeeList[iter].checkin.length - 1].checkType = this.empStatusUpdate.checkType;
								}
							})
							// for (var iter = 0; iter < this.employeeList.length; iter++) {
								// console.log(this.employeeList[iter].employeeNo ,"===",this.empStatusUpdate.empId);
								
								// console.log(this.employeeList[iter].employeeNo, this.employeeList[iter].status);
							 // }
						}
						// if (this.selected_EmoNo == this.s.employeeNo) {
						// 	this.set_selected_status = this.select_status;
						// 	this.currentUserStatus = this.set_selected_status;
						// }
						// else {
						// 	this.currentUserStatus = this.employeeCheckIns[0].checkin[0].checkType;
						// }
						
						
					})

					
		})
			
	}

	inOutFunc(employee) {
		this.navCtrl.push(UserCheckinsPage, {
			emp_sigle_rec: employee,
			emp_status: this.status
		});
	}
}