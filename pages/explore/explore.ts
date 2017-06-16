import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { GlobalProvider } from '../../providers/global-provider'

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
  color1: string;
  color2: string;
  color3: string;
  color4: string;
  color5: string;
  color6: string;
  color7: string;
  color8: string;
  color_1: string;
  color_2: string;
  color_3: string;
  bg_color_2: string;
  bg_color_3: string;
  bg_color_4: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private keyboard: Keyboard,
    private events: Events,
    public globals: GlobalProvider
  ) {

    //scelta colori
    this.color1 = globals.color1
    this.color2 = globals.color2
    this.color3 = globals.color3
    this.color4 = globals.color4
    this.color5 = globals.color5
    this.color6 = globals.color6
    this.color7 = globals.color7
    this.color8 = globals.color8
    this.color_1 = globals.color_1
    this.color_2 = globals.color_2
    this.color_3 = globals.color_3
    this.bg_color_2 = globals.bg_color_2
    this.bg_color_3 = globals.bg_color_3
    this.bg_color_4 = globals.bg_color_4

    events.subscribe('changeTheme', (data) => {
      this.color1 = this.globals.color1
      this.color2 = this.globals.color2
      this.color3 = this.globals.color3
      this.color4 = this.globals.color4
      this.color5 = this.globals.color5
      this.color6 = this.globals.color6
      this.color7 = this.globals.color7
      this.color_1 = this.globals.color_1
      this.color_2 = this.globals.color_2
      this.color_3 = this.globals.color_3
      this.bg_color_2 = this.globals.bg_color_2
      this.bg_color_3 = this.globals.bg_color_3
      this.bg_color_4 = this.globals.bg_color_4
    });

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
