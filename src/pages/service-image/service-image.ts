import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ServiceImagePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-service-image',
  templateUrl: 'service-image.html',
})
export class ServiceImagePage {
  img: any;
  tabBarElement: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.img = sessionStorage.getItem('image');

  }


  //////for hide/display ion tab/////////
  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryDetails');
    this.tabBarElement.style.display = 'none';

  }
  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';

  }
  //////for hide/display ion tab////////
}
