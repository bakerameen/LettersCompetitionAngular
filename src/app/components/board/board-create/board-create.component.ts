import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BoardService } from '../board.service';

@Component({
  selector: 'app-board-create',
  templateUrl: './board-create.component.html',
  styleUrls: ['./board-create.component.scss']
})
export class BoardCreateComponent implements OnInit {


  constructor(private boardSrv: BoardService) { }

  ngOnInit(): void {

  }

  onAddLetters(lettersForm: NgForm) {

    if (!lettersForm) {
         return;
       }

  this.boardSrv.addBoard(lettersForm.value.letter, lettersForm.value.color, lettersForm.value.fontcolor);

  }

}
