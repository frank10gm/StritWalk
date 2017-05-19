import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { SettingsPage } from '../settings/settings';
import { Insomnia } from '@ionic-native/insomnia';
import { MediaPlugin, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-cities',
  templateUrl: 'cities.html'
})
export class CitiesPage {

  username: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private nativeStorage: NativeStorage,
    private insomnia: Insomnia,
    private media: MediaPlugin, private file: File) {

    this.nativeStorage.getItem('localUser').then(
      data => {
        this.username = data.username
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CitiesPage')
  }

  openSettings(){
    this.navCtrl.push(SettingsPage)
  }

  fastRec(){
    console.log("dev")
  }

}
