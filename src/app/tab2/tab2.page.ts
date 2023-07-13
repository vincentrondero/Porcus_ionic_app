import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  pigs$!: Observable<any[]>;
  filteredPigs$!: Observable<any[]>;
  searchTerm!: string;
  pigID!: string;
  weight!: number | null;
  dateOfBirth!: string;
  gender!: string;
  userId!: string;

  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) { }
  showOverlayContent: boolean = false;

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.pigs$ = this.firestore.collection("Pigs", ref => ref.where('userId', '==', this.userId)).valueChanges();
        this.filteredPigs$ = this.pigs$;
      }
    });
  }

  filterPigs() {
    this.filteredPigs$ = this.pigs$.pipe(
      map(pigs => {
        if (!this.searchTerm) {
          return pigs;
        } else {
          const searchTerm = this.searchTerm.toLowerCase();
          return pigs.filter(pig => pig.pigID.toLowerCase().includes(searchTerm));
        }
      })
    );
  }

  showOverlay() {
    this.showOverlayContent = true;
  }

  hideOverlay() {
    this.showOverlayContent = false;
  }

  addPig() {
    if (!this.pigID) {
      console.error('Invalid pigID');
      return;
    }

    const pigData = {
      pigID: this.pigID,
      weight: this.weight,
      dateOfBirth: this.dateOfBirth,
      gender: this.gender,
      userId: this.userId
    };

    this.firestore.collection('Pigs').add(pigData)
      .then(() => {

        this.pigID = '';
        this.weight = null;
        this.dateOfBirth = '';
        this.gender = '';
      })
      .catch((error) => {
        console.error('Error adding pig:', error);
      });
  }
}
