import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController, Modal } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { NativeStorage } from '@ionic-native/native-storage';
import {GlobalProvider} from '../../providers/global-provider'
import {Account} from '../../providers/account'
import { Keyboard } from '@ionic-native/keyboard';

@Component({
    selector: 'modal-signup',
    templateUrl: 'signup.html'
})
export class SignUp {

    //variables
    user: any = {};
    languages: any;

    constructor( params: NavParams, public viewCtrl: ViewController, public navCtrl: NavController, public globals: GlobalProvider, public account: Account,
    private keyboard: Keyboard) {
        this.languages = globals.languages[globals.language];
        this.user.info = "xx";
    }

    signUp() {
        //implementa login qui
        this.account.register(this.user).then(data => {
            if(data == '1'){
                this.viewCtrl.dismiss(data)
            }
        });
    }

    close() {
        this.viewCtrl.dismiss()
    }

    keyP(code){
        if(code==13){
            this.keyboard.close();
            this.signUp();
        }
    }

}
