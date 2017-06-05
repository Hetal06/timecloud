import { Component } from '@angular/core';
import { NavController,NavParams,LoadingController ,Platform} from 'ionic-angular';
import { Http,Headers} from '@angular/http';

@Component({
	selector: 'page-setting',
	templateUrl: 'setting.html'
})
export class SettingPage {
public jobCosting = any;
contentHeader: Headers = new Headers({ "Content-Type": "application/json" });

	constructor(public platform: Platform,private loadingCtrl: LoadingController,public http: Http, public navCtrl: NavController, public params: NavParams) {
    if(this.jobCosting == 'true'){
      alert("enter work code");
    }else{
      alert("please,go to the setting and turn on Jobcode");
    }
	}


}
