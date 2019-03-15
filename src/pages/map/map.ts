import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { GoogleMaps } from '@ionic-native/google-maps';
declare var google;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class Map {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  tabBarElement: any;
  category:any;
  constructor(private googleMaps: GoogleMaps, public platform: Platform, public navCtrl: NavController, public navParams: NavParams) {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.category= sessionStorage.getItem('cat');

  }
  loadMap() {

    let latLng = new google.maps.LatLng(sessionStorage.getItem('lati'), sessionStorage.getItem('long'));

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
         var contentString =  sessionStorage.getItem('address');

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
    },2500);
        marker.addListener('click', function() {
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

  //  var infowindow = new google.maps.InfoWindow({
  //         content: content
  //       });
  //        marker.addListener('click', function() {
  //          alert('dd');
  //         infowindow.open(this.map, marker);
  //       });
  // }
  
  //////for hide/display ion tab/////////
  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryDetails');
    this.tabBarElement.style.display = 'none';
    this.loadMap();
  }
  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';

  }
  //////for hide/display ion tab////////
}
