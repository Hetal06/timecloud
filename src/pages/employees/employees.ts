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
  public employeeTemp: any;

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
            console.log("employeeCheckIns 129-->", this.employeeCheckIns);
						this.bLocal = false;
						this.bCountMatch = false;
            if (this.employeeCheckIns.length > 0) {
              console.log("line 99");
              if (localStorage.getItem("employeeList")) {
                    console.log("line 106------->",JSON.parse(localStorage.getItem("employeeList")).addedDate);
                 if (JSON.parse(localStorage.getItem("employeeList")).addedDate !== moment().format("YYYY-MM-DD") && JSON.parse(localStorage.getItem("employeeList")).addedDate !== undefined) {
								 	localStorage.removeItem("employeeList");
                  console.log("line 110 getItem from LS", localStorage.getItem("employeeList"));
                 } else {
                   this.employeeList = JSON.parse(localStorage.getItem("employeeList")).empList;
                   console.log("line 115 else localStorage getItem ",this.employeeList);
                    this.bLocal = true;
                    console.log("line 121",this.bLocal);
                     if (dataOfEmp.EmployeeData.length !== this.employeeList.length) {
                       console.log("line 109", dataOfEmp.EmployeeData.length, "!==", this.employeeList.length);
                       this.bCountMatch = false;
                       console.log("line 119",this.bCountMatch);
                     } else {
                       this.bCountMatch = true;
                       console.log("line 122",this.bCountMatch);
                     }

                }

              } else {
                console.log("line 114");
                this.bLocal = false;
                this.bCountMatch = false;
              }
              console.log("this.bLocal = ", this.bLocal, "this.bCountMatch = ", this.bCountMatch);
              var status = '';
              this.employeeTemp = [];
              for (var iter = 0; iter < dataOfEmp.EmployeeData.length; iter++) {
                for (var innerIter = 0; innerIter < this.employeeCheckIns.length; innerIter++) {
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


              if (!this.bCountMatch ||!this.bLocal ) {
                console.log("line 162", this.bLocal,"===",this.bCountMatch);
                this.employeeList = JSON.parse(localStorage.getItem("employeeList")).empList;
                console.log("line 174",this.employeeList);
                this.employeeList = this.employeeTemp;
                localStorage.removeItem("employeeList");
                console.log("178 line localStorage removeItem ",localStorage.getItem("employeeList"));
                localStorage.setItem("employeeList", JSON.stringify({ empList: this.employeeTemp, addedDate: moment().format("YYYY-MM-DD") }));
              //  this.employeeList = JSON.parse(localStorage.getItem("employeeList")).empList;
                console.log("line 180",JSON.parse(localStorage.getItem("employeeList")).empList);



              }
              else if (this.bLocal || this.bCountMatch) {
                console.log("line 184", this.bLocal ,"===",this.bCountMatch);
                this.employeeList = JSON.parse(localStorage.getItem("employeeList"));
                // console.log("line 186", this.employeeList);
                if (this.employeeList.length) {
                  // console.log("line 188",this.employeeList.length);
                  for (var iter = 0; iter < this.employeeTemp.length; iter++) {
                    // console.log("line 190----->",this.employeeTemp[iter]);
                    for (var innerIter = 0; innerIter < this.employeeList.length; innerIter++) {
                      // console.log("line 192----->",this.employeeList[innerIter]);
                      if (this.employeeList[innerIter].employeeNo == this.employeeTemp[iter].employeeNo) {
                        // console.log("line 201------>",this.employeeList[innerIter].employeeNo ,"==",this.employeeTemp[iter].employeeNo);
                        if (this.employeeTemp[iter].dateTime > this.employeeList[innerIter].dateTime) {
                          //  console.log("line 205----->",this.employeeTemp[iter].dateTime,">>", this.employeeList[innerIter].dateTime);
                          this.employeeList[innerIter].status = this.employeeTemp[iter].status;
                          this.employeeList[innerIter].dateTime = this.employeeTemp[iter].dateTime;
                          this.employeeTemp[iter].added = false;
                        }else{
                          // console.log("line 209=====>",this.employeeTemp[iter].dateTime,"==", this.employeeList[innerIter].dateTime);
                          this.employeeList[innerIter].status = this.employeeTemp[iter].status;
                          this.employeeList[innerIter].dateTime = this.employeeTemp[iter].dateTime;
                          this.employeeTemp[iter].added = false;
                        }
                      }
                    }
                  }
                  for (var iter = 0; iter < this.employeeTemp.length; iter++) {
                    // console.log("line 182");
                    if (this.employeeTemp[iter].added) {
											// console.log("line 195---->",this.employeeTemp[iter].added);
                      this.employeeTemp[iter].added = false;
                      this.employeeList.push(this.employeeTemp[iter]);
                    }
                  }
                }

                // console.log("226 line localStorage removeItem ",localStorage.getItem("employeeList"));

                this.employeeList = JSON.parse(localStorage.getItem("employeeList")).empList;
                // console.log("line 211",this.employeeList);
                // for(let i in this.employeeList){
                //   // console.log("line no 229",this.employeeList[i].status);
                //   //this.employeeList[i].status = this.employeeTemp[iter].status;
                // }
                localStorage.removeItem("employeeList");
                console.log("line 236 ====>",localStorage.getItem("employeeList"));
                localStorage.setItem("employeeList", JSON.stringify({ empList: this.employeeList, addedDate: moment().format("YYYY-MM-DD")}));
                console.log("line 238 ====>",localStorage.getItem("employeeList"));
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

  }

}
