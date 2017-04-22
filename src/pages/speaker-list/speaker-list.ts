import { Component } from '@angular/core';

import { ActionSheet, Platform, ActionSheetController, Config, NavController } from 'ionic-angular';


import { ConferenceData } from '../../providers/conference-data';
import { SessionDetailPage } from '../session-detail/session-detail';
import { SpeakerDetailPage } from '../speaker-detail/speaker-detail';

var window: any;

@Component({
  selector: 'page-speaker-list',
  templateUrl: 'speaker-list.html'
})
export class SpeakerListPage {
  actionSheet: ActionSheet;
  speakers = [];
  
  constructor(public platform: Platform,public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public confData: ConferenceData, public config: Config) { }

  ionViewDidLoad() {
    this.confData.getSpeakers().subscribe(speakers => {
      this.speakers = speakers;
    });
  }

  goToSessionDetail(session) {
    this.navCtrl.push(SessionDetailPage, session);
  }

  goToSpeakerDetail(speakerName: any) {
    this.navCtrl.push(SpeakerDetailPage, speakerName);
  }

  goToSpeakerTwitter(speaker) {
    var browser = window.cordova.InAppBrowser.open(`https://twitter.com/${speaker.twitter}`, '_blank');

    browser.on('loadstop')
      .subscribe((ev) => {
        console.log('InAppBrowser loaded!');
      });

    // var browserRef = window.cordova.InAppBrowser.open("https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=81a2dab8wplxg7&redirect_uri=https://ionic-li-login.stamplayapp.com/auth/v1/linkedin/connect&scope=r_basicprofile+r_emailaddress");
    // browserRef.addEventListener("loadstart", (event) => {
    //   if ((event.url).indexOf("https://ionic-li-login.stamplayapp.com/auth/v1/linkedin/connect") === 0) {
    //     browserRef.removeEventListener("exit", (event) => { });
    //     browserRef.close();
    //     /* Will be generate to the authentication code */
    //     // var authcode = (event.url).split("code=")[1];
    //     // //console.log(authcode);
    //     if (authcode != null) {
    //       resolve(authcode);
    //     }
    //     else {
    //       alert("Problem authenticating with Linkdin");
    //     }
    //   }
    // });
    // TODO fix error
    // let browser = new window(`https://twitter.com/${speaker.twitter}`, '_blank');

    // browser.on('loadstop')
    //   .subscribe((ev) => {
    //     console.log('InAppBrowser loaded!');
    //   });
  }

  openSpeakerShare(speaker) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Share ' + speaker.name,
      buttons: [
        {
          text: 'Copy Link',
          handler: ($event) => {
            console.log('Copy link clicked on https://twitter.com/' + speaker.twitter);
            if (window['cordova'] && window['cordova'].plugins.clipboard) {
              window['cordova'].plugins.clipboard.copy('https://twitter.com/' + speaker.twitter);
            }
          }
        },
        {
          text: 'Share via ...'
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    actionSheet.present();
  }

  openContact(speaker) {
    console.log("speaker name", speaker.name);
    console.log("speaker email", speaker.email);
    let mode = this.config.get('mode');

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Contact ' + speaker.name,
      buttons: [
        {
          text: `Email ( ${speaker.email} )`,
          icon: mode !== 'ios' ? 'mail' : null,
          handler: () => {
            window.cordova.plugins.email.open('mailto:' + speaker.email);
          }
        },
        {
          text: `Call ( ${speaker.phone} )`,
          icon: mode !== 'ios' ? 'call' : null,
          handler: () => {
            window.cordova.plugins.email.open('tel:' + speaker.phone);
          }
        }
      ]
    });

    actionSheet.present();
  }
}
