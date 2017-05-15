import { Component } from '@angular/core';

import { NavController, Platform, ViewController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';

import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,
 LatLng,
 CameraPosition,
 MarkerOptions,
 Marker
} from '@ionic-native/google-maps';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  map: GoogleMap;
  watch: any;

  constructor(public navCtrl: NavController, public platform: Platform, public view: ViewController,
  private geolocation: Geolocation) {
    this.platform.ready()
    .then(
      () => {
        // execute code here
        this.loadMap();
      }
    );

  }

  ngAfterViewInit() {

  }

  ionViewDidLoad(){

  }

  loadMap() {
    let element: HTMLElement = document.getElementById('map');
    this.map = new GoogleMap(element);
    // listen to MAP_READY event
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => console.log('Map is ready!'));
    // create LatLng object
    let ionic: LatLng = new LatLng(43.0741904, -89.3809802);
    // create CameraPosition
    let position: CameraPosition = {
      target: ionic,
      zoom: 15,
      tilt: 0
    };
    this.map.moveCamera(position);

    // create new marker
    // let markerOptions: GoogleMapsMarkerOptions = {
    //     position: ionic,
    //     title: 'Ionic'
    // };
    // map.addMarker(markerOptions)
    //     .then((marker: GoogleMapsMarker) => {
    //         marker.showInfoWindow();
    //     });

    this.geolocation.getCurrentPosition().then((resp) => {
      let me: LatLng = new LatLng(resp.coords.latitude, resp.coords.longitude);
      let position: CameraPosition = {
        target: me,
        zoom: 15,
        tilt: 0
      };
      this.map.moveCamera(position);
      setTimeout(this.watchAgain(), 2000);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  watchAgain(){
    console.log("a");
    let watch = this.geolocation.watchPosition();
    watch.subscribe(data => {
      console.log(data)
        if (data.coords != undefined) {
            var geoposition = (data);
            let me: LatLng = new LatLng(data.coords.latitude, data.coords.longitude);
            let position: CameraPosition = {
              target: me,
              zoom: 15,
              tilt: 0
            };
            this.map.moveCamera(position);
        } else {
          setTimeout(this.watchAgain(), 2000);
        }
    });
    this.watch = watch;
  }

}
