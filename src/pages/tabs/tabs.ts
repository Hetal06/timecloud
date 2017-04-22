import { Component } from '@angular/core';

import { SpeakerListPage } from '../speaker-list/speaker-list';
import { Events } from 'ionic-angular';
import { NavParams, NavController } from 'ionic-angular';
import { SchedulePage } from '../schedule/schedule';
import { LoginPage } from '../login/login';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
	public events: Events;
  tab1Root = SchedulePage;
  tab2Root = SpeakerListPage;
  // tab3Root: any = MapPage;
  // tab4Root: any = LoginPage;
  
  logout() {
    console.log("logout method");
    // BackendService.token = "";
    this.navCtrl.push(LoginPage);
  }
  
  constructor(navParams: NavParams, public navCtrl: NavController) {
    // this.logout();
  }

  

  

}
