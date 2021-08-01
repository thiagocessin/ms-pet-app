import { PedidoDTO } from './../../models/pedido.dto';
import { EnderecoDTO } from './../../models/endereco.dto';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ClienteService } from '../../services/domain/cliente.service';
import { StorageService } from '../../services/storage.service';
import { CartService } from '../../services/domain/cart.service';

@IonicPage()
@Component({
  selector: 'page-pick-address',
  templateUrl: 'pick-address.html',
})
export class PickAddressPage {

  items: EnderecoDTO[];
  pedido: PedidoDTO;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public clienteService:ClienteService,
              public storage: StorageService,
              public cartService: CartService) {
  }

  ionViewDidLoad() {

    let localUser = this.storage.getLocalUser();

    if(localUser && localUser.email){
      this.clienteService.findByEmail(localUser.email)
        .subscribe(res =>{
          this.items = res['enderecos'];
          let cart = this.cartService.getCart();

          this.pedido = {
            cliente:{id:res['id']},
            enderecoDeEntrega:null,
            pagamento:null,
            itens: cart.items.map(item=>{
              return {quantidade:item.quantidade,produto:{id:item.produto.id}}
            })
          }
        },
        (error)=>{

          if(error.status == 403){
            this.navCtrl.setRoot('HomePage');

          }
        })
    }else{
      this.navCtrl.setRoot('HomePage');
    }


  }

  nextPage(endereco:EnderecoDTO){
    this.pedido.enderecoDeEntrega = {id:endereco.id};
    this.navCtrl.push('PaymentPage',{pedido:this.pedido});
  }

}
