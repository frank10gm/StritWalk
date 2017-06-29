import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController, Modal, AlertController, Platform, Events } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { NativeStorage } from '@ionic-native/native-storage';
import { GlobalProvider } from '../../providers/global-provider'
import { Account } from '../../providers/account';
import { Dialogs } from '@ionic-native/dialogs';

@Component({
    selector: 'modal-marker',
    templateUrl: 'marker.html'
})
export class Marker2 {

    //variables
    user: any = {};
    title: string = '';
    id: string = '';
    marker: any = {};
    info: any = {};
    info_initial: any = {};
    clicked_close: number = 0;
    modification: number = 0;
    creation: boolean = false;
    audiocontext: any;
    currentBuffer: any;
    canvasWidth: any;
    canvasHeight: any;
    newCanvas: any;
    context: any;
    post_button: any;

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


    constructor(params: NavParams,
        public viewCtrl: ViewController,
        public navCtrl: NavController,
        public globals: GlobalProvider,
        public account: Account,
        public alertCtrl: AlertController,
        public platform: Platform,
        private events: Events,
        private dialogs: Dialogs
    ) {
        //console.log('event: ', params.get('event'));
        this.title = params.get('name');
        this.id = params.get('id_marker');
        // document.getElementById('map').style.display = 'none';
        this.marker.name = this.title;
        this.marker.id = this.id;
        //backbutton
        platform.registerBackButtonAction(() => {
            console.log("ho schiacciato il back");
            if(this.clicked_close == 0){
                this.clicked_close = 1;
                this.closeModal();
            }
        });
        //test
        this.info = params.get('data');
        this.creation = this.info.creation;
        this.info_initial.private = params.get('data').private;
        if(this.info.private == 1){
            this.info.private = true;
        }else{
            this.info.private = false;
        }
        this.marker.info = this.info;

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

        //pulsanti
        if(this.info.creation){
            this.post_button = "Post";
        }else{
            this.post_button = "Save";
        }

    }

    ngAfterViewInit() {
        //audio
        if(this.info.audio != null){
            setTimeout(()=>{
                this.waveContext(this.info.audio);
            },10)
        }
        //audio -- end
    }

    closeModal() {

        if(this.info.creation == true){
            this.marker.action = "del";
            this.viewCtrl.dismiss(this.marker);
            return 0;
        }

        if(this.marker.name != this.title || this.info.private != this.info_initial.private || this.modification == 1){
            let alert = this.alertCtrl.create({
                title: 'Save this point',
                message: 'Do you want to save changes?',
                buttons: [
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');
                            this.info.private = this.info_initial.private;
                            // document.getElementById('map').style.display = 'block';
                            this.viewCtrl.dismiss(this.marker);
                        }
                    },
                    {
                        text: 'YES',
                        handler: () => {
                            this.saveAll().then(() => {
                                // document.getElementById('map').style.display = 'block';
                                this.viewCtrl.dismiss(this.marker);
                            });
                        }
                    }
                ]
            });
            alert.present();
        }else{
            // document.getElementById('map').style.display = 'block';
            this.viewCtrl.dismiss(this.marker);
        }
    }

    delete() {

        let alert = this.alertCtrl.create({
            title: 'Delete this point',
            message: 'Are you sure?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'YES',
                    handler: () => {
                        // document.getElementById('map').style.display = 'block';
                        this.marker.action = "del";
                        this.viewCtrl.dismiss(this.marker);
                    }
                }
            ]
        });
        alert.present();
    }

    saveMarker(){
        //dev10n
        if(this.info.creation == true){
            this.viewCtrl.dismiss(this.marker);
            this.saveAll();
            return 0;
        }

        let alert = this.alertCtrl.create({
            title: 'Save this point',
            message: 'Are you sure?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'YES',
                    handler: () => {
                        //document.getElementById('map').style.display = 'block';
                        this.saveAll();
                        this.viewCtrl.dismiss(this.marker);
                    }
                }
            ]
        });
        alert.present();
    }

    clearText(){
        this.marker.name = "";
        console.log("cancella testo");
    }

    saveAll(){
        return this.account.editMarker(this.id, this.marker.name, this.info).then(data => {
            console.log(JSON.stringify(data));
            this.title = this.marker.name;
            this.marker.action = "edit";
            this.marker.info = this.info;
            return 0;
        });
    }

    modify(){
        this.modification = 1;
    }

    //wave

    waveContext(audio) {
        // AUDIO CONTEXT
        this.audiocontext = new (window["AudioContext"] || window["webkitAudioContext"])();
        this.currentBuffer = null;

        // CANVAS
        // console.log(document.getElementById("recContainer2").offsetWidth);

        this.canvasWidth = document.getElementById("recContainer2").offsetWidth - 10
        // this.canvasWidth = 250
        this.canvasHeight = 50
        this.newCanvas = this.createCanvas(this.canvasWidth, this.canvasHeight);
        this.context = null;

        this.appendCanvas();

        this.loadMusic('http://hackweb.it/api/uploads/music/'+audio);
        // this.loadMusic('./assets/music/feno.mp3');
        // this.loadMusic('cdvfile://localhost/persistent/record.m4a');
    }

    createCanvas(w, h) {
        var newCanvas = document.createElement('canvas');
        newCanvas.width = w;
        newCanvas.height = h;
        return newCanvas;
    }

    appendCanvas() {

        // document.body.appendChild(this.newCanvas);
        document.getElementById('waveform2').appendChild(this.newCanvas);
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

    loadMusic(url) {
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.responseType = "arraybuffer";
    req.onreadystatechange = (e) => {
      if (req.readyState == 4) {
        if (req.status == 200) {
          this.audiocontext.decodeAudioData(req.response,
            (buffer) => {
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
          this.context.strokeStyle = '#333';
          this.context.beginPath();
          this.context.moveTo(i, (resampled[j] - resampled[j + 2]));
          this.context.lineTo(i, (resampled[j + 3] + resampled[j + 5]));
          this.context.stroke();

          // draw from positiveAvg - variance to positiveAvg + variance
          //   this.context.strokeStyle = '#222';
          //   this.context.beginPath();
          //   this.context.moveTo(i, (resampled[j] - resampled[j + 2]));
          //   this.context.lineTo(i, (resampled[j] + resampled[j + 2]));
          //   this.context.stroke();

          // draw from negativeAvg + variance to negativeAvg - variance
          // context.strokeStyle = '#222';
          //   this.context.beginPath();
          //   this.context.moveTo(i, (resampled[j + 3] + resampled[j + 5]));
          //   this.context.lineTo(i, (resampled[j + 3] - resampled[j + 5]));
          //   this.context.stroke();
      }
      this.context.restore();

      console.log('done 231 iyi');
  }
    //wave -- END

}
