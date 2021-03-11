import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { MatchService } from '../../match/match.service';
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

  constructor(public teamservice: TeamsService, private authService: AuthService, private matcService: MatchService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.teamservice.getTeams();
    this.subTeams = this.teamservice.getTeamUpdateListener()
      .subscribe((teams: Team[]) => {
        this.isLoading = false;
        this.teams = teams;
        // console.log('baer' + JSON.stringify(teams));
        console.log(this.teams);
      });
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authListenerSub = this.authService.geAuthStatusListener().subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

  }

  onAddMatch(team) {
      this.matcService.addMatch(team.id, team.name, team.description, team.fPlayer, team.sPlayer, team.tPlayer, team.foPlayer, team.score);
  }


  onDelete(team) {
    this.teamservice.deleteTeam(team);
  }

  ngOnDestroy() {
    this.subTeams.unsubscribe();
    this.authListenerSub.unsubscribe();
  }

  onChangePage(pageData: PageEvent) {
  // console.log(pageData);
  }

}
