import { Injectable, ViewChild } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { LoadingController, Platform, Nav } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { Device } from '@ionic-native/device';
import { Sim } from '@ionic-native/sim';
import { Md5 } from 'ts-md5/dist/md5';
//import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Toast } from '@ionic-native/toast';

// this page is used for all service 
declare var WifiInfo: any;
@Injectable()
export class GlobalServiceProvider {
  @ViewChild(Nav) nav: Nav;
  headers: Headers;
  constructor(private toast: Toast, public platform: Platform, private sim: Sim, private device: Device, public loadingCtrl: LoadingController, public http: Http) {
    //this.initPushNotification();
    console.log(this.platform);

    if(this.platform.is('core') || this.platform.is('mobileweb'))
    {
      console.log('I am an browser');
      console.log('I am an browser');
      localStorage.setItem('device', 'browser');
      this.deviceId = 'test';
      this.deviceOs = 'Android';
      this.deviceOsVer = 'test';
      this.deviceToken = 'demoBroserToken';
      sessionStorage.setItem('macAddress', 'demowifi');
    }
    else
    {

      if (this.platform.is('ios')) {
        // This will only print when on iOS
        console.log('I am an iOS device!');
        localStorage.setItem('device', 'Ios');
        //WifiInfo.getWifiInfo(this.success, this.err);
        this.getDeviceData();
        this.deviceToken = sessionStorage.getItem('device_token');
        //this.deviceToken = 'demoBroserToken';
      }
      else if (this.platform.is('android')) {
         setTimeout(() => {
       this.deviceToken = sessionStorage.getItem('device_token');
      }, 1400);
      console.log('I am an android device!');
      localStorage.setItem('device', 'A');
      WifiInfo.getWifiInfo(this.success, this.err);
      this.getDeviceData();

      //this.deviceToken = 'demoBroserToken';
    }
    }

  }
  getDeviceData() {
    // this.sim.getSimInfo().then(
    //   (info) => {

    //     //alert('Sim info: :'+ JSON.stringify(info))
    //     this.simOperatorName = info.carrierName;
    //     this.simSerialNo = info.simSerialNumber;
    //     //alert(this.simOperatorName);
    //   },
    //   (err) => console.log('Unable to get sim info: :' + err)
    // );

    // this.sim.hasReadPermission().then(
    //   (info) => console.log('Has permission:' + info)
    // );

    // this.sim.requestReadPermission().then(
    //   () => console.log('Permission granted'),
    //   () => console.log('Permission denied')
    // );
    //this.deviceId = this.device.uuid;
    this.simOperatorName = 'demo';
    this.simSerialNo = 'demo';
    this.deviceOs = this.device.platform;
    this.deviceOsVer = this.device.version;
    this.deviceModel = this.device.model;
    this.deviceAndroidId = this.device.serial;
    //alert(this.device.serial);
    setTimeout(() => {
      this.deviceId = Md5.hashStr(sessionStorage.getItem('macAddress') + this.device.serial + this.device.model);
    }, 1000);
  }
  success(results) {
    // alert(results.MacAddress);
    //this.wifiMacAddress=results.MacAddress.toString();
    sessionStorage.setItem('macAddress', results.MacAddress);
    //console.log(window.btoa(results.MacAddress+this.device.serial+this.device.model));
  };
  err(e) {
    alert(JSON.stringify(e));
  };
  deviceId: any;
  deviceOs: any;
  deviceOsVer: any;
  appVer: any;
  latitude: any;
  longitude: any;
  simOperatorName: any;
  simSerialNo: any;
  deviceModel: any;
  wifiMacAddress: any;
  deviceAndroidId: any;
  appVertion: any = '1.0'
  deviceToken: any;

  public errorMessage: any = 'something went wrong.'
  // for development mode

 // serviceUrl: any = 'https://dev.iimafix.com/public/api/';

serviceUrl: any = 'https://iimafix.com/public/api/';
  // for live mode
  //serviceUrl: any = 'https://iimafix.com/api/';
  createLoadingBar() {
    return this.loadingCtrl.create({
      spinner: 'crescent',
      dismissOnPageChange: false
      //content: 'Loading data...'
    });
  }
  // userlogout(){
  //     let loadingPop = this.createLoadingBar();
  //     loadingPop.present();
  //     this.logout(this.serviceUrl + 'service-provider-logout', this.deviceOs, this.appVertion, this.deviceOsVer, localStorage.getItem('memberId'), localStorage.getItem('sessionId'))
  //       .subscribe(
  //       data => {
  //         console.log("details" + JSON.stringify(data));
  //         if (data.responseStatus.STATUS == 'SUCCESS') {
  //           // this.nav.setRoot(StartPage);
  //           loadingPop.dismiss();
  //           console.log('Agree clicked');

