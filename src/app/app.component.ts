import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
//import { ListPage } from '../pages/list/list';
//import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { FCM } from '@ionic-native/fcm';
import { StartPage } from '../pages/start/start';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Events } from 'ionic-angular';
import { JobDetailsPage } from '../pages/job-details/job-details';
import { ProfilePage } from '../pages/profile/profile';
import { Network } from '@ionic-native/network';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Toast } from '@ionic-native/toast';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Device } from '@ionic-native/device';
import { WalletPage } from '../pages/wallet/wallet';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { InAppBrowser } from '@ionic-native/in-app-browser';
//import { GlobalServiceProvider } from '../providers/global-service/global-service';
declare var FCMPlugin;
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  @ViewChild(NavController) navctrl: NavController;
  rootPage: any;
  profImg: any;
  userName: any;
  userEmail: any;
  spRating: any = '0.00';
  profRedirectionFlag: any = 'false';
  checkmode : any ;
  pages: Array<{ title: string, component: any }>;
  constructor(private iab: InAppBrowser, private fcm: FCM, private device: Device, public http: Http, private toast: Toast, private diagnostic: Diagnostic, private alertCtrl: AlertController, private network: Network, public events: Events, private fb: Facebook, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {

    this.initializeApp();


    //this.spRating = localStorage.getItem("rating");
    this.userName = localStorage.getItem('userName');
    this.userEmail = localStorage.getItem('userEmail');
    this.profImg = localStorage.getItem('userImg');
    this.pages = [
      { title: 'About us', component: TabsPage },
      { title: 'Terms and conditions', component: TabsPage },
      { title: 'Privacy policy', component: TabsPage },
      { title: 'Contact us', component: TabsPage },

      { title: 'Logout', component: StartPage }
      // { title: 'List', component: ListPage }
    ];
    events.subscribe('user:login', (user) => {
      // localStorage.getItem('memberId');

      this.userName = localStorage.getItem('userName');
      this.userEmail = localStorage.getItem('userEmail');
      this.profImg = localStorage.getItem('userImg');
    });
    events.subscribe('user:signup', (user) => {
      //localStorage.getItem('memberId');
      this.userName = localStorage.getItem('userName');
      this.userEmail = localStorage.getItem('userEmail');
      this.profImg = localStorage.getItem('userImg');
    });
    events.subscribe('user:profileUpdate', (user) => {
      //localStorage.getItem('memberId');
      this.userName = localStorage.getItem('userName');
      this.userEmail = localStorage.getItem('userEmail');
      this.profImg = localStorage.getItem('userImg');
    });

    events.subscribe('rating:updated', (rate) => {
      // localStorage.getItem('memberId');

      this.spRating = localStorage.getItem("rating");
      console.log('dd');

    });
    //watch network for a disconnect
    let alert = this.alertCtrl.create({
      title: 'Data connection',
      subTitle: 'Network was disconnected.',
      buttons: ['Dismiss']
    });
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
      // alert.present();
      this.toast.show("Please check your internet connection", '4000', 'bottom').subscribe(
        toast => {
          console.log(toast);
        }
      );

    });
    //stop disconnect watch
    //disconnectSubscription.unsubscribe();
    //watch network for a connection
    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      this.events.publish('network:connected', 'true');
    });
    //stop connect watch
    //connectSubscription.unsubscribe();
  }
