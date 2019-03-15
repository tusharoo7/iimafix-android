import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ListPage } from '../list/list';
import { NotificationPage } from '../notification/notification';
import { ProfilePage } from '../profile/profile';
import { WalletPage } from '../wallet/wallet';
/**
 * Generated class for the TabsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
// activated tab views
export class TabsPage {

  constructor(public menuCtrl: MenuController, public navCtrl: NavController, public navParams: NavParams) {
    this.menuCtrl.enable(true);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }
  tab1Root: any = HomePage;
 tab2Root: any = NotificationPage;
  //  tab2Root: any = '';
  //   tab3Root: any = '';
  tab3Root: any = WalletPage;
  tab4Root: any = ProfilePage;
 ionViewCanEnter(){
    if(undefined!=this.navCtrl.getActive())
    {
      if(this.navCtrl.length()==1)
      return false;
    }
  }
}
