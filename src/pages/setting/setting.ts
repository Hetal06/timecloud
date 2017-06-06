import { Component } from '@angular/core';
import { NavController,NavParams,LoadingController ,Platform} from 'ionic-angular';


@Component({
	selector: 'page-setting',
	templateUrl: 'setting.html'
})
export class SettingPage {
public jobCosting : any;


	constructor(public platform: Platform,private loadingCtrl: LoadingController, public navCtrl: NavController, public params: NavParams) {
		console.log("constructor",localStorage.getItem("jobCosting"));
		if(localStorage.getItem("jobCosting")){
				this.jobCosting = localStorage.getItem("jobCosting");
		}else{
			this.jobCosting = false;
		}
	}

toggleBtn(evt){
	console.log("111111111111111  after call function",this.jobCosting);
	if(this.jobCosting){
		this.jobCosting = false;
	}
	else{
		this.jobCosting = true;
	}
	localStorage.setItem("jobCosting",this.jobCosting);
	console.log("222222  after call function",this.jobCosting);
	// if(this.jobCosting == false){
	// 	this.jobCosting = true;
	// 	console.log("if setting page",this.jobCosting);
	// 	localStorage.setItem("jobCosting",this.jobCosting);
	// 	console.log(" if setting page",localStorage.getItem("jobCosting"));
	// }else{
	// 	this.jobCosting = false;
	// 	console.log("else setting page",this.jobCosting);
	// 	localStorage.setItem("jobCosting",this.jobCosting);
	// 	console.log(" else setting page",localStorage.getItem("jobCosting"));
	//
	// }
}

}
