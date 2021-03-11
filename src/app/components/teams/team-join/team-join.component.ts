import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Team } from '../teams.model';
import { TeamsService } from '../teams.service';

@Component({
  selector: 'app-team-join',
  templateUrl: './team-join.component.html',
  styleUrls: ['./team-join.component.scss']
})
export class TeamJoinComponent implements OnInit, OnDestroy {

  teamId;
  teams: Team;
  Players: any[] = [];

  private subPlayers: Subscription;

  constructor(private authService: AuthService, private teamService: TeamsService, public router: ActivatedRoute) { }

  ngOnInit(): void {
    // Get Team
    this.router.paramMap.subscribe((paramMap: ParamMap) => {
      this.teamId = paramMap.get('teamId');
      this.teamService.getTeam(this.teamId).subscribe( (teamData) => {
// console.log(teamData);
       this.teams = { id: teamData._id, name: teamData.name, description: teamData.description, fPlayer: teamData.fPlayer, sPlayer: teamData.sPlayer, tPlayer: teamData.tPlayer, foPlayer: teamData.foPlayer, score: teamData.score };
      });

    });

    // Get Players
    this.authService.getPlayers();
    this.subPlayers = this.authService.getPlayerUpdateListener().subscribe( players => {
      this.Players = players;
    });


  }

  onAddPlayer(playerForm: NgForm) {
    // console.log(playerForm.value.teamName);
    // if (!playerForm) {
    //   return;
    // }

this.teamService.addPlayers(this.teamId, this.teams.name, this.teams.description, playerForm.value.firstPlayer,  playerForm.value.secondPlayer, playerForm.value.thiredPlayer, playerForm.value.fourthPlayer, this.teams.score );

  }

  ngOnDestroy() {
    return this.subPlayers.unsubscribe();
  }

}
