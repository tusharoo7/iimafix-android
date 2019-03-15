/*========Ionic-angular core packages========*/
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
/*========Ionic-angular core packages========*/
/*========App pages========*/
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { StartPage } from '../pages/start/start';
import { SignupPage } from '../pages/signup/signup';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { ForgotPassPage } from '../pages/forgot-pass/forgot-pass';
import { ServicePage } from '../pages/service/service';
import { Map } from '../pages/map/map'; 
import { JobDetailsPage } from '../pages/job-details/job-details';
import { ServiceImagePage } from '../pages/service-image/service-image';
import { NotificationPage } from '../pages/notification/notification';
import { ProfilePage } from '../pages/profile/profile';
import { WalletPage } from '../pages/wallet/wallet';
import { JobDetailsSubmitPage } from '../pages/job-details-submit/job-details-submit';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { StartJobPopupPage } from '../pages/start-job-popup/start-job-popup';
/*========App pages========*/

/*========App Native packages========*/
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Toast } from '@ionic-native/toast';
import { Facebook } from '@ionic-native/facebook';
import { GlobalServiceProvider } from '../providers/global-service/global-service';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';
import { Sim } from '@ionic-native/sim';
import { LocationTracker } from '../providers/location-tracker/location-tracker';
import { ImagePicker } from '@ionic-native/image-picker';
import { Base64 } from '@ionic-native/base64';
import { GoogleMaps } from '@ionic-native/google-maps';
//import { Push } from '@ionic-native/push';
import { Camera } from '@ionic-native/camera';
import { Network } from '@ionic-native/network';
import { Diagnostic } from '@ionic-native/diagnostic';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { PhotoViewer } from '@ionic-native/photo-viewer';
//import { DatePicker } from 'ionic2-date-picker';
import { DatePickerModule } from 'ionic2-date-picker';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { FCM } from '@ionic-native/fcm';
import { QRScanner } from '@ionic-native/qr-scanner';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Crop } from '@ionic-native/crop';
/*========App Native packages========*/

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    StartPage,
    LoginPage,
    SignupPage,
    TabsPage,
    ForgotPassPage,
    ServicePage,
    Map,
    JobDetailsPage,
    ServiceImagePage,
    NotificationPage,
    ProfilePage,
    WalletPage,
    JobDetailsSubmitPage,
   // DatePicker,
    ChangePasswordPage,
    StartJobPopupPage
  ],
  imports: [
    BrowserModule, HttpModule,
    IonicModule.forRoot(MyApp, { tabsPlacement: 'bottom', tabsHideOnSubPages: true, scrollPadding: false,
    scrollAssist: true, 
    autoFocusAssist: false }),
    IonicImageViewerModule,
    DatePickerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    StartPage,
    LoginPage,
    SignupPage,
    TabsPage,
    ForgotPassPage,
    ServicePage,
    Map,
    JobDetailsPage,
    ServiceImagePage,
    NotificationPage,
    ProfilePage,
    WalletPage,
    JobDetailsSubmitPage,
   // DatePicker,
    ChangePasswordPage,
    StartJobPopupPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook,
    Toast,
    Device,
    Sim,
    BackgroundGeolocation,
    Geolocation,
    ImagePicker,
    Base64, GoogleMaps, FCM, Camera,Network,Diagnostic,PhotoViewer,InAppBrowser,QRScanner,Crop,BarcodeScanner,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    GlobalServiceProvider,
    LocationTracker
  ]
})
export class AppModule { }
