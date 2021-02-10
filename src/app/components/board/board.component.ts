import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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
  constructor(private boardService: BoardService) { }

  ngOnInit(): void {
    this.boardService.getBoard();
    this.boradSub = this.boardService.getBoradListener().subscribe(responseData => {
      this.Boards = responseData;
      this.shuffledArray = this.shuffleArray(this.Boards);
      console.log(this.shuffledArray);
    });
  }


  shuffleArray(array) {
    var m = array.length, t, i;

    while (m) {
      i = Math.floor(Math.random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  }


  onGreenColor(index, letter) {
    console.log(index, letter);

  }

  onRedColor(index, letter) {
    console.log(index, letter);
  }

}
