import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JwtHelper } from "angular2-jwt";
import { API_CONFIG } from "../config/api.config";
import { CredenciaisDTO } from "../models/credenciais.dto";
import { LocalUser } from "../models/local_user";
import { CartService } from "./domain/cart.service";
import { StorageService } from "./storage.service";

@Injectable()
export class AuthService{

jwtHelper: JwtHelper = new JwtHelper();

constructor(public http: HttpClient,
            public storage: StorageService,
            public cartService: CartService){

}

authenticate(creds: CredenciaisDTO){
    return this.http.post(
        `${API_CONFIG.baseUrl}/login`,
        creds,//dados a serem enviados no body
        {
            observe: 'response',
            responseType:'text'
        });

  }

  refreshToken(){
    return this.http.post(
        `${API_CONFIG.baseUrl}/auth/refresh_token`,
        {},
        {
            observe: 'response',
            responseType:'text'
        });

  }

  //ação realizada quando o login for efetuado com sucesso
  successfullLogin(authorizationValue : string){
    //remove a palavra BEarer
    let tok = authorizationValue.substring(7);
    let user: LocalUser = {
      token:tok,
      email: this.jwtHelper.decodeToken(tok).sub
    }
    //armazena user no localstorage
    this.storage.setLocalUser(user);
    this.cartService.crateOrClearCart();

  }

  logout(){
    this.storage.setLocalUser(null);
  }

}
