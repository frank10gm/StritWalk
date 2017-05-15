import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs'
import { StartPage } from '../start/start'

import { NativeStorage } from '@ionic-native/native-storage';
import { Insomnia } from '@ionic-native/insomnia';

/*
Generated class for the Splash page.

See http://ionicframework.com/docs/v2/components/#navigation for more info on
Ionic pages and navigation.
*/
@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html'
})
export class SplashPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform,
  private nativeStorage: NativeStorage,
  private insomnia: Insomnia) {
    this.platform.ready()
    .then(
      () => {
        this.insomnia.keepAwake()
                    .then(
                    () => console.log('insomnia online'),
                    () => console.log('error insomnia')
                    );
        // execute code here
        this.nativeStorage.getItem('localUser').then(
          data => {
            if(data.status){
              navCtrl.setRoot(TabsPage)
            }else{
              navCtrl.setRoot(StartPage)
            }
          },
          error => navCtrl.setRoot(StartPage)
        )
      }
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SplashPage');
  }

}
