import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{

    //intercepta a requisição e executa a lógica dentro do método
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        console.log('Inteceptor: passou')
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


                return Observable.throw(errorObj);
            }) as any;

    }
 
}
//fornece informações, exigência do angular
export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi:true,
};
