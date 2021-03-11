import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Match } from './match.model';
import { MatchService } from './match.service';
import { MatDialog } from "@angular/material/dialog";
import { DialogUserInformationComponent } from './dialog-user-information/dialog-user-information.component';
import { Answer } from './answer.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Board } from '../board/board.model';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit, OnDestroy {


  matches: Match[] = [];
  matchesScore: Match[] = [];
  subMatch: Subscription;
  subMatchScore: Subscription;
  users: Answer[] = [];
  answerSub: Subscription;
  date: Date;
  dataRefresher: any;
  isShowTimer = true;
  scoreVal = 0;
  btnClicked = false;
  Boards: Board[] = [];
  userName: string;

  constructor(private matchService: MatchService, private authService:
    AuthService, public dialog: MatDialog, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
   this.userName = this.authService.getUserName();
   this.authService.geAuthStatusListener().subscribe( isAuthenticated => {
    this.userName = this.authService.getUserName();
   });

    this.refreshData();
    // this.refreshScore();
    const currentDate = new Date();
    this.matchService.getMatches();
    this.matchService.getMatchesScores();

    this.subMatch = this.matchService.getMatchUpdateListener().subscribe(response => {

      this.matches = response;

    });

this.subMatchScore = this.matchService.getMatchScoreUpdateListener().subscribe(response => {
  this.matchesScore = response;
});

    this.authService.getUserClickedCredential();
    this.answerSub = this.authService.getAnswerUpdateListener().subscribe(Response => {
      this.users = Response;
      this.date = currentDate;
    });



  }


  // stopClickListenerTimer() {
  //   this.isShowTimer = !this.isShowTimer;

  // }

  // onClickedinfoByAdmin() {
  //   const currentDate = new Date();
  //   this.authService.getUserClickedCredential();
  //   this.answerSub = this.authService.getAnswerUpdateListener().subscribe( Response => {
  //     this.users = Response;
  //     this.date = currentDate;
  //   })
  // }

  // match.id, scoreVal, match.teamId, match.description, match.fPlayer, match.sPlayer, match.teamName
  updateScore(matchId, scoreVal, teamId, description, fPlayer, sPlayer, tPlayer, foPlayer, teamName) {

    this.matchService.updateMatch(matchId, scoreVal, teamId, description, fPlayer, sPlayer, tPlayer, foPlayer, teamName);
    this.matchService.getMatchUpdateListener()
     .subscribe( Response => {
        console.log(scoreVal);
        this.scoreVal = scoreVal;
     });
  }


  onHandRaised() {
    const audio = new Audio();
    audio.src = '/../../../assets/audio/marimba.mp3';
    audio.load();
    audio.play();

    this.btnClicked = true;
    const currentDate = new Date();
    //  this.authService.addUserClickedCredential();
    this.authService.updateUserClickedCredential();
    this.authService.getUserClickedCredential();
    this.answerSub = this.authService.getAnswerUpdateListener().subscribe(Response => {

      this.users = Response;
      this.date = currentDate;
    });



    // this.clickStatus = true;

    // console.log(this.user);
    // this.playerClicked = true;
    // let dialogRef = this.dialog.open(DialogUserInformationComponent, {data : {name: this.user }});

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    //   if (result === true) {
    //     this.playerClicked = false;
    //   } else {
    //     this.playerClicked = true;
    //   }
    // });

  }


  onReleasedClickedByAdmin() {

    this.authService.updateUserClickedCredentialByAdmin();
    // this.clickStatus = false;
    this.date = null;
    this.isShowTimer = !this.isShowTimer;
    this.btnClicked = false;

  }


  refreshData() {

    const currentDate = new Date();
    if (this.isShowTimer === true) {
      this.dataRefresher =
        setInterval(() => {
          this.authService.getUserClickedCredential();
          this.answerSub = this.authService.getAnswerUpdateListener().subscribe(Response => {
            this.users = Response;
            this.date = currentDate;
            //  this._snackBar.open('Hand raised by ', 'Baqer', {
            //     duration: 5000,
            //   });
          });

          this.matchService.getMatchesScores();
          this.subMatch = this.matchService.getMatchScoreUpdateListener().subscribe(response => {
            this.matchesScore = response;
          });


        }, 1000);


    } else {
      clearInterval(this.dataRefresher);
    }

  }

  // refreshScore() {
  //   if (this.isShowTimer === true) {
  //     this.dataRefresher =
  //       setInterval(() => {
  //         this.matchService.getMatches();


  //       }, 2000);


  //   } else {

  //     clearInterval(this.dataRefresher);
  //   }

  // }

  // openSnackBar(message: string, action: string) {
  //   this._snackBar.open(message, action, {
  //     duration: 2000,
  //   });
  // }

  onLogout() {
    this.authService.logOut();
  }


  ngOnDestroy() {

    this.subMatch.unsubscribe();
    this.answerSub.unsubscribe();
    this.subMatchScore.unsubscribe();

    if (this.dataRefresher) {

      clearInterval(this.dataRefresher);
    }

  }

}
