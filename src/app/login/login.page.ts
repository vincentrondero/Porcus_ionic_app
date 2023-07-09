import { Component, OnInit, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' }) 
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  name: string = '';
  loginSuccess: boolean = false;
  loginError: boolean = false;
  constructor(private afAuth: AngularFireAuth, private router: Router) { } // Inject the Router module

  login() {
    this.afAuth.signInWithEmailAndPassword(this.email, this.password)
      .then((userCredential: any) => {
        // Login successful
        console.log('Login successful');
        this.router.navigate(['./tabs']);
      })
      .catch((error: any) => {
        // Login error
        console.log('Login error:', error);
      });
  }

  ngOnInit() {
  }
}
