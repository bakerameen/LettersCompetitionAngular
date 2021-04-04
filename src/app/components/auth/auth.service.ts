import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Answer } from '../match/answer.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url: string = '';
  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private playersUpdated = new Subject<AuthData[]>();
  private userCredential = new Subject<any>();
  private tokenTimer: any;
  private userId: string;
  private userName: string;
  private playersNew: AuthData[] = [];
  animatedd: string;
  private disableAniamtion;

  private answer: Answer[] = [];
  private answerUpdate = new Subject<any>();
  private animationUpdate = new Subject<any>();
  private disableAniamtionUpdate = new Subject<any>();

  constructor(private http: HttpClient, private router: Router) { }

  // auth functions
  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  geAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  autoAuthUser() {
    const autInformation = this.getAuthData();
    if (!autInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = autInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = autInformation.token;
      this.isAuthenticated = true;
      this.userId = autInformation.userId;
      this.userName = autInformation.userName;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      userName: userName
    }

  }


  private saveAuthData(token: string, expirationDate: Date, userId: string, userName: string) {
    // localstorage api we can access
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', userName);

  }

  private clearAuthdata() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
  }


  private setAuthTimer(duration: number) {

    this.tokenTimer = setTimeout(() => {
      this.logOut();
    }, duration * 1000)
  }


  getuserId() {
    return this.userId;
  }

  getUserName() {
    return this.userName;
  }
  // user funcions

  createUser(email: string, password: string, name: string) {
    const authData: AuthData = { email: email, password: password, name: name };
    this.http.post(this.url + '/api/user/signup', authData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password, name: null }
    this.http.post<{ token: string, expiresIn: number, userID: string, name: string }>(this.url + '/api/user/login', authData).subscribe(response => {
      // console.log(response);
      const token = response.token;
      this.token = token;
      if (token) {
        const expiresInDuration = response.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated = true;
        this.userId = response.userID;
        this.userName = response.name;
        this.authStatusListener.next(true);
        const now = new Date;
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
        this.saveAuthData(token, expirationDate, this.userId, this.userName);
        this.router.navigate(["/match"]);
      }

    }, error => {
      this.authStatusListener.next(false);
    });
  }

  logOut() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.userId = null;
    this.userName = null;
    this.clearAuthdata();
    this.router.navigate(["/"]);
  }


  getPlayerUpdateListener() {
    return this.playersUpdated.asObservable();
  }

  getPlayers() {
    this.http.get<{ message: string, users: any }>(this.url  + '/api/user/users').subscribe((players) => {
      const playersArray = players.users;
      this.playersNew = playersArray;
      this.playersUpdated.next([...this.playersNew]);
    });
  }



  // Answer Start



  addUserClickedCredential() {
    const userAnswerede: Answer = { _id: null, userName: 'toto', userCliceked: true, timerClass: 'timercssssss' }
    return this.http.post<{ message: string, answeredId: string }>(this.url + '/api/answer', userAnswerede).subscribe(
      response => {
        const answerId = response.answeredId;
        userAnswerede._id = answerId;
        this.answer.push(userAnswerede);
        this.answerUpdate.next([...this.answer]);
        // this.router.navigate(['/'])
      }
    )
  }

  getAnimation() {
    return this.http.get<{ message: string, answer: any, timerClass : string }>(this.url + '/api/answer').subscribe(response => {

      this.animatedd = response.timerClass;
       this.animationUpdate.next([this.animatedd]);
       // console.log(response);
        });
  }


  updateAnimation() {
    const autInformation = this.getAuthData();
    const userName = autInformation.userName;
    const userAnswerede: Answer = { _id: '6017a15ed79fc79624e045a5', userName: userName, userCliceked: true, timerClass: 'animationCss' };

    const answerid = '6017a15ed79fc79624e045a5';

    this.http.put<{ message: string; username: string, class: string }>(this.url + '/api/answer/' + answerid, userAnswerede).subscribe(response => {
      // animation class
      this.animatedd = response.class;

      this.animationUpdate.next([...this.animatedd]);


    })
  }


  getUserClickedCredential() {
    this.http.get<{ message: string, answer: any }>(this.url + '/api/answer').subscribe(response => {
      this.answer = response.answer;
      this.answerUpdate.next([...this.answer]);
        });
  }

  // getdisabled() {
  //   this.http.get<{ message: string, answer: any, clicked : boolean }>(this.url + '/api/answer').subscribe(response => {
  //    this.disableAniamtion = response.clicked;
  //    this.disableAniamtionUpdate.next([...this.disableAniamtion]);
  //    console.log(this.disableAniamtion);
  //       });
  // }

  updateUserClickedCredential() {

      const autInformation = this.getAuthData();
      const userName = autInformation.userName;
      const answerid = '6017a15ed79fc79624e045a5';
      const userAnswerede: Answer = { _id: '6017a15ed79fc79624e045a5', userName: userName, userCliceked: true, timerClass: 'animationCss' };


// const i = setInterval(() => {



//   const autInformation = this.getAuthData();
//   const userName = autInformation.userName;
//   const answerid = '6017a15ed79fc79624e045a5';
//     const userAnswerede: Answer = { _id: '6017a15ed79fc79624e045a5', userName: userName, userCliceked: true, timerClass: 'animationCss' };

//   this.http.put<{ message: string; username: string, userCliceked: string}>(this.url + '/api/answer/' + answerid, userAnswerede).subscribe(response => {
//     console.log('HI');
//     const updatedAnswer = [...this.answer];
//     const oldAnswerIndex = updatedAnswer.findIndex(p => p._id === userAnswerede._id);
//     updatedAnswer[oldAnswerIndex] = userAnswerede;
//     this.answer = updatedAnswer;
//     this.answerUpdate.next([...this.answer]);

//   });




//       // this.animatedd = 'animationClass';

//       // this.animationUpdate.next([...this.animatedd]);
//       // this.disableAniamtion = true;

//       // console.log(this.disableAniamtion);

//     } , 1000);
// setTimeout(() => {
//       clearInterval( i );


      // const autInformation = this.getAuthData();
      // const userName = autInformation.userName;
      // const answerid = '6017a15ed79fc79624e045a5';
      // // tslint:disable-next-line: max-line-length
      // const userAnswerede: Answer = { _id: '6017a15ed79fc79624e045a5', userName: userName, userCliceked: false, timerClass: 'animationCss' };

      // tslint:disable-next-line: max-line-length

      // tslint:disable-next-line: max-line-length

      // this.disableAniamtion = false;
      // console.log(this.disableAniamtion);
      // this.disableAniamtion = true;

      // this.animatedd = "noAnimation";

      // this.animationUpdate.next([...this.animatedd]);
    // }, 2000);

      this.http.put<{ message: string; username: string, userCliceked: string}>(this.url + '/api/answer/' + answerid, userAnswerede)
        .subscribe(response => {
      console.log('HI 2');
      const updatedAnswer = [...this.answer];
      const oldAnswerIndex = updatedAnswer.findIndex(p => p._id === userAnswerede._id);
      updatedAnswer[oldAnswerIndex] = userAnswerede;
      this.answer = updatedAnswer;
      this.answerUpdate.next([...this.answer]);

    });

  }


  updateUserClickedCredentialByAdmin() {

    const autInformation = this.getAuthData();
    const userName = autInformation.userName;
    const userAnswerede: Answer = { _id: '6017a15ed79fc79624e045a5', userName: '', userCliceked: false, timerClass : 'noAnimation' };

    const answerid = '6017a15ed79fc79624e045a5';

    this.http.put(this.url + '/api/answer/admin/' + answerid, userAnswerede).subscribe(response => {
      this.animatedd = 'noAnimation';
      const updatedAnswer = [...this.answer];
      const oldAnswerIndex = updatedAnswer.findIndex(p => p._id === userAnswerede._id);
      updatedAnswer[oldAnswerIndex] = userAnswerede;
      this.answer = updatedAnswer;
      this.answerUpdate.next([...this.answer]);
    })
  }

  //  asObservable
  getAnswerUpdateListener() {
    return this.answerUpdate.asObservable();
  }

  getAnimationUpdateListener() {
    return this.animationUpdate.asObservable();
  }

  getdisbaleListener() {
    return this.disableAniamtionUpdate.asObservable();
  }


  // Answer End


}
