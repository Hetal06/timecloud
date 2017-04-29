import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
// import { LoginPage } from '../login/login';
import { Http,Headers } from '@angular/http';
import { Offline } from '../../providers/offline';
import { EmployeeServicePage } from '../../providers/employee-service';
import { UserCheckinsPage } from '../userCheckins/userCheckins';
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
	public employees: any;
	public status: any;
	public body;
	loginId = localStorage.getItem("loginId");
	// GetEmployee_URL: string = "http://localhost:3000/employeeHomeData/loginId";
	contentHeader: Headers = new Headers({ "Content-Type": "application/json"});
	data: any;
	// error: any;


	constructor(public navCtrl: NavController, private offlineService: Offline, private alertCtrl: AlertController, public http: Http, public employeeService: EmployeeServicePage) {
		console.log('Hello EmployeesPage Page');
		console.log("loginId", this.loginId);
		// console.log("GetEmployee_URL....", this.GetEmployee_URL);

		this.loadEmployee();
	}

	loadEmployee(){
		
		this.employeeService.load().subscribe(
			data => {
				this.employees = data.EmployeeData;
				console.log(data.EmployeeData);
				data.EmployeeData.forEach((employee) => {
					this.body = {
						"userid": employee.companyId,
						"employeeNo":employee.employeeNo
					}
					console.log("employee", employee);
					this.http.post('http://192.241.230.86/userCurrentCheckin', this.body, { headers: this.contentHeader })
						.map(data => data.json())
						.subscribe(
						data => {
							this.currentUserStatus = data.status
							console.log(this.currentUserStatus);
						}
						);
					

					});
				
				// this.employees = Array.of(this.employees);
				// console.log(data);
			},
			err => {
				console.log("err...." + err);
			}
		)



		// this.employeeService.load()
		// .then(data => {
		// 	this.employees = data;
		// });

		// this.http.post(this.GetEmployee_URL, { headers: this.contentHeader })
		// 	.map(res => res.json())
		// 	.subscribe(
		// 	err => this.error = err
		// 	);

		// console.log("data", this.data);
	}

	inOutFunc(employee) {
		console.log("inOutFunc work",employee);
		this.status = this.currentUserStatus;

		console.log("line 89", this.status);
		this.navCtrl.push(UserCheckinsPage, { emp_sigle_rec: employee,emp_status:this.status});
	}

	// ionViewDidLoad() {
	// 	console.log('Hello EmployeesPage Page');
	// }


	createTodo() {
		console.log("createTodo() work");
		let prompt = this.alertCtrl.create({
			title: 'Add',
			message: 'What do you need to do?',
			inputs: [
				{
					name: 'title'
				}
			],
			buttons: [
				{
					text: 'Cancel'
				},
				{
					text: 'Save',
					handler: data => {
						this.offlineService.createTodo({ title: data.title });
					}
				}
			]
		});

		prompt.present();

	}

	updateTodo(todo) {

		let prompt = this.alertCtrl.create({
			title: 'Edit',
			message: 'Change your mind?',
			inputs: [
				{
					name: 'title'
				}
			],
			buttons: [
				{
					text: 'Cancel'
				},
				{
					text: 'Save',
					handler: data => {
						this.offlineService.updateTodo({
							_id: todo._id,
							_rev: todo._rev,
							title: data.title
						});
					}
				}
			]
		});

		prompt.present();
	}

	deleteTodo(todo) {
		this.offlineService.deleteTodo(todo);
	}
	// authSuccess(token) {
	// 	this.error = null;
	// 	// localStorage.setItem("loginId", token);
	// 	console.log("data", token);
	// 	if (token) {
	// 		// this.navCtrl.push(HomePage);
	// 		console.log("success!");
	// 	} else {
	// 		console.log("invalid email and pwd");
	// 	}
	// 	// this.local.set('id_token', token);
	// 	// this.user = this.jwtHelper.decodeToken(token).username;
	// }

	

}
