import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { GlobalServiceProvider } from '../../providers/global-service/global-service';
@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
  oldPass: any;
  newPass: any;
  conPass: any;
  constructor(public globalservice: GlobalServiceProvider, private toast: Toast, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }
  // change password function
  chngPass(oldP, newP, confirmP) {
    if (oldP == '' || oldP == undefined) {
      this.toast.show('Please enter current password', '2000', 'bottom').subscribe(
        toast => {
        });
    }
    else if (newP == '' || newP == undefined) {
      this.toast.show('Please enter new password', '2000', 'bottom').subscribe(
        toast => {
        });
    }
    else if (newP != confirmP) {
      this.toast.show('New password and confirm password not matching', '2000', 'bottom').subscribe(
        toast => {
        });
    }
    else {
      let loadingPop = this.globalservice.createLoadingBar();
      loadingPop.present();
      this.globalservice
        .changePassword(this.globalservice.serviceUrl + 'service-provider-change-password', this.globalservice.deviceOs, this.globalservice.deviceOsVer, this.globalservice.appVertion, localStorage.getItem('memberId'), localStorage.getItem('sessionId'), oldP, newP)
        .subscribe(
        data => {
          console.log("details" + JSON.stringify(data));

          if (data.responseStatus.STATUS == 'SUCCESS') {
            loadingPop.dismiss();
            this.toast.show(data.responseStatus.MESSAGE, '2000', 'bottom').subscribe(
              toast => {
                //this.navCtrl.setRoot(LoginPage);
                this.oldPass = '';
                this.newPass = '';
                this.conPass = '';
              });
          }
          else {
            loadingPop.dismiss();
            this.toast.show(data.responseStatus.MESSAGE, '2000', 'bottom').subscribe(
              toast => {
                this.oldPass = '';
                this.newPass = '';
                this.conPass = '';
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
