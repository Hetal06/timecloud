import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { Offline } from '../../providers/offline';
/*
  Generated class for the Employees page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
	selector: 'page-employees',
	templateUrl: 'employees.html'
})
export class EmployeesPage {

	constructor(public navCtrl: NavController, private offlineService: Offline, private alertCtrl: AlertController) { }

	ionViewDidLoad() {
		console.log('Hello EmployeesPage Page');
	}


	createTodo() {

		let prompt = this.alertCtrl.create({
			title: 'Add',
			message: 'What do you need to do?',
			inputs: [
				{
					name: 'title'
				}
			],
			buttons: [
				{
					text: 'Cancel'
				},
				{
					text: 'Save',
					handler: data => {
						this.offlineService.createTodo({ title: data.title });
					}
				}
			]
		});

		prompt.present();

	}

	updateTodo(todo) {

		let prompt = this.alertCtrl.create({
			title: 'Edit',
			message: 'Change your mind?',
			inputs: [
				{
					name: 'title'
				}
			],
			buttons: [
				{
					text: 'Cancel'
				},
				{
					text: 'Save',
					handler: data => {
						this.offlineService.updateTodo({
							_id: todo._id,
							_rev: todo._rev,
							title: data.title
						});
					}
				}
			]
		});

		prompt.present();
	}

	deleteTodo(todo) {
		this.offlineService.deleteTodo(todo);
	}

}
