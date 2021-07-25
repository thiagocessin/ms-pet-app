import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AlertController } from "ionic-angular";
import { Observable } from "rxjs";
import { StorageService } from "../services/storage.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{

    constructor(public storage:StorageService,
                public alertCtrl : AlertController){


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

                  case 401:
                    this.handle401();
                    break;
                  case 403:
                    this.handle403();
                    break;
                  default:
                    this.handleDefaultError(errorObj);

                }

                return Observable.throw(errorObj);
            }) as any;

    }

    handleDefaultError(errorObj) {

      let alert = this.alertCtrl.create({
        title:'Erro : '+ errorObj.status + ': '+ errorObj.error,
        message: errorObj.message,
        enableBackdropDismiss: false,//não aceita tocar fora para sair
        buttons:[
          {
            text:'Ok'
          }
        ]

      });

      alert.present();
    }

    handle401() {
      let alert = this.alertCtrl.create({
        title:'Erro 401: Falha de autenticação',
        message:'Email ou senha incorretos',
        enableBackdropDismiss: false,//não aceita tocar fora para sair
        buttons:[
          {
            text:'Ok'
          }
        ]

      });

      alert.present();

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