  //         }
  //         else {
  //           loadingPop.dismiss();
  //           //this.nav.setRoot(StartPage);

  //         }
  //       },
  //       error => {
  //         loadingPop.dismiss();
  //         console.log("login" + JSON.stringify(error));
  //         this.errorMessage = <any>error
  //       });
  // }


  ////////////////////push///////////////////
  // initPushNotification() {
  //   if (!this.platform.is('cordova')) {
  //     console.warn('Push notifications not initialized. Cordova is not available - Run in physical device');
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
  //     // alert(data.registrationId);
  //     localStorage.setItem('device_token', data.registrationId);
  //     //TODO - send device token to server
  //   });
  //   pushObject.on('notification').subscribe((data: any) => {
  //     console.log('message -> ' + data.message);
  //     alert(JSON.stringify(data));
  //     // if (data.additionalData.foreground != true) {
  //     //   if (data.additionalData.a_data == 'details') {
  //     //     this.nav.push(JobDetailsPage);
  //     //   }
  //     //   else if (data.additionalData.a_data == 'profile') {
  //     //     this.nav.setRoot(ProfilePage);
  //     //   }
  //     //   else {}

  //     // }
  //     // else{
  //     //    this.toast.show('You have a new Job alert', '3000', 'bottom').subscribe(
  //     //       toast => {
  //     //         console.log(toast);
  //     //       });
  //     // }
  //     //if user using app and push notification comes
  //     if (data.additionalData.foreground) {

  //       //alert(data.message);
  //     } else {
  //       //if user NOT using app and push notification comes
  //       //TODO: Your logic on click of push notification directly
  //       //this.nav.push(DetailsPage, { message: data.message });
  //       console.log('Push notification clicked');
  //     }
  //   });

  //   pushObject.on('error').subscribe(error => console.error('Error with Push plugin' + error));
  // }
  //////////////////push///////////////////

