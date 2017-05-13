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
import { NavController, AlertController, NavParams } from 'ionic-angular';
// import { LoginPage } from '../login/login';
import { Http } from '@angular/http';
import { Offline } from '../../providers/offline';
import { EmployeeServicePage } from '../../providers/employee-service';
import { UserCheckinsPage } from '../userCheckins/userCheckins';
/*
  Generated class for the Employees page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var EmployeesPage = (function () {
    function EmployeesPage(navCtrl, offlineService, alertCtrl, http, employeeService, params) {
        this.navCtrl = navCtrl;
        this.offlineService = offlineService;
        this.alertCtrl = alertCtrl;
        this.http = http;
        this.employeeService = employeeService;
        this.params = params;
        this.select_status = params.data.selectedStatus;
        this.selected_EmoNo = params.data.selectedEmpNo;
        this.loadEmployee();
    }
    ;
    EmployeesPage.prototype.loadEmployee = function () {
        var _this = this;
        this.employeeService.load().subscribe(function (data) {
            _this.employees = data;
            // console.log("employee line 67-------->", this.employees	);
            data.forEach(function (employee) {
                // console.log("employee forEach line 70------->", employee);
                var checkin = employee.checkin;
                checkin.forEach(function (checkin) {
                    console.log("***********\n\n checkin time -------74", checkin.checkTime);
                    if (checkin.checkType == 1 || checkin.checkType == 'i' || checkin.checkType == 'I') {
                        _this.currentUserStatus = "IN";
                    }
                    if (checkin.checkType == 3) {
                        _this.currentUserStatus = "START BREAK";
                    }
                    if (checkin.checkType == 2) {
                        _this.currentUserStatus = "END BREAK";
                    }
                    else {
                        _this.currentUserStatus = "OUT";
                    }
                    // this.currentUserStatus = checkin.checkType;
                    console.log("***************\n\nemployee forEach line 87------->", _this.currentUserStatus);
                });
            });
            // data.EmployeeData.forEach((employee) => {
            // 	console.log("employee", employee);
            // // this.http.post('http://localhost:3000/currentCheckin', { headers: this.contentHeader })
            // // 		.map(data => console.log("data line 76----", data.json()))
            // });
        }, function (err) {
            console.log("---------------\n\n line 51 err " + err);
        });
    };
    EmployeesPage.prototype.inOutFunc = function (employee) {
        this.navCtrl.push(UserCheckinsPage, {
            emp_sigle_rec: employee,
            emp_status: this.status
        });
    };
    return EmployeesPage;
}());
EmployeesPage = __decorate([
    Component({
        selector: 'page-employees',
        templateUrl: 'employees.html'
    }),
    __metadata("design:paramtypes", [NavController, Offline, AlertController, Http, EmployeeServicePage, NavParams])
], EmployeesPage);
export { EmployeesPage };
//# sourceMappingURL=employees.js.map