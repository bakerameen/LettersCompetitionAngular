import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Team } from './teams.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { stringify } from '@angular/compiler/src/util';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  private teams: Team[] = [];
  private teamsUpdated = new Subject<Team[]>();

  constructor(private http: HttpClient, private router: Router) { }

  // get teams
  getTeams() {
    this.http.get<{ message: string, teams: any }>('http://localhost:8080/api/teams')
      .pipe(map((teamData) => {
        return teamData.teams.map(team => {
          return {
            name: team.name,
            description: team.description,
            id: team._id
          }
        });
      }))
      .subscribe(responseData => {
        this.teams = responseData;
        this.teamsUpdated.next([...this.teams]);
      });
  }

  // get single team - Edit
  getTeam(teamId: string) {
    return this.http.get<{ _id: string, name: string, description: string }>('http://localhost:8080/api/teams/' + teamId);

  }

  // add teams
  addTeam(teamName: string, teamdescription: string) {
    const team: Team = { id: null, name: teamName, description: teamdescription };
    this.http.post<{ message: string, teamId: string }>('http://localhost:8080/api/teams', team)
      .subscribe(responseData => {
        console.log(responseData);
        const teamId = responseData.teamId;
        team.id = teamId;
        this.teams.push(team);
        this.teamsUpdated.next([...this.teams]);
      });

  }

  // delete teams
  deleteTeam(teamId: string) {
    this.http.delete('http://localhost:8080/api/teams/' + teamId)
      .subscribe(() => {
        const updatedTeams = this.teams.filter(team => team.id !== teamId);
        this.teams = updatedTeams;
        this.teamsUpdated.next([...this.teams]);
      })
      ;
  }

  // update team
  updateTeam(teamId: string, name: string, description: string) {
    const team = { id: teamId, name: name, description: description };
    this.http.put('http://localhost:8080/api/teams/' + teamId, team)
      .subscribe(response => {
        const updatedTeam = [...this.teams];
        const oldTeamIndex = updatedTeam.findIndex(p => p.id === team.id);
        updatedTeam[oldTeamIndex] = team;
        this.teams = updatedTeam;
        this.teamsUpdated.next([...this.teams]);
        this.router.navigate(["/teams"]);
      })
      ;
  }

  //  asObservable
  getTeamUpdateListener() {
    return this.teamsUpdated.asObservable();
  }

}
