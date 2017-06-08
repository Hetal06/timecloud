import {
  Component
} from '@angular/core';
import {
  NavController,
  AlertController,
  NavParams,
  LoadingController
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
  templateUrl: 'employees.html',
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
  public employeeTemp: any;
  public keys :any;


  jobCosting=localStorage.getItem("jobCosting");
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

  constructor(private loadingCtrl: LoadingController,public navCtrl: NavController, private offlineService: Offline, private alertCtrl: AlertController, public http: Http, public employeeService: EmployeeServicePage, public params: NavParams) {
    // let loadingPopup = this.loadingCtrl.create({
    //   content: 'Loading data...'
    // });
    // loadingPopup.present();
    // setTimeout(() => {
    //     this.terminalEmp();
    //     loadingPopup.dismiss();
    //  }, 1000);
    if (localStorage.getItem("loginToken")) {
      this.loadEmployee();
      localStorage.setItem("bTerminalMode","false");
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
        this.employeeTemp = [];
        this.todayDate = moment().format("YYYY-MM-DD HH:mm:ss");
        this.today = moment().subtract(1, 'day').format("YYYY-MM-DD") + " 00:00:00";
        localStorage.setItem("TodayDate", this.todayDate);

        this.http.get(this.GetCheckin_URL, {
          headers: this.contentHeader
        })
          .map(data => data.json())
          .subscribe(
          dataOfCheckin => {
            this.employeeCheckIns = dataOfCheckin;
            this.checkins = [];
						this.bLocal = false;
						this.bCountMatch = false;
            console.log("sdffffffffffffff - ",this.employeeCheckIns.length);
            if (this.employeeCheckIns.length > 0) {
              if (localStorage.getItem("employeeList")) {
                  console.log("2nd if - ",(JSON.parse(localStorage.getItem("employeeList")).addedDate !== moment().format("YYYY-MM-DD")),(JSON.parse(localStorage.getItem("employeeList")).addedDate !== undefined),JSON.parse(localStorage.getItem("employeeList")) );
                 if (JSON.parse(localStorage.getItem("employeeList")).addedDate !== moment().format("YYYY-MM-DD") && JSON.parse(localStorage.getItem("employeeList")).addedDate !== undefined) {
                   console.log("3d if -",)
								 	localStorage.removeItem("employeeList");
                 } else {
                   this.employeeList = JSON.parse(localStorage.getItem("employeeList")).empList;
                    this.bLocal = true;
                     if (dataOfEmp.EmployeeData.length !== this.employeeList.length) {
                       this.bCountMatch = false;
                      } else {
                       this.bCountMatch = true;
                      }
                }
              } else {
                console.log("2nd else - ");
                this.bLocal = false;
                this.bCountMatch = false;
              }
              console.log("this.bLocal",this.bLocal,"this.bCountMatch",this.bCountMatch);
              var status = '';
              this.employeeTemp = [];
              for (var iter in dataOfEmp.EmployeeData) {
                // console.log("load 1st");
                for (var innerIter in this.employeeCheckIns) {
                  // console.log("load 2nd");
                  this.tempEmpData = this.employeeCheckIns[innerIter];
                  if (this.tempEmpData.employeeNo == dataOfEmp.EmployeeData[iter].employeeNo) {
                    // console.log("load 3rd");
                    if (this.tempEmpData.checkin.length > 0) {
                      // console.log("load 4th");
                      status = '';
                      if (this.tempEmpData.checkin[this.tempEmpData.checkin.length - 1].checkType == 1 || this.tempEmpData.checkin[this.tempEmpData.checkin.length - 1].checkType == 2 || this.tempEmpData.checkin[this.tempEmpData.checkin.length - 1].checkType == 'i' || this.tempEmpData.checkin[this.tempEmpData.checkin.length - 1].checkType == 'I') {
                        // console.log("load 5th");
                        status = 'I';
                      } else {
                        if (this.tempEmpData.checkin[this.tempEmpData.checkin.length - 1].checkType == 3) {
                          status = 'Break';
                        }
                      }
                      this.employeeTemp.push({
                        'employeeNo': dataOfEmp.EmployeeData[iter].employeeNo,
                        'firstName': dataOfEmp.EmployeeData[iter].firstName,
                        'lastName': dataOfEmp.EmployeeData[iter].lastName,
                        'pin': dataOfEmp.EmployeeData[iter].pin,
                        'status': this.tempEmpData.checkin[this.tempEmpData.checkin.length - 1].checkType,
                        'dateTime': this.tempEmpData.checkin[this.tempEmpData.checkin.length - 1].checkTime,
                        'added': true
                      });
                    }
                    else {
                      this.employeeTemp.push({
                        'employeeNo': dataOfEmp.EmployeeData[iter].employeeNo,
                        'firstName': dataOfEmp.EmployeeData[iter].firstName,
                        'lastName': dataOfEmp.EmployeeData[iter].lastName,
                        'pin': dataOfEmp.EmployeeData[iter].pin,
                        'status': "Out",
                        'dateTime': this.today,
                        'added': true
                      });
                    }
                  }
                }
              }
              if (!this.bLocal || !this.bCountMatch) {
                console.log("load 6th");
                var newRec = this.employeeTemp.length;
                var oldRec =this.employeeList.length;
                var countRec = newRec - oldRec;
                for (let i = 0; i < countRec; i++) {
                  this.employeeList.push(this.employeeTemp[i]);
                  }
                // this.employeeList = JSON.parse(localStorage.getItem("employeeList")).empList;
                console.log("employe list:",this.employeeList);
                localStorage.removeItem("employeeList");
                localStorage.setItem("employeeList", JSON.stringify({ empList: this.employeeTemp, addedDate: moment().format("YYYY-MM-DD")}));
                // this.employeeList = this.employeeTemp;
                console.log("after set localStorage mploye list:",this.employeeList.firstName);
              }
              else if (this.bLocal || this.bCountMatch) {

                console.log("load 7th");
                this.employeeList = JSON.parse(localStorage.getItem("employeeList")).empList;
                if (this.employeeList.length) {
                  for (var  iterEmp in this.employeeTemp) {
                    // console.log("load 8th");
                    for (var innerIterEmp in this.employeeList) {
                      // console.log("load 9th");
                      if (this.employeeList[innerIterEmp].employeeNo == this.employeeTemp[iterEmp].employeeNo) {
                        if (this.employeeTemp[iterEmp].dateTime > this.employeeList[innerIterEmp].dateTime) {
                          // console.log("this.employeeTemp[iterEmp].dateTime -->",this.employeeTemp[iterEmp].dateTime,"Name:",this.employeeTemp[iterEmp].firstName);
                          // console.log("this.employeeList[innerIterEmp].dateTime -->",this.employeeList[innerIterEmp].dateTime,"Name:",this.employeeList[innerIterEmp].firstName);
                          this.employeeList[innerIterEmp].status = this.employeeTemp[iterEmp].status;
                          this.employeeList[innerIterEmp].dateTime = this.employeeTemp[iterEmp].dateTime;
                          this.employeeTemp[iterEmp].added = false;
                          // console.log("this.employeeTemp[iterEmp].added",this.employeeTemp[iterEmp].added);
                        }else{
                          // console.log("else dateTime -->",this.employeeTemp[iterEmp].dateTime,"Name:",this.employeeTemp[iterEmp].firstName);
                          // console.log("else dateTime -->",this.employeeList[innerIterEmp].dateTime,"Name:",this.employeeList[innerIterEmp].firstName);
                          this.employeeList[innerIterEmp].status = this.employeeTemp[iterEmp].status;
                          this.employeeList[innerIterEmp].dateTime = this.employeeTemp[iterEmp].dateTime;
                          this.employeeTemp[iterEmp].added = false;
                          // console.log("else added",this.employeeTemp[iterEmp].added);
                        }
                      }
                    }
                  }
                  for (var iterTemp = 0; iterTemp < this.employeeTemp.length; iterTemp++) {
                    console.log("load 10th");
                    if (this.employeeTemp[iterTemp].added) {
                      this.employeeTemp[iterTemp].added = false;
                      this.employeeList.push(this.employeeTemp[iterTemp]);
                    }
                  }
                }
                console.log("load 11th");
                this.employeeList = JSON.parse(localStorage.getItem("employeeList")).empList;
                console.log("status update time emp list");
                console.log(this.employeeList);
                localStorage.removeItem("employeeList");
                localStorage.setItem("employeeList", JSON.stringify({ empList: this.employeeList, addedDate: moment().format("YYYY-MM-DD")}));
              }
            }
          })
      })
  }

  inOutFunc(employee) {
    // if(this.jobCosting == "true"){
    //   alert("enter job code");
    //     this.navCtrl.push(UserCheckinsPage);
    // }else{
    //   alert("please,go to the settings and turn on Jobcode");
    //     this.navCtrl.push(EmployeesPage);
    // }
    localStorage.setItem("emp_sigle_rec", JSON.stringify(employee));
     this.navCtrl.push(UserCheckinsPage);
  }
}
