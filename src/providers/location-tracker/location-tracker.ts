import { Injectable, NgZone } from '@angular/core';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';
import { Platform,AlertController } from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';
@Injectable()
export class LocationTracker {

  public watch: any;
  lat: any = '0.0';
  lng: any = '0.0';

  constructor(public alertCtrl: AlertController,private diagnostic: Diagnostic,platform: Platform,private geolocation: Geolocation, private backgroundGeolocation: BackgroundGeolocation, public zone: NgZone) {
  
  }
getLocation(){
 let locationOptions = {timeout: 2000, enableHighAccuracy: true};
 
    this.geolocation.getCurrentPosition(locationOptions).then((position) => {
        this.lat=position.coords.latitude;
        this.lng=position.coords.longitude
    }).catch((error) => {
      this.getLocation();
    });

}
checkLocation()
{

this.diagnostic.isLocationEnabled().then(
(isAvailable) => {
console.log('Is available? ' + isAvailable);
alert('Is available? ' + isAvailable);
if(isAvailable==true){
this.getLocation();
}
else{
    let alert = this.alertCtrl.create({
            title: 'Restor Nation',
            subTitle: 'Turn on location.',
            buttons: [
              {
                text: 'Ok',
                handler: data => {
                
                }
              }
            ]
          });
}
}).catch( (e) => {
console.log(e);
let alert = this.alertCtrl.create({
            title: 'Restor Nation',
            subTitle: 'Something went wrong.',
            buttons: [
              {
                text: 'Ok',
                handler: data => {
                
                }
              }
            ]
          });
});
}

/////BGLocation may be future enhance////
//   startTracking() {
// let successCallback = (isAvailable) => {
//        // alert(isAvailable);
//         if (isAvailable == true) {
         
//         }
//         else {
//           let alert = this.alertCtrl.create({
//             title: 'Restor Nation',
//             subTitle: 'Turn on location.',
//             buttons: [
//               {
//                 text: 'Ok',
//                 handler: data => {
                
//                 }
//               }
//             ]
//           });
//         }
//       };
//       let errorCallback = (e) => console.error(e);

//      this.diagnostic.isLocationEnabled().then(successCallback, errorCallback);

//   // Foreground Tracking

//     let options = {
//       frequency: 1000,
//       enableHighAccuracy: false
//     };

//     this.watch = this.geolocation.watchPosition(options).subscribe((position: Geoposition) => {

//     //  alert(position);

//       // Run update inside of Angular's zone
//       this.zone.run(() => {
//         this.lat = position.coords.latitude;
//         this.lng = position.coords.longitude;
//       });
// //alert(JSON.stringify(this.watch));
//     });

//     // Background Tracking

//     let config = {
//       desiredAccuracy: 10,
//             stationaryRadius: 20,
//             distanceFilter: 30,
//             debug: false, //  enable this hear sounds for background-geolocation life-cycle.
//             stopOnTerminate: false, // enable this to clear background location settings when the app terminates
//             startForeground:false
//     };

//     this.backgroundGeolocation.configure(config).subscribe((location) => {
//       //alert('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);
           
//       // Run update inside of Angular's zone
//       this.zone.run(() => {
//         this.lat = location.latitude;
//         this.lng = location.longitude;
//        // alert(this.lat);
//       });

//     }, (err) => {

//       console.log(err);

//     });

//     // Turn ON the background-geolocation system.
//     this.backgroundGeolocation.start();


 
//   }

//   stopTracking() {


//     console.log('stopTracking');

//     this.backgroundGeolocation.finish();

//   }

}