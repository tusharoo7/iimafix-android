import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalServiceProvider } from '../../providers/global-service/global-service';
import { LocationTracker } from '../../providers/location-tracker/location-tracker';
import { Toast } from '@ionic-native/toast';
import { LoginPage } from '../login/login';
@IonicPage()
@Component({
  selector: 'page-forgot-pass',
  templateUrl: 'forgot-pass.html',
})
export class ForgotPassPage {
  Email: any;
  constructor(private toast: Toast, public globalservice: GlobalServiceProvider, public locationTracker: LocationTracker, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPassPage');
  }
  back() {
    this.navCtrl.pop();
  }
// forgoit password  function
  forgotPass() {
    if (this.Email == '' || this.Email == undefined) {
      this.toast.show('Please enter registered email id', '2000', 'bottom').subscribe(
        toast => {
        });
    }
    else {
      let loadingPop = this.globalservice.createLoadingBar();
      loadingPop.present();
      this.globalservice
        .forgotPassword(this.globalservice.serviceUrl + 'service-provider-forget-password', this.globalservice.deviceOs, this.globalservice.appVertion, this.globalservice.deviceOsVer,  encodeURIComponent(this.Email.replace(/ /g,'')))
        .subscribe(
        data => {
          console.log("details" + JSON.stringify(data));

          if (data.responseStatus.STATUS == 'SUCCESS') {
            loadingPop.dismiss();
            this.toast.show(data.responseStatus.MESSAGE, '2000', 'bottom').subscribe(
              toast => {
                this.navCtrl.setRoot(LoginPage);
              });
          }
          else {
            loadingPop.dismiss();
            this.toast.show(data.responseStatus.MESSAGE, '2000', 'bottom').subscribe(
              toast => {
              });
          }
        },
        error => {
          loadingPop.dismiss();
          console.log("login" + JSON.stringify(error));
          this.globalservice.errorMessage = <any>error
        });
    }
  }
}
