import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker';
import { Base64 } from '@ionic-native/base64';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { GlobalServiceProvider } from '../../providers/global-service/global-service';
import { ToastController } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
//import { DatePicker } from 'ionic2-date-picker';
import { DatePickerProvider } from 'ionic2-date-picker';
import { ViewController, ModalController } from 'ionic-angular';
import { DatePickerOption } from 'ionic2-date-picker';

import { HomePage } from '../home/home';
@IonicPage()
@Component({
  selector: 'page-job-details-submit',
  templateUrl: 'job-details-submit.html',
  //providers: [DatePicker]
})
export class JobDetailsSubmitPage {
  img: any;
  imgData: any = [];
  imgDataView: any = [];
  f_type: any;
  remark: any="";
  jobStatus: any;
  myDate: any = 'Date';
  selectedDate: String = new Date().toISOString();
  myTime: any;
  descrpn: any;
  price: any;
  adjustedTime: any;
  today: any;
  dateFlag: any = 'false';
  cashrecived:any ;
  //modalCtrl:any;
  //viewController:any;
  paymentmode:any
  jobdetailssubmitjson:any
  constructor(public toastCtrl: ToastController,public modalCtrl: ModalController, public viewCtrl: ViewController, private datePickerProvider: DatePickerProvider, public events: Events, private toast: Toast, public globalservice: GlobalServiceProvider, public navCtrl: NavController, public navParams: NavParams, private camera: Camera, private base64: Base64, private imagePicker: ImagePicker, public alertCtrl: AlertController) {
    // //this.myDate = new Date();
    // //  this.today.setDate(30).toISOString();
    // // alert(today);

    // this.datePicker = new DatePicker(<any>this.modalCtrl, <any>this.viewCtrl);
    // this.datePicker.onDateSelected.subscribe((date) => {
    //   this.dateFlag = 'true';
    //   let TempDate = new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString().substring(0, 10);
    //   let day=TempDate.split('-')[2];
    //   let month=TempDate.split('-')[1];
    //   let year=TempDate.split('-')[0];
    //  // alert(TempDate.split('-')[0]);
    //   //alert(this.myDate.split('-')[1]);
    //   //alert(this.myDate.split('-')[2]);
    //    this.myDate=day.concat('/').concat(month).concat('/').concat(year);
    //   //alert(day.split('-')[2].concat('/').concat(month.split('-')[1]).concat('/').concat(year.split('-')[0]));
    //   //alert(this.myDate.substring(0, 10));

    //   // alert(this.myDate.getDate());
    //   //alert(this.myDate.getFullYear);
    //   //alert(this.myDate.getMonth);
    //   //alert(date);
    // });
   // this.cashrecived=0;
    this.jobStatus = sessionStorage.getItem('status');
    this.paymentmode = sessionStorage.getItem('paymentmode');
    if (this.jobStatus != 'pending') {
      this.myDate = '';
      this.adjustedTime = '';
      this.descrpn = '';
      this.price = '';
    }
    else {
      this.price = '';
    }

  }
  // showCalendar() {
  //   let datePickerOption: DatePickerOption = {
  //     minimumDate: new Date() // the minimum date selectable
  //   };
  //   this.datePicker.showCalendar(datePickerOption);
  // }
  // dispaly calender
   showCalendar() {
     let datePickerOption: DatePickerOption = {
      minimumDate: new Date() // the minimum date selectable
      //maximumDate: new Date() // the maximum date selectable
};
    let dateSelected =
      this.datePickerProvider.showCalendar(this.modalCtrl,datePickerOption);
    dateSelected.subscribe(date => {
    // alert(date);
      this.dateFlag = 'true';
      let TempDate = new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString().substring(0, 10);
      let day=TempDate.split('-')[2];
      let month=TempDate.split('-')[1];
      let year=TempDate.split('-')[0];
      this.myDate=day.concat('/').concat(month).concat('/').concat(year);
    });
  }
  ionViewDidLoad() {
    //this.datePicker.showCalendar();
    console.log('ionViewDidLoad JobDetailsSubmitPage');
  }
// get image source from mobile
  getImageSource() {

    let confirm = this.alertCtrl.create({
      title: 'Pick images from gallery or capture images using camera.',
      message: '',
      buttons: [
        {
          text: 'CAMERA',
          handler: () => {
            this.getCamera();
          }
        },
        {
          text: 'GALLERY',
          handler: () => {
            this.imgPicker();
          }
        }
      ]
    });
    confirm.present();
  }
  // operate the camera
  getCamera() {
    const options: CameraOptions = {
      quality: 30,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      targetWidth:800,
      targetHeight:800
    }
    this.camera.getPicture(options).then((imageData) => {
      if (this.imgData.length < 5) {
        let base64Image = 'data:image/jpeg;base64,' + imageData;
        this.img = base64Image;
        this.imgDataView.push({ "img": this.img });
        //sessionStorage.setItem('profImage', base64Image.split(',')[1]);
        //sessionStorage.setItem('profImage_type', 'jpg');
        this.imgData.push({ "img": encodeURIComponent(base64Image.split(',')[1]), "fileType": 'jpg' });
      }
      else {
        let alert = this.alertCtrl.create({
          title: 'Oops! You cannot select more than 5 images.',
          message: '',
          buttons: [
            {
              text: 'Ok',
            }
          ]
        });
        alert.present();
      }
    }, (err) => {
      // Handle error
    });

  }
  // pick image form  mobile
  imgPicker() {
    let options = {
      maximumImagesCount: 5 - this.imgData.length, // Android only since plugin version 2.1.1, default no limit
      quality: 30, // 0-100, default 100 which is highest quality
      width: 800,  // proportionally rescale image to this width, default no rescale
      height: 800, // same for height
    }
    this.imagePicker.getPictures(options).then((results) => {
      if (this.imgData.length < 5) {
        for (var i = 0; i < results.length; i++) {
          // alert('Image URI: ' + results[i]);
          if( results[i].substr(results[i].lastIndexOf('.') + 1)=='gif'){

             let alert = this.alertCtrl.create({
            title: 'iimafix',
            subTitle: '<strong>Image not supported, please choose another image.</strong>',
            buttons: [
              {
                text: 'OK',
                handler: data => {
                  this.getImageSource();
                }
              }
            ]
          });
          alert.present();
            break;
          }
          else{
             this.img = results[i];
          this.imgDataView.push({ "img": this.img });
          sessionStorage.setItem('profImage_type', results[i].substr(results[i].lastIndexOf('.') + 1));
          this.f_type = results[i].substr(results[i].lastIndexOf('.') + 1);
          this.fileToBase64(results[i]);
          }

        }
      }
      else {
        let alert = this.alertCtrl.create({
          title: 'Oops!You can not select more then 5 images.',
          message: '',
          buttons: [
            {
              text: 'Ok',
            }
          ]
        });
        alert.present();
      }
    }, (err) => { });
  }
  // convert file to base 64
  fileToBase64(path) {
    //alert('o');
    let filePath: any = path;
    this.base64.encodeFile(filePath).then((base64File: any) => {
      //sessionStorage.setItem('profImage', base64File.split(',')[1]);
      console.log(base64File);
      this.imgData.push({ "img": encodeURIComponent(base64File.split(',')[1]), "fileType": this.f_type });
      console.log(this.imgData);
    }, (err) => {
      console.log(err);
    });
  }

