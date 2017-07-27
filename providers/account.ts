import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { GlobalProvider} from '../providers/global-provider'
import {NativeStorage} from '@ionic-native/native-storage';
import {Dialogs} from '@ionic-native/dialogs';
import { Observable } from 'rxjs/Observable';

/*
Generated class for the Account provider.

See https://angular.io/docs/ts/latest/guide/dependency-injection.html
for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Account {

  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(public http: Http, public globals: GlobalProvider, public loadingCtrl: LoadingController,
    private dialogs: Dialogs,
    private nativeStorage: NativeStorage
  ) {

  }

  savePosition(lat, lng, id, accuracy){
    return this.http.post(this.globals.api_url, {action: 'saveMyPosition', id: id, lat: lat, lng: lng, accuracy: accuracy}, {headers: this.headers})
    .toPromise()
    .then(data => {
    })
    .catch(error => {
      return(error);
    });
  }

  saveMarkerPosition(lat, lng, id, marker_id){
    return this.http.post(this.globals.api_url, {action: 'saveMarkerPosition', user_id: id, marker_id: marker_id, lat: lat, lng: lng}, {headers: this.headers})
    .toPromise()
    .then(data => {
      // alert(JSON.stringify(data.text()));
      return(data.text());
    })
    .catch(error => {
      return("error");
    });
  }

  countMarkers(){
    return this.http.post(this.globals.api_url, {action: 'countMarkers'}, {headers: this.headers})
    .toPromise()
    .then(data => {
      return(data.text());
    })
    .catch(error => {
      return("error");
    });
  }

  login(username, password){
    let loading = this.loadingCtrl.create({
      content: ''
    });
    loading.present();

    return this.http.post(this.globals.api_url, {action: 'login', name: '', user: username, pass: password}, {headers: this.headers})
    .toPromise()
    .then(data => {
      loading.dismiss();
      // Dialogs.alert(JSON.stringify(data.json()[0]));
      if(data.json()[0].data == '1'){
        this.nativeStorage.setItem('localUser', {username: data.json()[0].user, status: true, id: data.json()[0].user_id})
      }else{
        this.dialogs.alert(this.globals.languages[this.globals.language][data.json()[0].error]);
      }
      return(data.json()[0].data);
    })
    .catch(error => {
      loading.dismiss();
      console.log(error);
      return(error);
    });
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  register(user){
    var go = true;
    var hasUpperCase = 0;
    var hasLowerCase = 0;
    var hasNumbers = 0;
    var hasNonalphas = 0;
    var error1 = "";
    if(user.password == undefined) user.password = "";
    if(user.username == undefined) user.username = "";
    hasUpperCase = /[A-Z]/.test(user.password) ? 1 : 0;
    hasLowerCase = /[a-z]/.test(user.password) ? 1 : 0;
    hasNumbers = /\d/.test(user.password) ? 1 : 0;
    // hasNonalphas = /\W/.test(user.password) ? 1 : 0;

    if(user.username.length < 4){
      error1 += (this.globals.languages[this.globals.language].error_shortusername + "\n");
      go = false;
    }
    if(!this.validateEmail(user.mail)){
      error1 += (this.globals.languages[this.globals.language].error_incorrectemail + "\n");
      go = false;
    }
    if(user.password.length < 8){
      error1 += (this.globals.languages[this.globals.language].error_shortpassword + "\n");
      go = false;
    }
    if(hasUpperCase + hasLowerCase + hasNumbers + hasNonalphas < 2){
      error1 += (this.globals.languages[this.globals.language].error_complexpassword + "\n");
      go = false;
    }
    if(user.password != user.password2){
      error1 += (this.globals.languages[this.globals.language].error_samepassword + "\n");
      go = false;
    }
    if(go){
      let loading = this.loadingCtrl.create({
        content: ''
      });
      loading.present();
      return this.http.post(this.globals.api_url, {action: 'register', user: user}, {headers: this.headers})
      .toPromise()
      .then(data => {
        loading.dismiss();
        // Dialogs.alert(JSON.stringify(data.json()[0]));
        if(data.json().data == '1'){
          this.nativeStorage.setItem('localUser', {username: data.json().username, status: true, id: data.json().user_id})
        }else{
          this.dialogs.alert(this.globals.languages[this.globals.language][data.json().error]);
        }
        return(data.json().data);
      })
      .catch(error => {
        loading.dismiss();
        console.log(error);
        return(error);
      });
    }else{
      this.dialogs.alert(error1);
    }
  }

  getUserMarkers(id){
    return this.http.post(this.globals.api_url, {action: 'getUserMarkers', user_id: id}, {headers: this.headers})
    .toPromise()
    .then(data => {
       return data.json();
    })
    .catch(error => {
      return(error);
    });
  }

  deleteMarker(id,audio){
    return this.http.post(this.globals.api_url, {action: 'deleteMarker', id: id, audio: audio}, {headers: this.headers})
    .toPromise()
    .then(data => {
      //
    }).catch(error => { return(error); });
  }

  getPeople(id){
    return this.http.post(this.globals.api_url, {action: 'getPeople', id: id}, {headers: this.headers})
    .toPromise()
    .then(data => {
       return data.json();
    })
    .catch(error => {
      return(error);
    });
  }

  editMarker(id, name, info){
    if(info.private == true){
      info.private = 1;
    }else if(info.private == false){
      info.private = 0;
    }
    return this.http.post(this.globals.api_url, {action: 'editMarker', id: id, name: name, private: info.private}, {headers: this.headers})
    .toPromise()
    .then(data => {
       return data.json();
    })
    .catch(error => {
      return(error);
    });
  }

  getPeopleMarker(id){
    return this.http.post(this.globals.api_url, {action: 'getPeopleMarker', id: id}, {headers: this.headers})
    .toPromise()
    .then(data => {
      return data.json();
    })
    .catch(error => {
      return(error);
    });
  }

  post(file:string, audio_name:string, file_name:string, lat?, lng?, post_text?:string){
    return this.http.post(this.globals.api_url, {action: 'post', id: this.globals.user_id, name:audio_name, audio: file_name, lat:lat, lng:lng, description:post_text}, {headers: this.headers})
    .timeout(1000)
    .toPromise()
    .then(data => {
      return data.json();
    })
    .catch(error => {
      console.log("account posting... "+error)
      return(error);
    });
  }

  getPosts(num?:number, order:string = "added", order2?:number, lat=0, lng=0){
    return this.http.post(this.globals.api_url, {action:'getPosts', num:num, order:order, order2:order2, lat:lat, lng:lng }, {headers: this.headers})
    .toPromise()
    .then(data => {
      return data.json();
    })
    .catch(error => {
      return(error);
    });
  }

  makePrivate(id, info){
    if(info.private == true){
      info.private = 1;
    }else if(info.private == false){
      info.private = 0;
    }
    return this.http.post(this.globals.api_url, {action: 'makePrivate', id: id, private: info.private}, {headers: this.headers})
    .toPromise()
    .then(data => {
       return data.json();
    })
    .catch(error => {
      return(error);
    });
  }

}
