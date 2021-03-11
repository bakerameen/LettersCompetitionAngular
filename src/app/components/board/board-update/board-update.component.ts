import { Component, OnDestroy, OnInit } from '@angular/core';
import { Board } from '../board.model';
import { BoardService } from '../board.service';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-board-update',
  templateUrl: './board-update.component.html',
  styleUrls: ['./board-update.component.scss']
})
export class BoardUpdateComponent implements OnInit, OnDestroy {

  Boards: Board[] = [];
  userName: string;
  boradSub: Subscription;

  constructor(private boardService: BoardService, private authService: AuthService) { }

  ngOnInit(): void {
    this.boardService.getBoard();
    this.boradSub = this.boardService.getBoradListener().subscribe(responseData => {
      this.Boards = responseData;

    });
  }

  onUpdateLetter(index, letter) {
    console.log(letter);
    this.boardService.updateboardItem(index, letter, null , null);
  }

  ngOnDestroy() {
    this.boradSub.unsubscribe();
  }

  onChangeEvent(event: any, index){
    this.boardService.updateboardItem(index, event.target.value, null , null);

  }

}
