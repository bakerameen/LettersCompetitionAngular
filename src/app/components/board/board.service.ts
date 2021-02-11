import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Board } from '../board/board.model';
import { identifierModuleUrl } from '@angular/compiler';


@Injectable({
  providedIn: 'root'
})

export class BoardService {
  private board: Board[] = [];
  private boardUpadted = new Subject<Board[]>();
  private getBoradUpdated = new Subject<any>();

  constructor(private http: HttpClient) { }

  // get matches
  getBoard() {
    this.http.get<{ message: string, board: any[] }>('http://localhost:8080/api/board/')
      .pipe(map(boarddata => {
        console.log(boarddata);
        return boarddata.board.map(boardResponse => {
          return {
            id: boardResponse._id,
            letter: boardResponse.letter,
            color: boardResponse.color,
            fontcolor: boardResponse.fontcolor,

          }
        })
      }))
      .subscribe(responseData => {
        this.board = responseData;
        this.boardUpadted.next([...this.board]);
      });

  }


  addBoard(letters: string, colors: string, fontcolors: string ) {
    const board: Board = {  id: null, letter: letters, color: colors, fontcolor: fontcolors};
    this.http.post('http://localhost:8080/api/board/', board)
     .subscribe( Response => {
        console.log(Response);
     });

  }


  updateboardItem(id: any, letter: string, color: string, fontcolor: string){
const boardItem = {id: id, letter: letter, color: color, fontcolor: fontcolor};
this.http.put('http://localhost:8080/api/board/'+id, boardItem).subscribe(Response => {
  const updatedBoardItem = [...this.board];
  const oldItemIndex = updatedBoardItem.findIndex(p => p.id === boardItem.id);
  updatedBoardItem[oldItemIndex] = boardItem;
  this.board = updatedBoardItem;
  this.boardUpadted.next([...this.board]);
});
  }



  updateArray(array: any) {
  console.log('ana');
  const color = 'gray';
  this.http.put('http://localhost:8080/api/board/', color).subscribe(Response => {
const newArray = this.board;

    var m = newArray.length, t, i;

    while (m) {
      i = Math.floor(Math.random() * m--);
      t = newArray[m];
      newArray[m] = newArray[i];
      newArray[i] = t;
    }


    this.board = newArray;
    this.getBoradUpdated.next([...this.board]);
  });


  // return array;


  }


  getBoradListener() {
    return this.boardUpadted.asObservable();
  }


  getBoradUpdatedListener() {
    return this.getBoradUpdated.asObservable();
  }

}
