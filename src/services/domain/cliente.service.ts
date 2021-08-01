import { ClienteDTO } from './../../models/cliente.dto';
import { API_CONFIG } from './../../config/api.config';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/RX";
import { StorageService } from '../storage.service';

@Injectable()
export class ClienteService{

  constructor(public http: HttpClient,
              public storage: StorageService){

  }

  findByEmail(email: string) {

    //let token = this.storage.getLocalUser().token;
    //let authHeader = new HttpHeaders({'Authorization':'Bearer '+token});

    return this.http.get(`${API_CONFIG.baseUrl}/clientes/email?value=${email}`);
  }

  getImageFromBucket(id: string) :Observable<any>{
    let url = `${API_CONFIG.bucketBaseUrl}/cp${id}.jpg`;

    return this.http.get(url,{responseType:'blob'});//imagem

  }

  insert(obj:ClienteDTO){
      return this.http.post(`${API_CONFIG.baseUrl}/clientes`,
                              obj,
                              {
                                observe:'response',
                                responseType:'text'//texto pois o corpo vem vazio e querop evitar erro de parse de json
                              });
    }

}
