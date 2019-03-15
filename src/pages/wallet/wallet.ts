import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalServiceProvider } from '../../providers/global-service/global-service';
import { Toast } from '@ionic-native/toast';
import { InAppBrowser } from '@ionic-native/in-app-browser';
/**
 * Generated class for the WalletPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})
export class WalletPage {
walletItems:any;
  constructor(private iab: InAppBrowser,private toast: Toast, public globalservice: GlobalServiceProvider,public navCtrl: NavController, public navParams: NavParams) {
  }

   ionViewWillEnter() {
    console.log('ionViewDidLoad WalletPage');
    this. wallet();
  }
  // get wallet data
  wallet() {
    let loadingPop = this.globalservice.createLoadingBar();
    loadingPop.present();
    this.globalservice
      .wallet(this.globalservice.serviceUrl + 'user-wallet-details', this.globalservice.deviceOs, this.globalservice.deviceOsVer, this.globalservice.appVertion, localStorage.getItem('memberId'), localStorage.getItem('sessionId'))
      .subscribe(
      data => {
        console.log("end" + JSON.stringify(data));
        if (data.responseStatus.STATUS == 'SUCCESS') {
          this.walletItems = [data.responseData];
          //alert(data.responseData);
          //alert(JSON.stringify(data.responseData));
          loadingPop.dismiss();
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
  // open link in app  browser
  openLink(link){
    this.iab.create(link,'_self',{location:'yes'});
  }
}
