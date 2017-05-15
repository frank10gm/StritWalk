import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { SettingsPage } from '../settings/settings';
import { Insomnia } from '@ionic-native/insomnia';

/*
  Generated class for the Cities page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-cities',
  templateUrl: 'cities.html'
})
export class CitiesPage {

  username: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private nativeStorage: NativeStorage,
  private insomnia: Insomnia) {
  
    this.nativeStorage.getItem('localUser').then(
      data => {
        this.username = data.username
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CitiesPage');
  }

  openSettings(){
    this.navCtrl.push(SettingsPage)
  }

}
