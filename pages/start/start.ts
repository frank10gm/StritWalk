import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController, Modal, Platform } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';
import { Login } from './login';
import { SignUp } from './signup'
import {GlobalProvider} from '../../providers/global-provider'



/*
Generated class for the Start page.

See http://ionicframework.com/docs/v2/components/#navigation for more info on
Ionic pages and navigation.
*/
@Component({
  selector: 'page-start',
  templateUrl: 'start.html'
})

export class StartPage {
  languages: any;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public platform: Platform,
  private globals: GlobalProvider) {
    this.languages = globals.languages[globals.language];
  }

  ionViewDidLoad() {
    //this.navCtrl.push(TabsPage)
  }

  presentLogin(event) {
    let loginModal = this.modalCtrl.create(Login, { event: 'pressLogin' });
    loginModal.onDidDismiss(data => {
      if(data == "1") this.navCtrl.push(TabsPage)
    });
    loginModal.present();
    //this.navCtrl.push(TabsPage)
  }

  presentSignUp(event) {
    let modal = this.modalCtrl.create(SignUp, { event: 'pressSignup' });
    modal.onDidDismiss(data => {
      if(data == "1") this.navCtrl.push(TabsPage)
    });
    modal.present();
    //this.navCtrl.push(TabsPage)
  }

}
