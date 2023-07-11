import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
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

  constructor(private firestore: AngularFirestore) { }
  showOverlayContent: boolean = false;

  ngOnInit() {
    this.pigs$ = this.firestore.collection("Pigs").valueChanges();
    this.filteredPigs$ = this.pigs$;
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
      gender: this.gender
    };
  
    this.firestore.collection('Pigs').add(pigData)
      .then(() => {
        // Document added successfully
        // Reset form fields or show a success message
        this.pigID = '';
        this.weight = null;
        this.dateOfBirth = '';
        this.gender = '';
      })
      .catch((error) => {
        // Handle error
        console.error('Error adding pig:', error);
      });
  }
  
  
}
