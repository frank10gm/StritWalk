import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';

/*
  Generated class for the Explore page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-explore',
  templateUrl: 'explore.html'
})
export class ExplorePage {
  search_group: string = "all";

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private keyboard: Keyboard) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExplorePage');
  }

  search(e){

  }

  searchClick(e){
    this.keyboard.close();
  }

}
