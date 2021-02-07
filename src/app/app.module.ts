// Angualr Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// components
import { AppComponent } from './app.component';
import { TeamsComponent } from './components/teams/teams.component';
import { HeaderComponent } from './components/layouts/header/header.component';
import { FooterComponent } from './components/layouts/footer/footer.component';
import { TeamCreateComponent } from './components/teams/team-create/team-create.component';
import { TeamListComponent } from './components/teams/team-list/team-list.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login/login.component';
import { SignupComponent } from './components/auth/signup/signup/signup.component';
import { AuthIntercepter } from './components/auth/auth-intercepter';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './components/error/error.component';
import { TeamJoinComponent } from './components/teams/team-join/team-join.component';
import { MatchComponent } from './components/match/match.component';
import { DialogUserInformationComponent } from './components/match/dialog-user-information/dialog-user-information.component';

// Material
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatBadgeModule} from '@angular/material/badge';
import {MatSnackBarModule} from '@angular/material/snack-bar';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    TeamsComponent,
    TeamCreateComponent,
    TeamListComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    ErrorComponent,
    TeamJoinComponent,
    MatchComponent,
    DialogUserInformationComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSelectModule,
    MatBadgeModule,
    MatSnackBarModule,
    AppRoutingModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthIntercepter, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent, DialogUserInformationComponent]
  // entryComponents This inform Angular to run it even don't see it

})
export class AppModule { }
