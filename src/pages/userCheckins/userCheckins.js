var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { EmployeesPage } from '../employees/employees';
import { EmployeeServicePage } from '../../providers/employee-service';
import * as moment from 'moment';
var UserCheckinsPage = (function () {
    function UserCheckinsPage(http, navCtrl, employeeService, params) {
        this.http = http;
        this.navCtrl = navCtrl;
        this.employeeService = employeeService;
        this.params = params;
        this.loginToken = localStorage.getItem("loginToken");
        this.loginId = localStorage.getItem("loginId");
        this.contentHeader = new Headers({ "Content-Type": "application/json" });
        console.log("SetTimeCloudPage");
        // this.loadUser();
        // navCtrl.params.data
        this.empSingleRec = params.data.emp_sigle_rec;
        // this.status = params.data.emp_status;
        this.emp_no = params.data.emp_sigle_rec.employeeNo;
        // console.log("status",this.status);
        console.log("emprec", this.emp_no);
    }
    UserCheckinsPage.prototype.checkInOut = function (clickUserStatus, clickEmpNo) {
        var _this = this;
        if (clickUserStatus == 'In') {
            this.checktype = 4;
        }
        else if (clickUserStatus == 'endBreak') {
            this.checktype = 2;
        }
        else if (clickUserStatus == 'startBreak') {
            this.checktype = 3;
        }
        else {
            this.checktype = 'OUT';
        }
        console.log("-----------\n\n line 40 checkStatus", this.checktype);
        // console.log("API USER STATUS", this.user);
        // console.log("clickUserStatus", clickUserStatus, clickEmpNo);
        var dateTime = new Date();
        this.body = {
            "userid": localStorage.getItem('userId'),
            "employeeNo": this.emp_no,
            "checkType": this.checktype,
            "timeIn": moment(dateTime).format("YYYY-MM-DD HH:mm:ss")
        };
        console.log("------\n\n line 47 body", this.body);
        this.http.post('http://localhost:3000/insertCheckins', this.body, { headers: this.contentHeader })
            .subscribe(function (data) {
            console.log("line 78 ok");
            data.json();
            _this.checktype = clickUserStatus;
            console.log("--------\n\n line 65 currentUserStatus", _this.checktype);
        }, function (error) {
            console.log("line 62 error");
        });
        this.navCtrl.push(EmployeesPage, { selectedStatus: clickUserStatus, selectedEmpNo: clickEmpNo });
    };
    UserCheckinsPage.prototype.cancleBtn = function () {
        console.log("cancle func");
        this.navCtrl.push(EmployeesPage);
    };
    return UserCheckinsPage;
}());
UserCheckinsPage = __decorate([
    Component({
        selector: 'page-userCheckins',
        templateUrl: 'userCheckins.html'
    }),
    __metadata("design:paramtypes", [Http, NavController, EmployeeServicePage, NavParams])
], UserCheckinsPage);
export { UserCheckinsPage };
//# sourceMappingURL=userCheckins.js.map