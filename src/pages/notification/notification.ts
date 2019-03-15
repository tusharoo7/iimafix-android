import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { JobDetailsSubmitPage } from '../job-details-submit/job-details-submit';
import { AlertController } from 'ionic-angular';
import { GlobalServiceProvider } from '../../providers/global-service/global-service';
import { Toast } from '@ionic-native/toast';
import { JobDetailsPage } from '../job-details/job-details';
import { WalletPage } from '../wallet/wallet';
import { ProfilePage } from '../profile/profile';
@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {
  notificationLIst: any;
  constructor(private toast: Toast, public globalservice: GlobalServiceProvider, public menuCtrl: MenuController, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    //this.menuCtrl.enable(true);

  }
  ionViewWillEnter() {
    console.log('ionViewDidLoad NotificationPage');
    this.getNotificationList();
  }
  // list of notification
  getNotificationList() {
    let loadingPop = this.globalservice.createLoadingBar();
    loadingPop.present();
    this.globalservice
      .getNotification(this.globalservice.serviceUrl + 'user-notification', this.globalservice.deviceOs, this.globalservice.deviceOsVer, this.globalservice.appVertion, localStorage.getItem('memberId'), localStorage.getItem('sessionId'))
      .subscribe(
      data => {
        console.log("end" + JSON.stringify(data));
        if (data.responseStatus.STATUS == 'SUCCESS') {
          this.notificationLIst = data.responseData;
          //alert(data.responseData);
         // alert(JSON.stringify(data.responseData));
          loadingPop.dismiss();
        }
        else {
          loadingPop.dismiss();
           this.notificationLIst='';
          // this.toast.show(data.responseStatus.MESSAGE, '2000', 'bottom').subscribe(
          //   toast => {
          //   });
        }
      },
      error => {
        loadingPop.dismiss();
        console.log("login" + JSON.stringify(error));
        this.globalservice.errorMessage = <any>error
      });
  }
  notificationDetails(id,type){
if(type=='Wallet Updated'){

this.navCtrl.parent.select(2);
}
else if(type=='Member Verified'){
//this.navCtrl.push(ProfilePage);
this.navCtrl.parent.select(3);
}
else{
sessionStorage.setItem('rqstId',id);
this.navCtrl.push(JobDetailsPage);
}
  }
}
