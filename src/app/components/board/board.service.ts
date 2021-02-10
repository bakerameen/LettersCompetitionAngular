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
        console.log(responseData);
      });

  }


  addBoard(letters: string, colors: string, fontcolors: string ) {
    const board: Board = {  id: null, letter: letters, color: colors, fontcolor: fontcolors};
    this.http.post('http://localhost:8080/api/board/', board)
     .subscribe( Response => {
        console.log(Response);
     });

  }

  getBoradListener() {
    return this.boardUpadted.asObservable();
  }

}