  /*========service-data handler======*/
  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }
  /*========service-data handler======*/

  /*========error handler======*/
  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
  /*========error handler======*/

  /*========login service======*/
  login(url: string, userEmail, loginType, deviceId, pushNotificationToken, os, latitude, longitude, simOperatorName, osVersion, appVersion, password, simSerialNo, socialId, deviceName, deviceAndroidID, deviceWifiMacID
  ): Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('userEmail', userEmail);
    urlSearchParams.append('loginType', loginType);
    urlSearchParams.append('deviceId', deviceId);
    urlSearchParams.append('pushNotificationToken', pushNotificationToken);
    urlSearchParams.append('os', os);
    urlSearchParams.append('latitude', latitude);
    urlSearchParams.append('longitude', longitude);
    urlSearchParams.append('simOperatorName', simOperatorName);
    urlSearchParams.append('osVersion', osVersion);
    urlSearchParams.append('appVersion', appVersion);
    urlSearchParams.append('password', password);
    urlSearchParams.append('simSerialNo', simSerialNo);
    urlSearchParams.append('socialId', socialId);
    urlSearchParams.append('deviceName', deviceName);
    urlSearchParams.append('deviceAndroidID', deviceAndroidID);
    urlSearchParams.append('deviceWifiMacID', deviceWifiMacID);
    let body = urlSearchParams.toString()
    console.log(body)
    return this.http
      .post(url, body, { headers: headers })
      .map(this.extractData)
      .catch(this.handleError);
  }
  /*========login service======*/

  /*========signup service======*/
  signup(url: string, userEmail, registrationType, deviceId, pushNotificationToken, os, latitude, longitude, simOperatorName, osVersion, appVersion, password, simSerialNo, confirm_password, socialId, user_image, user_image_type, userName, mobile, company_name, upload_certification, upload_certification_type, selected_categories, deviceName, deviceAndroidID, deviceWifiMacID, company_registration_no):
    Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('userEmail', userEmail);
    urlSearchParams.append('registrationType', registrationType);
    urlSearchParams.append('deviceId', deviceId);
    urlSearchParams.append('pushNotificationToken', pushNotificationToken);
    urlSearchParams.append('os', os);
    urlSearchParams.append('latitude', latitude);
    urlSearchParams.append('longitude', longitude);
    urlSearchParams.append('simOperatorName', simOperatorName);
    urlSearchParams.append('osVersion', osVersion);
    urlSearchParams.append('appVersion', appVersion);
    urlSearchParams.append('password', password);
    urlSearchParams.append('simSerialNo', simSerialNo);
    urlSearchParams.append('confirm_password', confirm_password);
    urlSearchParams.append('socialId', socialId);
    urlSearchParams.append('member_image', user_image);
    urlSearchParams.append('member_image_type', user_image_type);
    urlSearchParams.append('userName', userName);
    urlSearchParams.append('phone', mobile);
    urlSearchParams.append('company_name', company_name);
    urlSearchParams.append('upload_certification', upload_certification);
    urlSearchParams.append('upload_certification_type', upload_certification_type);
    urlSearchParams.append('selected_categories', selected_categories);
    urlSearchParams.append('deviceName', deviceName);
    urlSearchParams.append('deviceAndroidID', deviceAndroidID);
    urlSearchParams.append('deviceWifiMacID', deviceWifiMacID);
    urlSearchParams.append('company_registration_no', company_registration_no);
    let body = urlSearchParams.toString()
    console.log(body);
    return this.http
      .post(url, body, { headers: headers })
      .map(this.extractData)
      .catch(this.handleError);
  }
  /*========signup service======*/

  /*========work_category service======*/
  serviceCategory(url: string, appVersion, os, osVersion): Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('os', os);
    urlSearchParams.append('osVersion', osVersion);
    urlSearchParams.append('appVersion', appVersion);

    let body = urlSearchParams.toString()
    return this.http
      .post(url, body, { headers: headers })
      .map(this.extractData)
      .catch(this.handleError);
  }
  /*========work_category service======*/

  /*========social login service======*/
  checkUsers(url: string, email, socialId, osVersion, appVersion, os): Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('email', email);
    urlSearchParams.append('socialId', socialId);
    urlSearchParams.append('os', os);
    urlSearchParams.append('osVersion', osVersion);
    urlSearchParams.append('appVersion', appVersion);

    let body = urlSearchParams.toString()
    return this.http
      .post(url, body, { headers: headers })
      .map(this.extractData)
      .catch(this.handleError);
  }
  /*========social login service======*/

  /*========social login service======*/
  putLocation(url: string, osVersion, appVersion, os, latitude, longitude, member_id, sessionId): Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('os', os);
    urlSearchParams.append('osVersion', osVersion);
    urlSearchParams.append('appVersion', appVersion);
    urlSearchParams.append('latitude', latitude);
    urlSearchParams.append('longitude', longitude);
    urlSearchParams.append('member_id', member_id);
    urlSearchParams.append('sessionId', sessionId);

    let body = urlSearchParams.toString()
    return this.http
      .post(url, body, { headers: headers })
      .map(this.extractData)
      .catch(this.handleError);
  }
  /*========social login service======*/

  /*========job alert service======*/
  jobAlerts(url: string, os, osVersion, appVersion, memberId, sessionId, limit, offset, latitude, longitude): Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('os', os);
    urlSearchParams.append('osVersion', osVersion);
    urlSearchParams.append('appVersion', appVersion);
    urlSearchParams.append('memberId', memberId);
    urlSearchParams.append('sessionId', sessionId);
    urlSearchParams.append('limit', limit);
    urlSearchParams.append('offset', offset);
    urlSearchParams.append('latitude', latitude);
    urlSearchParams.append('longitude', longitude);

    let body = urlSearchParams.toString()
    return this.http
      .post(url, body, { headers: headers })
      .map(this.extractData)
      .catch(this.handleError);
  }
  /*========job alert service======*/

  /*========job alert service======*/
  myJob(url: string, os, osVersion, appVersion, memberId, sessionId, limit, offset): Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('os', os);
    urlSearchParams.append('osVersion', osVersion);
    urlSearchParams.append('appVersion', appVersion);
    urlSearchParams.append('memberId', memberId);
    urlSearchParams.append('sessionId', sessionId);
    urlSearchParams.append('limit', limit);
    urlSearchParams.append('offset', offset);

    let body = urlSearchParams.toString()
    return this.http
      .post(url, body, { headers: headers })
      .map(this.extractData)
      .catch(this.handleError);
  }
  /*========job alert service======*/

  /*========job alert service======*/
  jobDetails(url: string, os, osVersion, appVersion, memberId, sessionId, serviceRequestId): Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('os', os);
    urlSearchParams.append('osVersion', osVersion);
    urlSearchParams.append('appVersion', appVersion);
    urlSearchParams.append('memberId', memberId);
    urlSearchParams.append('sessionId', sessionId);
    urlSearchParams.append('serviceRequestId', serviceRequestId);
    let body = urlSearchParams.toString()
    return this.http
      .post(url, body, { headers: headers })
      .map(this.extractData)
      .catch(this.handleError);
  }
  /*========job alert service======*/

  /*========forgot password service======*/
  forgotPassword(url: string, os, osVersion, appVersion, email): Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('os', os);
    urlSearchParams.append('osVersion', osVersion);
    urlSearchParams.append('appVersion', appVersion);
    urlSearchParams.append('email', email);

    let body = urlSearchParams.toString()
    return this.http
      .post(url, body, { headers: headers })
      .map(this.extractData)
      .catch(this.handleError);
  }
  /*========forgot password service======*/

  /*========logout service======*/
  logout(url: string, os, osVersion, appVersion, memberId, sessionId): Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('os', os);
    urlSearchParams.append('osVersion', osVersion);
    urlSearchParams.append('appVersion', appVersion);
    urlSearchParams.append('memberId', memberId);
    urlSearchParams.append('sessionId', sessionId);


    let body = urlSearchParams.toString()
    return this.http
      .post(url, body, { headers: headers })
      .map(this.extractData)
      .catch(this.handleError);
  }
  /*========logout service======*/

  /*========serviceAcceptReject service======*/
  serviceAcceptReject(url: string, os, osVersion, appVersion, memberId, sessionId, serviceRequestId, type): Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('os', os);
    urlSearchParams.append('osVersion', osVersion);
    urlSearchParams.append('appVersion', appVersion);
    urlSearchParams.append('memberId', memberId);
    urlSearchParams.append('sessionId', sessionId);
    urlSearchParams.append('serviceRequestId', serviceRequestId);
    urlSearchParams.append('type', type);


    let body = urlSearchParams.toString()
    return this.http
      .post(url, body, { headers: headers })
      .map(this.extractData)
      .catch(this.handleError);
  }
  /*========serviceAcceptReject service======*/

  /*========startService service======*/
  startService(url: string, os, osVersion, appVersion, memberId, sessionId, serviceRequestId, serviceRequestNo): Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('os', os);
    urlSearchParams.append('osVersion', osVersion);
    urlSearchParams.append('appVersion', appVersion);
    urlSearchParams.append('memberId', memberId);
    urlSearchParams.append('sessionId', sessionId);
    urlSearchParams.append('serviceRequestId', serviceRequestId);
    urlSearchParams.append('serviceRequestNo', serviceRequestNo);


    let body = urlSearchParams.toString()
    return this.http
      .post(url, body, { headers: headers })
      .map(this.extractData)
      .catch(this.handleError);
  }
  /*========startService service======*/

  /*========endService service======*/
  endService(url: string, os, osVersion, appVersion, memberId, sessionId, serviceRequestId, customerSatisfactionCode): Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('os', os);
    urlSearchParams.append('osVersion', osVersion);
    urlSearchParams.append('appVersion', appVersion);
    urlSearchParams.append('memberId', memberId);
    urlSearchParams.append('sessionId', sessionId);
    urlSearchParams.append('serviceRequestId', serviceRequestId);
    urlSearchParams.append('customerSatisfactionCode', customerSatisfactionCode);


    let body = urlSearchParams.toString()
    return this.http
      .post(url, body, { headers: headers })
      .map(this.extractData)
      .catch(this.handleError);
  }
  /*========endService service======*/

  /*======== get profile service======*/
  getProfile(url: string, os, osVersion, appVersion, memberId, sessionId): Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('os', os);
    urlSearchParams.append('osVersion', osVersion);
    urlSearchParams.append('appVersion', appVersion);
    urlSearchParams.append('memberId', memberId);
    urlSearchParams.append('sessionId', sessionId);

    //console.log(urlSearchParams.toString());
    let body = urlSearchParams.toString()
    return this.http
      .post(url, body, { headers: headers })
      .map(this.extractData)
      .catch(this.handleError);
  }
  /*========get profile service======*/
  /*========update profile service======*/
  profile(url: string, os, osVersion, appVersion, memberId, sessionId, name, phone, companyName,
    bankAccount, profilePic, profilePicType, uploadCertification, uploadCertificationType, isPushNotification, company_registration_no): Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('os', os);
    urlSearchParams.append('osVersion', osVersion);
    urlSearchParams.append('appVersion', appVersion);
    urlSearchParams.append('memberId', memberId);
    urlSearchParams.append('sessionId', sessionId);
    urlSearchParams.append('name', name);
    urlSearchParams.append('phone', phone);
    urlSearchParams.append('isPushNotification', isPushNotification);
    urlSearchParams.append('company_name', companyName);
    urlSearchParams.append('bankAccount', bankAccount);
    urlSearchParams.append('profilePic', profilePic);
    urlSearchParams.append('profilePicType', profilePicType);
    urlSearchParams.append('uploadCertification', uploadCertification);
    urlSearchParams.append('uploadCertificationType', uploadCertificationType);
    urlSearchParams.append('company_registration_no', company_registration_no);

    //console.log(urlSearchParams.toString());
    let body = urlSearchParams.toString()
    return this.http
      .post(url, body, { headers: headers })
      .map(this.extractData)
      .catch(this.handleError);
  }
  /*========update profile service======*/

  /*========job details submit service======*/
  jobDetailsSubmit(url: string,data): Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('os', data.deviceOs);
    urlSearchParams.append('osVersion', data.deviceOsVer);
    urlSearchParams.append('appVersion', data.appVertion);
    urlSearchParams.append('memberId', data.memberId);
    urlSearchParams.append('sessionId', data.sessionId);
    urlSearchParams.append('serviceRequestID', data.rqstId);
    urlSearchParams.append('imageDesc', data.imgData);
    urlSearchParams.append('requestRemark', data.remark);
    urlSearchParams.append('customerExtraPaid',data.cashrecived)
    urlSearchParams.append('report_status', data.jobStatus);
    urlSearchParams.append('jobDate', data.myDate);
    urlSearchParams.append('jobTime', data.adjustedTime);
    urlSearchParams.append('quotationDesc', data.descrpn);
    urlSearchParams.append('quotationPrice', data.price);

    let body = urlSearchParams.toString()
    console.log(body);
    return this.http
      .post(url, body, { headers: headers })
      .map(this.extractData)
      .catch(this.handleError);
  }
  /*========job details submit service======*/

  /*========I am interested service======*/
  IMInterested(url: string, os, osVersion, appVersion, memberId, sessionId, serviceRequestId): Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('os', os);
    urlSearchParams.append('osVersion', osVersion);
    urlSearchParams.append('appVersion', appVersion);
    urlSearchParams.append('memberId', memberId);
    urlSearchParams.append('sessionId', sessionId);
    urlSearchParams.append('name', name);
    urlSearchParams.append('serviceRequestId', serviceRequestId);


    //console.log(urlSearchParams.toString());
    let body = urlSearchParams.toString()
    return this.http
      .post(url, body, { headers: headers })
      .map(this.extractData)
      .catch(this.handleError);
  }
  /*========I am interested service======*/

  /*========notification service======*/
  getNotification(url: string, os, osVersion, appVersion, memberId, sessionId): Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('os', os);
    urlSearchParams.append('osVersion', osVersion);
    urlSearchParams.append('appVersion', appVersion);
    urlSearchParams.append('memberId', memberId);
    urlSearchParams.append('sessionId', sessionId);

    //console.log(urlSearchParams.toString());
    let body = urlSearchParams.toString()
    return this.http
      .post(url, body, { headers: headers })
      .map(this.extractData)
      .catch(this.handleError);
  }
  /*========notification service======*/
  /*========wallet service======*/
  wallet(url: string, os, osVersion, appVersion, memberId, sessionId): Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('os', os);
    urlSearchParams.append('osVersion', osVersion);
    urlSearchParams.append('appVersion', appVersion);
    urlSearchParams.append('memberId', memberId);
    urlSearchParams.append('sessionId', sessionId);

    //console.log(urlSearchParams.toString());
    let body = urlSearchParams.toString()
    return this.http
      .post(url, body, { headers: headers })
      .map(this.extractData)
      .catch(this.handleError);
  }
  /*========wallet service======*/

  /*========wallet service======*/
  changePassword(url: string, os, osVersion, appVersion, memberId, sessionId, oldPassword, newPassword): Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('os', os);
    urlSearchParams.append('osVersion', osVersion);
    urlSearchParams.append('appVersion', appVersion);
    urlSearchParams.append('memberId', memberId);
    urlSearchParams.append('sessionId', sessionId);
    urlSearchParams.append('oldPassword', oldPassword);
    urlSearchParams.append('newPassword', newPassword);

    //console.log(urlSearchParams.toString());
    let body = urlSearchParams.toString()
    return this.http
      .post(url, body, { headers: headers })
      .map(this.extractData)
      .catch(this.handleError);
  }
  /*========wallet service======*/
}
