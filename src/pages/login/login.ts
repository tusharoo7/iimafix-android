import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { StartPage } from '../start/start';
import { GlobalServiceProvider } from '../../providers/global-service/global-service';
import { LocationTracker } from '../../providers/location-tracker/location-tracker';
import { Toast } from '@ionic-native/toast';
import { Validators, FormBuilder } from '@angular/forms';
import { Http } from '@angular/http';
//import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';
import { ForgotPassPage } from '../forgot-pass/forgot-pass';
import { ServicePage } from '../service/service';
import { Events } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  f_name: any;
  l_name: any;
  email_id: any;
  fullName: any;
  smallPic: any;
  largePic: any;
  socialId: any;
  //loadingPop: any = this.globalservice.createLoadingBar();
  constructor(public toastCtrl: ToastController ,public events: Events, public locationTracker: LocationTracker, public menuCtrl: MenuController, public http: Http, private formBuilder: FormBuilder, private toast: Toast, public globalservice: GlobalServiceProvider, private fb: Facebook, public navCtrl: NavController, public navParams: NavParams) {
    this.menuCtrl.enable(false);
   // this.locationTracker.startTracking();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.locationTracker.getLocation();
  }

  public loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
  back() {
    this.navCtrl.setRoot(StartPage);
  }
  // used for login
  login(login_type) {
    let email_regxp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // alert(this.loginForm.value.email);
    // alert(login_type);
    // alert(this.globalservice.deviceId);
    // alert(this.globalservice.deviceOs);
    // alert(this.locationTracker.lat);
    // alert(this.locationTracker.lng);
    // alert(this.globalservice.deviceOsVer);
    // alert(this.globalservice.deviceToken);
    // alert(this.globalservice.appVertion);
    // alert(this.loginForm.value.password);
    // alert(this.globalservice.deviceAndroidId);
    // alert(sessionStorage.getItem('macAddress'));
    if (this.globalservice.deviceToken == null) {
      this.globalservice.deviceToken = localStorage.getItem('device_token');
    }

    if (this.loginForm.value.email == undefined || this.loginForm.value.email == '') {
      this.toast.show("Please enter email", '2000', 'bottom').subscribe(
        toast => {
          console.log(toast);
        });
    //  this.sendalertmessage('bottom','Please enter email' );
    }
    else if (login_type == 'G' && this.loginForm.value.password == undefined || login_type == 'G' && this.loginForm.value.password == '') {
      this.toast.show("Please enter password", '2000', 'bottom').subscribe(
        toast => {
          console.log(toast);
        });

      //  this.sendalertmessage('bottom','Please enter password' );
    }

    else {
      let loadingPop = this.globalservice.createLoadingBar();
     // if (login_type == 'G') {
        loadingPop.present();
     // }

      setTimeout(() => {
        this.globalservice
          .login(this.globalservice.serviceUrl + 'service-provider-login', encodeURIComponent( this.loginForm.value.email.replace(/ /g,'')), login_type, this.globalservice.deviceId, localStorage.getItem('device_token'), this.globalservice.deviceOs, this.locationTracker.lat, this.locationTracker.lng, this.globalservice.simOperatorName, this.globalservice.deviceOsVer, this.globalservice.appVertion, this.loginForm.value.password, this.globalservice.simSerialNo, this.socialId, this.globalservice.deviceModel, this.globalservice.deviceAndroidId, sessionStorage.getItem('macAddress'))
          .subscribe(
          data => {
            console.log("login" + JSON.stringify(data));
            loadingPop.dismiss();
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
              this.events.publish('user:login', 'true');
              if (login_type == 'F') {

                this.navCtrl.setRoot(TabsPage);
                //loadingPop.dismiss();
              }
              else {
                this.navCtrl.setRoot(TabsPage);
              }
            }
            else if(data.responseStatus.STATUS =='FAILED' && data.responseStatus.STATUSCODE=='248'){
               loadingPop.dismiss();
              this.toast.show(data.responseStatus.MESSAGE, '2000', 'bottom').subscribe(
                toast => {
                  this.fb.logout()
                    .then((res: FacebookLoginResponse) => {
                      console.log('Logout from Facebook!', res);
                    })
                    .catch(e => console.log('Error logging into Facebook', e));
                });
            }
            else {
              loadingPop.dismiss();
              this.toast.show("Invalid email/password", '2000', 'bottom').subscribe(
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
      }, 1500);
    }
  }
  // got to forgot password page
  forgotPass() {
    this.navCtrl.push(ForgotPassPage);
  }
  /// used for fb login
  fbLogin() {
    this.loginForm.value.email = '';
    this.loginForm.value.password = '';
    this.fb.login(['public_profile', 'user_friends', 'email'])
      .then((res: FacebookLoginResponse) => {
        console.log('Logged into Facebook!', res);
        this.fbApi();
      })
      .catch(e => console.log('Error logging into Facebook', e));
  }
  // facebook api integration
  fbApi() {
    // let loadingPop = this.globalservice.createLoadingBar();
    // loadingPop.present();
    this.fb.api('me?fields=id,name,email,first_name,last_name,picture.width(100).height(100).as(picture_small),picture.width(720).height(720).as(picture_large)', [])
      .then((res) => {
        console.log(JSON.stringify(res));
        //this.f_name = res.first_name;
        //this.l_name = res.last_name;
        this.loginForm.value.email = res.email;
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
          this.loginForm.value.email = res.email;
          this.fullName = res.name;
          this.socialId = res.id;
          this.checkUser(res.email, this.socialId);

        }
        //this.smallPic = res.picture_small.data.url;
        sessionStorage.setItem('fbImage', res.picture_large.data.url);
        //this.largePic = res.picture_large.data.url;

      })
      .catch(e => {
        console.log('Error logging into Facebook', e);
        //loadingPop.dismiss();
        this.toast.show('Error logging into Facebook,' + e, '2000', 'bottom').subscribe(
          toast => {
            console.log(toast);
          });
      });
  }
  // check user already exist or not
  checkUser(email, socialId) {
    let loadingPop = this.globalservice.createLoadingBar();
    loadingPop.present();
    this.globalservice
      .checkUsers(this.globalservice.serviceUrl + 'service-provider-already-exist', email, socialId, this.globalservice.deviceOsVer, this.globalservice.appVertion, this.globalservice.deviceOs)
      .subscribe(
      data => {
        console.log("check" + JSON.stringify(data));
        if (data.responseStatus.STATUS == 'SUCCESS') {
            loadingPop.dismiss();
          if (data.responseData.exist == 'N') {    /*if new user*/

            sessionStorage.setItem('userName', this.fullName);
            sessionStorage.setItem('socialId', this.socialId);
            //alert('insideCheck');
            this.navCtrl.push(ServicePage);
          }
          else {                                  /*if exists user*/
            this.loginForm.value.email = data.responseData.email;
            this.login('F');
          }
          //this.navCtrl.setRoot(TabsPage);
        }
        else {
          loadingPop.dismiss();
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
        loadingPop.dismiss();
        this.fb.logout()
          .then((res: FacebookLoginResponse) => {
            console.log('Logout from Facebook!', res);
          })
          .catch(e => console.log('Error logging into Facebook', e));
        this.globalservice.errorMessage = <any>error
      });
  }

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
