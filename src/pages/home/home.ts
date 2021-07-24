import { Component } from '@angular/core';
import { IonicPage, MenuController, NavController } from 'ionic-angular';
import { CredenciaisDTO } from '../../models/credenciais.dto';
import { AuthService } from '../../services/auth.service';

@IonicPage()// me permite escrever o nome da página entre aspas
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  creds: CredenciaisDTO={
    email:"",
    senha:""
  }

  constructor(public navCtrl: NavController,
              public menu: MenuController,
              public auth: AuthService) {

  }

  ionViewWillEnter() {
    this.menu.swipeEnable(false);
  }

  ionViewDidLeave() {
    this.menu.swipeEnable(true);
  }
  login(){
    this.auth.authenticate(this.creds).subscribe((res)=>{
      this.auth.successfullLogin(res.headers.get('Authorization'))
      this.navCtrl.setRoot("CategoriasPage")
    },
    (erro)=>{});
   }

}
