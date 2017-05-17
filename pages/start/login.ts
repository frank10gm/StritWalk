import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController, Modal, AlertController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { NativeStorage } from '@ionic-native/native-storage';
import {GlobalProvider} from '../../providers/global-provider'
import {Account} from '../../providers/account'

@Component({
    selector: 'modal-login',
    templateUrl: 'login.html'
})
export class Login {

    //variables
    user: any = {};
    languages: any;
    translate: any;
    language: string;
    trans: any[] = [];

    constructor( params: NavParams,
        public viewCtrl: ViewController,
        public navCtrl: NavController,
        public globals: GlobalProvider,
        public account: Account,
        public alertCtrl: AlertController ){
        console.log('event: ', params.get('event'));
        for (var key in globals.translate['start-login']) {
            this.trans[key] = (globals.translate['start-login'][key][globals.language])
        }
        console.log(JSON.stringify(this.trans));
        this.languages = globals.languages[globals.language];
        this.language = globals.language;
        this.translate = globals.translate['start-login'];
        // console.log(globals.translate['start-login']['1']['ww']);
    }

    login() {
        //implementa login qui
        this.account.login(this.user.name, this.user.password).then(data => {
            if(data == '1'){
                this.viewCtrl.dismiss(data)
            }
        });
    }

    lostPassword() {
        this.alertCtrl.create("in costruzione...");
    }

    closeLogin() {
        this.viewCtrl.dismiss()
    }

}
