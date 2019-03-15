import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { GlobalServiceProvider } from '../../providers/global-service/global-service';
import { LocationTracker } from '../../providers/location-tracker/location-tracker';
import { Toast } from '@ionic-native/toast';
import { ImagePicker } from '@ionic-native/image-picker';
import { Base64 } from '@ionic-native/base64';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Crop } from '@ionic-native/crop';
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  userName: any;
  userEmail: any;
  userImg: any;
  userCat: any
  uploadCertification: any;
  uploadCertificationType: any;
  pushNotification: any;
  userBankAccount: any = '';
  companyName: any;
  isPushEnable: any;
  userContactNo: any;
  profilePic: any;
  ProfilePicType: any;
  img: any;
  userBaseImg: any = '';
  upload_certification_type: any;
  upload_certification: any = '';
  certificate: any;
  isPushNotification: any;
  company_reg_no: any;
  isUserVarified: any;
  varifiedCap: any;
  btnText: any = 'Upload certificate and/or ACRA';
  certificateNme: any;
  certificateTxt: any;
  constructor(private crop: Crop, private photoViewer: PhotoViewer, public alertCtrl: AlertController, private base64: Base64, private imagePicker: ImagePicker, private camera: Camera, private toast: Toast, public globalservice: GlobalServiceProvider, public events: Events, public locationTracker: LocationTracker, public navCtrl: NavController, public navParams: NavParams) {
    sessionStorage.setItem('detailsPage', '');
     this.imagePicker.requestReadPermission();
    // this.getProfile();
    // this.userName = localStorage.getItem('userName');
    // this.userEmail = localStorage.getItem('userEmail');
    // this.userImg = localStorage.getItem('userImg');
    // this.company_reg_no = localStorage.getItem('companyReg');
    // this.userCat = localStorage.getItem('userCat');
    // this.uploadCertification = localStorage.getItem('uploadCertification');
    // this.certificate = this.uploadCertification.substr(this.uploadCertification.lastIndexOf('/') + 1);
    // this.isPushNotification = localStorage.getItem('pushNotification');

    // this.userContactNo = localStorage.getItem('contactno');
    // // alert(this.isPushNotification);
    // if (this.isPushNotification == 'Y') {
    //   this.isPushEnable = "true";
    // }
    // else {
    //   this.isPushEnable = "false";
    // }
    // this.userBankAccount = localStorage.getItem('userBankAccount');
    // if (this.userBankAccount == 'null' || this.userBankAccount == undefined) {
    //   this.userBankAccount = '';
    //   // alert('dd');
    // }
    // this.companyName = localStorage.getItem('companyName');
    // console.log('ionViewDidLoad ProfilePage');
  }

  ionViewDidLoad() {
    // this.userName = localStorage.getItem('userName');
    // this.userEmail = localStorage.getItem('userEmail');
    // this.userImg = localStorage.getItem('userImg');
    // this.company_reg_no = localStorage.getItem('companyReg');
    // this.userCat = localStorage.getItem('userCat');
    // this.uploadCertification = localStorage.getItem('uploadCertification');
    // this.certificate = this.uploadCertification.substr(this.uploadCertification.lastIndexOf('/') + 1);
    // this.isPushNotification = localStorage.getItem('pushNotification');
    // sessionStorage.setItem('detailsPage', '');
    // this.userContactNo = localStorage.getItem('contactno');
    // // alert(this.isPushNotification);
    // if (this.isPushNotification == 'Y') {
    //   this.isPushEnable = "true";
    // }
    // else {
    //   this.isPushEnable = "false";
    // }
    // this.userBankAccount = localStorage.getItem('userBankAccount');
    // if (this.userBankAccount == 'null' || this.userBankAccount == undefined) {
    //   this.userBankAccount = '';
    //   // alert('dd');
    // }
    // this.companyName = localStorage.getItem('companyName');
    // console.log('ionViewDidLoad ProfilePage');
  }
  ionViewWillEnter() {
    this.btnText='Upload certificate and/or ACRA';
    this.getProfile();
  }
