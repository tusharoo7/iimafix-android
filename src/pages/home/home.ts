import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, MenuController, Events, AlertController } from 'ionic-angular';
import { Content } from 'ionic-angular';
import { GlobalServiceProvider } from '../../providers/global-service/global-service';
import { LocationTracker } from '../../providers/location-tracker/location-tracker';
import { Toast } from '@ionic-native/toast';
import { Observable } from 'rxjs/Rx';
import { Map } from '../map/map';
import { JobDetailsPage } from '../job-details/job-details';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { StartPage } from '../start/start';
import { Diagnostic } from '@ionic-native/diagnostic';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  @ViewChild("contentRef")
  contentHandle: ElementRef;
  private tabBarHeight;
  private topOrBottom: string;
  private contentBox;
  jobAlert: any;
  myAlert: any = 'true';
  myJobs: any = 'false';
  limit: number = 100;
  offset: number = 0;
  scrlHeight: any;
  offsetHeight: any;
  docheight: any;
  scroll: any;
  jobalertArray: any = [];
  myjobArray: any = [];
  Myjob: any;
  animationList: any = 'true';
  myAlertEmply: any;
  myJobNoData: any = 'false';
  loadmoreFlag: any = 'false';
  alertJobNoData: any = 'false';
  subscription: any;
  jobAlertempty: any;
  jobList: any = [];
  jobAlertCount: any;
  myJobCount: any;
  offset1: any = 0;
  arr1: any = [];
  arr2: any = [];
  arr3: any = [];
  arr4: any = [];
  dataList: any = [];
  spRating: any;
  checkmode : any ;
  @ViewChild(Content) content: Content;
  constructor(private diagnostic: Diagnostic, private fb: Facebook, public alertCtrl: AlertController, public events: Events, private toast: Toast, public globalservice: GlobalServiceProvider, public locationTracker: LocationTracker, public menuCtrl: MenuController, public navCtrl: NavController) {
    this.menuCtrl.enable(true);
    let successCallback = (isAvailable) => { console.log('Is available? ' + isAvailable); };
    let errorCallback = (e) => console.error(e);
    this.diagnostic.isGpsLocationAvailable().then(successCallback).catch(errorCallback);
    this.animationList = 'true';
    events.subscribe('network:connected', (flag) => {
      this.limit = 100;
      this.offset = 0;
      this.customTabToggel('myAlert', 'scrollDisable');
    });
    events.subscribe('details:updated', (flag) => {
      this.customTabToggel('myJobs', 'scrollDisable');
    });
    /////BGLocation may be future enhance////
    // events.subscribe('location:stop', (flag) => {
    //   this.subscription.unsubscribe();
    // });
    localStorage.setItem('loginFlag', 'true');
    setTimeout(() => {
      //this.getJobAlerts();
    }, 500);
    //sessionStorage.setItem('memberId','326');
    //setTimeout(() => {

  }
  // this function is used for load more pagination
  loadmore(event) { /// after 3 months forgot logic:(
    if (event != null && event.scrollTop + window.innerHeight > document.getElementById('contentHeight').offsetHeight + 150 && this.myJobs == 'false' && this.jobAlertCount > this.limit && this.jobAlertCount > this.offset) {
      this.loadmoreFlag = 'true';
      this.offset = this.offset + this.limit;
      setTimeout(() => {
        this.getJobAlerts();
      }, 500);
    }
    else if (event != null && event.scrollTop + window.innerHeight > document.getElementById('contentHeight').offsetHeight + 150 && this.myJobs == 'true' && this.myJobCount >= this.limit && this.myJobCount >= this.offset1) {
      this.offset1 = this.offset1 + this.limit;
      setTimeout(() => {
        this.getMyJob();
      }, 100);
    }
    else {
    }
  }
  ionViewDidEnter() {
    this.locationTracker.getLocation();
  }
  ionViewWillEnter() {

    if (sessionStorage.getItem('toggelTab') == 'myAlert') {
      this.customTabToggel('myAlert', 'scrollDisable');
      document.getElementById("myjobs").classList.remove("active");
      document.getElementById("myalerts").classList.add("active");
    }
    else if (sessionStorage.getItem('toggelTab') == 'myJobs') {
      this.customTabToggel('myJobs', 'scrollDisable');
      document.getElementById("myjobs").classList.add("active");
      document.getElementById("myalerts").classList.remove("active");
    }
    else {
      document.getElementById("myalerts").classList.add("active");
      document.getElementById("myjobs").classList.remove("active");
       this.customTabToggel('myAlert', 'scrollDisable');
    }

    /// check mode
     if(this.globalservice.serviceUrl=="https://dev.iimafix.com/public/api/")
      {
        this.checkmode ="Development Mode" ;
      }
      else if(this.globalservice.serviceUrl=="http://iimafix.com/api/" || this.globalservice.serviceUrl=="https://iimafix.com/public/api/" )
     {
      this.checkmode ="" ;
     }
  }
  // go to job details page
  job_details(rqstId) {
    sessionStorage.setItem('rqstId', rqstId);
    this.navCtrl.push(JobDetailsPage);
  }
    // used for home page tab
  customTabToggel(event, scroll) {
    if (event == 'myAlert') {
      this.limit = 10;
      this.offset = 0;
      this.doRefreshJobalert('refresh');
      if (scroll == 'scrollToTop') { this.content.scrollToTop(); }

      this.animationList = 'false'
      this.myAlert = 'true';
      this.myJobs = 'false';
      this.myJobNoData = 'false';
      if (this.dataList == '') {
        this.myJobNoData = 'true';
      }
      else {
        this.myJobNoData = 'false';
      }
      sessionStorage.setItem('toggelTab', event);
      document.getElementById("myjobs").classList.remove("active");
      document.getElementById("myalerts").classList.add("active");
    }
    else {
      this.limit = 10;
      this.offset1 = 0;

      this.doRefreshMyJob('refresh');
      if (scroll == 'scrollToTop') { this.content.scrollToTop(); }
      if (this.jobList == '') {
        this.myJobNoData = 'true';
      }
      else {
        this.myJobNoData = 'false';
      }
      this.myJobs = 'true';
      this.myAlert = 'false';
      sessionStorage.setItem('toggelTab', event);
      document.getElementById("myjobs").classList.add("active");
      document.getElementById("myalerts").classList.remove("active");
    }
  }
  /////BGLocation may be future enhance////
  // putLocationVal() {
  //   //alert(this.locationTracker.lat);
  //   //alert(this.locationTracker.lng);
  //   this.globalservice
  //     .putLocation(this.globalservice.serviceUrl + 'service-provider-location-update', this.globalservice.deviceOsVer, this.globalservice.appVertion, this.globalservice.deviceOs, this.locationTracker.lat, this.locationTracker.lng, localStorage.getItem('memberId'), localStorage.getItem('sessionId'))
  //     .subscribe(
  //     data => {
  //       console.log("location" + JSON.stringify(data));
  //       if (data.responseStatus.STATUS == 'SUCCESS') {
  //         console.log(data.responseStatus.MESSAGE);
  //       }
  //       else {
  //         // this.toast.show(data.responseStatus.MESSAGE, '2000', 'bottom').subscribe(
  //         //   toast => {
  //         //   });
  //       }
  //     },
  //     error => {
  //       console.log("login" + JSON.stringify(error));
  //       this.globalservice.errorMessage = <any>error
  //     });
  // }
  // used for home job alert
  getJobAlerts() {
    //let loadingPop = this.globalservice.createLoadingBar();
    //loadingPop.present();
    this.globalservice
      .jobAlerts(this.globalservice.serviceUrl + 'get-service-requests', this.globalservice.deviceOs, this.globalservice.deviceOsVer, this.globalservice.appVertion, localStorage.getItem('memberId'), localStorage.getItem('sessionId'), this.limit, this.offset, this.locationTracker.lat, this.locationTracker.lng)
      .subscribe(
      data => {
        console.log(JSON.stringify(data));
        if (data.responseStatus.STATUS == 'SUCCESS') {
          this.jobAlertCount = data.extraData.total_count;
          this.spRating = data.extraData.avgRating;
          localStorage.setItem("rating", this.spRating);
          this.events.publish('rating:updated', this.spRating);
          // alert('pp'+this.spRating);
          //this.jobAlert = data.responseData;
          this.arr1 = data.responseData;
          this.dataList = Array.from(new Set(this.arr2.concat(this.arr1).map((itemInArray) => itemInArray)));
          this.arr2 = Array.from(this.dataList);
          this.arr1 = '';
          this.jobAlertempty = 'true';
          document.getElementById("myalerts").classList.add("active");
          document.getElementById("myjobs").classList.remove("active");
          if (this.loadmoreFlag == 'false') {
            this.getMyJob();
            // this.subscription = Observable.timer(12000).subscribe(x => {
            //   this.putLocationVal();
            // });
          }
          else {
          }
          if (sessionStorage.getItem('profRedirectionFlag') == 'true') {
            //alert('yo yo');
            this.navCtrl.parent.select(3);
            sessionStorage.setItem('profRedirectionFlag', 'false');
          }
          else if(sessionStorage.getItem('walletRedirectionFlag')=='true'){
            this.navCtrl.parent.select(2);
            sessionStorage.setItem('walletRedirectionFlag','false')
          }
        }
        else if (data.responseStatus.STATUS == 'FAILED' && data.responseStatus.STATUSCODE == '218') {
          this.toast.show(data.responseStatus.MESSAGE, '2000', 'bottom').subscribe(
            toast => {
              this.navCtrl.setRoot(StartPage);
            });
        }
        else {
          //loadingPop.dismiss();
          this.toast.show(data.responseStatus.MESSAGE, '2000', 'bottom').subscribe(
            toast => {
              console.log(toast);
            });
        }
      },
      error => {
        //loadingPop.dismiss();
        this.globalservice.errorMessage = <any>error
      });
  }
  // get map view
  goMap(lati, long, category, address) {
    sessionStorage.setItem('address', address)
    sessionStorage.setItem('cat', category);
    sessionStorage.setItem('lati', lati);
    sessionStorage.setItem('long', long);
    this.navCtrl.push(Map);
  }
  // get my job
  getMyJob() {
    let loadingPop = this.globalservice.createLoadingBar();
    loadingPop.present();
    this.globalservice
      .myJob(this.globalservice.serviceUrl + 'my-jobs', this.globalservice.deviceOs, this.globalservice.deviceOsVer, this.globalservice.appVertion, localStorage.getItem('memberId'), localStorage.getItem('sessionId'), this.limit, this.offset1)
      .subscribe(
      data => {
        console.log(JSON.stringify(data));
        if (data.responseStatus.STATUS == 'SUCCESS') {
          this.myJobCount = data.extraData.total_count;
          if (data.responseStatus.STATUSCODE != '601') {
            //this.Myjob = data.responseData;
            this.arr3 = data.responseData;
            this.jobList = this.arr4.concat(this.arr3);
            this.arr4 = this.jobList;
            this.arr3 = '';
          }
          else if (this.jobList == '') {
            this.myAlertEmply = '';
          }
          else { }
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
  // used for job alert refreesh
  doRefreshJobalert(refresher) {
    this.limit = 1000;
    this.offset = 0;
    this.arr1 = [];
    this.arr2 = [];
    let loadingPop = this.globalservice.createLoadingBar();
    if (refresher == 'refresh') {
      loadingPop.present();
    }
    this.globalservice
      .jobAlerts(this.globalservice.serviceUrl + 'get-service-requests', this.globalservice.deviceOs, this.globalservice.deviceOsVer, this.globalservice.appVertion, localStorage.getItem('memberId'), localStorage.getItem('sessionId'), this.limit, this.offset, this.locationTracker.lat, this.locationTracker.lng)
      .subscribe(
      data => {
        console.log(JSON.stringify(data));
        if (refresher == 'refresh') {
          loadingPop.dismiss();
        }
        if (data.responseStatus.STATUS == 'SUCCESS') {
          this.jobAlertCount = data.extraData.total_count;
          this.spRating = data.extraData.avgRating;
          //alert(this.spRating);
           localStorage.setItem("rating", this.spRating);
          this.events.publish('rating:updated', this.spRating);
          //alert('dd'+this.spRating);
          this.arr1 = data.responseData;
          this.dataList = Array.from(new Set(this.arr2.concat(this.arr1).map((itemInArray) => itemInArray)));
          this.arr2 = Array.from(this.dataList);
          if (refresher != 'refresh') {
            setTimeout(() => {
              refresher.complete();
            }, 1500);
          }
        }
        else if (data.responseStatus.STATUS == 'FAILED' && data.responseStatus.STATUSCODE == '218') {
          this.toast.show(data.responseStatus.MESSAGE, '2000', 'bottom').subscribe(
            toast => {
              this.navCtrl.setRoot(StartPage);
            });
        }
        else {
          //loadingPop.dismiss();
          this.toast.show(data.responseStatus.MESSAGE, '2000', 'bottom').subscribe(
            toast => {
              console.log(toast);
            });
        }
      },
      error => {
        if (refresher == 'refresh') {
          loadingPop.dismiss();
        }
        this.globalservice.errorMessage = <any>error
      });
  }
  doRefreshMyJob(refresher) {
    //this.content.scrollToTop();
    this.limit = 10;
    this.offset1 = 0;
    this.arr3 = [];
    this.arr4 = [];
    let loadingPop = this.globalservice.createLoadingBar();
    if (refresher == 'refresh') {
      loadingPop.present();
    }
    this.globalservice
      .myJob(this.globalservice.serviceUrl + 'my-jobs', this.globalservice.deviceOs, this.globalservice.deviceOsVer, this.globalservice.appVertion, localStorage.getItem('memberId'), localStorage.getItem('sessionId'), this.limit, this.offset1)
      .subscribe(
      data => {
        console.log(JSON.stringify(data));
        if (refresher == 'refresh') {
          loadingPop.dismiss();
        }
        if (data.responseStatus.STATUS == 'SUCCESS') {
          this.myJobCount = data.extraData.total_count;
          // this.jobList = '';
          this.arr3 = data.responseData;
          this.jobList = this.arr4.concat(this.arr3);
          this.arr4 = this.jobList;
          if (refresher != 'refresh') {
            setTimeout(() => {
              refresher.complete();
            }, 1500);
          }

        }
        else if (data.responseStatus.STATUS == 'FAILED' && data.responseStatus.STATUSCODE == '218') {
          this.toast.show(data.responseStatus.MESSAGE, '2000', 'bottom').subscribe(
            toast => {
              this.navCtrl.setRoot(StartPage);
            });
        }
        else {
          //loadingPop.dismiss();
          this.toast.show(data.responseStatus.MESSAGE, '2000', 'bottom').subscribe(
            toast => {
              console.log(toast);
            });
        }
      },
      error => {
        if (refresher == 'refresh') {
          loadingPop.dismiss();
        }
        this.globalservice.errorMessage = <any>error
      });
  }
  ionViewDidLeave() {
    //alert('aaa');
    this.events.unsubscribe('rating:updated');
    //alert('ddd');
  }


}
