import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Match } from '../match/match.model';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';



@Injectable({
  providedIn: 'root'
})
export class MatchService {

  // private url: string = 'http://localhost:8080/';
  private match: Match[] = [];
  private matchUpadted = new Subject<Match[]>();

  constructor(private http: HttpClient) { }





// get matches
getMatches() {
   this.http.get<{message: string, matches: any}>('http://localhost:8080/api/match/')
   .pipe(map(matchdata => {
     console.log(matchdata)
     return matchdata.matches.map(matchResponse => {
       return {
       id: matchResponse._id,
      teamId: matchResponse.teamId,
      teamName: matchResponse.teamName,
      description: matchResponse.description,
      fPlayer: matchResponse.fPlayer,
      sPlayer: matchResponse.sPlayer,
      score: matchResponse.score
    }
     })
   }))
   .subscribe( responseData => {
    this.match = responseData;
    this.matchUpadted.next([...this.match]);
  })

}


  // add match
  addMatch(teamId: string, teamName: string, teamdescription: string, fPlayer: string, sPlayer: string, score: number) {
    const match: Match = { id: null, teamId: teamId, teamName: teamName, description: teamdescription, fPlayer: fPlayer, sPlayer: sPlayer, score: score };

     this.http.post<{ message: string, matchId: string }>('http://localhost:8080/api/match/', match)
       .subscribe(responseData => {

        const matchId = responseData.matchId;
        match.id = matchId;
        this.match.push(match);
        this.matchUpadted.next([...this.match]);
       });
  }

// matchId, scoreVal, teamId, description, fPlayer, sPlayer, teamName
  updateMatch(matchId, scoreVal, teamId, description, fPlayer, sPlayer, teamName ) {

    const teamUpdate = {id: matchId, score: scoreVal, teamId: teamId, description:description, fPlayer: fPlayer, sPlayer: sPlayer, teamName: teamName };
this.http.put<{message: Message, match: any}>('http://localhost:8080/api/match/' + matchId, teamUpdate).subscribe(Response => {
  const updatedMatch = [...this.match];
  const oldTeamIndex = updatedMatch.findIndex(p => p.id === teamUpdate.id);
   updatedMatch[oldTeamIndex] = teamUpdate;
   this.match = updatedMatch;
   this.matchUpadted.next([...this.match]);
})
  }

  getMatchUpdateListener() {
    return this.matchUpadted.asObservable();
  }


}