// get details of user profile
  getProfile() {
    let loadingPop = this.globalservice.createLoadingBar();
    loadingPop.present();

    this.globalservice
      .getProfile(this.globalservice.serviceUrl + 'service-provider-profile-data', this.globalservice.deviceOs,
      this.globalservice.deviceOsVer,
      this.globalservice.appVertion,
      localStorage.getItem('memberId'),
      localStorage.getItem('sessionId'),
    )
      .subscribe(
      data => {
        console.log(JSON.stringify(data));
        loadingPop.dismiss();
        if (data.responseStatus.STATUS == 'SUCCESS') {
          this.isUserVarified = data.responseData.isVerified;
          if (this.isUserVarified == 'Verified') {
            this.varifiedCap = 'Yes';
          }
          else {
            this.varifiedCap = 'No';
          }
          this.userName = data.responseData.name;
          this.userEmail = data.responseData.email;
          this.userImg = data.responseData.profilePic;
          this.company_reg_no = data.responseData.companyRegNo;
          this.userCat = data.responseData.userCategory;
          this.uploadCertification = data.responseData.uploadCertification;
          //this.btnText = this.uploadCertification.substr(this.uploadCertification.lastIndexOf('/') + 1);
          this.certificateNme = this.uploadCertification.substr(this.uploadCertification.lastIndexOf('/') + 1);
          if (this.uploadCertification.substr(this.uploadCertification.lastIndexOf('.') + 1) == 'pdf') {
            this.certificateTxt = this.uploadCertification.substr(this.uploadCertification.lastIndexOf('/') + 1);
          }
          else {
            this.certificateTxt = 'View uploaded certificate';
          }
          this.isPushNotification = data.responseData.pushNotification;

          this.userContactNo = data.responseData.phone;
          if (this.isPushNotification == 'Y') {
            this.isPushEnable = true;
            //alert(this.isPushNotification);
          }
          else {
            this.isPushEnable = false;
          }
          this.userBankAccount = data.responseData.bankAccount;
          if (this.userBankAccount == 'null' || this.userBankAccount == undefined) {
            this.userBankAccount = '';
            // alert('dd');
          }
          this.companyName = data.responseData.companyName;
          localStorage.setItem('userImg', data.responseData.profilePic);
          localStorage.setItem('userName', data.responseData.name);
          //this.uploadCertification = data.responseData.uploadCertification;
          this.events.publish('user:profileUpdate', 'true');
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
  // update user profile
  updateProfile() {

    //  alert('flag'+this.isPushEnable);
    // alert('push'+this.isPushNotification);
    if (this.userName == undefined || this.userName == '' || this.userName.length > 100) {
      this.toast.show("Please enter name", '2000', 'bottom').subscribe(
        toast => {
          console.log(toast);
        });
    }
    // else if (this.userBankAccount == undefined || this.userBankAccount == '') {
    //   this.toast.show("Please enter Bank account number", '2000', 'bottom').subscribe(
    //     toast => {
    //       console.log(toast);
    //     });
    // }
    if (this.companyName == undefined || this.companyName == '' || this.companyName.length > 50) {
      this.toast.show('Please enrer company name', '2000', 'bottom').subscribe(
        toast => {
          console.log(toast);
        });
    }
    else if (this.company_reg_no == undefined || this.company_reg_no == '' || this.company_reg_no.length > 50) {
      this.toast.show('Please enter company Registration number', '2000', 'bottom').subscribe(
        toast => {
          console.log(toast);
        });
    }
    else if (this.userContactNo == undefined || this.userContactNo == '') {
      this.toast.show('Please enter contact number', '2000', 'bottom').subscribe(
        toast => {
          console.log(toast);
        });
    }
    else if (this.userContactNo.toString().length < 8) {
      this.toast.show('Contact number must be at least 8 digits with ISD code', '2000', 'bottom').subscribe(
        toast => {
          console.log(toast);
        });
    }
    else {

      if (this.isPushEnable == true) {
        this.isPushNotification = 'Y';
      }
      else {
        this.isPushNotification = 'N';
      }
      let loadingPop = this.globalservice.createLoadingBar();
      loadingPop.present();

      this.globalservice
        .profile(this.globalservice.serviceUrl + 'service-provider-profile-update', this.globalservice.deviceOs,
        this.globalservice.deviceOsVer,
        this.globalservice.appVertion,
        localStorage.getItem('memberId'),
        localStorage.getItem('sessionId'),
        this.userName,
        this.userContactNo,
        this.companyName,
        this.userBankAccount,
        encodeURIComponent(this.userBaseImg),
        this.ProfilePicType,
        encodeURIComponent(this.upload_certification),
        this.upload_certification_type,
        this.isPushNotification,
        this.company_reg_no)
        .subscribe(
        data => {
          console.log(JSON.stringify(data));
          loadingPop.dismiss();
          if (data.responseStatus.STATUS == 'SUCCESS') {

            localStorage.setItem('userImg', data.responseData.profilePic);
            localStorage.setItem('userName', data.responseData.name);
            localStorage.setItem('contactno', data.responseData.phone);
            localStorage.setItem('companyReg', data.responseData.companyRegNo);
            localStorage.setItem('uploadCertification', data.responseData.uploadCertification);
            localStorage.setItem('pushNotification', data.responseData.pushNotification);
            localStorage.setItem('userBankAccount', data.responseData.bankAccount);
            localStorage.setItem('companyName', data.responseData.companyName);
            this.uploadCertification = data.responseData.uploadCertification;
            //this.btnText = this.uploadCertification.substr(this.uploadCertification.lastIndexOf('/') + 1);
            this.btnText='Upload certificate and/or ACRA';
            this.events.publish('user:profileUpdate', 'true');
            this.toast.show(data.responseStatus.MESSAGE, '2000', 'bottom').subscribe(
              toast => {
                console.log(toast);
              });
            this.certificateNme = this.uploadCertification.substr(this.uploadCertification.lastIndexOf('/') + 1);
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
  ///////profile image upload/////////
  getImageSource() {

    let confirm = this.alertCtrl.create({
      title: 'Select an image from gallery or capture an image using camera.',
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
      //allowEdit: true,
      targetWidth: 800,
      targetHeight: 800,
    }
    this.camera.getPicture(options).then((imageData) => {
      // let base64Image = 'data:image/jpeg;base64,' + imageData;
      // this.userBaseImg = base64Image.split(',')[1];
      // console.log('profile pic' + this.userBaseImg);
      // this.userImg = base64Image;
      this.ProfilePicType = 'jpg';
      //this.ProfilePicType = imageData.substr(imageData.lastIndexOf('.') + 1);

      ////crop/////
      this.crop.crop(imageData, { quality: 60 })
        .then(
        newImage => {
          this.userImg = newImage;
          this.userBaseImg = newImage;
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
      quality: 40, // 0-100, default 100 which is highest quality
      width: 800,  // proportionally rescale image to this width, default no rescale
      height: 800, // same for height

    }
    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        console.log('Image URI: ' + results[i]);
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
        else {
          //this.ProfilePicType = results[i].substr(results[i].lastIndexOf('.') + 1);
          this.ProfilePicType = 'jpg';
          //sessionStorage.setItem('profImage_type', results[i].substr(results[i].lastIndexOf('.') + 1));
          // this.fileToBase64(results[i]);

          ////crop/////
          this.crop.crop(results[i], { quality: 100 })
            .then(
            newImage => {
              this.userImg = newImage;
              this.userBaseImg = newImage;
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
      this.userBaseImg = base64File.split(',')[1];
      console.log(base64File.split(',')[1])
      console.log(base64File);
    }, (err) => {
      console.log(err);
    });
  }

  ////////certificate upload////
  getImageSourceCer() {

    let confirm = this.alertCtrl.create({
      title: 'Select an image from gallery or capture an image using camera.',
      message: '',
      buttons: [
        {
          text: 'CAMERA',
          handler: () => {
            this.getCameraCer();
          }
        },
        {
          text: 'GALLERY',
          handler: () => {
            this.imgPickerCer();
          }
        }
      ]
    });
    confirm.present();
  }
  imgPickerCer() {
    let options = {
      maximumImagesCount: 1,
      quality: 40, // 0-100, default 100 which is highest quality
      width: 800,  // proportionally rescale image to this width, default no rescale
      height: 800, // same for height
    }
    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        //console.log('Image URI: ' + results[i]);
        //this.img=results[i];
        // this.fileToBase64Cer(results[i]);
        // this.upload_certification_type = results[i].substr(results[i].lastIndexOf('.') + 1);
        // this.certificate = results[i].substr(results[i].lastIndexOf('/') + 1);
        if (results[i].substr(results[i].lastIndexOf('.') + 1) == 'gif') {
          let alert = this.alertCtrl.create({
            title: 'iimafix',
            subTitle: '<strong>Image not supported, please choose another image.</strong>',
            buttons: [
              {
                text: 'OK',
                handler: data => {
                  this.getImageSourceCer();
                }
              }
            ]
          });
          alert.present();
        }
        else {
          this.upload_certification_type = results[i].substr(results[i].lastIndexOf('.') + 1);
          this.fileToBase64Cer(results[i]);
          this.btnText = results[i].substr(results[i].lastIndexOf('/') + 1);
        }
      }
    }, (err) => { });
  }
  fileToBase64Cer(path) {
    let filePath: string = path;
    this.base64.encodeFile(filePath).then((base64File: string) => {
      console.log(base64File);
      this.upload_certification = base64File.split(',')[1];

    }, (err) => {
      console.log(err);
    });
  }
  getCameraCer() {
    const options: CameraOptions = {
      quality: 40,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      targetWidth: 800,
      targetHeight: 800,
    }
    this.camera.getPicture(options).then((imageData) => {
      // alert(imageData);
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.fileToBase64Cer(imageData);
      this.upload_certification_type = imageData.substr(imageData.lastIndexOf('.') + 1);
      this.btnText = imageData.substr(imageData.lastIndexOf('/') + 1);
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
  // certificatePicker() {
  //   let options = {
  //     maximumImagesCount: 1, // Android only since plugin version 2.1.1, default no limit
  //     quality: 60, // 0-100, default 100 which is highest quality
  //     //width: 300,  // proportionally rescale image to this width, default no rescale
  //    // height: 300, // same for height
  //   }
  //   this.imagePicker.getPictures(options).then((results) => {
  //     for (var i = 0; i < results.length; i++) {
  //       console.log('Image URI: ' + results[i]);
  //       this.upload_certification_type = results[i].substr(results[i].lastIndexOf('.') + 1);
  //       this.certificateToBase64(results[i]);
  //       this.certificate = results[i].substr(results[i].lastIndexOf('/') + 1);
  //     }
  //   }, (err) => { });
  // }

  // certificateToBase64(path) {
  //   let filePath: string = path;
  //   this.base64.encodeFile(filePath).then((base64File: string) => {
  //     this.upload_certification = base64File.split(',')[1];
  //     console.log('certificate' + this.upload_certification);
  //   }, (err) => {
  //     console.log(err);
  //   });
  // }

  download() {
    let id = localStorage.getItem("catd_id");
    window.open(this.uploadCertification, '_system', 'location=yes');

  }
  openImg() {
    //alert(this.uploadCertification);
    if (this.uploadCertification.substr(this.uploadCertification.lastIndexOf('.') + 1) != 'pdf') {
      this.photoViewer.show(this.uploadCertification);
    }
    else {
      //alert('Pagla chulke ne');
    }

  }
  openProImg() {
    this.photoViewer.show(this.userImg);
  }
  ionViewDidLeave() {
    //alert('aaa');
    this.events.unsubscribe('user:profileUpdate');
    //alert('ddd');
  }
}
