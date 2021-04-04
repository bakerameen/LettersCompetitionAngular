import { Component, OnDestroy, OnInit, ViewChild, ElementRef  } from '@angular/core';
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
  subTime: Subscription;
  subMatchScore: Subscription;
  users: Answer[] = [];
  answerSub: Subscription;
  date: Date;
  dataRefresher: any;
  timeRefresher: any;
  isShowTimer = true;
  isShowTimerExpired = true;
  scoreVal = 0;
  btnClicked = false;
  Boards: Board[] = [];
  userName: string;
  timerLeft;
  count = 10;
  timeout;
  animationClass = "notAnimated";
  // timerId;
  disbale: Subscription;

  constructor(private matchService: MatchService, private authService:
    AuthService, public dialog: MatDialog, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {

    // this.authService.getdisabled();
    // this.disbale = this.authService.getdisbaleListener().subscribe( response => {
    //  this.disbale = response;
    //  });



   this.userName = this.authService.getUserName();
   this.authService.geAuthStatusListener().subscribe( isAuthenticated => {
    this.userName = this.authService.getUserName();
   });

    this.refreshData();
    this.refreshTime();
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

        this.scoreVal = scoreVal;
     });
  }


  onHandRaised() {

    // this.authService.updateAnimation();
    // this.authService.getAnimation();
    // this.authService.getAnimationUpdateListener().subscribe(animation => {
    //   this.animationClass = animation;

    // });

    const audio = new Audio();
    audio.src = '/../../../assets/audio/marimba.mp3';
    audio.load();
    audio.play();

    // // this.btnClicked = true;
    // const currentDate = new Date();
    // const currentTime = currentDate.getSeconds();
    // const currentTimes = currentTime + 7;

    //  this.authService.addUserClickedCredential();
    this.authService.updateUserClickedCredential();


const i = setInterval(() => {
console.log('Timer Start : ');

    } , 1000);
setTimeout(() => {
      clearInterval( i );
      console.log('Timer Finished :');
      this.onReleasedClickedByAdmin();
    }, 7000);



    // this.authService.getUserClickedCredential();
    //this.answerSub = this.authService.getAnswerUpdateListener().subscribe(Response => {
      //this.users = Response;
      //console.log('toto', this.users);
      // this.date = currentDate;

    // });



        // repeat with the interval of 2 seconds
// let timerId = setInterval(() =>  1000);
// console.log(timerId);
// // after 5 seconds stop
// setTimeout(() => { clearInterval(timerId);  }, 7000);

    // this.timeout = setInterval(() => {
    //   if (this.count > 0) {
    //     this.count -= 1;
    //   } else {
    //     clearInterval(this.timeout);
    //   }
    // }, 500);

   // this.refreshData();

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
    this.isShowTimerExpired = !this.isShowTimerExpired;
    this.btnClicked = false;

    const audio = new Audio();
    audio.src = '/../../../assets/audio/timeout.mp3';
    audio.load();
    audio.play();

    //timer
    // this.authService.getAnimation();
    // this.authService.getAnimationUpdateListener().subscribe(animation => {
    //   this.animationClass = animation;

    // });

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



          //timer
    // this.animationClass = this.authService.getAnimation();
    // this.authService.getAnimationUpdateListener().subscribe(animation => {
    //   this.animationClass = this.animationClass;
    //   console.log('toto');
    // });

          this.count -= 1;

        }, 1000);


    } else {
      clearInterval(this.dataRefresher);
    }

  }



  refreshTime() {

//     if (this.isShowTimerExpired === true) {
// // Hello is alerted repeatedly after every 3 seconds
// let timerId= setInterval(() =>
//  {
//    this.authService.getAnimation();
//     this.authService.getAnimationUpdateListener().subscribe(animation => {
//       this.animationClass = animation;
//     });
//   }

//  , 1000);

// // Clear intervals after 6 sec with the timer id
// setTimeout(() => {
//   this.authService.getAnimation();
//   this.authService.getAnimationUpdateListener().subscribe(animation => {
//     this.animationClass = 'notAnimated';
//   });
//   clearInterval(timerId);


// }, 7000);

// }
    if (this.isShowTimerExpired === true) {
      this.timeRefresher =
        setInterval(() => {
          //timer

          this.authService.getAnimation();
          this.subTime = this.authService.getAnimationUpdateListener().subscribe(animation => {
            this.animationClass = animation;

          });

           // setTimeout(() => { clearInterval( this.timeRefresher ); }, 7000);

        }, 1000);




    } else {
      clearInterval(this.timeRefresher);
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
    this.subTime.unsubscribe();
    this.disbale.unsubscribe();
    this.subMatchScore.unsubscribe();

    if (this.dataRefresher) {
      clearInterval(this.dataRefresher);
    }

    if(this.timeRefresher) {
      clearInterval(this.timeRefresher);
    }

  }

}
