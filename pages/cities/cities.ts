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
  rec: boolean = false;
  duration: number;

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
    this.rec = true
    // this.fast_rec.release();
    document.getElementById("waveform").innerHTML = "";
    // this.waveContext()
    this.file.createFile('cdvfile://localhost/persistent/', 'record.m4a', true).then(() => {
      let file = this.media.create('cdvfile://localhost/persistent/record.m4a');
      file.startRecord();
      var i = 0;
      var last_left = 0;
      var elw = (0.5)
      var totalw = document.getElementById("waveform").offsetWidth
      var waveform = document.getElementById("waveform")
      waveform.style.left = 0+'px'
      var scroll = 0;
      //interval
      var inter = window.setInterval(()=>{
        file.getCurrentAmplitude().then((data)=>{
          if(last_left>(totalw)){
            scroll -= (elw+1)
            // console.log(scroll)
            waveform.style.left = scroll + 'px'
          }
          var left = (last_left) + 'px'
          last_left+=(elw+1)
          var node = document.createElement("div")
          node.className = "wave"
          node.style.height = (data * 25) + 'px'
          node.style.left = left
          node.style.width = elw + 'px'
          document.getElementById('waveform').appendChild(node);
          //onda inferiore
          node = document.createElement("div")
          node.className = "wave-down"
          node.style.height = (data * 25) + 'px'
          node.style.left = left
          node.style.width = elw + 'px'
          document.getElementById('waveform').appendChild(node);
          i++;
          //dev10n
          this.duration = i;
        })
      },10)
      window.setTimeout(() => {
        window.clearInterval(inter);
        file.stopRecord()
        window.setTimeout(()=>{
          this.fast_rec = file;
          // this.waveContext()
          this.rec = false;
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
    var waveform = document.getElementById("waveform")
    var totalw = document.getElementById("waveform").offsetWidth
    waveform.style.left = totalw+'px'
    let duration = (this.duration *10)+2000
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
      inter = window.setInterval(()=>{
        this.fast_rec.getCurrentPosition().then((data)=>{
          if(i < this.duration){
            if(last_left>(totalw)){
              scroll -= (1.5)
              // console.log(scroll)
              waveform.style.left = scroll + 'px'
            }else{
              scroll2 -= 1.5
              waveform.style.left = scroll2 + 'px'
            }
            var left = last_left+'px'
            last_left+=1.5
            // node.style.left = left
            i++
          }
        })
      },10)
    // },100)



    window.setTimeout(() => {
      window.clearInterval(inter);
      // waveform.removeChild(node)
    },duration); //fast riff of 5 secons
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
    // console.log(document.getElementById("recContainer").offsetWidth);
    this.canvasWidth = document.getElementById("recContainer").offsetWidth - 10
    this.canvasHeight =  50
    this.newCanvas   = this.createCanvas(this.canvasWidth, this.canvasHeight);
    this.context     = null;

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

    // MUSIC DISPLAY
    displayBuffer(buff /* is an AudioBuffer */) {
      var leftChannel = buff.getChannelData(0); // Float32Array describing left channel
      // we 'resample' with cumul, count, variance
      // Offset 0 : PositiveCumul  1: PositiveCount  2: PositiveVariance
      //        3 : NegativeCumul  4: NegativeCount  5: NegativeVariance
      // that makes 6 data per bucket
      var resampled = new Float64Array(this.canvasWidth * 6 );
      var i=0, j=0, buckIndex = 0;
      var min=1e3, max=-1e3;
      var thisValue=0, res=0;
      var sampleCount = leftChannel.length;
      // first pass for mean
      for (i=0; i<sampleCount; i++) {
        // in which bucket do we fall ?
        buckIndex = 0 | ( this.canvasWidth * i / sampleCount );
        buckIndex *= 6;
        // positive or negative ?
        thisValue = leftChannel[i];
        if (thisValue>0) {
          resampled[buckIndex    ] += thisValue;
          resampled[buckIndex + 1] +=1;
        } else if (thisValue<0) {
          resampled[buckIndex + 3] += thisValue;
          resampled[buckIndex + 4] +=1;
        }
        if (thisValue<min) min=thisValue;
        if (thisValue>max) max = thisValue;
      }
      // compute mean now
      for (i=0, j=0; i<this.canvasWidth; i++, j+=6) {
        if (resampled[j+1] != 0) {
          resampled[j] /= resampled[j+1]; ;
        }
        if (resampled[j+4]!= 0) {
          resampled[j+3] /= resampled[j+4];
        }
      }
      // second pass for mean variation  ( variance is too low)
      for (i=0; i<leftChannel.length; i++) {
        // in which bucket do we fall ?
        buckIndex = 0 | (this.canvasWidth * i / leftChannel.length );
        buckIndex *= 6;
        // positive or negative ?
        thisValue = leftChannel[i];
        if (thisValue>0) {
          resampled[buckIndex + 2] += Math.abs( resampled[buckIndex] - thisValue );
        } else  if (thisValue<0) {
          resampled[buckIndex + 5] += Math.abs( resampled[buckIndex + 3] - thisValue );
        }
      }
      // compute mean variation/variance now
      for (i=0, j=0; i<this.canvasWidth; i++, j+=6) {
        if (resampled[j+1]) resampled[j+2] /= resampled[j+1];
        if (resampled[j+4]) resampled[j+5] /= resampled[j+4];
      }
      this.context.save();
      this.context.fillStyle = '#fff' ;
      this.context.fillRect(0,0,this.canvasWidth,this.canvasHeight );
      this.context.translate(0.5,this.canvasHeight / 2);

      //dev10n
      this.context.scale(1, 200);
      // this.context.scale(1*window.devicePixelRatio, 200*window.devicePixelRatio);

      for (var i=0; i< this.canvasWidth; i++) {
        j=i*6;
        // draw from positiveAvg - variance to negativeAvg - variance
        this.context.strokeStyle = '#387ef5';
        this.context.beginPath();
        this.context.moveTo( i  , (resampled[j] - resampled[j+2] ));
        this.context.lineTo( i  , (resampled[j +3] + resampled[j+5] ) );
        this.context.stroke();

        // draw from positiveAvg - variance to positiveAvg + variance
        this.context.strokeStyle = '#222';
        this.context.beginPath();
        this.context.moveTo( i  , (resampled[j] - resampled[j+2] ));
        this.context.lineTo( i  , (resampled[j] + resampled[j+2] ) );
        this.context.stroke();

        // draw from negativeAvg + variance to negativeAvg - variance
        // context.strokeStyle = '#222';
        this.context.beginPath();
        this.context.moveTo( i  , (resampled[j+3] + resampled[j+5] ));
        this.context.lineTo( i  , (resampled[j+3] - resampled[j+5] ) );
        this.context.stroke();
      }
      this.context.restore();

      console.log('done 231 iyi');
    }


    createCanvas( w, h ) {
      var newCanvas = document.createElement('canvas');
      newCanvas.width  = w;
      newCanvas.height = h;
      return newCanvas;
    }


    getWave(){
      var waveform = document.getElementById("waveform")
      waveform.style.left = 0+'px'
      waveform.innerHTML = "";
      this.waveContext()
    }

}
