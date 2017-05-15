import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { StartPage } from '../start/start'

/*
  Generated class for the Settings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public app: App,
  private nativeStorage: NativeStorage) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  logout(){
    this.nativeStorage.clear();
    this.app.getRootNav().setRoot(StartPage);
  }

}
