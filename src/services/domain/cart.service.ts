import { ProdutoDTO } from './../../models/produto.dto';
import { Cart } from '../../models/cart.model';

import { Injectable } from "@angular/core";
import { StorageService } from "../storage.service";

@Injectable()
export class CartService{

    constructor(public storage:StorageService){

    }

    crateOrClearCart(): Cart{
      let cart: Cart = {items:[]};
      this.storage.setCart(cart);

      return cart;
    }

    getCart(): Cart{
      let cart = this.storage.getCart();

      if(cart == null){
        cart = this.crateOrClearCart();
      }
      return cart;
    }

    addProduto(produto:ProdutoDTO){
      let cart = this.getCart();
      let position = cart.items.findIndex(item => item.produto.id == produto.id);

      if(position == -1){
        cart.items.push({quantidade:1, produto:produto});
      }
      this.storage.setCart(cart);

      return cart;
    }


}
