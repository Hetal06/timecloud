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
// import * as _ from "lodash";

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
  public employeeTemp: any;
  public keys :any;

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
    // setTimeout(function() {
    //   location.reload();
    //   console.log("update dataOfEmp.EmployeeData");
    // }, 10000);

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
          //  console.log("employeeCheckIns 129-->", this.employeeCheckIns);
						this.bLocal = false;
						this.bCountMatch = false;
            if (this.employeeCheckIns.length > 0) {
            //  console.log("line 99");
              if (localStorage.getItem("employeeList")) {
                  //  console.log("line 106------->",JSON.parse(localStorage.getItem("employeeList")).addedDate);
                 if (JSON.parse(localStorage.getItem("employeeList")).addedDate !== moment().format("YYYY-MM-DD") && JSON.parse(localStorage.getItem("employeeList")).addedDate !== undefined) {
								 	localStorage.removeItem("employeeList");
                //  console.log("line 110 getItem from LS", localStorage.getItem("employeeList"));
                 } else {
                   this.employeeList = JSON.parse(localStorage.getItem("employeeList")).empList;
                   console.log("line 115 else localStorage getItem ",this.employeeList);
                    this.bLocal = true;
                    console.log("line 121",this.bLocal);
                     if (dataOfEmp.EmployeeData.length !== this.employeeList.length) {
                      console.log("line 109", dataOfEmp.EmployeeData.length, "!==", this.employeeList.length);
                       this.bCountMatch = false;
                      // console.log("line 119",this.employeeList);
                      } else {
                       this.bCountMatch = true;
                       //console.log("line 122",this.bCountMatch);
                      }

                }

              } else {
              //  console.log("line 114");
                this.bLocal = false;
                this.bCountMatch = false;
              }
            //  console.log("this.bLocal = ", this.bLocal, "this.bCountMatch = ", this.bCountMatch);
              var status = '';
              this.employeeTemp = [];
              for (var iter in dataOfEmp.EmployeeData) {
                //console.log("line 136 ==>");
                for (var innerIter in this.employeeCheckIns) {
                  //console.log("line 138 ==>");
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
                // this.employeeList = JSON.parse(localStorage.getItem("employeeList")).empList;
                localStorage.removeItem("employeeList");
                localStorage.setItem("employeeList", JSON.stringify({ empList: this.employeeTemp, addedDate: moment().format("YYYY-MM-DD")}));
                console.log("line 185-----",localStorage.getItem("employeeList"));

              }
              else if (this.bLocal || this.bCountMatch) {
                console.log("line 196====>this.bLocal",this.bLocal,"===this.bCountMatch",this.bCountMatch);
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
                localStorage.removeItem("employeeList");
                localStorage.setItem("employeeList", JSON.stringify({ empList: this.employeeList, addedDate: moment().format("YYYY-MM-DD")}));
              }
            }
          })
      })

  }

  inOutFunc(employee) {
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
