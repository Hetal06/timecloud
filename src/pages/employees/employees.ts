import {
  Component
} from '@angular/core';
//import { OrderrByPipe } from '../../pipes/orderBy';
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
// import * as _ from "lodash";

@Component({
  selector: 'page-employees',
  templateUrl: 'employees.html',
//  pipes : [OrderrByPipe]
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
  public employeeListAddedDate:any;

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
            if (this.employeeCheckIns.length > 0) {
              if (localStorage.getItem("employeeList")) {
                 if (JSON.parse(localStorage.getItem("employeeList")).addedDate !== moment().format("YYYY-MM-DD") && JSON.parse(localStorage.getItem("employeeList")).addedDate !== undefined) {
								 	localStorage.removeItem("employeeList");
                 } else {
                   this.employeeList = JSON.parse(localStorage.getItem("employeeList")).empList;
                   console.log("line 115 else localStorage getItem ",this.employeeList);
                    this.bLocal = true;
                    console.log("line 121",this.bLocal);
                     if (dataOfEmp.EmployeeData.length !== this.employeeList.length) {
                      console.log("line 109", dataOfEmp.EmployeeData.length, "!==", this.employeeList.length);
                       this.bCountMatch = false;
                      } else {
                       this.bCountMatch = true;
                      }
                }

              } else {
                this.bLocal = false;
                this.bCountMatch = false;
              }
              var status = '';
              this.employeeTemp = [];
              for (var iter in dataOfEmp.EmployeeData) {
                for (var innerIter in this.employeeCheckIns) {
                  this.tempEmpData = this.employeeCheckIns[innerIter];
                  if (this.tempEmpData.employeeNo == dataOfEmp.EmployeeData[iter].employeeNo) {
                    if (this.tempEmpData.checkin.length > 0) {
                      status = '';
                      if (this.tempEmpData.checkin[this.tempEmpData.checkin.length - 1].checkType == 1 || this.tempEmpData.checkin[this.tempEmpData.checkin.length - 1].checkType == 2 || this.tempEmpData.checkin[this.tempEmpData.checkin.length - 1].checkType == 'i' || this.tempEmpData.checkin[this.tempEmpData.checkin.length - 1].checkType == 'I') {
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
                var newRec = this.employeeTemp.length;
                var oldRec =this.employeeList.length;
                var countRec = newRec - oldRec;
                for (let i = 0; i < countRec; i++) {
                  console.log("line 180====>",countRec );
                  this.employeeList.push(this.employeeTemp[i]);
                }
                localStorage.removeItem("employeeList");
                localStorage.setItem("employeeList", JSON.stringify({ empList: this.employeeTemp, addedDate: moment().format("YYYY-MM-DD")}));
              }
              else if (this.bLocal || this.bCountMatch) {
                this.employeeList = JSON.parse(localStorage.getItem("employeeList")).empList;
                if (this.employeeList.length) {
                  for (var  iterEmp in this.employeeTemp) {
                    for (var innerIterEmp in this.employeeList) {
                      if (this.employeeList[innerIterEmp].employeeNo == this.employeeTemp[iterEmp].employeeNo) {
                        if (this.employeeTemp[iterEmp].dateTime > this.employeeList[innerIterEmp].dateTime) {
                          this.employeeList[innerIterEmp].status = this.employeeTemp[iterEmp].status;
                          this.employeeList[innerIterEmp].dateTime = this.employeeTemp[iterEmp].dateTime;
                          this.employeeTemp[iterEmp].added = false;
                        }else{
                          this.employeeList[innerIterEmp].status = this.employeeTemp[iterEmp].status;
                          this.employeeList[innerIterEmp].dateTime = this.employeeTemp[iterEmp].dateTime;
                          this.employeeTemp[iterEmp].added = false;
                        }
                      }
                    }
                  }
                  for (var iterTemp = 0; iterTemp < this.employeeTemp.length; iterTemp++) {
                    if (this.employeeTemp[iterTemp].added) {
                      this.employeeTemp[iterTemp].added = false;
                      this.employeeList.push(this.employeeTemp[iterTemp]);
                    }
                  }
                }
                this.employeeList = JSON.parse(localStorage.getItem("employeeList")).empList;
                this.employeeListAddedDate = JSON.parse(localStorage.getItem("employeeList")).addedDate;
                localStorage.setItem("employeeListAddedDate",JSON.stringify(this.employeeListAddedDate));
                console.log("line 197",localStorage.getItem("employeeListAddedDate"));
                localStorage.removeItem("employeeList");
                localStorage.setItem("employeeList", JSON.stringify({ empList: this.employeeList, addedDate: moment().format("YYYY-MM-DD")}));
              }
            }
          })
      })
  }

  inOutFunc(employee) {
    localStorage.setItem("emp_sigle_rec", JSON.stringify(employee));
    // let loadingPopup = this.loadingCtrl.create({
    //   content: 'Loading data...'
    // });
    // loadingPopup.present();
    //
    // setTimeout(() => {
    //
    //   loadingPopup.dismiss();
    //  }, 1000);
    this.navCtrl.push(UserCheckinsPage);

  }
}
