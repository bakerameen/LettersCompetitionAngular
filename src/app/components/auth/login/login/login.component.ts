import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

  onlogin(form : NgForm) {
    if(form.invalid) {
     return;
    }
this.isLoading = true;
    console.log(form.value);
    this.authService.login(form.value.email, form.value.password);
  }
}
