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

    removeProduto(produto:ProdutoDTO){
      let cart = this.getCart();
      let position = cart.items.findIndex(item => item.produto.id == produto.id);

      if(position != -1){
        cart.items.splice(position,1);
      }
      this.storage.setCart(cart);

      return cart;
    }

    increaseQuantity(produto:ProdutoDTO){
      let cart = this.getCart();
      let position = cart.items.findIndex(item => item.produto.id == produto.id);

      if(position != -1){
        cart.items[position].quantidade++;
      }
      this.storage.setCart(cart);

      return cart;
    }

    decreaseQuantity(produto:ProdutoDTO){
      let cart = this.getCart();
      let position = cart.items.findIndex(item => item.produto.id == produto.id);

      if(position != -1){
        cart.items[position].quantidade--;

        if(cart.items[position].quantidade < 1){
          cart = this.removeProduto(produto);
        }
      }
      this.storage.setCart(cart);

      return cart;
    }

    total():number{

      let cart = this.getCart();
      let sum = 0;

      for(var i = 0; i < cart.items.length;i++){
        sum+=cart.items[i].produto.preco* cart.items[i].quantidade;
      }
      return sum;
    }





}
