import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Match } from './match.model';
import { MatchService } from './match.service';
import { MatDialog } from "@angular/material/dialog";
import { DialogUserInformationComponent } from './dialog-user-information/dialog-user-information.component';
import { Answer } from './answer.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit, OnDestroy {


  matches: Match[] = [];
  subMatch: Subscription;
  users: Answer[] = [];
  answerSub: Subscription;
  date: Date;
  dataRefresher: any;
  isShowTimer = true;
  scoreVal = 0;
  btnClicked = false;

  constructor(private matchService: MatchService, private authService: AuthService, public dialog: MatDialog, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {

   this.refreshData();
    const currentDate = new Date();
    this.matchService.getMatches();
    this.subMatch = this.matchService.getMatchUpdateListener().subscribe(response => {
      this.matches = response;
    });

    this.authService.getUserClickedCredential();
    this.answerSub = this.authService.getAnswerUpdateListener().subscribe(Response => {
      this.users = Response;
      this.date = currentDate;
    })
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

  updateScore(matchId, scoreVal) {
    this.matchService.updateMatch(matchId, scoreVal);
  }


  onHandRaised() {
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

        }, 5000);


    } else {
      console.log('fff')
      clearInterval(this.dataRefresher);
    }

  }

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

    if (this.dataRefresher) {

      clearInterval(this.dataRefresher);
    }

  }

}
