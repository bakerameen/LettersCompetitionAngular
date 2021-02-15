import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Board } from './board.model';
import { BoardService } from './board.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  shuffledArray: [];
  randomLetters: Board[] = [];
  Boards: Board[] = [];
  boradSub: Subscription;
  userName: string;

  constructor(private boardService: BoardService, private authService: AuthService) { }

  ngOnInit(): void {
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
this.boardService.getBoard();
this.boradSub = this.boardService.getBoradListener().subscribe(responseData => {
  this.Boards = responseData;
});


})

  }


  onGreenColor(index, letter) {
    this.boardService.updateboardItem(index, letter, 'green', 'white');
  }

  onRedColor(index, letter) {
    this.boardService.updateboardItem(index, letter, 'red', 'white');
  }

}
