import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Team } from '../teams.model';
import { TeamsService } from '../teams.service';

@Component({
  selector: 'app-team-create',
  templateUrl: './team-create.component.html',
  styleUrls: ['./team-create.component.scss']
})
export class TeamCreateComponent implements OnInit {
  value = 'Clear me';
  teamName = '';
  teamDescription = '';


  constructor(public teamservice: TeamsService) { }

  ngOnInit(): void {
  }

  onAddTeams(teamForm: NgForm) {
    //  we can send as oject or as parameters

    // const team: Team = {
    //   name: teamForm.value.teamName,
    //   description: teamForm.value.teamDescription,
    // };
    this.teamservice.addTeam(teamForm.value.teamName, teamForm.value.teamDescription);
    teamForm.resetForm();
  }

}
