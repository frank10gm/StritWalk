import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController, Modal, AlertController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { NativeStorage } from '@ionic-native/native-storage';
import { GlobalProvider } from '../../providers/global-provider'
import { Account } from '../../providers/account'

@Component({
    selector: 'page-user-markers',
    templateUrl: 'user-markers.html'
})
export class UserMarkersPage {

    //variables
    user: any = {};
    title: string = '';
    id: string = '';
    marker: any = {};

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
        this.marker.name = this.title;
        this.marker.id = this.id;
    }

    closeModal() {
        document.getElementById('map').style.display = 'block';
        this.viewCtrl.dismiss(this.marker);
    }

    delete() {
        let alert = this.alertCtrl.create({
            title: 'Delete this point',
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
                        this.marker.action = "del";
                        this.viewCtrl.dismiss(this.marker);
                    }
                }
            ]
        });
        alert.present();
    }

    saveMarker(){
        let alert = this.alertCtrl.create({
            title: 'Save this point',
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
                        //document.getElementById('map').style.display = 'block';
                        console.log(this.marker.name);
                        this.account.editMarker(this.id, this.marker.name, "").then(data => {
                            console.log(JSON.stringify(data));
                            this.title = this.marker.name;
                            this.marker.action = "edit";
                        });
                    }
                }
            ]
        });
        alert.present();
    }

}
