import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { SettingsPage } from '../settings/settings';
import { Insomnia } from '@ionic-native/insomnia';
import { MediaPlugin, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
// import WaveSurfer from 'wavesurfer.js';
import { Dialogs } from '@ionic-native/dialogs';


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

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private nativeStorage: NativeStorage,
    private insomnia: Insomnia,
    private media: MediaPlugin,
    private file: File,
    private dialogs: Dialogs) {

    this.nativeStorage.getItem('localUser').then(
      data => {
        this.username = data.username;
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CitiesPage');
  }

  openSettings(){
    this.navCtrl.push(SettingsPage);
  }

  fastRec(){
    // this.file.createFile(this.file.tempDirectory, 'my_file.m4a', true).then(() => {
    //   let file = this.media.create(this.file.tempDirectory.replace(/^file:\/\//, '') + 'my_file.m4a');
    //   file.startRecord();
    //   window.setTimeout(() => file.stopRecord(), 5000);
    //   this.fast_rec = file;
    //   // console.log(" aa " + file.getDuration());
    // });
    this.isFastRiff = false;
    document.getElementById("waveform").innerHTML = "";
    this.file.createFile('cdvfile://localhost/persistent/', 'record.m4a', true).then(() => {
      let file = this.media.create('cdvfile://localhost/persistent/record.m4a');
      file.startRecord();
      window.setTimeout(() => {
        file.stopRecord()
        window.setTimeout(()=>{
          this.fast_rec = file;
          this.waveContext()
          this.isFastRiff = true;
        },100)
      }, 5000); //fast riff of 5 secons
    });
  }

  fastPlay(){
    // var filer;
    // this.file.readAsDataURL(this.file.tempDirectory, 'my_file.m4a').then(data=>{
    //   filer = data;
    // });
    // let file = this.media.create('./assets/music/feno.mp3');
    // wavesurfer.load('http://ia902606.us.archive.org/35/items/shortpoetry_047_librivox/song_cjrg_teasdale_64kb.mp3');
    // wavesurfer.play();
    this.fast_rec.play();
  }

  waver(){
    // this.wave = WaveSurfer.create({
    //   container: '#waveform',
    //   waveColor: 'violet'
    // })
    //
    // this.wave.load('cdvfile://localhost/persistent/record.m4a');
  }

  waveContext(){
    // AUDIO CONTEXT
    this.audiocontext = new (window["AudioContext"] || window["webkitAudioContext"])();
    this.currentBuffer  = null;

    // CANVAS
    this.canvasWidth = window.innerWidth; //document.getElementById("wavecontainer").offsetwidth
    this.canvasHeight = 80 ;
    this.newCanvas   = this.createCanvas(this.canvasWidth, this.canvasHeight);
    this.context     = null;

    this.appendCanvas();

    this.loadMusic('cdvfile://localhost/persistent/record.m4a');
  }

  appendCanvas() {
    // document.body.appendChild(this.newCanvas);
    document.getElementById('waveform').appendChild(this.newCanvas);
    this.context = this.newCanvas.getContext('2d');
  }

  // MUSIC LOADER + DECODE
  loadMusic(url) {
    var req = new XMLHttpRequest();
    req.open( "GET", url, true );
    req.responseType = "arraybuffer";
    req.onreadystatechange = (e) => {
      if (req.readyState == 4) {
        if(req.status == 200){
          this.audiocontext.decodeAudioData(req.response,
            (buffer)=>{
              this.currentBuffer = buffer;
              this.displayBuffer(buffer);
            },this.onDecodeError);
          }else{
            this.dialogs.alert('error during the load.Wrong url or cross origin issue');
          }
        }
      }
      req.send()
    }

    onDecodeError() {
      this.dialogs.alert('error while decoding your file.');
    }

    // MUSIC DISPLAY
    displayBuffer(buff /* is an AudioBuffer */) {
      var leftChannel = buff.getChannelData(0); // Float32Array describing left channel
      var lineOpacity = this.canvasWidth / leftChannel.length  ;
      this.context.save();
      this.context.fillStyle = '#222' ;
      this.context.fillRect(0,0,this.canvasWidth,this.canvasHeight );
      this.context.strokeStyle = '#121';
      this.context.globalCompositeOperation = 'lighter';
      this.context.translate(0,this.canvasHeight / 2);
      this.context.globalAlpha = 0.06 ; // lineOpacity ;
      for (var i=0; i<  leftChannel.length; i++) {
        // on which line do we get ?
        var x = Math.floor ( this.canvasWidth * i / leftChannel.length ) ;
        var y = leftChannel[i] * this.canvasHeight / 2 ;
        this.context.beginPath();
        this.context.moveTo( x  , 0 );
        this.context.lineTo( x+1, y );
        this.context.stroke();
      }
      this.context.restore();
      console.log('done');
    }


    createCanvas( w, h ) {
      var newCanvas = document.createElement('canvas');
      newCanvas.width  = w;
      newCanvas.height = h;
      return newCanvas;
    }

}
