import {
	Component
} from '@angular/core';
import {
	NavController,
	AlertController,
	NavParams
} from 'ionic-angular';
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
import {
	UserCheckinsPage
} from '../userCheckins/userCheckins';
import {
	LoginPage
} from '../login/login';
import * as moment from 'moment';

@Component({
	selector: 'page-employees',
	templateUrl: 'employees.html'
})
export class EmployeesPage {
	public todayDate: any;
	public set_selected_status: any;
	public employees: any;
	public status: any;
	public body;
	public employeeList: any;
	public employeeCheckIns: any;
	public employeeAttendance: any;
	public empStatusUpdate: any;
	public confirmedExit: any;
	public attandanceCheckType: any;
	public EmpStoreDataNew: any;
	public checkins: any;
	public bLocal: boolean;
	public bCountMatch: boolean;
	public empData: any;
	public empCurrentDate: any;
	public today: any;
	public tempEmpData: any;

	loginToken = localStorage.getItem("loginToken");
	loginId = localStorage.getItem("userId");
	loginEmail = localStorage.getItem("loginEmail");
	GetCheckin_URL: string = "http://192.241.230.86:4000/currentCheckin";
	contentHeader: Headers = new Headers({
		"Content-Type": "application/json",
		"Authorization": this.loginId
	});

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

		// if (localStorage.getItem("employeeList") && (localStorage.getItem("TodayDate") == moment().format("YYYY-MM-DD"))) {
		// 	this.employeeList = JSON.parse(localStorage.getItem("employeeList"));
		// 	if (localStorage.getItem("empStatusUpdate")) {
		// 		this.EmpStoreDataNew = JSON.parse(localStorage.getItem("empStatusUpdate"));
		// 		for (var itr = 0; itr < this.employeeList.length; itr++) {
		// 			if (this.employeeList[itr].employeeNo == this.EmpStoreDataNew.employeeNo) {
		// 				this.employeeList[itr].status = this.EmpStoreDataNew.checkType;
		// 			}
		// 			if (this.employeeList.length === (itr + 1)) {
		// 				localStorage.setItem("employeeList", JSON.stringify(this.employeeList));
		// 			}
		// 		}
		// 	} else {
		// 		console.log("! == this.EmpStoreDataNew	");
		// 	}
		//
		// }
		// else
		// {
			console.log("else line 92");

