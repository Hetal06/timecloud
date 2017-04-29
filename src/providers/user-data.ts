import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';


@Injectable()
export class UserData {
  _favorites = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

  constructor(public events: Events, public storage: Storage) { }

  hasFavorite(sessionName) {
    return (this._favorites.indexOf(sessionName) > -1);
  };

  addFavorite(sessionName) {
    this._favorites.push(sessionName);
  };

  removeFavorite(sessionName) {
    let index = this._favorites.indexOf(sessionName);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  };

  login(username) {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.setUsername(username);
    this.events.publish('user:login');
  };

  signup(username) {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.setUsername(username);
    this.events.publish('user:signup');
  };

  logout() {
    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove('username');
    this.events.publish('user:logout');
  };

  setUsername(username) {
    this.storage.set('username', username);
  };

  getUsername() {
    return this.storage.get('username').then((value) => {
      return value;
    });
  };

  // return a promise
  hasLoggedIn() {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };

  checkHasSeenTutorial() {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    })
  };

  // TO DO : Backend Service

  // import { Injectable } from "@angular/core";
  // import { getString, setString } from "application-settings";
  //
  // const tokenKey = "token";
  //
  // export class BackendService {
  //   // static apiUrl = "https://api.everlive.com/v1/GWfRtXi1Lwt4jcqK/";
  //   // static apiUrl = "http://219.88.253.55:3000/";
  //   static apiUrl = "http://192.168.1.2:3000/";
  //
  //
  //   static isLoggedIn(): boolean {
  //     return !!getString("token");
  //   }
  //
  //   static get token(): string {
  //     return getString("token");
  //   }
  //
  //   static set token(theToken: string) {
  //     setString("token", theToken);
  //   }
  // }


  // TO DO : Service Login
  //
  // import { Injectable } from "@angular/core";
  // import { Http, Headers, Response } from "@angular/http";
  // import { Observable } from "rxjs/Rx";
  // import "rxjs/add/operator/do";
  // import "rxjs/add/operator/map";
  //
  // import { User } from "./user.model";
  // import { BackendService } from "./backend.service";
  //
  // @Injectable()
  // export class LoginService {
  //     constructor(private http: Http) { }
  //
  //     register(user: User) {
  //         let headers = new Headers();
  //         headers.append("Content-Type", "application/json");
  //
  //         return this.http.post(
  //             BackendService.apiUrl + "Users",
  //             JSON.stringify({
  //                 Username: user.email,
  //                 Email: user.email,
  //                 Password: user.password
  //             }),
  //             { headers: headers }
  //         )
  //             .catch(this.handleErrors);
  //     }
  //
  //     login(user: User) {
  //         let headers = new Headers();
  //         headers.append("Content-Type", "application/json");
  //
  //         // return this.http.post(
  //         //   BackendService.apiUrl + "oauth/token",
  //         //   JSON.stringify({
  //         //     username: user.email,
  //         //     password: user.password,
  //         //     grant_type: "password"
  //         //   }),
  //         //   { headers: headers }
  //         // )
  //         return this.http.post(
  //             BackendService.apiUrl + "mobileLogin",
  //             JSON.stringify({
  //                 email: user.email,
  //                 pwd: user.password,
  //                 grant_type: "password"
  //             }),
  //             { headers: headers }
  //         )
  //         .map(response => response.json())
  //         .do(data => {
  //             console.log("hello");
  //             console.log("data" + JSON.stringify(data));
  //             console.log(data.user)
  //             BackendService.token = data.user;
  //             // console.log(JSON.stringify(BackendService.token));
  //         })
  //         .catch(this.handleErrors);
  //     }
  //
  //     logoff() {
  //         BackendService.token = "";
  //     }
  //
  //     resetPassword(email) {
  //         let headers = new Headers();
  //         headers.append("Content-Type", "application/json");
  //
  //         return this.http.post(
  //             BackendService.apiUrl + "Users/resetpassword",
  //             JSON.stringify({
  //                 Email: email
  //             }),
  //             { headers: headers }
  //         )
  //             .catch(this.handleErrors);
  //     }
  //
  //     handleErrors(error: Response) {
  //         console.log(error);
  //         console.log("error" + JSON.stringify(error.json()));
  //         return Observable.throw(error);
  //     }
  // }

}
