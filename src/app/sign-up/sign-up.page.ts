import { Component, OnInit, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' }) // Add the @Injectable decorator
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  email: string = '';
  password: string = '';
  name: string = '';
  loginSuccess: boolean = false;
  loginError: boolean = false;

  constructor(private afAuth: AngularFireAuth, private router: Router) { }

  ngOnInit() {
  }
  
  signUp() {
    this.afAuth.createUserWithEmailAndPassword(this.email, this.password)
      .then((userCredential: any) => {
        console.log(userCredential.user);
        this.router.navigate(['./login']);
      })
      .catch((error: any) => {
        console.log(error);
        this.loginError = true; // Set the loginError flag to true
      });
  }
  
}
