var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
var EmployeeServicePage = (function () {
    // CheckIn_URL: String = "localhost:3000/userCurrentCheckin";
    function EmployeeServicePage(http) {
        this.http = http;
        this.loginId = localStorage.getItem("userId");
        this.loginToken = localStorage.getItem("loginToken");
        this.GetEmployee_URL = "http://localhost:3000/currentCheckin";
        this.contentHeader = new Headers({ "Content-Type": "application/json", "Authorization": this.loginId });
        console.log("emploee  Service Ctrl");
    }
    EmployeeServicePage.prototype.load = function () {
        // let body={
        // "token"=localStorage.getItem(loginToken)
        // }
        return this.http.get(this.GetEmployee_URL, { headers: this.contentHeader })
            .map(function (data) { return data.json(); });
    };
    return EmployeeServicePage;
}());
EmployeeServicePage = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Http])
], EmployeeServicePage);
export { EmployeeServicePage };
//# sourceMappingURL=employee-service.js.map