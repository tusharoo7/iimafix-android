import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController } from 'ionic-angular';
import { StartPage } from '../start/start';
import { Validators, FormBuilder } from '@angular/forms';
import { GlobalServiceProvider } from '../../providers/global-service/global-service';
import { LocationTracker } from '../../providers/location-tracker/location-tracker';
import { Toast } from '@ionic-native/toast';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Http } from '@angular/http';
import { ServicePage } from '../service/service';
import { ImagePicker } from '@ionic-native/image-picker';
import { Base64 } from '@ionic-native/base64';
import { TabsPage } from '../tabs/tabs';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Events } from 'ionic-angular';
import { Crop } from '@ionic-native/crop';
@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  loadingPop: any = this.globalservice.createLoadingBar();
  socialId: any;
  user_image: any;
  user_image_type: any;
  img: any;
  fullName: any;

  constructor(private crop: Crop, public events: Events, private camera: Camera, public alertCtrl: AlertController, private base64: Base64, private imagePicker: ImagePicker, public locationTracker: LocationTracker, public menuCtrl: MenuController, public http: Http, private formBuilder: FormBuilder, private toast: Toast, public globalservice: GlobalServiceProvider, private fb: Facebook, public navCtrl: NavController, public navParams: NavParams) {
    this.img = 'assets/img/common_image.png';
    this.menuCtrl.enable(false);
     this.imagePicker.requestReadPermission();
    //this.locationTracker.startTracking();
    sessionStorage.setItem('profImage', '');

  }
  public signupForm = this.formBuilder.group({
    UserName: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    conf_pass: ['', Validators.required]
  });
  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }
  goLogin() {
    this.navCtrl.setRoot(StartPage);
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
  getCamera() {
    const options: CameraOptions = {
     quality: 40,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
       targetWidth:1024,
      targetHeight:1024
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      //let base64Image = 'data:image/jpeg;base64,' + imageData;
     // alert(imageData);
      // this.img = base64Image;
      // sessionStorage.setItem('profImage', base64Image.split(',')[1]);
      // sessionStorage.setItem('profImage_type', 'jpg');
      sessionStorage.setItem('profImage_type', 'jpg');
      ////crop/////
      this.crop.crop(imageData, { quality: 100 })
        .then(
        newImage => {
          this.img = newImage;
          this.fileToBase64(newImage);
          console.log('new image path is: ' + newImage)
        },
        error => console.error('Error cropping image', error)
        );
      ////end crop////

    }, (err) => {
      // Handle error
    });
  }

  imgPicker() {
    let options = {
      maximumImagesCount: 1, // Android only since plugin version 2.1.1, default no limit
      quality: 50, // 0-100, default 100 which is highest quality
      width: 1024,  // proportionally rescale image to this width, default no rescale
      height: 1024, // same for height
    }
    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        console.log('Image URI: ' + results[i]);
        // this.img = results[i];
        // sessionStorage.setItem('profImage_type', results[i].substr(results[i].lastIndexOf('.') + 1));
        // this.fileToBase64(results[i]);
        ////crop/////
        if (results[i].substr(results[i].lastIndexOf('.') + 1) == 'gif') {
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
        }
        else{
           this.crop.crop(results[i], { quality: 60 })
        .then(
        newImage => {
          this.img = newImage;
          //alert(newImage.substr(newImage.lastIndexOf('.') + 1));
          sessionStorage.setItem('profImage_type','jpg');
          this.fileToBase64(newImage);
          console.log('new image path is: ' + newImage)
        },
        error => console.error('Error cropping image', error)
        );
          ////end crop////
        }
      }
    }, (err) => { });
  }
  fileToBase64(path) {
    let filePath: string = path;
    this.base64.encodeFile(filePath).then((base64File: string) => {
      sessionStorage.setItem('profImage', base64File.split(',')[1]);
      // console.log(base64File.split(',')[1])
      console.log(base64File);
    }, (err) => {
      console.log(err);
    });
  }

  // used for image picking
  signup() {
    let email_regxp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.signupForm.value.UserName == undefined || this.signupForm.value.UserName == '' || this.signupForm.value.UserName.length > 100) {
      this.toast.show("Please enter name", '2000', 'bottom').subscribe(
        toast => {
          console.log(toast);
        });
    }
    else if (this.signupForm.value.email == undefined || this.signupForm.value.email == '') {
      this.toast.show("Please enter email", '2000', 'bottom').subscribe(
        toast => {
          console.log(toast);
        });
    }
    else if (!email_regxp.test(this.signupForm.value.email || this.signupForm.value.email.length > 100)) {
      this.toast.show("Invalid email", '2000', 'bottom').subscribe(
        toast => {
          console.log(toast);
        });
    }
    else if (this.signupForm.value.password == '' || this.signupForm.value.password == undefined) {
      this.toast.show("Please enter password", '2000', 'bottom').subscribe(
        toast => {
          console.log(toast);
        });
    }
    else if (this.signupForm.value.password.length < 6 || this.signupForm.value.email.length > 100) {
      this.toast.show("Use at least 6 characters for password", '2000', 'bottom').subscribe(
        toast => {
          console.log(toast);
        });
    }
    else if (this.signupForm.value.conf_pass != this.signupForm.value.password || this.signupForm.value.conf_pass == '') {
      this.toast.show("Password and confirm password not matching", '2000', 'bottom').subscribe(
        toast => {
          console.log(toast);
        });
    }
    else {
      sessionStorage.setItem('userName', this.signupForm.value.UserName);
      sessionStorage.setItem('email', encodeURIComponent(this.signupForm.value.email));
      sessionStorage.setItem('password', this.signupForm.value.password);
      sessionStorage.setItem('conf', this.signupForm.value.conf_pass);
      this.navCtrl.push(ServicePage);
    }
  }
  // get login data
  login(login_type) {
    let loadingPop = this.globalservice.createLoadingBar();
    // alert(this.signupForm.value.email);
    //  alert(login_type);
    // alert(this.globalservice.deviceId);
    // alert(this.globalservice.deviceOs);
    // alert(this.locationTracker.lat);
    // alert(this.locationTracker.lng);
    // alert(this.globalservice.deviceOsVer);

    if (login_type == 'G') {
      loadingPop.present();
    }
    this.globalservice
      .login(this.globalservice.serviceUrl + 'service-provider-login', this.signupForm.value.email, login_type, this.globalservice.deviceId, this.globalservice.deviceToken, this.globalservice.deviceOs, this.locationTracker.lat, this.locationTracker.lng, this.globalservice.simOperatorName, this.globalservice.deviceOsVer, this.globalservice.appVertion, '', this.globalservice.simSerialNo, this.socialId, this.globalservice.deviceModel, this.globalservice.deviceAndroidId, sessionStorage.getItem('macAddress'))
      .subscribe(
      data => {
        //alert("login" + JSON.stringify(data));

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
          loadingPop.dismiss();
          this.events.publish('user:login', 'true');
          if (login_type == 'F') {

            this.navCtrl.setRoot(TabsPage);
            // loadingPop.dismiss();

          }
          else {
            this.navCtrl.setRoot(TabsPage);
            //loadingPop.dismiss();
          }

        }
        else {
          loadingPop.dismiss();
          this.toast.show("Invalid credential.Try again", '2000', 'bottom').subscribe(
            toast => {
              this.fb.logout()
                .then((res: FacebookLoginResponse) => {
                  console.log('Logout from Facebook!', res);
                })
                .catch(e => console.log('Error logging into Facebook', e));
            });
        }
      },
      error => {
        console.log("login" + JSON.stringify(error));
        loadingPop.dismiss();
        this.fb.logout()
          .then((res: FacebookLoginResponse) => {
            console.log('Logout from Facebook!', res);
          })
          .catch(e => console.log('Error logging into Facebook', e));
        this.globalservice.errorMessage = <any>error
      });
  }
  fbLogin() {
    this.fb.login(['public_profile', 'user_friends', 'email'])
      .then((res: FacebookLoginResponse) => {
        // alert('Logged into Facebook!'+ JSON.stringify(res));
        this.fbApi();
      })
      .catch(e => alert('Error logging into Facebook' + e));
  }
  fbApi() {

    this.fb.api('me?fields=id,name,email,first_name,last_name,picture.width(100).height(100).as(picture_small),picture.width(720).height(720).as(picture_large)', [])
      .then((res) => {
        //alert(JSON.stringify(res));
        //this.f_name = res.first_name;
        //this.l_name = res.last_name;
        this.signupForm.value.email = res.email;
        if (res.email == '' || res.email == undefined || res.email == null) { /*if not return email id from FB */
          sessionStorage.setItem('emailFlag', 'true');
          this.socialId = res.id;
          this.fullName = res.name;
          this.checkUser('', this.socialId);
          //alert('ddd');
        }
        else {                                                                 /*if return email id from FB */
          sessionStorage.setItem('emailFlag', 'false');
          sessionStorage.setItem('email', res.email);
          this.signupForm.value.email = res.email;
          this.fullName = res.name;
          this.socialId = res.id;
          this.checkUser(res.email, this.socialId);
        }
        sessionStorage.setItem('fbImage', res.picture_large.data.url);
        //this.smallPic = res.picture_small.data.url;
        //this.largePic = res.picture_large.data.url;
      })
      .catch(e => {
        console.log('Error logging into Facebook', e);
        this.loadingPop.dismiss();
        this.toast.show('Error logging into Facebook,' + e, '2000', 'bottom').subscribe(
          toast => {
            console.log(toast);
          });
      });
  }
  // user already exist or not 
  checkUser(email, socialId) {
    //alert(email);
    this.loadingPop.present();
    this.globalservice
      .checkUsers(this.globalservice.serviceUrl + 'service-provider-already-exist', email, socialId, this.globalservice.deviceOsVer, this.globalservice.appVertion, this.globalservice.deviceOs)
      .subscribe(
      data => {
        //alert("check" + JSON.stringify(data));
        //alert('check');
        if (data.responseStatus.STATUS == 'SUCCESS') {

          if (data.responseData.exist == 'N') {
            //alert('notexists');      /*if new user*/
            this.loadingPop.dismiss();
            sessionStorage.setItem('userName', this.fullName);
            sessionStorage.setItem('socialId', this.socialId);
            //alert('insideCheck');
            this.navCtrl.push(ServicePage);
          }
          else {
            //alert('userexists');
            this.loadingPop.dismiss();                              /*if exists user*/
            this.signupForm.value.email = data.responseData.email;
            this.login('F');
          }
          //this.navCtrl.setRoot(TabsPage);
        }
        else {
          this.loadingPop.dismiss();
          this.toast.show("Invalid credential.Try again.", '2000', 'bottom').subscribe(
            toast => {
              this.fb.logout()
                .then((res: FacebookLoginResponse) => {
                  console.log('Logout from Facebook!', res);
                })
                .catch(e => console.log('Error logging into Facebook', e));
            });
        }
      },
      error => {
        //alert('dd');
        this.loadingPop.dismiss();
        this.fb.logout()
          .then((res: FacebookLoginResponse) => {
            console.log('Logout from Facebook!', res);
          })
          .catch(e => console.log('Error logging into Facebook', e));
        this.globalservice.errorMessage = <any>error
      });
  }
}
