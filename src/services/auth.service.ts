import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_CONFIG } from "../config/api.config";
import { CredenciaisDTO } from "../models/credenciais.dto";
import { LocalUser } from "../models/local_user";
import { StorageService } from "./storage.service";

@Injectable()
export class AuthService{

constructor(public http: HttpClient,
            public storage: StorageService){

}

authenticate(creds: CredenciaisDTO){
    return this.http.post(
        `${API_CONFIG.baseUrl}/login`,
        creds,
        //especifico a resposta com header
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
      token:tok
    }
    //armazena user no localstorage
    this.storage.setLocalUser(user);

  }

  logout(){
    this.storage.setLocalUser(null);
  }

}
