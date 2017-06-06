import { Component } from '@angular/core';
import { NavController,NavParams,LoadingController ,Platform} from 'ionic-angular';
import { Http,Headers} from '@angular/http';
import { EmployeesPage } from '../employees/employees';
import { TerminalModePage } from '../terminalMode/terminalMode';
import { EmployeeServicePage } from '../../providers/employee-service';
import * as moment from 'moment';
import { LoginPage } from '../login/login';
import { GoogleMaps} from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';


@Component({
	selector: 'page-userCheckins',
	templateUrl: 'userCheckins.html'
})
export class UserCheckinsPage {
	userInOutRec: any;
	public empSingleRec: any;
	public duplicateStatus :any;
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
	public employeeListAddedDate:any;
	public date:any;
	public map:any;
	public lat:any;
	public lon:any;
	public changeJobcode:any;

	loginToken = localStorage.getItem("loginToken");
	loginId = localStorage.getItem("userId");

	contentHeader: Headers = new Headers({ "Content-Type": "application/json" });

	constructor(public platform: Platform,private geolocation: Geolocation, private googleMaps: GoogleMaps,private loadingCtrl: LoadingController,public http: Http, public navCtrl: NavController, public employeeService: EmployeeServicePage, public params: NavParams) {
		platform.ready().then(() => {
      this.loadMap();
    });
		if(localStorage.getItem("loginToken")) {
			this.empSingleRec = JSON.parse(localStorage.getItem("emp_sigle_rec"));
			this.emp_no = this.empSingleRec.employeeNo;
			this.old_status = this.empSingleRec.status;
			this.date=this.empSingleRec.todayDate;
			} else {
			this.navCtrl.push(LoginPage);
		}
	}

	loadMap() {
	this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }).then((resp) => {
		this.lat=resp.coords.latitude;
		this.lon=resp.coords.longitude;
		}).catch((error) => {
		console.log('Error getting location', error);
	});
 }

	checkInOut(clickUserStatus,clickEmpNo){
		console.log("this.lat=",this.lat,"this.lon ",this.lon);
		this.changeJobcode=localStorage.getItem("changeJobcode");
		console.log("changeJobcode is",this.changeJobcode);
	 this.employeeList = JSON.parse(localStorage.getItem("employeeList")).empList;
//	 console.log("line 50",this.employeeList);
	 this.employeeListAddedDate=JSON.parse(localStorage.getItem("employeeListAddedDate"));
	// console.log("line 55",this.employeeListAddedDate);
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
			"timeIn": moment(this.dateTime).format("YYYY-MM-DD HH:mm:ss"),
			// "workcode":this.changeJobcode,
			"lat":this.lat,
			"lon":this.lon
		}
		let loadingPopup = this.loadingCtrl.create({
			content: 'Loading data...'
		});
		loadingPopup.present();
		this.http.post('http://192.241.230.86:4000/insertCheckins', this.body, { headers: this.contentHeader })
						.subscribe(data => {
							data.json();
							console.log("line 102", data.json());
							if (data.json()) {
							for(let i=0;i<this.employeeList.length;i++){
								  	if(this.employeeList[i].employeeNo == this.emp_no ){
										this.employeeList[i].status = this.checktype;
									}
								}
							  localStorage.removeItem("employeeList");
								setTimeout(() => {
									localStorage.setItem("employeeList", JSON.stringify({ empList: this.employeeList, addedDate: this.employeeListAddedDate}));
									//console.log("line 86  --->",localStorage.getItem("employeeList"));
						      loadingPopup.dismiss();
						     }, 1000);


								if(localStorage.getItem("bTerminalMode") == "false"){
									//console.log("line 86 terminalmode",localStorage.getItem("bTerminalMode"));
										this.navCtrl.push(EmployeesPage);
								}else if(localStorage.getItem("bTerminalMode") == "true"){
									//console.log("line 89 terminalmode",localStorage.getItem("bTerminalMode"));
										this.navCtrl.push(TerminalModePage);
								}
							}
						},error =>{
							//console.log("line 62 error");
						});

	}

	cancleBtn(){
		let loadingPopup = this.loadingCtrl.create({
			content: ''
		});
		loadingPopup.present();
		if(localStorage.getItem("bTerminalMode") == "false"){
			setTimeout(() => {
				this.navCtrl.push(EmployeesPage);
				loadingPopup.dismiss();
			 }, 1000);

		}else if(localStorage.getItem("bTerminalMode") == "true"){
			setTimeout(() => {
					this.navCtrl.push(TerminalModePage);
				loadingPopup.dismiss();
			 }, 1000);
		}

	}

}
