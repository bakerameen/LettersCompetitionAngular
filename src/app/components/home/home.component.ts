import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  userId: string;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userId = this.authService.getuserId();
    console.log(this.userId);
  }

}
