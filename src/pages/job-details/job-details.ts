import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, Events, ModalController } from 'ionic-angular';
import { GlobalServiceProvider } from '../../providers/global-service/global-service';
import { LocationTracker } from '../../providers/location-tracker/location-tracker';
import { Toast } from '@ionic-native/toast';
import { GoogleMaps, GoogleMapsEvent } from '@ionic-native/google-maps';
import { ServiceImagePage } from '../service-image/service-image';
import { StartPage } from '../start/start';
import { TabsPage } from '../tabs/tabs';
import { JobDetailsSubmitPage } from '../job-details-submit/job-details-submit';
//import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

import { StartJobPopupPage } from '../start-job-popup/start-job-popup';
declare var google;

@IonicPage()
@Component({
  selector: 'page-job-details',
  templateUrl: 'job-details.html',
})
export class JobDetailsPage {
  tabBarElement: any;
  category: any;
  details: any;
  image: any;
  status: any;
  label: any;
  lat: any;
  long: any;
  map: any;
  description: any;
  addInfoWindow: any;
  type: any;
  address: any;
  btnAccept: any;
  btnReject: any;
  rejectText: any;
  msg: any;
  isVarified: any;
  status_label: any;
  custSatisCode: any = '';
  selectOptions: any;
  jobStatus: any;
  totalamount:any;
  // ==================== 06-12-18 ==========================
  paymentmode:any;
  @ViewChild('map') mapElement: ElementRef;
  constructor(public modalCtrl: ModalController, public events: Events, public alertCtrl: AlertController, public platform: Platform, private googleMaps: GoogleMaps, private toast: Toast, public globalservice: GlobalServiceProvider, public locationTracker: LocationTracker, public navCtrl: NavController, public navParams: NavParams) {
    this.selectOptions = {
      //title: 'Pizza Toppings',
      subTitle: 'Choose job status',
      mode: 'ios',
      enableBackdropDismiss: true
    };
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    sessionStorage.setItem('detailsPage', 'true');
    //this.rejectText = localStorage.getItem('rejectText');
    // this.getJobDetails();
    events.subscribe('start:job', (flag) => {
      this.getJobDetails();
    });
  }
// used for load map element
  loadMap(lat, long) {

    let latLng = new google.maps.LatLng(lat, long);
    let mapOptions = {
      center: latLng,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });
    var contentString = this.address;

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()

    });
    setTimeout(() => {
      infowindow.open(this.map, marker);
    }, 2500);
    marker.addListener('click', function () {
      infowindow.open(this.map, marker);
    });
  }

  // addMarker() {
  //   let marker = new google.maps.Marker({
  //     map: this.map,
  //     animation: google.maps.Animation.DROP,
  //     position: this.map.getCenter()
  //   });

  //   let content = "<h4>Information!</h4>";

  //   this.addInfoWindow(marker, content);

  // }
  //////for hide/display ion tab/////////
  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryDetails');
    this.tabBarElement.style.display = 'none';
  }
  ionViewWillEnter() {
    this.jobStatus = '';
    this.getJobDetails();
    //this.jobStatus='complete';
    //this.jobStatus='pending';
  }
  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }
  //////for hide/display ion tab////////
  // get the job details
  getJobDetails() {
    let loadingPop = this.globalservice.createLoadingBar();
    loadingPop.present();
    this.globalservice
      .jobDetails(this.globalservice.serviceUrl + 'service-details', this.globalservice.deviceOs, this.globalservice.appVertion, this.globalservice.deviceOsVer, localStorage.getItem('memberId'), localStorage.getItem('sessionId'), sessionStorage.getItem('rqstId'))
      .subscribe(
      data => {
        console.log("details" + JSON.stringify(data));
        if (data.responseStatus.STATUS == 'SUCCESS') {

          this.details = [data.responseData];
          console.log(this.details.status);
          if( data.responseData.status=="Completed"|| data.responseData.status=="Review Pending")
          {
           this.totalamount = parseFloat(data.responseData.amount_paid) + parseFloat(data.responseData.extra_paid);
           console.log(this.totalamount);
          }

          this.category = data.responseData.category_label;
          this.image = data.responseData.image;

          this.status = data.responseData.status;
          // this.type = data.responseData.type;
          this.lat = data.responseData.latitude;
          this.long = data.responseData.longitude;
          this.description = data.responseData.description;
          this.address = data.responseData.address;
          this.isVarified = data.responseData.memberIsVerified;
          this.status_label = data.responseData.status_label;
          // ==================== 06-12-18 ==========================
          this.paymentmode =  data.responseData.payment_mode;
          this.loadMap(this.lat, this.long);
          console.log(data.responseStatus.MESSAGE);
          setTimeout(() => {
            loadingPop.dismiss();
          }, 500);
        }
        else if (data.responseStatus.STATUS == 'FAILED' && data.responseStatus.STATUSCODE == '218') {
          loadingPop.dismiss();
          this.toast.show(data.responseStatus.MESSAGE, '2000', 'bottom').subscribe(
            toast => {
              this.navCtrl.setRoot(StartPage);
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
        // this.toast.show('Somthing went wrong!try again.', '2000', 'bottom').subscribe(
        //   toast => {
        //   });
        console.log("login" + JSON.stringify(error));
        this.globalservice.errorMessage = <any>error
      });
  }
  openImg(img) {

    sessionStorage.setItem('image', img);
    this.navCtrl.push(ServiceImagePage);
  }
  // useed for accept and reject job
  servAcceptReject(type) {
    let loadingPop = this.globalservice.createLoadingBar();
    loadingPop.present();
    this.globalservice
      .serviceAcceptReject(this.globalservice.serviceUrl + 'service-accept-reject', this.globalservice.deviceOs, this.globalservice.deviceOsVer, this.globalservice.appVertion, localStorage.getItem('memberId'), localStorage.getItem('sessionId'), sessionStorage.getItem('rqstId'), type)
      .subscribe(
      data => {
        console.log("details" + JSON.stringify(data));
        loadingPop.dismiss();
        if (data.responseStatus.STATUS == 'SUCCESS') {

          //loadingPop.dismiss();
          if (data.responseStatus.STATUSCODE == '227') {
            let alert = this.alertCtrl.create({
              title: '',
              subTitle: '<i class="fa fa-check-circle" aria-hidden="true"></i><b style="text-align:center;"><p><strong>CONGRATULATIONS!</strong></p><p>You have a new job. Please arrive at job location on time.</p></b>',
              enableBackdropDismiss: false,
              buttons: [
                {
                  text: 'OK',
                  handler: data => {
                    this.getJobDetails();
                    // this.events.publish('details:updated', 'true');
                  }
                }
              ]
            });
            alert.present();
            // this.status = 'Accepted';
          }

          else { }
        }
        else if (data.responseStatus.STATUSCODE == '229') {
          // this.status = 'Rejected';
          let alert = this.alertCtrl.create({
            title: '',
            subTitle: '<span><i class="cross fa fa-times-circle" aria-hidden="true"></i><b style="text-align:center;"><p><strong>OH NO!</strong></p><p>The job has been taken. Please try again next time.</p></b></span>',
            enableBackdropDismiss: false,
            //subTitle: 'OH NO!The job has been taken.please try again next time.',
            buttons: [
              {
                text: 'OK',
                handler: data => {
                  //this.rejectText = data.responseStatus.MESSAGE;
                  //localStorage.setItem('rejectText', data.responseStatus.MESSAGE);
                  this.getJobDetails();
                }
              }
            ]
          });
          alert.present();
        }
        else if (data.responseStatus.STATUSCODE == '228') {
          loadingPop.dismiss();
          let prompt = this.alertCtrl.create({
            title: 'iimafix',
            message: "Your account could not be varified, please upload certificate to accept jobs!!",
            buttons: [
              {
                text: 'Upload',
                handler: data => {
                  // console.log('Cancel clicked');

                  this.navCtrl.parent.select(3);
                  this.navCtrl.pop();
                }
              },
              {
                text: 'Dismiss',
                handler: data => {
                  console.log('Saved clicked');
                }
              }
            ]
          });
          prompt.present();
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
  // start the job
  jobStart() {

    this.modalshow();
    // let prompt = this.alertCtrl.create({
    //   title: 'iimafix',
    //   message: "Enter Request ID",
    //   inputs: [
    //     {
    //       name: 'otp',
    //       placeholder: 'Request ID'
    //     },
    //   ],
    //   buttons: [
    //     {
    //       text: 'QR scan',
    //       handler: data => {
    //       this.loadScan();

    //       }
    //     },
    //     {
    //       text: 'Continue',
    //       handler: data => {
    //         //alert(JSON.stringify(data));
    //         if (data.otp != '') {
    //           console.log('Saved clicked');
    //           this.startService(data.otp);
    //         }
    //         else {
    //           this.toast.show('Invalid Input.Try again.', '2000', 'bottom').subscribe(
    //             toast => {
    //             });
    //         }

    //       }
    //     }
    //   ]
    // });
    // prompt.present();
  }
  // startService(serviceNo) {
  //   let loadingPop = this.globalservice.createLoadingBar();
  //   loadingPop.present();
  //   this.globalservice
  //     .startService(this.globalservice.serviceUrl + 'service-start', this.globalservice.deviceOs, this.globalservice.deviceOsVer, this.globalservice.appVertion, localStorage.getItem('memberId'), localStorage.getItem('sessionId'), sessionStorage.getItem('rqstId'), serviceNo)
  //     .subscribe(
  //     data => {
  //       console.log("start" + JSON.stringify(data));

  //       if (data.responseStatus.STATUS == 'SUCCESS') {

  //         loadingPop.dismiss();
  //         // this.status = 'Running';
  //         this.getJobDetails();
  //         this.events.publish('details:updated', 'true');
  //         this.toast.show(data.responseStatus.MESSAGE, '2000', 'bottom').subscribe(
  //           toast => {
  //           });
  //       }
  //       else {
  //         loadingPop.dismiss();
  //         this.toast.show(data.responseStatus.MESSAGE, '2000', 'bottom').subscribe(
  //           toast => {
  //           });
  //       }
  //     },
  //     error => {
  //       loadingPop.dismiss();
  //       console.log("login" + JSON.stringify(error));
  //       this.globalservice.errorMessage = <any>error
  //     });
  // }
  // endJob() {
  //   let prompt = this.alertCtrl.create({
  //     title: 'Restor nation',
  //     //subTitle:this.custSatisCode,
  //     message: "Enter customer satisfaction code.",
  //     enableBackdropDismiss: true,
  //     inputs: [
  //       {
  //         name: 'csc',
  //         placeholder: 'Customer satisfaction code',
  //         type: 'tel'

  //       },
  //     ],
  //     buttons: [
  //       // {
  //       //   text: 'Cancel',
  //       //   handler: data => {
  //       //     console.log('Cancel clicked');
  //       //   }
  //       // },
  //       {
  //         text: 'Done',
  //         handler: data => {
  //           //alert(data.csc);
  //           this.custSatisCode = 'invalid Input.';
  //           console.log('Saved clicked');
  //           if (data.csc != '') {
  //             this.endService(data.csc);
  //           }
  //           else {
  //             this.toast.show('Invalid Input.Try again.', '2000', 'bottom').subscribe(
  //               toast => {
  //               });
  //           }
  //         }
  //       }
  //     ]
  //   });
  //   //prompt.present();
  // }
  // endService(cus_satisfaction_No) {
  //   let alert = this.alertCtrl.create({
  //     title: 'Restor Nation',
  //     subTitle: 'Job completed.',
  //     enableBackdropDismiss: false,
  //     buttons: [
  //       {
  //         text: 'Dismiss',
  //         handler: data => {
  //           this.getJobDetails();
  //         }
  //       }
  //     ]
  //   });
  //   let loadingPop = this.globalservice.createLoadingBar();
  //   loadingPop.present();
  //   this.globalservice
  //     .endService(this.globalservice.serviceUrl + 'service-end', this.globalservice.deviceOs, this.globalservice.deviceOsVer, this.globalservice.appVertion, localStorage.getItem('memberId'), localStorage.getItem('sessionId'), sessionStorage.getItem('rqstId'), cus_satisfaction_No)
  //     .subscribe(
  //     data => {
  //       console.log("end" + JSON.stringify(data));

  //       if (data.responseStatus.STATUS == 'SUCCESS') {

  //         loadingPop.dismiss();
  //         //this.status = 'Running';
  //         alert.present();
  //         this.events.publish('details:updated', 'true');

  //       }
  //       else {
  //         loadingPop.dismiss();
  //         this.toast.show(data.responseStatus.MESSAGE, '2000', 'bottom').subscribe(
  //           toast => {
  //           });
  //       }
  //     },
  //     error => {
  //       loadingPop.dismiss();
  //       console.log("login" + JSON.stringify(error));
  //       this.globalservice.errorMessage = <any>error
  //     });
  // }
  endJobSubmit() {
    // this.navCtrl.push(JobDetailsSubmitPage);
  }
  // send i am interes agianst this job
  IMIntersted() {
    let loadingPop = this.globalservice.createLoadingBar();
    loadingPop.present();
    this.globalservice
      .IMInterested(this.globalservice.serviceUrl + 'i-am-interested', this.globalservice.deviceOs, this.globalservice.deviceOsVer, this.globalservice.appVertion, localStorage.getItem('memberId'), localStorage.getItem('sessionId'), sessionStorage.getItem('rqstId'))
      .subscribe(
      data => {
        console.log("end" + JSON.stringify(data));
        if (data.responseStatus.STATUS == 'SUCCESS') {
          loadingPop.dismiss();
          if (data.responseStatus.STATUSCODE == '241') {
            this.toast.show(data.responseStatus.MESSAGE, '2000', 'bottom').subscribe(
              toast => {
              });
          }
          else {
            this.toast.show(data.responseStatus.MESSAGE, '2000', 'bottom').subscribe(
              toast => {
              });
          }
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
  selectStatus(event) {
    // 06-12-18
  //  alert(this.paymentmode);
    sessionStorage.setItem('status', event);
    sessionStorage.setItem('paymentmode', this.paymentmode);
    this.navCtrl.push(JobDetailsSubmitPage);
  }
 modalshow() {
    let myModal = this.modalCtrl.create(StartJobPopupPage);
    myModal.present();
  }

}
