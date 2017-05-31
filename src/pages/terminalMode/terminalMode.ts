import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-terminalMode',
  templateUrl: 'terminalMode.html'
})
export class TerminalModePage {

  constructor(public navCtrl: NavController) {
    console.log("line 11 terminalMode added");
  }

}
