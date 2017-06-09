import {
  Component
} from '@angular/core';
import {
  NavController,
  AlertController,
  NavParams,
  Platform,
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
  selector: 'page-terminalMode',
  templateUrl: 'terminalMode.html'
})
export class TerminalModePage {
  public todayDate: any;
  public loadingPopup: any;
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
  public getUserPin :any;
  public getUserOwnData:any;
  public pincode :any;


  loginToken = localStorage.getItem("loginToken");
  loginId = localStorage.getItem("userId");
  loginEmail = localStorage.getItem("loginEmail");
  GetUserOwnData_URL = "http://192.241.230.86:4000/employeeOwnData";
  GetCheckin_URL: string = "http://192.241.230.86:4000/currentCheckin";
  CheckUserPin_URL : string = "http://192.241.230.86:4000/checkuserpin";
  contentHeader: Headers = new Headers({
    "Content-Type": "application/json",
    "Authorization": this.loginId
  });
  userContentHeader: Headers = new Headers({
    "Content-Type": "application/json",
    "token": this.loginToken
  });
  pinContentHeader: Headers = new Headers({
    "Content-Type": "application/json",
  });

  data: any;
  select_status: any;
  selected_EmoNo: any;

  constructor(private loadingCtrl: LoadingController,public platform: Platform,public navCtrl: NavController, private offlineService: Offline, private alertCtrl: AlertController, public http: Http, public employeeService: EmployeeServicePage, public params: NavParams) {
    if (localStorage.getItem("loginToken")) {
        this.terminalEmp();
        this.loadingPopup = this.loadingCtrl.create({
          content: ''
        });
        this.loadingPopup.present();
    } else {
      this.navCtrl.push(LoginPage);
    }
  }

  terminalEmp() {
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        this.navCtrl.setRoot(TerminalModePage);
      });
 });
    this.employeeService.load().subscribe(
      dataOfEmp => {
        this.employeeList = [];
        this.employeeTemp = [];
        this.today = moment().subtract(1, 'day').format("YYYY-MM-DD") + " 00:00:00";

        this.http.get(this.GetCheckin_URL, {
          headers: this.contentHeader
        })
          .map(data => data.json())
          .subscribe(
          dataOfCheckin => {
            this.employeeCheckIns = dataOfCheckin;
            this.loadingPopup.dismiss();
            this.checkins = [];
						this.bLocal = false;
            if (this.employeeCheckIns.length > 0) {
              if (localStorage.getItem("employeeList")) {
                 if (JSON.parse(localStorage.getItem("employeeList")).addedDate !== moment().format("YYYY-MM-DD") && JSON.parse(localStorage.getItem("employeeList")).addedDate !== undefined) {
								 	localStorage.removeItem("employeeList");
                 } else {
                   this.employeeList = JSON.parse(localStorage.getItem("employeeList")).empList;
                    this.bLocal = true;
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
              if (!this.bLocal) {
                localStorage.removeItem("employeeList");
                localStorage.setItem("employeeList", JSON.stringify({ empList: this.employeeTemp, addedDate: moment().format("YYYY-MM-DD")}));
                this.employeeList = this.employeeTemp;
              }
              else if (this.bLocal) {
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
                localStorage.removeItem("employeeList");
                localStorage.setItem("employeeList", JSON.stringify({ empList: this.employeeList, addedDate: moment().format("YYYY-MM-DD")}));
              }
            }
          });
      });
  }

// For Redirect to status Update Page
  inOutFunc(employee) {
    localStorage.setItem("emp_sigle_rec", JSON.stringify(employee));
    let prompt = this.alertCtrl.create({
     title: employee.firstName +', Please Enter Passcode',

     inputs: [
       {
         type: 'password',
         name: 'Passcode',
         placeholder: 'Pin Code',
        },
     ],
     buttons: [
       {
         text: 'Cancel',
         handler: data => {
           console.log('Cancel clicked');
         }
       },
       {
         text: 'OK',
         handler: data => {
           console.log("data Passcode",data.Passcode);
           if(data.Passcode == employee.pin){
            let body ={
               userId:this.loginId,
               pincode:employee.pin
             }

             this.http.post(this.CheckUserPin_URL, body,{headers :this.pinContentHeader})
                             .subscribe(dataOfPincodeEmp => {
                               this.getUserPin =dataOfPincodeEmp.json();
                               console.log("line 224",this.getUserPin);
                     });
           this.navCtrl.push(UserCheckinsPage);
           }else{
             let alert= this.alertCtrl.create({
               title:"Enter Wrong Pincode",
               buttons: ['OK']
             });
             alert.present();
           }

         }
       }
     ]
   });
   prompt.present();
  }
}
