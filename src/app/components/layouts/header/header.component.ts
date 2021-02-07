import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListenerSub: Subscription;
  userIsAuthenticated = false;

  constructor(private autheService: AuthService) { }

  ngOnInit(): void {
    this.userIsAuthenticated = this.autheService.getIsAuth();
    this.authListenerSub = this.autheService.geAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  onLogout() {
    this.autheService.logOut();
  }

  ngOnDestroy() {
    this.authListenerSub.unsubscribe();
  }

}
