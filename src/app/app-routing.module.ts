import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './components/auth/auth.guard';
import { LoginComponent } from './components/auth/login/login/login.component';
import { SignupComponent } from './components/auth/signup/signup/signup.component';
import { BoardCreateComponent } from './components/board/board-create/board-create.component';

import { HomeComponent } from './components/home/home.component';
import { MatchComponent } from './components/match/match.component';
import { TeamCreateComponent } from './components/teams/team-create/team-create.component';
import { TeamJoinComponent } from './components/teams/team-join/team-join.component';
import { TeamListComponent } from './components/teams/team-list/team-list.component';




const routes: Routes = [
  { path: '', component: HomeComponent  },
  { path: 'teams', component: TeamListComponent, canActivate: [AuthGuard] },
  { path: 'teamcreate', component: TeamCreateComponent, canActivate: [AuthGuard]  },
  { path: 'teamedit/:teamId', component: TeamCreateComponent, canActivate: [AuthGuard]},
  { path: 'teamjoin/:teamId', component: TeamJoinComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'match', component: MatchComponent},
  { path: 'board', component: BoardCreateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
