import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { StartPage } from '../start/start';
import { FavPage } from '../fav/fav';
import { ExplorePage } from '../explore/explore';
import { CitiesPage } from '../cities/cities';
import { MapPage } from '../map/map'
import { ProfilePage } from '../profile/profile';;

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

  constructor() {

  }
}
