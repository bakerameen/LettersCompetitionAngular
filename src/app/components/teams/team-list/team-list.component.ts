import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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

  constructor(public teamservice: TeamsService) { }

  ngOnInit(): void {

    this.teamservice.getTeams();
    this.subTeams = this.teamservice.getTeamUpdateListener()
      .subscribe((teams: Team[]) => {
        this.teams = teams;

      });
  }

  onDelete(team) {
    this.teamservice.deleteTeam(team);
  }

  ngOnDestroy() {
    this.subTeams.unsubscribe();
  }

}
