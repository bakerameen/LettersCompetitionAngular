import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './components/auth/auth.guard';
import { LoginComponent } from './components/auth/login/login/login.component';
import { SignupComponent } from './components/auth/signup/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { TeamCreateComponent } from './components/teams/team-create/team-create.component';
import { TeamListComponent } from './components/teams/team-list/team-list.component';



const routes: Routes = [
  { path: '', component: HomeComponent  },
  { path: 'teams', component: TeamListComponent, canActivate: [AuthGuard] },
  { path: 'teamcreate', component: TeamCreateComponent, canActivate: [AuthGuard]  },
  { path: 'teamedit/:teamId', component: TeamCreateComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
