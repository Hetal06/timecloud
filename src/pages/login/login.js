var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Injectable } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { EmployeesPage } from '../employees/employees';
// import { JwtHelper } from 'angular2-jwt';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
// import {Http,Headers} from '@angular/http';
var LoginPage = (function () {
    function LoginPage(navCtrl, navParams, formBuilder, alertCtrl, http
        // private http: Http
    ) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.formBuilder = formBuilder;
        this.alertCtrl = alertCtrl;
        this.http = http;
        this.submitAttempt = false;
        this.logins = {};
        this.LOGIN_URL = "http://localhost:3000/mobileLogin";
        this.contentHeader = new Headers({ "Content-Type": "application/json" });
        this.login = formBuilder.group({
            'email': ['', Validators.compose([Validators.required, Validators.minLength(5)])],
            'pwd': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
        });
        this.email = this.login.controls['email'];
        this.pwd = this.login.controls['pwd'];
        console.log("logout mcd ethod run");
    }
    LoginPage.prototype.logForm = function () {
        var _this = this;
        console.log("login method work");
        this.submitAttempt = true;
        console.log(this.login.controls.email.value, "", this.login.controls.pwd.value);
        this.data = {
            email: this.login.controls.email.value,
            pwd: this.login.controls.pwd.value
        };
        this.http.post(this.LOGIN_URL, this.data, { headers: this.contentHeader })
            .map(function (res) { return res.json(); })
            .subscribe(function (data) { return _this.authSuccess(data); }, function (err) { return _this.error = err; });
        // .map(res => res.json())
        // .subscribe(
        // data => {
        // 	console.log("line 73------", data.token);
        // 	data => this.authSuccess(data.token)
        // },
        // err => this.error = err
        // );
        // console.log("res==", res);
        // console.log("data", data);
    };
    LoginPage.prototype.authSuccess = function (data) {
        this.error = null;
        localStorage.setItem("loginToken", data.token);
        localStorage.setItem("userId", data.user);
        localStorage.setItem("loginEmail", data.email);
        // console.log("----line 97 data", data);
        // console.log("----line 98 data token", data.token);
        // console.log("----line 99 data user", data.user);
        // console.log("----line 100 data email", data.email);
        // localStorage.setItem("loginId", token);
        if (data) {
            this.navCtrl.push(EmployeesPage);
            console.log("success!");
        }
        else {
            console.log("invalid email and pwd");
        }
        // this.local.set('id_token', token);
        // this.user = this.jwtHelper.decodeToken(token).username;
    };
    return LoginPage;
}());
LoginPage = __decorate([
    Component({
        selector: 'page-login',
        templateUrl: 'login.html',
    }),
    Injectable(),
    __metadata("design:paramtypes", [NavController,
        NavParams,
        FormBuilder,
        AlertController,
        Http
        // private http: Http
    ])
], LoginPage);
export { LoginPage };
//# sourceMappingURL=login.js.map