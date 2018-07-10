import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // tslint:disable-next-line:no-debugger
        debugger;
        return next.handle(req)
            .pipe(
                catchError(error => {
                    if (error instanceof HttpErrorResponse) {
                        const applicationError = error.headers.get('Application-Error');
                        if (applicationError) {
                            return Observable.throw(applicationError);
                        }
                        const serverError = error.error;
                        let modelStateErrors = '';
                        if (serverError && typeof serverError === 'object') {
                            for (const key in serverError) {
                                if (serverError[key]) {
                                    modelStateErrors += serverError[key] + '\n';
                                }
                            }
                        }
                        return Observable.throw(modelStateErrors || serverError || 'Server error');
                    }
                })
            );
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
};
