import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

/*
  Generated class for the GlobalProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GlobalProvider {

  public api_url:string = "http://www.hackweb.it/api/safeproject/index.php"
  public user_position: any;
  public languages: any = [];
  public language: string = 'ww';

  constructor(public http: Http) {
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
      if(this.languages[this.language][key] == undefined){
          this.languages[this.language][key] = this.languages['ww'][key];
      }
    }

  }

}
