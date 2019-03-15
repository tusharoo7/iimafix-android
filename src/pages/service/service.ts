import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController } from 'ionic-angular';
import { GlobalServiceProvider } from '../../providers/global-service/global-service';
import { LocationTracker } from '../../providers/location-tracker/location-tracker';
import { Toast } from '@ionic-native/toast';
import { SignupPage } from '../signup/signup';
import { ImagePicker } from '@ionic-native/image-picker';
import { Base64 } from '@ionic-native/base64';
import { TabsPage } from '../tabs/tabs';
import { Events } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { InAppBrowser } from '@ionic-native/in-app-browser';
@IonicPage()
@Component({
  selector: 'page-service',
  templateUrl: 'service.html',
})
export class ServicePage {
  //loadingPop: any = this.globalservice.createLoadingBar();
  category: any;
  services: any = [];
  socialId: any;
  user_image: any;
  user_image_type: any;
  UserName: any;
  mobile: any;
  company_name: any;
  certificate: any;
  upload_certification_type: any;
  upload_certification: any = '';
  fbFlag: any;
  signupType: any = 'G';
  email: any = '';
  profImg: any = '';
  company_reg_no: any;
  img: any;
  constructor(private iab: InAppBrowser,public alertCtrl: AlertController, private camera: Camera, public events: Events, private base64: Base64, private imagePicker: ImagePicker, private toast: Toast, public globalservice: GlobalServiceProvider, public locationTracker: LocationTracker, public menuCtrl: MenuController, public navCtrl: NavController, public navParams: NavParams) {

  }
  gosignup() {
    this.navCtrl.pop();
  }
  ionViewDidLoad() {
    if (sessionStorage.getItem('socialId') == null || sessionStorage.getItem('socialId') == '') {
      this.socialId = '';
      this.profImg = sessionStorage.getItem('profImage');
      this.email = sessionStorage.getItem('email');
      this.signupType = 'G';
    }
    else {
      this.socialId = sessionStorage.getItem('socialId');
      this.signupType = 'F';
      this.profImg = sessionStorage.getItem('fbImage');
      //this.profImg=encodeURIComponent(sessionStorage.getItem('profImage').split(',')[1]);
    }
    if (sessionStorage.getItem('emailFlag') == 'true') {
      this.fbFlag = 'true';

    }
    else {
      this.fbFlag = 'false';
      this.email = sessionStorage.getItem('email');
    }

    let loadingPop = this.globalservice.createLoadingBar();
    loadingPop.present();
    this.globalservice
      .serviceCategory(this.globalservice.serviceUrl + 'all-categories', this.globalservice.deviceOs, this.globalservice.deviceOsVer, '0.1')
      .subscribe(
      data => {
        console.log(data);
        //loadingPop.dismiss();
        if (data.responseStatus.STATUS == 'SUCCESS') {
          loadingPop.dismiss();
          this.category = data.responseData;
        }
        else {
          loadingPop.dismiss();
          this.toast.show("Invalid credential.Try again.", '2000', 'bottom').subscribe(
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
  updateService(event) {
    if (this.services.indexOf(event) == -1) {
      this.services.push(event);
    }
    else {
      this.services.splice(this.services.indexOf(event), 1);
    }
    //alert(this.services);

  }
  getImageSource() {

    let confirm = this.alertCtrl.create({
      title: 'Pick an image from gallery or capture an image using camera.',
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
  imgPicker() {
    let options = {
      maximumImagesCount: 1, // Android only since plugin version 2.1.1, default no limit
      quality: 40, // 0-100, default 100 which is highest quality
      width: 800,  // proportionally rescale image to this width, default no rescale
      height: 800, // same for height
    }
    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        if (results[i].substr(results[i].lastIndexOf('.') + 1) == 'gif') {
          let alert = this.alertCtrl.create({
            title: 'iimafix',
            subTitle: '<strong>Please upload a file must be an jpg image.</strong>',
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
        }
        else {
          this.upload_certification_type = results[i].substr(results[i].lastIndexOf('.') + 1);
          this.fileToBase64(results[i]);
          this.certificate = results[i].substr(results[i].lastIndexOf('/') + 1);
        }
        //console.log('Image URI: ' + results[i]);
        //this.img=results[i];
        // this.fileToBase64(results[i]);
        // this.upload_certification_type = results[i].substr(results[i].lastIndexOf('.') + 1);
        // this.certificate = results[i].substr(results[i].lastIndexOf('/') + 1);

      }
    }, (err) => { });
  }
  fileToBase64(path) {
    let filePath: string = path;
    this.base64.encodeFile(filePath).then((base64File: string) => {
      console.log(base64File);
      this.upload_certification = base64File.split(',')[1];
    }, (err) => {
      console.log(err);
    });
  }
  getCamera() {
    const options: CameraOptions = {
      quality: 40,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      targetWidth: 800,
      targetHeight: 800
    }
    this.camera.getPicture(options).then((imageData) => {
      // alert(imageData);
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.fileToBase64(imageData);
      this.upload_certification_type = imageData.substr(imageData.lastIndexOf('.') + 1);
      this.certificate = imageData.substr(imageData.lastIndexOf('/') + 1);
      // let base64Image = 'data:image/jpeg;base64,' + imageData;
      //alert(base64Image);
      //this.upload_certification = base64Image.split(',')[1];
      // this.upload_certification_type='jpg';
      // sessionStorage.setItem('profImage', base64Image.split(',')[1]);
      // sessionStorage.setItem('profImage_type', 'jpg');

    }, (err) => {
      // Handle error
    });
  }
  registration() {
    // if(sessionStorage.getItem('profImage')==null){
    //   sessionStorage.setItem('profImage','')
    // }
    // if(this.upload_certification==undefined){
    //   this.upload_certification='';
    // }
    // alert(this.email);
    // alert(this.globalservice.deviceId);
    // alert(this.globalservice.deviceOs);
    // alert(this.locationTracker.lat);
    // alert(this.locationTracker.lng);
    // alert(this.globalservice.deviceOsVer);
    // alert(sessionStorage.getItem('password'));
    // alert(sessionStorage.getItem('conf'));
    //  alert(this.socialId);
    // alert(sessionStorage.getItem('profImage'));
    // alert(sessionStorage.getItem('profImage_type'));
    // alert( this.signupType);
    // alert(sessionStorage.getItem('userName'));
    // alert(this.mobile);
    // alert(this.company_name);
    // alert(this.upload_certification);
    // alert(this.upload_certification_type);
    // alert(this.upload_certification.split(',')[1])
    // alert(this.services);
    if (this.company_name == undefined) {
      this.company_name = '';
    }

    if (this.company_name == '' || this.company_name == undefined || this.company_name.length > 50) {
      this.toast.show('Please enter company name', '2000', 'bottom').subscribe(
        toast => {
          console.log(toast);
        });
    }
    else if (this.company_reg_no == undefined || this.company_reg_no == '' || this.company_reg_no.length > 50) {
      this.toast.show('Please enter company registration number', '2000', 'bottom').subscribe(
        toast => {
          console.log(toast);
        });
    }
    else if (this.mobile == undefined || this.mobile == '') {
      this.toast.show('Please enter contact number', '2000', 'bottom').subscribe(
        toast => {
          console.log(toast);
        });
    }
    else if (this.mobile.toString().length < 8) {
      this.toast.show('Contact number must be at least 8 digits with ISD code', '2000', 'bottom').subscribe(
        toast => {
          console.log(toast);
        });
    }
    else if (this.services == '') {
      this.toast.show('Select atleast one service', '2000', 'bottom').subscribe(
        toast => {
          console.log(toast);
        });
    }
    else if (this.services != '' && this.mobile == undefined) {
      this.toast.show('Please enter mobile number', '2000', 'bottom').subscribe(
        toast => {
          console.log(toast);
        });
    }
    //  else if (this.services == ''&& this.mobile != undefined) {
    //   this.toast.show('All fields are blank and Clicked on Joined Now.', '2000', 'bottom').subscribe(
    //     toast => {
    //       console.log(toast);
    //     });
    // }
    else {
      let loadingPop = this.globalservice.createLoadingBar();
      loadingPop.present();
      this.globalservice.signup(
        this.globalservice.serviceUrl + 'service-provider-registration',
        this.email,
        this.signupType,
        this.globalservice.deviceId,
        this.globalservice.deviceToken,
        this.globalservice.deviceOs,
        this.locationTracker.lat,
        this.locationTracker.lng,
        this.globalservice.simOperatorName,
        this.globalservice.deviceOsVer,
        this.globalservice.appVertion,
        sessionStorage.getItem('password'),
        this.globalservice.simSerialNo,
        sessionStorage.getItem('conf'),
        this.socialId,
        encodeURIComponent(this.profImg),
        //'',
        sessionStorage.getItem('profImage_type'),
        sessionStorage.getItem('userName'),
        this.mobile,
        this.company_name,
        encodeURIComponent(this.upload_certification),
        this.upload_certification_type,
        this.services,
        this.globalservice.deviceModel,
        this.globalservice.deviceAndroidId,
        sessionStorage.getItem('macAddress'),
        this.company_reg_no)
        .subscribe(
        data => {
          console.log(JSON.stringify(data));
          //loadingPop.dismiss();
          if (data.responseStatus.STATUS == 'SUCCESS') {
            localStorage.setItem('memberId', data.responseData.userId);
            localStorage.setItem('sessionId', data.responseData.sessionId);
            localStorage.setItem('userName', data.responseData.userName);
            localStorage.setItem('userEmail', data.responseData.userEmail);
            localStorage.setItem('userImg', data.responseData.profilePic);
            localStorage.setItem('contactno', data.responseData.userPhone);
            localStorage.setItem('userCat', data.responseData.userCategory);
            localStorage.setItem('uploadCertification', data.responseData.uploadCertification);
            localStorage.setItem('pushNotification', data.responseData.pushNotification);
            localStorage.setItem('userBankAccount', data.responseData.userBankAccount);
            localStorage.setItem('companyName', data.responseData.userCompanyName);
            localStorage.setItem('companyReg', data.responseData.userCompanyRegNo);
            this.events.publish('user:signup', 'true');
            sessionStorage.setItem('userName', '');
            sessionStorage.setItem('emailFlag', 'false');
            sessionStorage.setItem('email', '');
            sessionStorage.setItem('socialId', '');
            this.email = '';
            this.socialId = '';
            this.navCtrl.setRoot(TabsPage);
            loadingPop.dismiss();
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
   openLink(link){
    this.iab.create(link,'_self',{location:'yes'}); 
  }
}
