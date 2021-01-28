import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Match } from '../match/match.model';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  private match: Match[] = [];
  private matchUpadted = new Subject<Match[]>();

  constructor(private http: HttpClient, private router: Router) { }

// get matches
getMatches() {
   this.http.get<{message: string, matches: any}>('/api/match/')
   .pipe(map(matchdata => {
     console.log(matchdata);
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
  addMatch(teamId: string, teamName: string, teamdescription: string, fPlayer: string, sPlayer: string, score: string) {
    const match: Match = { id: null, teamId: teamId, teamName: teamName, description: teamdescription, fPlayer: fPlayer, sPlayer: sPlayer, score: score };

     this.http.post<{ message: string, matchId: string }>('/api/match/', match)
       .subscribe(responseData => {

        const matchId = responseData.matchId;
        match.id = matchId;
        this.match.push(match);
        this.matchUpadted.next([...this.match]);
       });
  }



  getMatchUpdateListener() {
    return this.matchUpadted.asObservable();
  }


}
