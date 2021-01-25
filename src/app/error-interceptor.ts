import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ErrorComponent } from "./components/error/error.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

constructor(private dailog: MatDialog ){}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occured!';
if (error.error.message) {
errorMessage = error.error.message;

}

        this.dailog.open(ErrorComponent, {data : {message: errorMessage}});
        // alert(error.error.error.message);
        //alert(error.error.message);
        return throwError(error);
      })
    );
  }
}

