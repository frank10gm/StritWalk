import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { StartPage } from '../start/start';
import { FavPage } from '../fav/fav';
import { ExplorePage } from '../explore/explore';
import { CitiesPage } from '../cities/cities';
import { MapPage } from '../map/map'
import { ProfilePage } from '../profile/profile';
import { GlobalProvider } from '../../providers/global-provider'
import { Events } from 'ionic-angular';
import { Brightness } from '@ionic-native/brightness';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = ProfilePage;
  tab2Root: any = ExplorePage;
  tab3Root: any = FavPage;
  tab4Root: any = MapPage;
  tab5Root: any = CitiesPage;
  color1: string;

  constructor(public globals: GlobalProvider,
    public events: Events,
    private brightness: Brightness
  ) {
    this.color1 = globals.color8
    events.subscribe('changeTheme', (data) => {
      this.color1 = globals.color8
    });
    events.subscribe('openKeyboard', () => {
      console.log("openKeyboard");
    });

    window.setTimeout(()=>{
      // this.changeBrightness()
      // window.setInterval(()=>{
      //   this.changeBrightness()
      // }, 2000)
      // this.brightness.setBrightness(0);
    },300)

  }

  changeBrightness(){
    this.brightness.getBrightness().then((data)=>{
      console.log("Brightness " + data);
      if(data <= 0.3){
        this.globals.changeTheme("bl")
      }else{
        this.globals.changeTheme("wh")
      }
    })
  }

}