			this.employeeService.load().subscribe(
				dataOfEmp => {
					this.employeeList = [];
					this.todayDate = moment().format("YYYY-MM-DD HH:mm:ss");
					this.today = moment().subtract(1,'day').format("YYYY-MM-DD") +" 00:00:00";
					localStorage.setItem("TodayDate", this.todayDate);


					this.http.get(this.GetCheckin_URL, {
						headers: this.contentHeader
					})
						.map(data => data.json())
						.subscribe(
						dataOfCheckin => {
							this.employeeCheckIns = dataOfCheckin;
							this.checkins = [];
							console.log("employeeCheckIns 129-->", this.employeeCheckIns);

							if (this.employeeCheckIns.length > 0) {

								if (localStorage.getItem("employeeList")) {
									this.bLocal = true;
									this.employeeList = JSON.parse(localStorage.getItem("employeeList"));
									// console.log("line 109", this.employeeList);
									if (dataOfEmp.EmployeeData.length !== this.employeeList.length) {
										this.bCountMatch = false;
									} else {
										this.bCountMatch = true;
									}
								} else {
									this.bLocal = false;
									this.bCountMatch = false;
								}
								console.log("this.bLocal = ", this.bLocal, "this.bCountMatch = ", this.bCountMatch);

								if (!this.bLocal && !this.bCountMatch) {
									for (var iter = 0; iter < dataOfEmp.EmployeeData.length; iter++) {
										// console.log("line 136---->",dataOfEmp.EmployeeData.length);
										for (var innerIter = 0; innerIter < this.employeeCheckIns.length; innerIter++) {
											this.tempEmpData = this.employeeCheckIns[innerIter];
											console.log("line 138 ---------->",this.tempEmpData.employeeNo,"==",this.tempEmpData.firstName);
											if (this.tempEmpData.employeeNo == dataOfEmp.EmployeeData[iter].employeeNo) {
												console.log(this.tempEmpData.employeeNo ,"==", dataOfEmp.EmployeeData[iter].employeeNo)
												if (this.tempEmpData.checkin.length > 0){
													// console.log("line 140 ---->",this.tempEmpData.checkin.length);
													var status = '';
													if (this.tempEmpData.checkin[this.tempEmpData.checkin.length - 1].checkType == 1 || this.tempEmpData.checkin[this.tempEmpData.checkin.length - 1].checkType == 2 || this.tempEmpData.checkin[this.tempEmpData.checkin.length - 1].checkType == 'i' || this.tempEmpData.checkin[this.tempEmpData.checkin.length - 1].checkType == 'I') {
														status = 'I';
													} else {
														if (this.tempEmpData.checkin[this.tempEmpData.checkin.length - 1].checkType == 3) {
															status = 'Break';
														}
													}
													this.employeeList.push({
														'employeeNo': dataOfEmp.EmployeeData[iter].employeeNo,
														'firstName': dataOfEmp.EmployeeData[iter].firstName,
														'lastName': dataOfEmp.EmployeeData[iter].lastName,
														'status':this.tempEmpData.checkin[this.tempEmpData.checkin.length - 1].checkType,
														'dateTime': this.tempEmpData.checkin[this.tempEmpData.checkin.length - 1].checkTime
													});
													console.log("line 159");
												}
												else{
													this.employeeList.push({
														'employeeNo': dataOfEmp.EmployeeData[iter].employeeNo,
														'firstName': dataOfEmp.EmployeeData[iter].firstName,
														'lastName': dataOfEmp.EmployeeData[iter].lastName,
														'status': "Out",
														'dateTime': this.today
													});
													console.log("line 169");
												}
											}
										}
										if (iter == (dataOfEmp.EmployeeData.length - 1) && !this.bLocal) {
											for (var iter = 0; iter < this.employeeList.length; iter++){
												console.log("this.employeeList line 175===>",this.employeeList[iter]);
												for (var innerIter = iter; innerIter < this.employeeList.length; innerIter++) {
													console.log("this.employeeList line 177===>",this.employeeList[innerIter]);
													if (iter != innerIter && this.employeeList[iter] && this.employeeList[innerIter]) {
														if (this.employeeList[iter].employeeNo == this.employeeList[innerIter].employeeNo) {
															this.employeeList[iter].displayData = false;
														}
													}
													localStorage.setItem("employeeList", JSON.stringify(this.employeeList));
												}
											}
										}
									}
								}else{
									if (localStorage.getItem("employeeList")) {
											this.employeeList = JSON.parse(localStorage.getItem("employeeList"));
											console.log("localStorage else ",localStorage.getItem("employeeList"));
											if (localStorage.getItem("empStatusUpdate")) {
												console.log("this.EmpStoreDataNew localStorage------>",localStorage.getItem("empStatusUpdate"));
												this.EmpStoreDataNew = JSON.parse(localStorage.getItem("empStatusUpdate"));
												for (var itr = 0; itr < this.employeeList.length; itr++) {
													if (this.employeeList[itr].employeeNo == this.EmpStoreDataNew.employeeNo) {
														this.employeeList[itr].status = this.EmpStoreDataNew.checkType;
													}
													if (this.employeeList.length === (itr + 1)) {
														localStorage.setItem("employeeList", JSON.stringify(this.employeeList));
													}
												}
											} else {
												console.log("! == this.EmpStoreDataNew	");
											}
										}
								}
							}
						})
				})
				// this.navCtrl.setRoot(this.navCtrl.getActive().component);
		// }
	}

	inOutFunc(employee) {
		console.log("employeeeeeeeeeee", employee);
		let emp_sigle_rec = {
			"firstName": employee.firstName,
			"lastName": employee.lastName,
			"status": employee.status,
			"employeeNo": employee.employeeNo
		};
		localStorage.setItem("emp_sigle_rec", JSON.stringify(emp_sigle_rec));

		this.navCtrl.push(UserCheckinsPage);

	}

}
