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
	public confirmedExit: any;
	public attandanceCheckType: any;
	public EmpStoreData: any;
	public checkins: any;
	public bLocal: boolean;
	public bCountMatch: boolean;
	loginToken = localStorage.getItem("loginToken");
	loginId = localStorage.getItem("userId");
	loginEmail = localStorage.getItem("loginEmail");
	GetCheckin_URL: string = "http://localhost:4000/currentCheckin";
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
		// localStorage.removeItem("employeeList");
		this.employeeService.load().subscribe(
			dataOfEmp => {
				this.employeeList = [];

				this.http.get(this.GetCheckin_URL, {
					headers: this.contentHeader
				})
					.map(data => data.json())
					.subscribe(
					dataOfCheckin => {
						this.employeeCheckIns = dataOfCheckin;
						this.checkins = [];

						if (this.employeeCheckIns.length > 0) {

							this.employeeCheckIns.forEach((employeeNoData, key) => {

								if (employeeNoData.checkin.length > 0) {
									employeeNoData.checkin.forEach((checkIns) => {
										var status = '';
										if (checkIns.checkType == 1 || checkIns.checkType == 2 || checkIns.checkType == 'i' || checkIns.checkType == 'I') {
											status = 'I';
										} else {
											if (checkIns.checkType == 3) {
												status = 'Break';

											} else {
												status = 'Out';
											}
										}
										this.checkins.push({
											'employeeNo': employeeNoData.employeeNo,
											'status': status
										})
									})
								} else {
									this.checkins.push({
										'employeeNo': employeeNoData.employeeNo,
										'status': 'Out'
									})
								}

							})
							// console.log("line 114--", dataOfEmp.EmployeeData);
							if (localStorage.getItem("employeeList")) {
								this.bLocal = true;
								this.employeeList = JSON.parse(localStorage.getItem("employeeList"));
								console.log("line 109", this.employeeList);
								if (dataOfEmp.EmployeeData.length !== this.employeeList.length) {
									this.bCountMatch = false;
								} else {
									this.bCountMatch = true;
								}
							} else {
								this.bLocal = false;
							}
							// console.log("line 120", this.checkins);
							for (var iter = 0; iter < dataOfEmp.EmployeeData.length; iter++) {
								// console.log("employee of home data ------------------116------------->", dataOfEmp.EmployeeData[iter]);
								for (var innerIter = 0; innerIter < this.checkins.length; innerIter++) {
									// console.log("innerIter -------->", innerIter);
									if (this.checkins[innerIter].employeeNo == dataOfEmp.EmployeeData[iter].employeeNo) {
										// console.log(this.checkins[innerIter].employeeNo == dataOfEmp.EmployeeData[iter].employeeNo);
										if (this.bLocal && !this.bCountMatch) {
											 console.log("this.employeeList[iter] line 136", this.employeeList[iter]);
											if (this.employeeList[iter].employeeNo !== dataOfEmp.EmployeeData[iter].employeeNo) {
												this.employeeList.push({
													'employeeNo': dataOfEmp.EmployeeData[iter].employeeNo,
													'firstName': dataOfEmp.EmployeeData[iter].firstName,
													'lastName': dataOfEmp.EmployeeData[iter].lastName,
													'status': this.checkins[innerIter].status
												});
											}
										} else if (this.bLocal && this.bCountMatch) {
											if (this.employeeList[iter].employeeNo == dataOfEmp.EmployeeData[iter].employeeNo && this.employeeList[iter].status !== this.checkins[innerIter].status) {
												// this.employeeList[iter].status = this.checkins[innerIter].status;
											}
										} else if (!this.bLocal) {
											this.employeeList.push({
												'employeeNo': dataOfEmp.EmployeeData[iter].employeeNo,
												'firstName': dataOfEmp.EmployeeData[iter].firstName,
												'lastName': dataOfEmp.EmployeeData[iter].lastName,
												'status': this.checkins[innerIter].status
											});
										}

									}
								}


								if (iter == (dataOfEmp.EmployeeData.length - 1)) {

									for (var iter = 0; iter < this.employeeList.length; iter++) {
										for (var innerIter = iter; innerIter < this.employeeList.length; innerIter++) {
											// console.log(this.employeeList, innerIter, iter);
											if (iter != innerIter && this.employeeList[iter] && this.employeeList[innerIter]) {
												if (this.employeeList[iter].employeeNo == this.employeeList[innerIter].employeeNo) {
													// this.employeeList.splice(iter, 1);
													this.employeeList[iter].displayData = false;
													// console.log("this.employeeList[iter] line 170", this.employeeList[iter].status.length);
												}
											}
										}
									}
									console.log(this.employeeList);
									localStorage.setItem("employeeList", JSON.stringify(this.employeeList));

									// this.EmpStoreData = JSON.parse(localStorage.getItem("employeeList"));
									// console.log("line 120", this.EmpStoreData);
								}
							}

						}
					})


			})

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
		// this.navCtrl.push(UserCheckinsPage, {
		// 		emp_sigle_rec: employee,
		// 		emp_status: this.status
		// });
	}

}