  // convert the time into am and pm format
  tConvert(time) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice(1);  // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours

    }
    this.adjustedTime = time.join('');
    console.log(this.adjustedTime);
    //alert(time.join(''));
    //return time.join (''); // return adjusted time or original string

  }

  // final service submit
  serviceDetailsSubmit() {

    if (this.adjustedTime) {
      this.tConvert(this.adjustedTime);
    }
    console.log(this.paymentmode)
    if (this.imgData.length < 1) {
      this.sendalertmessage('bottom','Please upload atleast one image' );

    }

    else if (this.jobStatus == 'pending' && this.myDate == 'Date' || this.jobStatus == 'pending' && this.myDate == '' || this.jobStatus == 'pending' && this.myDate == undefined) {
      this.sendalertmessage('bottom','Please select job date' );

    }
    else if (this.jobStatus == 'pending' && this.adjustedTime == '' || this.jobStatus == 'pending' && this.adjustedTime == undefined) {
      this.sendalertmessage('bottom','Please select job time' );

    }
    else if (this.jobStatus == 'pending' && this.descrpn == '' || this.jobStatus == 'pending' && this.descrpn == undefined) {
      this.sendalertmessage('bottom','Job description should not be blank' );
    }
    else if(this.jobStatus!='notComplete' && this.paymentmode=='COD')
    {
      console.log(this.cashrecived)
      if(this.cashrecived==undefined ||  this.cashrecived=="")
      {
        this.sendalertmessage('bottom','Please enter  amount' );

      }
      else if(this.cashrecived!=undefined &&  this.cashrecived!="" && !new RegExp("^[0-9]+(\.[0-9]{1,2})?$").test(this.cashrecived))
      {
        this.sendalertmessage('bottom','Please enter  valid amount');

      }
      else if(this.cashrecived=='0' || this.cashrecived=="0" || this.cashrecived==0 )
      {
        this.sendalertmessage('bottom','Please enter amount which is greater then zero');
      }
      else{
                this.jobdetailssubmitjson = {
                                              'deviceOs' : this.globalservice.deviceOs,
                                              'deviceOsVer':   this.globalservice.deviceOsVer,
                                              'appVertion':   this.globalservice.appVertion,
                                              'memberId' :   localStorage.getItem('memberId'),
                                              'sessionId' :   localStorage.getItem('sessionId'),
                                              'rqstId' :  sessionStorage.getItem('rqstId'),
                                              'imgData'  : JSON.stringify(this.imgData),
                                                //'testing',
                                              'remark' : this.remark,
                                              'cashrecived' : this.cashrecived,
                                              'jobStatus':  this.jobStatus,
                                              'myDate' : this.myDate,
                                              'adjustedTime':  this.adjustedTime,
                                              'descrpn' : this.descrpn,
                                              'price' :  this.price
                                           }
                                           console.log(this.jobdetailssubmitjson)
                                           let loadingPop = this.globalservice.createLoadingBar();
                                          loadingPop.present();
                                          this.globalservice
                                            .jobDetailsSubmit(this.globalservice.serviceUrl + 'service-report-submit', this.jobdetailssubmitjson)
                                            .subscribe(
                                              data => {
                                                console.log(JSON.stringify(data));
                                                loadingPop.dismiss();
                                                if (data.responseStatus.STATUS == 'SUCCESS') {
                                                  console.log("test root");
                                                  this.toast.show(data.responseStatus.MESSAGE, '2000', 'bottom').subscribe(
                                                    toast => {
                                                      console.log("test root home");
                                                      this.navCtrl.popToRoot();
                                                      // this.events.publish('details:updated', 'true');
                                                      //  this.navCtrl.setRoot(HomePage);
                                                    });
                                                }
                                                else {
                                                  loadingPop.dismiss();
                                                  this.toast.show(data.responseStatus.MESSAGE, '2000', 'bottom').subscribe(
                                                    toast => {
                                                      console.log(toast);
                                                    });
                                                }
                                              },
                                              error => {
                                                loadingPop.dismiss();
                                                this.globalservice.errorMessage = <any>error
                                              });
          }
    }
    else
    {
         if(this.cashrecived==undefined || this.cashrecived=="" )
            {
              this.cashrecived=0;
            }
            this.jobdetailssubmitjson = {
                                    'deviceOs' : this.globalservice.deviceOs,
                                    'deviceOsVer':   this.globalservice.deviceOsVer,
                                    'appVertion':   this.globalservice.appVertion,
                                    'memberId' :   localStorage.getItem('memberId'),
                                    'sessionId' :   localStorage.getItem('sessionId'),
                                    'rqstId' :  sessionStorage.getItem('rqstId'),
                                    'imgData'  : JSON.stringify(this.imgData),
                                      //'testing',
                                    'remark' : this.remark,
                                    'cashrecived' : this.cashrecived,
                                    'jobStatus':  this.jobStatus,
                                    'myDate' : this.myDate,
                                    'adjustedTime':  this.adjustedTime,
                                    'descrpn' : this.descrpn,
                                    'price' :  this.price
                                 }
       console.log(this.jobdetailssubmitjson)

       let loadingPop = this.globalservice.createLoadingBar();
      loadingPop.present();
      this.globalservice
        .jobDetailsSubmit(this.globalservice.serviceUrl + 'service-report-submit',  this.jobdetailssubmitjson)
        .subscribe(
        data => {
          console.log(JSON.stringify(data));
          loadingPop.dismiss();
          if (data.responseStatus.STATUS == 'SUCCESS') {
            console.log("test root");
            this.toast.show(data.responseStatus.MESSAGE, '2000', 'bottom').subscribe(
              toast => {
                console.log("test root home");
                this.navCtrl.popToRoot();
                // this.events.publish('details:updated', 'true');
              //  this.navCtrl.setRoot(HomePage);
              });
          }
          else {
            loadingPop.dismiss();
            this.toast.show(data.responseStatus.MESSAGE, '2000', 'bottom').subscribe(
              toast => {
                console.log(toast);
              });
          }
        },
        error => {
          loadingPop.dismiss();
          this.globalservice.errorMessage = <any>error
        });
    }

      // console.log('else block'+this.cashrecived);




  }
  // remove selected image
  removeImg(index) {
    // alert(index);
    // alert(this.imgDataView.length);
    //  alert(this.imgData.length);
    this.imgDataView.splice(index, 1);
    this.imgData.splice(index, 1);
  }
// used for toast message display
  sendalertmessage(position: string,message: string)
  {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: position
    });

    toast.present(toast);
  }
}
