import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController, Modal, AlertController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { NativeStorage } from '@ionic-native/native-storage';
import { GlobalProvider } from '../../providers/global-provider'
import { Account } from '../../providers/account'

@Component({
    selector: 'modal-settings',
    templateUrl: 'settings.html'
})
export class Settings {

    //variables
    user: any = {};
    title: string = '';
    id: string = '';

    constructor(params: NavParams,
        public viewCtrl: ViewController,
        public navCtrl: NavController,
        public globals: GlobalProvider,
        public account: Account,
        public alertCtrl: AlertController) {
        //console.log('event: ', params.get('event'));
        this.title = params.get('name');
        this.id = params.get('id_marker');
        document.getElementById('map').style.display = 'none';
    }

    closeModal() {
        document.getElementById('map').style.display = 'block';
        this.viewCtrl.dismiss("exit");
    }

    delete() {
        let alert = this.alertCtrl.create({
            title: 'Delete this pos',
            message: 'Are you sure?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'YES',
                    handler: () => {
                        document.getElementById('map').style.display = 'block';
                        this.viewCtrl.dismiss(this.id);
                    }
                }
            ]
        });
        alert.present();
    }

}
