import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Team } from './teams.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  private teams: Team[] = [];
  private teamsUpdated = new Subject<Team[]>();

  constructor(private http: HttpClient) { }

  // get teams
  getTeams() {
    this.http.get<{ message: string, teams: any }>('api/teams')
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



  // add teams
  addTeam(teamName: string, teamdescription: string) {
    const team: Team = { id: null, name: teamName, description: teamdescription };
    this.http.post<{ message: string, teamId: string }>('api/teams', team)
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
    this.http.delete('api/teams/' + teamId)
    .subscribe(()=> {
      const updatedTeams = this.teams.filter(team => team.id !==  teamId);
      this.teams = updatedTeams;
      this.teamsUpdated.next([...this.teams]);
    })
    ;
  }

  //  asObservable
  getTeamUpdateListener() {
    return this.teamsUpdated.asObservable();
  }

}
