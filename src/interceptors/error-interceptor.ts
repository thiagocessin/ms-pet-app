import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { StorageService } from "../services/storage.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{

    constructor(public storage:StorageService){


    }

    //intercepta a requisição e executa a lógica dentro do método
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{

        return next.handle(req)
            .catch((error, caught)=>{
                let errorObj = error;

                if(errorObj.error){
                    errorObj = errorObj.error;
                }

                if(!errorObj.status){
                    errorObj = JSON.parse(errorObj);
                }
                console.log('Erro detectado pelo interceptor')
                console.log(errorObj)


                switch(errorObj.status){
                  case 403:
                    this.handle403();
                    break;
                }

                return Observable.throw(errorObj);
            }) as any;

    }

    //unauthorized
    handle403(){
      //remove obj do storage se ele existir
      this.storage.setLocalUser(null);
    }

}
//fornece informações, exigência do angular
export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi:true,
};
