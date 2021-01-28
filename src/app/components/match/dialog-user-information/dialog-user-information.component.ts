import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-user-information',
  templateUrl: './dialog-user-information.component.html',
  styleUrls: ['./dialog-user-information.component.scss']
})
export class DialogUserInformationComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {name: string}) { }

  ngOnInit(): void {
  }

}
