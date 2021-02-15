import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Team } from './teams.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Match } from '../match/match.model';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  // http://localhost:8080
  private url: string = 'http://localhost:8080';
  private teams: Team[] = [];
  private match: Match[] = [];
  private teamsUpdated = new Subject<Team[]>();
  private matchUpadted = new Subject<Match[]>();

  constructor(private http: HttpClient, private router: Router) { }

  // get teams
  getTeams() {
    this.http.get<{ message: string, teams: any }>(this.url + '/api/teams')
      .pipe(map((teamData) => {
        console.log(teamData);
        return teamData.teams.map(team => {
          return {
            name: team.name,
            description: team.description,
            id: team._id,
            fPlayer: team.fPlayer,
            sPlayer: team.sPlayer,
            score: team.score
          }
        });
      }))
      .subscribe(responseData => {
        console.log(responseData);
        this.teams = responseData;
        this.teamsUpdated.next([...this.teams]);

      });
  }

  // get single team - Edit
  getTeam(teamId: string) {
    return this.http.get<{ _id: string, name: string, description: string, fPlayer: string, sPlayer: string, score: string }>(this.url + '/api/teams/' + teamId);

  }

  // add teams
  addTeam(teamName: string, teamdescription: string) {
    const team: Team = { id: null, name: teamName, description: teamdescription, fPlayer: null, sPlayer: null, score: 0 };
    this.http.post<{ message: string, teamId: string }>(this.url + '/api/teams', team)
      .subscribe(responseData => {
        const teamId = responseData.teamId;
        team.id = teamId;
        this.teams.push(team);
        this.teamsUpdated.next([...this.teams]);
      });

  }

  // delete teams
  deleteTeam(teamId: string) {
    this.http.delete(this.url + '/api/teams/' + teamId)
      .subscribe(() => {
        const updatedTeams = this.teams.filter(team => team.id !== teamId);
        this.teams = updatedTeams;
        this.teamsUpdated.next([...this.teams]);
      })
      ;
  }

  // update team
  updateTeam(teamId: string, name: string, description: string) {
    const team = { id: teamId, name: name, description: description, fPlayer: null, sPlayer: null, score: null };
    this.http.put(this.url + '/api/teams/' + teamId, team)
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


  // add players on team

  addPlayers(teamId: string, name: string, description: string, firstPlayer: string, secondPlayer: string, score: number) {
    const team = { id: teamId, name: name, description: description, fPlayer: firstPlayer, sPlayer: secondPlayer, score: score };

    this.http.put(this.url + "/api/teams/players/" + teamId, team).subscribe(response => {
      const updatedTeam = [...this.teams];
      const oldTeamIndex = updatedTeam.findIndex(p => p.id === team.id);
      updatedTeam[oldTeamIndex] = team;
      this.teams = updatedTeam;
      this.teamsUpdated.next([...this.teams]);
      this.router.navigate(["/teams"]);

    })

  }

  //  asObservable
  getTeamUpdateListener() {
    return this.teamsUpdated.asObservable();
  }




}
