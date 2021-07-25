import { API_CONFIG } from './../config/api.config';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { StorageService } from "../services/storage.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{


  constructor(public storage: StorageService){

  }

    //intercepta a requisição e executa a lógica dentro do método
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
      let localUser = this.storage.getLocalUser();

      let N = API_CONFIG.baseUrl.length;
      let requestToApi= req.url.substr(0,N) == API_CONFIG.baseUrl;

      if(localUser && requestToApi){
        const authReq = req.clone({headers:req.headers.set('Authorization','Bearer '+localUser.token)});
        return next.handle(authReq);

      }else{
        return next.handle(req)
      }

    }

}
//fornece informações, exigência do angular
export const AuthInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi:true,
};
