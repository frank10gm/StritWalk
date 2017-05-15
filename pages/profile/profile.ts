import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage'
import { SettingsPage } from '../settings/settings'

/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  title: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, private nativeStorage: NativeStorage) {
    this.nativeStorage.getItem('localUser').then(
      data => {
        this.title = data.username
      }
    )
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');

  }

  openSettings(){
    this.navCtrl.push(SettingsPage)
  }

}
