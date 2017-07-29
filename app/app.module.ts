import { NgModule, ErrorHandler, enableProdMode } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { StartPage } from '../pages/start/start'
import { Login } from '../pages/start/login'
import { SignUp } from '../pages/start/signup'
import { LoginPage } from '../pages/login/login'
import { GlobalProvider } from '../providers/global-provider'
import { Account } from '../providers/account'
import { SplashPage } from '../pages/splash/splash'
import { MapPage } from '../pages/map/map'
import { Marker2 } from '../pages/map/marker'
import { FavPage } from '../pages/fav/fav'
import { CitiesPage } from '../pages/cities/cities'
import { ProfilePage } from '../pages/profile/profile'
import { ExplorePage } from '../pages/explore/explore'
import { SettingsPage } from '../pages/settings/settings'
import { Settings } from '../pages/map/settings'
import { Geolocation } from '@ionic-native/geolocation';
import { Dialogs } from '@ionic-native/dialogs';
import { NativeStorage } from '@ionic-native/native-storage';
import { Insomnia } from '@ionic-native/insomnia';
import { UserMarkersPage } from '../pages/user-markers/user-markers'
import { OtherMarkersPage } from '../pages/other-markers/other-markers'
import { Keyboard } from '@ionic-native/keyboard';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  CameraPosition,
  MarkerOptions,
  Marker
} from '@ionic-native/google-maps';
import { Media, MediaObject } from '@ionic-native/media';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Brightness } from '@ionic-native/brightness';
import { MapsClusterProvider } from '../providers/maps-cluster/maps-cluster';

enableProdMode();

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    Login,
    SignUp,
    StartPage,
    LoginPage,
    SplashPage,
    MapPage,
    FavPage,
    CitiesPage,
    ProfilePage,
    ExplorePage,
    SettingsPage,
    Marker2,
    Settings,
    UserMarkersPage,
    OtherMarkersPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp,{
      platforms: {
        android: {
          activator: 'none',
          // tabsPlacement: 'top'
        }
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    Login,
    SignUp,
    StartPage,
    LoginPage,
    SplashPage,
    MapPage,
    FavPage,
    CitiesPage,
    ProfilePage,
    ExplorePage,
    SettingsPage,
    Marker2,
    Settings,
    UserMarkersPage,
    OtherMarkersPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GlobalProvider,
    Account,
    GoogleMaps,
    Dialogs,
    NativeStorage,
    Insomnia,
    Geolocation,
    Keyboard,
    FileTransfer,
    File,
    Media,
    Brightness,
    MapsClusterProvider
  ]
})
export class AppModule {}
