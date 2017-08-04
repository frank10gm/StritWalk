import { Component, ViewChild } from '@angular/core';
import { GlobalProvider } from '../../providers/global-provider'

import 'rxjs/add/operator/filter';
import 'rxjs';
import { Observable } from 'rxjs/Observable';
import { NavController, Platform, ViewController, ModalController, Modal, App, ToastController, Events } from 'ionic-angular';
import { Account } from '../../providers/account';
import { Marker2 } from './marker';
import { Settings } from './settings';

import { Geolocation } from '@ionic-native/geolocation';
import { Dialogs } from '@ionic-native/dialogs';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapsMapTypeId,
  LatLng,
  CameraPosition,
  MarkerOptions,
  Marker
} from '@ionic-native/google-maps';
import { NativeStorage } from '@ionic-native/native-storage';
import { Insomnia } from '@ionic-native/insomnia';
import { CitiesPage } from '../cities/cities';
import { Keyboard } from '@ionic-native/keyboard';


@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  map: GoogleMap;
  me: any;
  watch: any;
  user: string;
  user_status: boolean;
  my_places: any[] = [];
  id: string;
  overlay: any;
  dark: string;
  moon: string;
  zoom: number = 13;
  people_markers: any[] = [];
  interval_upd: any;
  interval_people: any;
  lat: any;
  lng: any;
  people_places_markers: any[] = [];
  my_places_marker: any[] = [];
  interval_people_places: any;
  searchBar: boolean = true;
  searchBarModel: string = "";
  me2: any;
  track: boolean = false;
  delta: number = 100;
  delay: number = 10;
  i: number = 0;
  deltaLat: any;
  deltaLng: any;
  locateme_color: string = "primary";
  locate: string = "locate";
  accuracy: any;
  people_circles: any[] = [];
  track_person: boolean = true;
  person: any;
  track_person_val: boolean = false;
  p: any;
  track_person_color: string = "dark";
  last_coords: any;

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

  @ViewChild('searchBarId') searchBarId;

  constructor(public navCtrl: NavController, public platform: Platform, public view: ViewController,
    public globals: GlobalProvider,
    public account: Account,
    public modalCtrl: ModalController,
    private geolocation: Geolocation,
    private insomnia: Insomnia,
    private nativeStorage: NativeStorage,
    private googleMaps: GoogleMaps,
    public app: App,
    public toastCtrl: ToastController,
    private keyboard: Keyboard,
    private events: Events
  ) {
    this.platform.ready()
      .then(() => {
        //   this.insomnia.keepAwake()
        //   .then(
        //     () => console.log('success'),
        //     () => console.log('error')
        //   );

        this.nativeStorage.getItem('localUser').then(
          data => {
            this.user = data.username;
            this.user_status = data.status;
            this.id = data.id;
          }
        )
      });

    //selezione colori mappa
    if (this.globals.color == "bl") {
      this.dark = "light";
      this.moon = "md-sunny";
    } else {
      this.dark = "dark";
      this.moon = "md-moon";
    }
    //selezione colori mappa -- END

    this.keyboard.onKeyboardHide().subscribe((e) => {
      if (!this.searchBar) {
        this.searchBarOpen();
      }
    });

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

  ngAfterViewInit() {
    console.log("view init ... loading map");
    setTimeout(() => {
      this.loadMap();
    }, 500);
  }

  ionViewDidLoad() {

  }

  locateMe() {
    //old v1
    // this.map.getCameraPosition().then(data => {
    //     let position: CameraPosition = {
    //         target: this.globals.user_position,
    //         tilt: 0,
    //         zoom: data.zoom
    //     };
    //     this.map.moveCamera(position);
    //     this.track = !this.track;
    //     if (this.track) {
    //         this.locate = "navigate";
    //         this.locateme_color = "danger";
    //     }
    //     if (!this.track) {
    //         this.locate = "locate";
    //         this.locateme_color = "primary";
    //     }
    // })

    var camerapos = this.map.getCameraPosition();

    let position: CameraPosition = {
      target: this.globals.user_position,
      tilt: 0,
      zoom: camerapos.zoom
    };
    this.map.moveCamera(position);
    this.track = !this.track;
    if (this.track) {
      this.locate = "navigate";
      this.locateme_color = "danger";
    }
    if (!this.track) {
      this.locate = "locate";
      this.locateme_color = "primary";
    }

    // this.me.showInfoWindow();
  }

  savePosition() {
    //this.geolocation.getCurrentPosition().then((resp) => {
    if (this.user_status) {
      this.account.savePosition(this.last_coords.latitude, this.last_coords.longitude, this.id, this.last_coords.accuracy).then(data => {
        //console.log("aggiorno utente: " + this.id + " lat: " + this.last_coords.latitude + " lng: " + this.last_coords.longitude);
      });
      //this.moveMe(this.globals.user_position, this.last_coords);
      this.interval_upd = setTimeout(() => {
        this.savePosition();
      }, 10000);
    }
    //});
  }

  loadMap() {
    let element: HTMLElement = document.getElementById('map');
    // this.map = new GoogleMap(element);
    this.map = this.googleMaps.create(element);
    // this.map.clear();
    // listen to MAP_READY event
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      console.log('Map is ready!');
      // var mapType = "MAP_TYPE_NONE";
      // this.map.setMapTypeId(mapType);

      this.map.setMapTypeId(GoogleMapsMapTypeId['NONE']);

      var stamen = "http://tile.stamen.com/toner/<zoom>/<x>/<y>@2x.png";
      // if(this.globals.color == "bl") var map_color = "dark"
      // else map_color = "light";
      var map_color = "light";
      // return "http://tile.openstreetmap.org/" + z + "/" + x + "/" + y + ".png";
      var openm = 'http://cartodb-basemaps-a.global.ssl.fastly.net/' + map_color + '_all/<zoom>/<x>/<y>@2x.png';
      openm = 'http://cartodb-basemaps-a.global.ssl.fastly.net/' + map_color + '_all/';

      this.map.addTileOverlay({
        //dev10n
        // debug: false,
        getTile: (x, y, z) => {
          return openm + z + '/' + x + '/' + y + '@2x.png';
        }
      }).then(tileOverlay => {
        //dev10n
        this.overlay = tileOverlay;
        // alert(JSON.stringify(tileOverlay._map._objectInstance.OVERLAYS[0]));
        // alert(JSON.stringify(this.overlay.getTileSize()));
      }).catch(e => {
        console.log("tile error: " + e)
      });

      //map position change
      this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe((pos) => {
        this.stopTrack();
      })

    });

    this.geolocation.getCurrentPosition().then((resp) => {

      let me: LatLng = new LatLng(resp.coords.latitude, resp.coords.longitude);
      let position: CameraPosition = {
        target: me,
        zoom: this.zoom,
        tilt: 0
      };
      this.map.moveCamera(position);
      //myself on map
      this.map.addMarker({
        position: me,
        icon: {
          url: './assets/images/bluedot.png',
          size: {
            width: 22, //25
            height: 22 //38
          }
        },
        zIndex: 0,
        title: 'Me',
      }).then((marker: Marker) => {
        marker.setIconAnchor(11, 11);
        this.me2 = marker;
        marker.addEventListener(GoogleMapsEvent.INFO_CLICK).subscribe((e) => {
          // this.navCtrl.push(CitiesPage);
          this.app.getRootNav().getActiveChildNav().select(0);
        });
      });

      this.accuracy = resp.coords.accuracy;

      this.map.addCircle({
        center: me,
        radius: resp.coords.accuracy,
        zIndex: 99,
        fillColor: 'rgba(0, 0, 0, 0.1)', //#F0FFFF
        strokeColor: '#387ef5',
        strokeWidth: 1
      }).then((circle) => {
        this.me = circle;
        this.lat = resp.coords.latitude;
        this.lng = resp.coords.longitude;
        this.last_coords = resp.coords;
        //my position to global
        this.globals.user_position = me;
        //dev10n
        this.watchAgain();
        this.getPeople();
        this.getPeopleMarker();
        this.savePosition();
        this.myMovement();
      });


    }).catch((error) => {
      console.log('Error getting location', error);
    });

    //click on map listener
    this.map.on(GoogleMapsEvent.MAP_LONG_CLICK).subscribe((pos) => {
      //AGGIUNTA NUOVI MARKER
      //viene creato il marker e poi subito viene aprto il modal
      var el = null;
      let el_data: any = {};
      //save markers positions of user
      if (this.user_status) {
        this.account.saveMarkerPosition(pos.lat, pos.lng, this.id, this.my_places.length).then(last => {
          let markerdata: any = {};
          markerdata.name = 'Post #' + last.toString();
          markerdata.last = last;
          el_data = markerdata;
          el_data.creation = true;

          let markerModal = this.modalCtrl.create(Marker2, { event: 'pressMarker', name: el_data.name, id_user: this.id, id_marker: el_data.last.toString(), data: el_data });
          markerModal.onDidDismiss(data => {
            if (data.action == "del") {
              this.account.deleteMarker(data.id, data.info.audio).then(data => {
                // console.log("deleted marker on creation");
              });
            } else if (data.action == "edit") {
              el_data.name = data.name;
            }
          });
          markerModal.present();
        });
      }

    });
  }

  watchAgain() {
    let watch = this.geolocation.watchPosition();
    watch.subscribe(data => {
      if ((data).coords != undefined) {
        var geoposition = (data);
        let me: LatLng = new LatLng(data.coords.latitude, data.coords.longitude);
        this.me.setRadius(data.coords.accuracy);
        this.globals.user_position = me;
        this.last_coords = data.coords;
        // this.moveMe(this.globals.user_position, this.last_coords);
      } else {
        //setTimeout(this.watchAgain(), 2000);
      }
    },
      error => {
        console.log(error);
      });
    this.watch = watch;
  }

  darkMap() {
    if (this.moon == "md-sunny") {
      this.moon = "md-moon"
      console.log("tile: " + JSON.stringify(this.overlay));
      this.overlay.remove();
      // var openm = 'http://cartodb-basemaps-a.global.ssl.fastly.net/light_all/<zoom>/<x>/<y>@2x.png';
      var openm = 'http://cartodb-basemaps-a.global.ssl.fastly.net/light_all/';
      this.dark = "dark";
    } else {
      this.moon = "md-sunny"
      console.log("tile: " + JSON.stringify(this.overlay));
      this.overlay.remove();
      // var openm = 'http://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/<zoom>/<x>/<y>@2x.png';
      var openm = 'http://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/';
      this.dark = "light";
    }

    this.map.addTileOverlay({
      getTile: (x, y, z) => {
        return openm + z + '/' + x + '/' + y + '@2x.png';
      }
    }).then((tileOverlay) => {
      this.overlay = tileOverlay;
    });

    if (!this.searchBar) {
      this.searchBarOpen();
    }
  }

  settings() {
    this.stopTrack();
    let settingsModal = this.modalCtrl.create(Settings, { event: 'pressSettings' });
    settingsModal.onDidDismiss(data => {
      // this.map.setVisible(true);
    });
    settingsModal.present();
    if (!this.searchBar) {
      this.searchBarOpen();
    }
  }

  getPeople() {
    if (this.track_person_val) {
      // this.map.getCameraPosition().then((data) => {
      //     this.map.animateCamera({
      //         target: this.person,
      //         tilt: 0,
      //         zoom: data.zoom,
      //         duration: 1000,
      //         bearing: data.bearing
      //     });
      // });

      var camerapos = this.map.getCameraPosition();
      this.map.animateCamera({
        target: this.person,
        tilt: 0,
        zoom: camerapos.zoom,
        duration: 1000,
        bearing: camerapos.bearing
      });
    }
    this.account.getPeople(this.id).then(data => {
      var cur_set = [];
      var cur_set_circle = [];
      for (let marker of data) {
        if (this.people_markers[marker.id] == undefined) {
          this.map.addCircle({
            center: new LatLng(marker.lat, marker.lng),
            radius: marker.accuracy,
            fillColor: 'rgba(0, 0, 0, 0.10)', //#F0FFFF
            strokeColor: '#222222',
            strokeWidth: 1
          }).then((circle) => {
            cur_set_circle[marker.id] = circle;
            this.people_circles[marker.id] = circle;
          });
          this.map.addMarker({
            position: new LatLng(marker.lat, marker.lng),
            icon: {
              url: './assets/images/dark-dot.png',
              size: {
                width: 22, //20
                height: 22 //31
              }
            },
            title: marker.login,
            snippet: 'click here to open'
          }).then((marker2: Marker) => {
            this.people_markers[marker.id] = [marker, marker2];
            this.people_markers[marker.id][0].name = this.people_markers[marker.id][0].login;
            cur_set[marker.id] = marker2;
            marker2.setIconAnchor(11, 11);
            marker2.addEventListener(GoogleMapsEvent.MARKER_CLICK).subscribe((e) => {
              //inizializzazione del tracking
              this.stopTrack();
              this.person = new LatLng(marker.lat, marker.lng);
              this.p = marker.id;
              this.track_person = false;
              setTimeout(() => {
                marker2.hideInfoWindow();
              }, 5000);
            });
            marker2.addEventListener(GoogleMapsEvent.INFO_CLICK).subscribe((e) => {
              //aggiunta del modal
            });
          });
        } else {
          //muovo le persone già inserite nella mappa
          //movimento track person
          if (this.p == marker.id) {
            this.person = new LatLng(marker.lat, marker.lng);
          }
          cur_set[marker.id] = this.people_markers[marker.id][1];
          cur_set_circle[marker.id] = this.people_circles[marker.id];
          this.people_circles[marker.id].setRadius(marker.accuracy);
          //
          // this.people_circles[marker.id].setCenter(new LatLng(marker.lat, marker.lng));
          // this.people_markers[marker.id][1].setPosition(new LatLng(marker.lat, marker.lng));
          //
          //the smooth movement should be here
          let deltaLat = (marker.lat - this.people_markers[marker.id][0].lat) / 100;
          let deltaLng = (marker.lng - this.people_markers[marker.id][0].lng) / 100;
          let i = 0;
          this.peopleMoveSmooth(marker.id, this.people_markers[marker.id][0].lat, this.people_markers[marker.id][0].lng, deltaLat, deltaLng, i);
          this.people_markers[marker.id][0].lat = marker.lat;
          this.people_markers[marker.id][0].lng = marker.lng;
          // console.log("muovo: " + marker.id + " lat: " + marker.lat + " lng: " + marker.lng + " accuracy: " + marker.accuracy);
        }
      }
      //eliminiamo i morti
      for (let i in this.people_markers) {
        if (this.people_markers[i][1] != cur_set[i]) {
          console.log('morto: ' + i);
          this.people_markers[i][1].remove();
          this.people_markers[i] = undefined;
          this.people_circles[i].remove();
        }
      }
      this.interval_people = setTimeout(() => {
        this.getPeople();
      }, 10000);
    });
  }

  openMyModal(id) {
    let markerModal = this.modalCtrl.create(Marker2, { event: 'pressMarker', name: this.my_places_marker[id][0].name, id_user: this.id, id_marker: id, data: this.my_places_marker[id][0] });
    markerModal.onDidDismiss(data => {
      if (data.action == "del") {
        this.my_places_marker[id][1].remove();
        this.account.deleteMarker(data.id, data.info.audio).then(data => {
          console.log("deleted marker getPeopleMarker");
        });
      } else if (data.action == "edit") {
        this.my_places_marker[id][1].hideInfoWindow();
        this.my_places_marker[id][1].setTitle(data.name + " ");
        this.my_places_marker[id][0].name = data.name;
      }
    });
    markerModal.present();
  }

  getPeopleMarker() {
    //caricamento nella mappa dei marker già creati dall'utente corrente
    this.account.getUserMarkers(this.id).then(data => {
      var cur_set = [];
      for (let marker of data) {
        if (this.my_places_marker[marker.id] == undefined) {
          if (marker.name == null) {
            marker.name = 'Post #' + (marker.id)
          }
          this.map.addMarker({
            position: new LatLng(marker.lat, marker.lng),
            icon: {
              url: './assets/images/dot-red.png',
              size: {
                width: 20,
                height: 31
              }
            },
            title: marker.name,
            snippet: 'click here to open'
          }).then((marker2: Marker) => {
            this.my_places_marker[marker.id] = [marker, marker2];
            var arr = [];
            arr.push(marker);
            arr.push(marker2);
            this.my_places.push(arr);
            marker2.addEventListener(GoogleMapsEvent.MARKER_CLICK).subscribe((e) => {
              this.stopTrack();
              setTimeout(() => {
                marker2.hideInfoWindow();
              }, 5000);
            });
            marker2.addEventListener(GoogleMapsEvent.INFO_CLICK).subscribe((e) => {
              this.openMyModal(marker.id)
            });
          });
        } else {
          this.my_places_marker[marker.id][1].setTitle(marker.name);
          cur_set[marker.id] = this.my_places_marker[marker.id][1];
        }
      }
      //eliminiamo i morti
      for (let i in this.my_places_marker) {
        if (this.my_places_marker[i][1] != cur_set[i]) {
          this.my_places_marker[i][1].remove();
          this.my_places_marker[i] = undefined;
        }
      }
    });

    this.account.getPeopleMarker(this.id).then(data => {
      var cur_set = [];
      for (let marker of data) {
        if (this.people_places_markers[marker.id] == undefined) {

          this.map.addMarker({
            position: new LatLng(marker.lat, marker.lng),
            icon: {
              url: './assets/images/dot-green.png',
              size: {
                width: 20, //20
                height: 31 //31
              }
            },
            title: marker.name,
            snippet: 'created by: ' + marker.creator + ' \nclick here to open'
          }).then((marker2: Marker) => {
            this.people_places_markers[marker.id] = [marker, marker2];
            cur_set[marker.id] = marker2;
            marker2.addEventListener(GoogleMapsEvent.MARKER_CLICK).subscribe((e) => {
              this.stopTrack();
              setTimeout(() => {
                marker2.hideInfoWindow();
              }, 5000);
            });
            marker2.addEventListener(GoogleMapsEvent.INFO_CLICK).subscribe((e) => {
              //aggiunta del modal
            });
          });
        } else {
          //muovo i posti già inseriti nella mappa
          this.people_places_markers[marker.id][1].setPosition(new LatLng(marker.lat, marker.lng));
          cur_set[marker.id] = this.people_places_markers[marker.id][1];
        }
      }
      //eliminiamo i morti
      for (let i in this.people_places_markers) {
        if (this.people_places_markers[i][1] != cur_set[i]) {
          // console.log('eliminato: '+i);
          this.people_places_markers[i][1].remove();
          this.people_places_markers[i] = undefined;
        }
      }
      this.interval_people_places = setTimeout(() => {
        this.getPeopleMarker();
      }, 10000);
    });
  }

  searchBarOpen() {
    this.searchBar = !this.searchBar;
    this.map.setClickable(this.searchBar);
    this.searchBarModel = "";
    this.stopTrack();

    if (!this.searchBar) {
      setTimeout(() => {
        this.searchBarId.setFocus();
        this.keyboard.show(); // for android
      }, 500); //a least 150ms.
    } else {
      this.keyboard.close();
    }
  }

  search(e) {
    var lat = 0;
    var lng = 0;
    var dest = 0;
    var arr = [];
    this.stopTrack();
    if (this.my_places_marker.length > 0) {
      for (let i in this.my_places_marker) {
        arr.push(this.my_places_marker[i][0]);
      }
    }
    if (this.people_markers.length > 0) {
      for (let i in this.people_markers) {
        arr.push(this.people_markers[i][0]);
      }
    }
    if (this.people_places_markers.length > 0) {
      for (let i in this.people_places_markers) {
        arr.push(this.people_places_markers[i][0]);
      }
    }

    for (let i in arr) {
      if (arr[i].name.toLowerCase().includes(e.target.value.toLowerCase())) {
        lat = arr[i].lat;
        lng = arr[i].lng;
        dest = 1;
      }
    }

    if (dest == 1) {
      // this.map.getCameraPosition().then(data => {
      //     let position: CameraPosition = {
      //         target: new LatLng(lat, lng),
      //         tilt: 0,
      //         zoom: data.zoom
      //     };
      //     this.map.moveCamera(position);
      // })

      var camerapos = this.map.getCameraPosition();
      let position: CameraPosition = {
        target: new LatLng(lat, lng),
        tilt: 0,
        zoom: camerapos.zoom
      };
      this.map.moveCamera(position);

    }
  }

  openMessages() {
    console.log("dev11n");
  }

  zoomOut() {
    if (!this.searchBar) {
      this.searchBarOpen();
    }
    // this.map.getCameraPosition().then((data) => {
    //     if (data.zoom == 13) {
    //         this.map.setZoom(16);
    //         this.zoom = 16;
    //     } else if (data.zoom >= 14) {
    //         this.map.setZoom(3);
    //         this.zoom = 3;
    //     } else {
    //         this.map.setZoom(data.zoom + 2);
    //         this.zoom = (data.zoom + 2);
    //     }
    //     let toast = this.toastCtrl.create({
    //         message: 'Zoom level: ' + Math.round(this.zoom),
    //         duration: 500,
    //         position: 'top'
    //     });
    //     toast.present();
    // });

    var camerapos = this.map.getCameraPosition();
    if (camerapos.zoom == 13) {
      this.map.setCameraZoom(16);
      this.zoom = 16;
    } else if (camerapos.zoom >= 14) {
      this.map.setCameraZoom(3);
      this.zoom = 3;
    } else {
      this.map.setCameraZoom(camerapos.zoom + 2);
      this.zoom = (camerapos.zoom + 2);
    }
    let toast = this.toastCtrl.create({
      message: 'Zoom level: ' + Math.round(this.zoom),
      duration: 500,
      position: 'top'
    });
    toast.present();

  }

  peopleMoveSmooth(p, lat, lng, deltaLat, deltaLng, i) {
    lat = Number(lat);
    lng = Number(lng);
    lat += Number(deltaLat);
    lng += Number(deltaLng);
    var pos = new LatLng(lat, lng);
    this.people_markers[p][1].setPosition(pos);
    this.people_circles[p].setCenter(pos);
    if (i != 100) {
      i++;
      setTimeout(() => {
        this.peopleMoveSmooth(p, lat, lng, deltaLat, deltaLng, i);
      }, 100);
    }
  }

  stopTrack() {
    this.track = false;
    this.locateme_color = "primary";
    this.locate = "locate";
    this.track_person = true;
  }

  trackPerson(p) {
    this.track_person_val = !this.track_person_val;
    if (this.track_person_val) {
      this.track_person_color = "danger";
      // this.map.getCameraPosition().then((data) => {
      //     this.map.animateCamera({
      //         target: this.person,
      //         tilt: 0,
      //         zoom: 13,
      //         duration: 1000,
      //         bearing: data.bearing
      //     });
      // });
      var camerapos = this.map.getCameraPosition();
      this.map.animateCamera({
        target: this.person,
        tilt: 0,
        zoom: 13,
        duration: 1000,
        bearing: camerapos.bearing
      });

    } else {
      this.track_person_color = "dark";
    }
  }

  myMovement() {
    this.moveMe(this.globals.user_position, this.last_coords);
    if (this.track) {
      // this.map.getCameraPosition().then((data) => {
      //     this.map.animateCamera({
      //         target: this.globals.user_position,
      //         tilt: 0,
      //         zoom: data.zoom,
      //         duration: 500,
      //         bearing: data.bearing
      //     });
      // });

      var camerapos = this.map.getCameraPosition();
      this.map.animateCamera({
        target: this.globals.user_position,
        tilt: 0,
        zoom: camerapos.zoom,
        duration: 500,
        bearing: camerapos.bearing
      });

    }
    setTimeout(() => {
      this.myMovement();
    }, 1000);
  }

  moveMe(me, coords) {
    // this.me.setRadius(coords.accuracy);
    this.accuracy = coords.accuracy;
    this.i = 0;
    this.deltaLat = (coords.latitude - this.lat) / this.delta;
    this.deltaLng = (coords.longitude - this.lng) / this.delta;
    this.moveSmooth();
    // this.me2.setPosition(me)
    // this.me.setCenter(me);
    //dev10n
  }

  moveSmooth() {
    this.lat += this.deltaLat;
    this.lng += this.deltaLng;
    var me = new LatLng(this.lat, this.lng);
    this.me2.setPosition(me)
    this.me.setCenter(me);
    if (this.i != this.delta) {
      this.i++;
      setTimeout(() => {
        this.moveSmooth();
      }, this.delay);
    }
  }

}
