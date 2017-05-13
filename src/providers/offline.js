var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import * as PouchDB from 'pouchdb';
import 'rxjs/add/operator/map';
/*
  Generated class for the Offline provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
var Offline = (function () {
    function Offline(http) {
        this.http = http;
        console.log('Hello Offline Provider');
    }
    Offline.prototype.init = function (details) {
        console.log("details :-", details);
        this.db = new PouchDB('timecloud');
        this.remote = details.userDBs.supertest;
        var options = {
            live: true,
            retry: true,
            continuous: true
        };
        this.db.sync(this.remote, options);
        console.log("line 39", this.db);
    };
    Offline.prototype.logout = function () {
        this.data = null;
        this.db.destroy().then(function () {
            console.log("database removed");
        });
    };
    Offline.prototype.getTodos = function () {
        var _this = this;
        if (this.data) {
            console.log("fetTodos List", this.data);
            return Promise.resolve(this.data);
        }
        return new Promise(function (resolve) {
            _this.db.allDocs({
                include_docs: true
            }).then(function (result) {
                _this.data = [];
                var doc = result.rows.map(function (row) {
                    _this.data.push(row.doc);
                });
                console.log(doc);
                resolve(_this.data);
                _this.db.changes({ live: true, since: 'now', include_docs: true }).on('change', function (change) {
                    _this.handleChange(change);
                });
            }).catch(function (error) {
                console.log(error);
            });
        });
    };
    Offline.prototype.createTodo = function (todo) {
        console.log("createTodo", todo);
        this.db.post(todo);
    };
    Offline.prototype.updateTodo = function (todo) {
        this.db.put(todo).catch(function (err) {
            console.log(err);
        });
    };
    Offline.prototype.deleteTodo = function (todo) {
        this.db.remove(todo).catch(function (err) {
            console.log(err);
        });
    };
    Offline.prototype.handleChange = function (change) {
        var changedDoc = null;
        var changedIndex = null;
        this.data.forEach(function (doc, index) {
            if (doc._id === change.id) {
                changedDoc = doc;
                changedIndex = index;
            }
        });
        //A document was deleted
        if (change.deleted) {
            this.data.splice(changedIndex, 1);
        }
        else {
            //A document was updated
            if (changedDoc) {
                this.data[changedIndex] = change.doc;
            }
            else {
                this.data.push(change.doc);
            }
        }
    };
    return Offline;
}());
Offline = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Http])
], Offline);
export { Offline };
//# sourceMappingURL=offline.js.map