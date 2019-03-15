import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { GlobalServiceProvider } from '../../providers/global-service/global-service';
import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';

@IonicPage()
@Component({
  selector: 'page-start',
  templateUrl: 'start.html',
})
// this is start section of this project from this section project satrted
export class StartPage {
  img: any;
  tabBarElement: any;
  constructor(public globalservice: GlobalServiceProvider, public menuCtrl: MenuController, public navCtrl: NavController, public navParams: NavParams) {
    this.tabBarElement = '';
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

  }
  //   ngOnInit() {
  //   setTimeout(() => {
  //   this.slideChanged();

  //   }, 4500);

  // }
  ionViewDidLoad() {
    //this.tabBarElement.style.display = 'none';
    this.img = './assets/img/intro-bg.jpg';
    setTimeout(() => {
      this.menuCtrl.enable(false);
    }, 1500);
    let loadingPop = this.globalservice.createLoadingBar();
    loadingPop.dismiss();
  }
  // go to login page
  goLogin() {
    this.navCtrl.push(LoginPage);
  }
  // go to signup page
  goSignup() {
    this.navCtrl.push(SignupPage);
  }

}
