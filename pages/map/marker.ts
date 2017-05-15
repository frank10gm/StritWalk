import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController, Modal, AlertController, Platform } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { NativeStorage } from '@ionic-native/native-storage';
import { GlobalProvider } from '../../providers/global-provider'
import { Account } from '../../providers/account'

@Component({
    selector: 'modal-marker',
    templateUrl: 'marker.html'
})
export class Marker2 {

    //variables
    user: any = {};
    title: string = '';
    id: string = '';
    marker: any = {};
    info: any = {};
    info_initial: any = {};
    clicked_close: number = 0;
    modification: number = 0;

    constructor(params: NavParams,
        public viewCtrl: ViewController,
        public navCtrl: NavController,
        public globals: GlobalProvider,
        public account: Account,
        public alertCtrl: AlertController,
        public platform: Platform) {
        //console.log('event: ', params.get('event'));
        this.title = params.get('name');
        this.id = params.get('id_marker');
        document.getElementById('map').style.display = 'none';
        this.marker.name = this.title;
        this.marker.id = this.id;
        //backbutton
        platform.registerBackButtonAction(() => {
            console.log("ho schiacciato il back");
            if(this.clicked_close == 0){
                this.clicked_close = 1;
                this.closeModal();
            }
        });
        //test
        this.info = params.get('data');
        this.info_initial.private = params.get('data').private;
        if(this.info.private == 0){
            this.info.private = false;
        }else{
            this.info.private = true;
        }
        this.marker.info = this.info;
    }

    closeModal() {
        if(this.marker.name != this.title || this.info.private != this.info_initial.private || this.modification == 1){
            let alert = this.alertCtrl.create({
                title: 'Save this point',
                message: 'Do you want to save changes?',
                buttons: [
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');
                            this.info.private = this.info_initial.private;
                            document.getElementById('map').style.display = 'block';
                            this.viewCtrl.dismiss(this.marker);
                        }
                    },
                    {
                        text: 'YES',
                        handler: () => {
                            this.saveAll().then(() => {
                                document.getElementById('map').style.display = 'block';
                                this.viewCtrl.dismiss(this.marker);
                            });
                        }
                    }
                ]
            });
            alert.present();
        }else{
            document.getElementById('map').style.display = 'block';
            this.viewCtrl.dismiss(this.marker);
        }
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
                        this.saveAll();
                    }
                }
            ]
        });
        alert.present();
    }

    clearText(){
        this.marker.name = "";
        console.log("cancella testo");
    }

     saveAll(){
        return this.account.editMarker(this.id, this.marker.name, this.info).then(data => {
            console.log(JSON.stringify(data));
            this.title = this.marker.name;
            this.marker.action = "edit";
            this.marker.info = this.info;
            return 0;
        });
    }

    modify(){
        this.modification = 1;
    }

}
