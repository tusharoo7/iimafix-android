import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Toast } from '@ionic-native/toast';
import { GlobalServiceProvider } from '../../providers/global-service/global-service';
/**
 * Generated class for the StartJobPopupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-start-job-popup',
  templateUrl: 'start-job-popup.html',
})
export class StartJobPopupPage {
  requestNo: any;
  constructor(public events: Events, public globalservice: GlobalServiceProvider, private toast: Toast, private barcodeScanner: BarcodeScanner, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad StartJobPopupPage');
  }
  modalhide() {
    this.viewCtrl.dismiss();
  }
  // barcode scanner
  loadScan() {

    this.barcodeScanner.scan().then((barcodeData) => {
      // Success! Barcode data is here
      this.requestNo = barcodeData.text;
      // alert(JSON.stringify(barcodeData));
    }, (err) => {
      // An error occurred
    });
  }
  // start job
  startJob() {
    //alert(JSON.stringify(data));
    //alert(this.requestNo);
    if (this.requestNo != '') {
      console.log('Saved clicked');
      this.startService(this.requestNo);
    }
    else {
      this.toast.show('Please enter Request Id', '2000', 'bottom').subscribe(
        toast => {
        });
    }
  }
  // its used for start a service
  startService(serviceNo) {
    let loadingPop = this.globalservice.createLoadingBar();
    loadingPop.present();
    this.globalservice
      .startService(this.globalservice.serviceUrl + 'service-start', this.globalservice.deviceOs, this.globalservice.deviceOsVer, this.globalservice.appVertion, localStorage.getItem('memberId'), localStorage.getItem('sessionId'), sessionStorage.getItem('rqstId'), serviceNo)
      .subscribe(
      data => {
        console.log("start" + JSON.stringify(data));

        if (data.responseStatus.STATUS == 'SUCCESS') {

          loadingPop.dismiss();
          // this.status = 'Running';
          //this.getJobDetails();
          this.viewCtrl.dismiss();
          this.events.publish('start:job', 'true');
          this.toast.show(data.responseStatus.MESSAGE, '2000', 'bottom').subscribe(
            toast => {
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
    ionViewDidLeave() {
    //alert('aaa');
    this.events.unsubscribe('start:job');
    //alert('ddd');
  }
}
