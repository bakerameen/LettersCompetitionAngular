import { Component, OnDestroy, OnInit, Input, Output , EventEmitter} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Match } from './match.model';
import { MatchService } from './match.service';
import { MatDialog } from "@angular/material/dialog";
import { DialogUserInformationComponent } from './dialog-user-information/dialog-user-information.component';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit, OnDestroy {


  @Input()
  count: number = 0;

  @Output()
  change: EventEmitter<number> = new EventEmitter<number>();


  matches: Match[] = [];
  subMatch: Subscription;
  user: string;
  playerClicked = false;

  constructor(private matchService: MatchService, private authService: AuthService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.matchService.getMatches();
    this.subMatch = this.matchService.getMatchUpdateListener().subscribe(response => {
      this.matches = response;
      console.log(this.matches)
    });

  }

  onHandRaised() {
    this.user = this.authService.getUserClickedCredential();
    console.log(this.user);
    this.playerClicked = true;
    let dialogRef = this.dialog.open(DialogUserInformationComponent, {data : {name: this.user }});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result === true) {
        this.playerClicked = false;
      } else {
        this.playerClicked = true;
      }
    });

  }



  ngOnDestroy() {

    this.subMatch.unsubscribe();
  }




  increment() {
    this.count++;
    this.change.emit(this.count);
  }

  decrement() {
    this.count--;
    this.change.emit(this.count);
  }



}
