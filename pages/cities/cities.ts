import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Platform, Events } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { SettingsPage } from '../settings/settings';
import { Insomnia } from '@ionic-native/insomnia';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
// import WaveSurfer from 'wavesurfer.js';
import { Dialogs } from '@ionic-native/dialogs';
import { GlobalProvider } from '../../providers/global-provider';
import { Brightness } from '@ionic-native/brightness';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Account } from '../../providers/account';
import { Geolocation } from '@ionic-native/geolocation';


@Component({
  selector: 'page-cities',
  templateUrl: 'cities.html'
})
export class CitiesPage {

  username: string = "";
  fast_rec: any;
  wave: any;
  audiocontext: any;
  currentBuffer: any;
  canvasWidth: any;
  canvasHeight: any;
  newCanvas: any;
  context: any;
  isFastRiff: boolean = false;
  rec: boolean = false;
  rec2: boolean = false;
  duration: number;
  hideStart: boolean;
  inter: any;
  color1: string;
  color2: string;
  color3: string;
  color4: string;
  color5: string;
  color6: string;
  color7: string;
  color8: string;
  color9: string;
  color_1: string;
  color_2: string;
  color_3: string;
  color_4: string;
  bg_color_2: string;
  bg_color_3: string;
  bg_color_4: string;
  file_url: string;
  file_name: string;
  audio_posted: boolean = false;
  audio_posted_finish: boolean = false;
  audio_name: string;
  posts: any;
  infinite:number = 0;
  lat: any;
  lng: any;
  audio: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    private nativeStorage: NativeStorage,
    private insomnia: Insomnia,
    private media: Media,
    private file: File,
    private dialogs: Dialogs,
    public globals: GlobalProvider,
    private events: Events,
    private brightness: Brightness,
    private transfer: FileTransfer,
    private account: Account,
    private geolocation: Geolocation
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
    this.color9 = globals.color9
    this.color_1 = globals.color_1
    this.color_2 = globals.color_2
    this.color_3 = globals.color_3
    this.color_4 = globals.color_4
    this.bg_color_2 = globals.bg_color_2
    this.bg_color_3 = globals.bg_color_3
    this.bg_color_4 = globals.bg_color_4

    this.nativeStorage.getItem('localUser').then(data => {
      this.username = data.username;
    })

    events.subscribe('changeTheme', (data) => {
      this.color1 = this.globals.color1
      this.color2 = this.globals.color2
      this.color3 = this.globals.color3
      this.color4 = this.globals.color4
      this.color5 = this.globals.color5
      this.color6 = this.globals.color6
      this.color7 = this.globals.color7
      this.color8 = globals.color8
      this.color9 = globals.color9
      this.color_1 = this.globals.color_1
      this.color_2 = this.globals.color_2
      this.color_3 = this.globals.color_3
      this.color_4 = this.globals.color_4
      this.bg_color_2 = this.globals.bg_color_2
      this.bg_color_3 = this.globals.bg_color_3
      this.bg_color_4 = this.globals.bg_color_4
    });

