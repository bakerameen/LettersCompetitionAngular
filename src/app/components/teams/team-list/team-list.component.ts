import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Team } from '../teams.model';
import { TeamsService } from '../teams.service';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss']
})
export class TeamListComponent implements OnInit, OnDestroy {
  teams: Team[] = [];
  private subTeams: Subscription;
  private authListenerSub :  Subscription;
  userIsAuthenticated = false;
  isLoading = false;
  totalTeams = 10;
  teamPerPage = 5;
  pageSizeOptions = [1, 2 , 5, 10];

  constructor(public teamservice: TeamsService, private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.teamservice.getTeams();
    this.subTeams = this.teamservice.getTeamUpdateListener()
      .subscribe((teams: Team[]) => {
        this.isLoading = false;
        this.teams = teams;
      });
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authListenerSub = this.authService.geAuthStatusListener().subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onDelete(team) {
    this.teamservice.deleteTeam(team);
  }

  ngOnDestroy() {
    this.subTeams.unsubscribe();
    this.authListenerSub.unsubscribe();
  }

  onChangePage(pageData: PageEvent) {
console.log(pageData);
  }

}