// initialize the app
  initializeApp() {
    this.platform.ready().then(() => {

     /// check mode
    //  if(this.globalservice.serviceUrl=="https://dev.iimafix.com/public/api/")
    //   {
    //     this.checkmode ="Development Mode" ;
    //   }
    //   else if(this.globalservice.serviceUrl=="http://iimafix.com/api/" || this.globalservice.serviceUrl=="https://iimafix.com/public/api/" )
    //  {
    //   this.checkmode ="" ;
    //  }

      this.initPushNotification();
      this.statusBar.show();
      this.splashScreen.hide();

      this.diagnostic.isLocationEnabled().then(
        (isAvailable) => {
          console.log('Is available? ' + isAvailable);
          //check location acess
          if (isAvailable == false) {
            let alert = this.alertCtrl.create({
              title: 'iimafix',
              subTitle: '<strong>Allow iimafix to access your location, to find out the best jobs near you.</strong>',
              buttons: ['OK']
            });
            alert.present();
          }
        }).catch((e) => {
          console.log(e);
          //alert(JSON.stringify(e));
        });
      setTimeout(() => {
        //this.locationTracker.startTracking();
        if (localStorage.getItem('loginFlag') == 'true') {
          this.rootPage = TabsPage;
        }
        else {
          this.rootPage = StartPage;
        }
      }, 1000);
    });
  }
  ////////////////////push notification///////////////////
  initPushNotification() {
    if (!this.platform.is('cordova')) {
      console.warn('Push notifications not initialized. Cordova is not available - Run in physical device');
      return;
    }
    this.fcm.getToken().then(token => {
      //this.backend.registerToken(token);
      console.log('device token===================>'+ token);
       setTimeout(() => {
      sessionStorage.setItem('device_token', token);
      localStorage.setItem('device_token', token);
    }, 1000);

    });
    this.fcm.onNotification().subscribe(param => {

      if (param.wasTapped) {
        // alert(JSON.stringify(param));
        if (param.data == 'details') {
          sessionStorage.setItem('rqstId', param.id);
          setTimeout(() => {
            this.nav.push(JobDetailsPage);
          }, 1500);
        }
        else if (param.data == 'profile') {

          sessionStorage.setItem('memberId', param.id);
          sessionStorage.setItem('profRedirectionFlag', 'true');
          //this.profRedirectionFlag='true';
          //  setTimeout(() => {
          //     alert(param.id);
          // this.nav.parent.select(3);
          //  }, 5000);
        }
        else if (param.data == 'wallet') {
          sessionStorage.setItem('memberId', param.id);
          sessionStorage.setItem('walletRedirectionFlag', 'true');
          //     setTimeout(() => {
          //  this.nav.parent.select(2);
          //   }, 1500);
        }
        else {
          console.log("else block excuted")
        }
      }
      else {
       // alert(JSON.stringify(param.toast_data));
        this.toast.show(param.toast_data, '4000', 'bottom').subscribe(
          toast => {
            console.log(toast);
          });
      }
    });
    //////////////////FCM///////////////////
    // if (typeof (FCMPlugin) !== "undefined") {
    //   FCMPlugin.getToken(function (t) {
    //     alert(t);
    //     localStorage.setItem('device_token', t);
    //     console.log("Use this token for sending device specific messages\nToken: " + t);
    //   }, function (e) {
    //     console.log("Uh-Oh!\n" + e);
    //   });
    //   FCMPlugin.onNotification(function (d) {
    //   // navctrl.push(JobDetailsPage);
    //   alert(JSON.stringify(d));
    //     if (d.wasTapped) {
    //     alert(this.navctrl.getActive());
    //       // Background recieval (Even if app is closed),
    //       // bring up the message in UI

    //       if (d.data == 'details') {
    //          alert(d.data);
    //         localStorage.setItem('rqstId', d.id);
    //        // sessionStorage.setItem('flag',d.data);

    //       }
    //       else if (d.data == 'profile') {
    //         localStorage.setItem('memberId', d.id);
    //         this.nav.setRoot(ProfilePage);
    //       }
    //       else if (d.data == 'wallet') {
    //         localStorage.setItem('memberId', d.id);
    //         this.nav.setRoot(WalletPage);
    //       }
    //   } else {
    //   alert('else');

    //       // Foreground recieval, update UI or what have you...
    //     }
    //   }, function (msg) {
    //     //alert(msg);
    //     // No problemo, registered callback

    //   }, function (err) {
    //     console.log("Arf, no good mate... " + err);
    //   });
    // } else console.log("Notifications disabled, only provided in Android/iOS environment");
    ///////////////FCM////////////////////




    //   to check if we have permission
    //   if (!this.platform.is('cordova')) {
    //  console.warn('Push notifications not initialized. Cordova is not available - Run in physical device');
    //     return;
    //   }
    //   const options: PushOptions = {
    //     android: {
    //       senderID: '118894696856'
    //     },
    //     ios: {
    //       alert: 'true',
    //       badge: false,
    //       sound: 'true'
    //     },
    //     windows: {}
    //   };
    //   const pushObject: PushObject = this.push.init(options);

    //   pushObject.on('registration').subscribe((data: any) => {
    //     console.log('device token -> ' + data.registrationId);
    //     //alert(data.registrationId);
    //     localStorage.setItem('device_token', data.registrationId);
    //     //TODO - send device token to server
    //   });

    //   pushObject.on('notification').subscribe((data: any) => {
    //     alert(JSON.stringify(pushObject));
    //   //console.log('message -> ' + data.message);
    //     //alert(JSON.stringify(data));
    //     if (data.additionalData.foreground != true) {
    //       alert('back')
    //       if (data.additionalData.a_data == 'details') {
    //         localStorage.setItem('rqstId',data.additionalData.id);
    //         this.nav.push(JobDetailsPage);
    //       }
    //       else if (data.additionalData.a_data == 'profile') {
    //         this.nav.setRoot(ProfilePage);
    //       }
    //       else {}

    //     }
    //     else{
    //        this.toast.show('You have a new Job alert', '3000', 'bottom').subscribe(
    //           toast => {
    //             console.log(toast);
    //           });
    //     }
    //     //if user using app and push notification comes
    //     if (data.additionalData.foreground) {

    //       alert(data.message);
    //     } else {
    //       //alert('dd');
    //       //if user NOT using app and push notification comes
    //       //TODO: Your logic on click of push notification directly
    //       //this.nav.push(DetailsPage, { message: data.message });
    //       console.log('Push notification clicked');
    //     }
    //   });

    //   pushObject.on('error').subscribe(error => console.error('Error with Push plugin' + error));
  }
  //////////////////push///////////////////
  chngPass() {
    this.nav.push(ChangePasswordPage);
  }
  logout() {
    //alert(this.device.platform);
    //alert(this.device.version);

    //alert('aaa');
    this.events.unsubscribe('network:connected');
    //alert('ddd');
    localStorage.setItem("rating", '');
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('os', this.device.platform);
    urlSearchParams.append('osVersion', this.device.version);
    urlSearchParams.append('appVersion', '1.0');
    urlSearchParams.append('memberId', localStorage.getItem('memberId'));
    urlSearchParams.append('sessionId', localStorage.getItem('sessionId'));

    let body = urlSearchParams.toString()

    this.http.post('https://iimafix.com/public/api/service-provider-logout', body, { headers: headers })
      .map(res => res.json())
      .subscribe(
      data => {
        console.log(data);
        // this.loadingPopup.dismiss();

        if (data.responseStatus.STATUS == 'SUCCESS') {
          this.nav.setRoot(StartPage);
          // loadingPop.dismiss();
          localStorage.setItem('loginFlag', 'false');
          this.nav.setRoot(StartPage);
          this.fb.logout()
            .then((res: FacebookLoginResponse) => {
              console.log('Logout from Facebook!', res);
            })
            .catch(e => console.log('Error logging into Facebook', e));
          localStorage.setItem('loginFlag', 'false');

          // this.events.publish('network:connected', 'true');

          //this.events.publish('location:stop', 'true');
          console.log('Agree clicked');

        }
        else {
          //loadingPop.dismiss();
          this.nav.setRoot(StartPage);

        }

      },
      error => {
        this.nav.setRoot(StartPage);
        //this.loadingPopup.dismiss();
        this.toast.show("something went wrong.Try again.", '2000', 'bottom').subscribe(
          toast => {
            console.log(toast);
          }
        );
      })

  }
  openLink(link) {
    this.iab.create(link, '_self', { location: 'yes' });
  }

}
