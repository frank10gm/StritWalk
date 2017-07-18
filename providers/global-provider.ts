import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Events, Platform } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';

/*
  Generated class for the GlobalProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GlobalProvider {

  public api_url: string = "http://www.hackweb.it/api/index.php"
  public upload_url: string = "http://www.hackweb.it/api/upload5.php"
  public upload_url2: string = "http://www.hackweb.it/api/upload_img.php"
  public user_position: any;
  public languages: any = [];
  public language: string = 'ww';
  public translate: any = [];
  public color: string;
  public color1: string;
  public color2: string;
  public color3: string;
  public color4: string;
  public color5: string;
  public color6: string;
  public color7: string;
  public color8: string;
  public color9: string;
  public color_1: string;
  public color_2: string;
  public color_3: string;
  public color_4: string;
  public bg_color_2: string;
  public bg_color_3: string;
  public bg_color_4: string;
  public user_id: string;
  public user_name: string;
  public user_status: string;

  constructor(public http: Http,
    public events: Events,
    private storage: NativeStorage,
    public platform: Platform
  ) {

    //username data
    this.platform.ready().then(() => {
      this.storage.getItem('localUser').then(
        data => {
          this.user_name = data.username;
          this.user_status = data.status;
          this.user_id = data.id;
        }
      )
    })

    //colori
    this.color = "bl";
    this.color1 = "wh1"
    this.color2 = "wh2"
    this.color3 = "wh3"
    this.color4 = "wh4"
    this.color5 = "wh5"
    this.color6 = "wh6"
    this.color7 = "wh7"
    this.color8 = "wh8"
    this.color9 = "wh9"
    this.color_1 = "wh-color-1";
    this.color_2 = "wh-color-2";
    this.color_3 = "wh-color-3";
    this.color_4 = "wh-color-3";
    this.bg_color_2 = "wh-bg-color-2";
    this.bg_color_3 = "wh-bg-color-3";
    this.bg_color_4 = "wh-bg-color-4";

    //cambia colore
    this.changeTheme('wh');

    //traduzioni
    this.translate['start-login'] = {
      '1': {
        'ww': "Log in",
        'it': "Accedi"
      },
      '2': {
        'ww': "fro",
        'it': 'ci'
      }
    };

    this.translate['profile'] = {
      '1': {
        'ww': "(if you want to edit your profile click here)",
        'it': ""
      },
      '2': {
        'ww': "Log in",
        'it': "gino"
      },
    };

    for (var key in this.translate) {
      for (var key2 in this.translate[key]) {
        console.log(this.translate[key][key2]['it']);
        if (this.translate[key][key2]['it'] == "") {
          this.translate[key][key2]['it'] = this.translate[key][key2]['ww'];
        }
      }
    }

    this.languages['ww'] = {
      login: "Log in",
      register: "Register",
      click_here: "Click here",
      lost_password: "Lost password?",
      cancel: "Cancel",
      problems: "Do you have problems? Contact",
      welcome: "Welcome",
      start1: "Thank you for downloading SafeChild!",
      start2: "Do you have an account?",
      start3: "For any doubt contact",
      error_username: "username not available",
      error_mail: "email address already in use",
      error_userpass: "wrong username or password",
      error_shortusername: "username too short",
      error_incorrectemail: "incorrect email address",
      error_samepassword: "password fields don't match",
      error_shortpassword: "password must contain at least 8 characters",
      error_complexpassword: "password must contain at least: 1 capital letter and 1 number"
    };
    this.languages['it'] = {
      login: "Accedi",
      register: "Iscriviti",
      click_here: "Clicca qui",
      lost_password: "Hai perso la password",
      cancel: "Annulla",
      problems: "Per problemi contatta",
      welcome: "Benvenuto",
      start1: "Grazie per aver scaricato Cities!<br>Ora puoi iscriverti.",
      start2: "Se sei già iscritto effettua subito l'accesso.",
      start3: "Se hai qualche dubbio contatta",
      error_username: "username non disponibile",
      error_mail: "indirizzo email già in uso",
      error_userpass: "username o password sbagliati",
      error_shortusername: "username troppo corto",
      error_incorrectemail: "indirizzo email non corretto",
      error_samepassword: "le password non coincidono"
    };

    for (var key in this.languages['ww']) {
      if (this.languages[this.language][key] == undefined) {
        this.languages[this.language][key] = this.languages['ww'][key];
      }
    }
  }

  changeTheme(color) {
    if (color == "bl") {
      this.color1 = "wh1";
      this.color = "bl";
    } else if (color == "wh") {
      this.color1 = "bl1";
      this.color = "wh";
    }
    if (this.color1 == "bl1") {
      this.color1 = "wh1"
      this.color2 = "wh2"
      this.color3 = "wh3"
      this.color4 = "wh4"
      this.color5 = "wh5"
      this.color6 = "wh6"
      this.color7 = "wh7"
      this.color8 = "wh8";
      this.color9 = "wh9";
      this.color_1 = "wh-color-1";
      this.color_2 = "wh-color-2";
      this.color_3 = "wh-color-3";
      this.color_4 = "wh-color-3";
      this.bg_color_2 = "wh-bg-color-2";
      this.bg_color_3 = "wh-bg-color-3";
      this.bg_color_4 = "wh-bg-color-4";
    } else {
      this.color1 = "bl1"
      this.color2 = "bl2"
      this.color3 = "bl3"
      this.color4 = "bl4"
      this.color5 = "bl5"
      this.color6 = "bl6"
      this.color7 = "bl7"
      this.color8 = "bl8";
      this.color9 = "bl9";
      this.color_1 = "bl-color-1";
      this.color_2 = "bl-color-2";
      this.color_3 = "bl-color-3";
      this.color_4 = "bl-color-3";
      this.bg_color_2 = "bl-bg-color-2";
      this.bg_color_3 = "bl-bg-color-3";
      this.bg_color_4 = "bl-bg-color-4";
    }
    this.events.publish('changeTheme', Date.now());
  }

}
