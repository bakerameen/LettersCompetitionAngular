import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Board } from './board.model';
import { BoardService } from './board.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {
  shuffledArray: [];
  randomLetters: Board[] = [];
  Boards: Board[] = [];
  boradSub: Subscription;
  userName: string;
  dataRefresher: any;

  constructor(private boardService: BoardService, private authService: AuthService) { }

  ngOnInit(): void {

    this.refreshData();
    this.userName = this.authService.getUserName();
    this.authService.geAuthStatusListener().subscribe( isAuthenticated => {
      this.userName = this.authService.getUserName();
    });
    this.boardService.getBoard();
    this.boradSub = this.boardService.getBoradListener().subscribe(responseData => {
      this.Boards = responseData;

    });
  }


  shuffleArray(array) {

 this.boardService.updateArray(array);
 this.boardService.getBoradUpdatedListener().subscribe( Response => {

  this.Boards = Response;
  // this.boardService.getBoard();
  // this.boardService.getBoard();
// this.boradSub = this.boardService.getBoradListener().subscribe(responseData => {
//   this.Boards = responseData;
// });


})

  }


  onGreenColor(index, letter) {
    const audio = new Audio();
    audio.src = '/../../../assets/audio/applause4.mp3';
    audio.load();
    audio.play();
    this.boardService.updateboardItem(index, letter, 'green', 'white');
  }

  onRedColor(index, letter) {
    const audio = new Audio();
    audio.src = '/../../../assets/audio/applause4.mp3';
    audio.load();
    audio.play();
    this.boardService.updateboardItem(index, letter, 'red', 'white');
  }

  ngOnDestroy() {
    this.boradSub.unsubscribe();
  }


  refreshData() {
      this.dataRefresher =
        setInterval(() => {
          this.boardService.getBoradUpdatedListener().subscribe( Response => {
            this.Boards = Response;

          })

        }, 5000);


    }



}