    this.getPosts();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CitiesPage');
  }

  openSettings() {
    this.navCtrl.push(SettingsPage);
  }

  fastRec() {
    this.audio_posted = false;
    this.isFastRiff = false;
    this.rec = false
    this.rec2 = true
    this.hideStart = true
    // this.fast_rec.release();
    document.getElementById("waveform").innerHTML = "";
    // this.waveContext()
    //cdvfile://localhost/persistent/record.m4a
    //this.file.dataDirectory + 'record.aac'
    //dev10n
    var url = this.file.dataDirectory

    // var name = 'record-'+this.username+'-'+Date.now()+'.m4a'
    // if (this.platform.is('android')) {
    //   url = this.file.externalDataDirectory
    //   name = 'record-'+this.username+'-'+Date.now()+'.aac'
    // }

    var name = 'record.m4a'
    if (this.platform.is('android')) {
      url = this.file.externalDataDirectory
      name = 'record.aac'
    }

    this.file_name = name;
    this.file_url = url;

    this.file.createFile(url, name, true).then(() => {
      this.fast_rec = this.media.create(url.replace(/^file:\/\//, '') + name);
      this.fast_rec.startRecord();
      var i = 0;
      var last_left = 0;
      var elw = (1)
      var totalw = document.getElementById("waveform").offsetWidth
      var waveform = document.getElementById("waveform")
      waveform.style.left = 0 + 'px'
      var scroll = 0;

      //intervallo con apiezza suono
      this.inter = window.setInterval(() => {
        this.fast_rec.getCurrentAmplitude().then((data) => {
          if (last_left > (totalw)) {
            scroll -= (elw + 1);
            waveform.style.left = scroll + 'px';
          }
          var left = (last_left) + 'px';
          last_left += (elw + 1);
          //onda superiore
          var node = document.createElement("div");
          node.className = "wave "+"wh"+"-bg-color-3"
          node.style.height = (data * 35) + 'px'
          node.style.left = left
          node.style.width = elw + 'px'
          document.getElementById('waveform').appendChild(node);
          //onda inferiore
          node = document.createElement("div")
          node.className = "wave-down wh-bg-color-2"
          node.style.height = (data * 15) + 'px'
          node.style.left = left
          node.style.width = elw + 'px'
          document.getElementById('waveform').appendChild(node);
          i++;
          this.duration = i;
        })
      }, 50)
      window.setTimeout(() => {
        // window.clearInterval(inter);
        // file.stopRecord()
        // window.setTimeout(()=>{
        //   this.fast_rec = file;
        //   // this.waveContext()
        //   this.rec = false;
        //   this.isFastRiff = true;
        // },100)
        this.stopRec();
      }, 30000); //fast riff of 5 secons
    });
  }

  stopRec() {
    this.rec = true;
    window.setTimeout(() => {
      window.clearInterval(this.inter);
      this.fast_rec.stopRecord()
      window.setTimeout(() => {
        // this.waveContext()
        this.rec = false;
        this.isFastRiff = true;
      }, 100)
    }, 500)
  }

  fastPlay() {
    // var filer;
    // this.file.readAsDataURL(this.file.tempDirectory, 'my_file.m4a').then(data=>{
    //   filer = data;
    // });
    // let file = this.media.create('./assets/music/feno.mp3');
    // wavesurfer.load('http://ia902606.us.archive.org/35/items/shortpoetry_047_librivox/song_cjrg_teasdale_64kb.mp3');
    // wavesurfer.play();
    var waveform = document.getElementById("waveform")
    var totalw = document.getElementById("waveform").offsetWidth
    waveform.style.left = totalw + 'px'
    let duration = (this.duration * 10) + 2000
    // var node = document.createElement("div")
    // node.className = "wave-current"
    // node.style.left = 0 + 'px'
    // waveform.appendChild(node);
    var last_left = 0
    var scroll = 0;
    var i = 0
    var scroll2 = totalw
    var inter = null

    this.fast_rec.play()

    // window.setTimeout(()=>{
    inter = window.setInterval(() => {
      this.fast_rec.getCurrentPosition().then((data) => {
        // console.log(data)
        // if(i < this.duration + 50){
        if (data >= 0) {
          if (last_left > (totalw)) {
            scroll -= (2)
            // console.log(scroll)
            waveform.style.left = scroll + 'px'
          } else {
            scroll2 -= 2
            waveform.style.left = scroll2 + 'px'
          }
          var left = last_left + 'px'
          last_left += 2
          // node.style.left = left
        }
        // }
        if (data < 0 && i > 50) {
          window.clearInterval(inter);
        }
      })
      i++
    }, 50)
    // },100)



    window.setTimeout(() => {

      // waveform.removeChild(node)
    }, 10000); //fast riff of 5 secons
  }

  waver() {
    // this.wave = WaveSurfer.create({
    //   container: '#waveform',
    //   waveColor: 'violet'
    // })
    //
    // this.wave.load('cdvfile://localhost/persistent/record.m4a');
  }

  waveContext() {
    // AUDIO CONTEXT
    this.audiocontext = new (window["AudioContext"] || window["webkitAudioContext"])();
    this.currentBuffer = null;

    // CANVAS
    // console.log(document.getElementById("recContainer").offsetWidth);
    this.canvasWidth = document.getElementById("recContainer").offsetWidth - 10
    this.canvasHeight = 50
    this.newCanvas = this.createCanvas(this.canvasWidth, this.canvasHeight);
    this.context = null;

    this.appendCanvas();

    this.loadMusic('cdvfile://localhost/persistent/record.m4a');
    // this.loadMusic('./assets/music/feno.mp3');
  }

  appendCanvas() {
    // document.body.appendChild(this.newCanvas);
    document.getElementById('waveform').appendChild(this.newCanvas);
    this.context = this.newCanvas.getContext('2d');

    var devicePixelRatio = window.devicePixelRatio || 1
    var backingStoreRatio = this.context.webkitBackingStorePixelRatio ||
    this.context.mozBackingStorePixelRatio ||
    this.context.msBackingStorePixelRatio ||
    this.context.oBackingStorePixelRatio ||
    this.context.backingStorePixelRatio || 1
    var ratio = devicePixelRatio / backingStoreRatio;

    if (window.devicePixelRatio > 1) {
      //dev10n
      var canvasWidth = this.newCanvas.width;
      var canvasHeight = this.newCanvas.height;

      this.newCanvas.width = canvasWidth * ratio
      this.newCanvas.height = canvasHeight * ratio
      this.newCanvas.style.width = canvasWidth + 'px'
      this.newCanvas.style.height = canvasHeight + 'px'
      this.context.scale(ratio, ratio);
    }
  }

  // MUSIC LOADER + DECODE
  loadMusic(url) {
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.responseType = "arraybuffer";
    req.onreadystatechange = (e) => {
      if (req.readyState == 4) {
        if (req.status == 200) {
          this.audiocontext.decodeAudioData(req.response,(buffer) => {
            this.currentBuffer = buffer;
            this.displayBuffer(buffer);
          }, this.onDecodeError);
        } else {
          this.dialogs.alert('error during the load. Wrong url or cross origin issue');
        }
      }
    }
    req.send()
  }

  onDecodeError() {
    this.dialogs.alert('error while decoding your file.');
  }

  // MUSIC DISPLAY
  displayBuffer2(buff /* is an AudioBuffer */) {
    var leftChannel = buff.getChannelData(0); // Float32Array describing left channel
    var lineOpacity = this.canvasWidth / leftChannel.length;

    this.context.save();
    this.context.fillStyle = '#222';
    this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.context.strokeStyle = '#121';
    this.context.globalCompositeOperation = 'lighter';
    this.context.translate(0, this.canvasHeight / 2);
    this.context.globalAlpha = 0.06; // lineOpacity ;
    for (var i = 0; i < leftChannel.length; i++) {
      // on which line do we get ?
      var x = Math.floor(this.canvasWidth * i / leftChannel.length);
      var y = leftChannel[i] * this.canvasHeight / 2;
      this.context.beginPath();
      this.context.moveTo(x, 0);
      this.context.lineTo(x + 1, y);
      this.context.stroke();
    }
    this.context.restore();
    console.log('done');
  }

  // MUSIC DISPLAY
  displayBuffer(buff /* is an AudioBuffer */) {
    var leftChannel = buff.getChannelData(0); // Float32Array describing left channel
    // we 'resample' with cumul, count, variance
    // Offset 0 : PositiveCumul  1: PositiveCount  2: PositiveVariance
    //        3 : NegativeCumul  4: NegativeCount  5: NegativeVariance
    // that makes 6 data per bucket
    var resampled = new Float64Array(this.canvasWidth * 6);
    var i = 0, j = 0, buckIndex = 0;
    var min = 1e3, max = -1e3;
    var thisValue = 0, res = 0;
    var sampleCount = leftChannel.length;
    // first pass for mean
    for (i = 0; i < sampleCount; i++) {
      // in which bucket do we fall ?
      buckIndex = 0 | (this.canvasWidth * i / sampleCount);
      buckIndex *= 6;
      // positive or negative ?
      thisValue = leftChannel[i];
      if (thisValue > 0) {
        resampled[buckIndex] += thisValue;
        resampled[buckIndex + 1] += 1;
      } else if (thisValue < 0) {
        resampled[buckIndex + 3] += thisValue;
        resampled[buckIndex + 4] += 1;
      }
      if (thisValue < min) min = thisValue;
      if (thisValue > max) max = thisValue;
    }
    // compute mean now
    for (i = 0, j = 0; i < this.canvasWidth; i++ , j += 6) {
      if (resampled[j + 1] != 0) {
        resampled[j] /= resampled[j + 1];;
      }
      if (resampled[j + 4] != 0) {
        resampled[j + 3] /= resampled[j + 4];
      }
    }
    // second pass for mean variation  ( variance is too low)
    for (i = 0; i < leftChannel.length; i++) {
      // in which bucket do we fall ?
      buckIndex = 0 | (this.canvasWidth * i / leftChannel.length);
      buckIndex *= 6;
      // positive or negative ?
      thisValue = leftChannel[i];
      if (thisValue > 0) {
        resampled[buckIndex + 2] += Math.abs(resampled[buckIndex] - thisValue);
      } else if (thisValue < 0) {
        resampled[buckIndex + 5] += Math.abs(resampled[buckIndex + 3] - thisValue);
      }
    }
    // compute mean variation/variance now
    for (i = 0, j = 0; i < this.canvasWidth; i++ , j += 6) {
      if (resampled[j + 1]) resampled[j + 2] /= resampled[j + 1];
      if (resampled[j + 4]) resampled[j + 5] /= resampled[j + 4];
    }
    this.context.save();
    this.context.fillStyle = '#fff';
    this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.context.translate(0.5, this.canvasHeight / 2);

    //dev10n
    this.context.scale(1, 200);
    // this.context.scale(1*window.devicePixelRatio, 200*window.devicePixelRatio);

    for (var i = 0; i < this.canvasWidth; i++) {
      j = i * 6;
      // draw from positiveAvg - variance to negativeAvg - variance
      this.context.strokeStyle = '#387ef5';
      this.context.beginPath();
      this.context.moveTo(i, (resampled[j] - resampled[j + 2]));
      this.context.lineTo(i, (resampled[j + 3] + resampled[j + 5]));
      this.context.stroke();

      // draw from positiveAvg - variance to positiveAvg + variance
      this.context.strokeStyle = '#222';
      this.context.beginPath();
      this.context.moveTo(i, (resampled[j] - resampled[j + 2]));
      this.context.lineTo(i, (resampled[j] + resampled[j + 2]));
      this.context.stroke();

      // draw from negativeAvg + variance to negativeAvg - variance
      // context.strokeStyle = '#222';
      this.context.beginPath();
      this.context.moveTo(i, (resampled[j + 3] + resampled[j + 5]));
      this.context.lineTo(i, (resampled[j + 3] - resampled[j + 5]));
      this.context.stroke();
    }
    this.context.restore();

    console.log('done 231 iyi');
  }

  createCanvas(w, h) {
    var newCanvas = document.createElement('canvas');
    newCanvas.width = w;
    newCanvas.height = h;
    return newCanvas;
  }

  getWave() {
    var waveform = document.getElementById("waveform")
    waveform.style.left = 0 + 'px'
    waveform.innerHTML = "";
    this.waveContext()
  }

  changeTheme() {
    this.globals.changeTheme("")
  }

  //funzione per postare
  post() {
    this.audio_posted = true;
    var coor = null;

    this.geolocation.getCurrentPosition().then((resp) => {
      coor = resp.coords;
      const fileTransfer: FileTransferObject = this.transfer.create();
      if(this.audio_name != null){
        this.audio_name = this.audio_name.replace(/\s/g, '');
      }

      var name = 'record-' + this.username + '-' + this.audio_name + '-' + Date.now() + '.m4a';

      if (this.platform.is('android')) {
        name = 'record-' + this.username + '-' + this.audio_name + '-' + Date.now() + '.aac';
      }

      let options: FileUploadOptions = {
        fileKey: 'file',
        fileName: name,
        headers: {}
      }

      fileTransfer.upload(this.file_url + this.file_name, this.globals.upload_url, options)
      .then((data) => {
        // console.log("### FILE UPLOADED ###");
        this.account.post(name, this.audio_name, name, coor.latitude, coor.longitude).then(data=>{
          // console.log(JSON.stringify(data))
          //dev10n
          this.audio_posted_finish = true;
          setTimeout(()=>{
            this.audio_posted_finish = false
            this.audio_posted = false
            this.audio_posted = false
            this.isFastRiff = false
            this.rec = false
            this.rec2 = false
            this.hideStart = true
          },3000)
        })
        .catch(err => {
          console.log("posting... "+JSON.stringify(err))
        });
      })
      .catch(err => {

      })
    }).catch((error) => {
      console.log('Error getting location', error);
    });

  }

  openMessages(){

  }

  refreshPage(e){
    this.infinite = 0;
    this.getPosts().then(data => {
      e.complete();
    });
  }

  doInfinite(e) {
    if(this.infinite < 0){
      e.complete();
      return 0
    }
    this.infinite += 5;
    this.account.getPosts(this.infinite,"added",5).then(data => {
      e.complete();
      if(data != ''){
        // this.getPostWave(data);
        for (let i in data) {
          this.posts.push(data[i]);
        }
      }else{
        this.infinite = -1;
      }
    });
  }

  getPosts(){
    return this.geolocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      return this.account.getPosts(0, "added", 5, this.lat, this.lng).then(data => {
        console.log(JSON.stringify(data))
        this.posts = data;
        // this.getPostWave(data);
        return data;
      });
    });
  }

  getPostWave(data){
    //audio
    for(let ii in data){
      if(data[ii].audio != null){
        data[ii].isaudio = true;
        setTimeout(()=>{
          //dev10n
          //this.waveContext(this.info.audio);
          this.audiocontext = new (window["AudioContext"] || window["webkitAudioContext"])();
          var req = new XMLHttpRequest();
          req.open("GET", 'http://hackweb.it/api/uploads/music/'+data[ii].audio, true);
          req.responseType = "arraybuffer";
          req.onreadystatechange = (e) => {
            if (req.readyState == 4) {
              if (req.status == 200) {
                this.audiocontext.decodeAudioData(req.response, (buffer) => {
                  var audioBuffer = buffer;
                  buffer = buffer.getChannelData(0);
                  var samplerate = audioBuffer.sampleRate; // store sample rate
                  var maxvals = [], max = 0;
                  var left_n = 10;
                  var totalw = (document.getElementById("start").offsetWidth - 20)/2;
                  var step = Math.ceil(buffer.length/totalw)
                  var max_amp = 50;
                  for (var i = 0; i < totalw; i++) {
                    var amp = Math.abs(buffer[Math.ceil(buffer.length/totalw)*i]);
                    amp = (amp);
                    var left = left_n + 'px'
                    left_n += (1 + 1);
                    //onda superiore
                    var node = document.createElement("div")
                    node.className = "wave wh-bg-color-3"
                    node.style.height = (amp * 60) + 'px'
                    node.style.left = left
                    node.style.width = 1 + 'px'
                    document.getElementById('waveform3-'+data[ii].id).appendChild(node);
                    //onda inferiore
                    node = document.createElement("div")
                    node.className = "wave-down wh-bg-color-2"
                    node.style.height = (amp * 25) + 'px'
                    node.style.left = left
                    node.style.width = 1 + 'px'
                    document.getElementById('waveform3-'+data[ii].id).appendChild(node);
                  }
                }, this.onDecodeError);
              } else {
                this.dialogs.alert('error during the load. Wrong url or cross origin issue');
              }
            }
          }
          req.send()

        },10)
      }
    }
    //audio -- end
  }

  getSingleWave(data){
    var x = document.getElementsByClassName("waveform3");
    var i;
    for (i = 0; i < x.length; i++) {
      x[i].innerHTML = "";
    }
    //audio
    setTimeout(()=>{
      //dev10n
      //this.waveContext(this.info.audio);
      this.audiocontext = new (window["AudioContext"] || window["webkitAudioContext"])();
      var req = new XMLHttpRequest();
      req.open("GET", 'http://hackweb.it/api/uploads/music/'+data.audio, true);
      req.responseType = "arraybuffer";
      req.onreadystatechange = (e) => {
        if (req.readyState == 4) {
          if (req.status == 200) {
            this.audiocontext.decodeAudioData(req.response, (buffer) => {
              var audioBuffer = buffer;
              buffer = buffer.getChannelData(0);
              var samplerate = audioBuffer.sampleRate; // store sample rate
              var maxvals = [], max = 0;
              var left_n = 10;
              var totalw = (document.getElementById('waveform3-'+data.id).offsetWidth - 20)/2;
              var step = Math.ceil(buffer.length/totalw)
              var max_amp = 50;
              for (var i = 0; i < totalw; i++) {
                var amp = Math.abs(buffer[Math.ceil(buffer.length/totalw)*i]);
                amp = (amp);
                var left = left_n + 'px'
                left_n += (1 + 1);
                //onda superiore
                var node = document.createElement("div")
                node.className = "wave wh-bg-color-3"
                node.style.height = (amp * 60) + 'px'
                node.style.left = left
                node.style.width = 1 + 'px'
                document.getElementById('waveform3-'+data.id).appendChild(node);
                //onda inferiore
                node = document.createElement("div")
                node.className = "wave-down wh-bg-color-2"
                node.style.height = (amp * 25) + 'px'
                node.style.left = left
                node.style.width = 1 + 'px'
                document.getElementById('waveform3-'+data.id).appendChild(node);
              }
            }, this.onDecodeError);
          } else {
            this.dialogs.alert('error during the load. Wrong url or cross origin issue');
          }
        }
      }
      req.send()

    },10)
    //audio -- end
  }

  audioPlay(data){
    this.getSingleWave(data);
    var file_link = 'http://hackweb.it/api/uploads/music/'+data.audio;
    const file: MediaObject = this.media.create(file_link);
    file.play();
  }

}
