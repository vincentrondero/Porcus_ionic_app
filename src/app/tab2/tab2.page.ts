import { Component } from '@angular/core';
import { AngularFirestore} from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  pigs$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  filteredPigs$!: Observable<any[]>;
  searchTerm!: string;
  pigID!: string;
  weight!: number | null;
  dateOfBirth!: string;
  gender!: string;
  userId!: string;
  selectedPigID!: string;
  selectedPig: any = { weight: null }; // Initialize with default values

  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) { }
  showOverlayContent: boolean = false;
  showOverlayContent1: boolean = false;

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.pigs$ = new BehaviorSubject<any[]>([]);
        this.firestore.collection("Pigs", ref => ref.where('userId', '==', this.userId))
          .valueChanges()
          .subscribe(pigs => {
            this.pigs$.next(pigs);
            this.filterPigs();
          });
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

  updatePig() {
    if (!this.selectedPigID) {
      console.error('No pig selected for update');
      return;
    }

    this.firestore.collection('Pigs').doc(this.selectedPigID)
      .update(this.selectedPig)
      .then(() => {
        console.log('Pig updated successfully');
        const updatedPigs = this.pigs$.getValue().map(pig => {
          if (pig.pigID === this.selectedPigID) {
            return { ...pig, ...this.selectedPig };
          }
          return pig;
        });
        this.pigs$.next(updatedPigs);
        this.hideOverlay1();
      })
      .catch((error) => {
        console.error('Error updating pig:', error);
      });
  }

  showDropdown(pig: any) {
    pig.showDropdown = !pig.showDropdown;
  }

  selectPig(pig: any) {
    this.selectedPigID = pig.pigID;
    this.selectedPig = { ...pig };
    this.showOverlay1();
  }

  showOverlay1() {
    this.showOverlayContent1 = true;
  }

  hideOverlay1() {
    this.showOverlayContent1 = false;
    this.closeDropdown();
  }
  closeDropdown() {
    const updatedPigs = this.pigs$.getValue().map(pig => {
      if (pig.showDropdown) {
        return { ...pig, showDropdown: false };
      }
      return pig;
    });
    this.pigs$.next(updatedPigs);
  }
  markAsSold(pig: any) {
    const pigRef = this.firestore.collection('Pigs', ref => ref.where('pigID', '==', pig.pigID));
  
    const dataToUpdate = {
      status: pig.status === 'Sold' ? 'Unsold' : 'Sold'
    };
  
    pigRef.get().subscribe(querySnapshot => {
      if (querySnapshot.size > 0) {
        querySnapshot.forEach(doc => {
          doc.ref.update(dataToUpdate)
            .then(() => {
              console.log('Pig marked as', dataToUpdate.status, 'successfully');
              pig.status = dataToUpdate.status; // Update the status in the local pig object
              this.hideOverlay1();
            })
            .catch((error) => {
              console.error('Error marking pig as', dataToUpdate.status, ':', error);
            });
        });
      } else {
        console.log('Document does not exist');
        // Handle the case where the document does not exist
      }
    });
  }
  toggleStatusDropdown(pig: any) {
    pig.showStatusDropdown = !pig.showStatusDropdown;
  }
  
  
  updateStatus(pig: any, status: string) {
    const pigRef = this.firestore.collection('Pigs').doc(pig.pigID);
  
    const dataToUpdate = {
      status: status
    };
  
    pigRef.update(dataToUpdate)
      .then(() => {
        console.log('Pig status updated successfully');
        pig.status = status; // Update the status in the local pig object
        pig.showStatusDropdown = false; // Hide the status dropdown
        this.hideOverlay1();
      })
      .catch((error) => {
        console.error('Error updating pig status:', error);
      });
  }
  toggleCondition(pig: any, condition: string) {
    if (pig.condition === condition) {
      this.updateCondition(pig, ''); // Remove the condition if already active
    } else {
      this.updateCondition(pig, condition); // Set the condition if not active
    }
  }
  
  updateCondition(pig: any, newCondition: string) {
    const pigRef = this.firestore.collection('Pigs', ref => ref.where('pigID', '==', pig.pigID));
  
    const dataToUpdate = {
      condition: newCondition
    };
  
    pigRef.get().subscribe(querySnapshot => {
      if (querySnapshot.size > 0) {
        querySnapshot.forEach(doc => {
          doc.ref.update(dataToUpdate)
            .then(() => {
              console.log('Pig condition updated successfully');
              pig.condition = newCondition; // Update the condition in the local pig object
              pig.showStatusDropdown = false; // Hide the status dropdown
              this.hideOverlay1();
            })
            .catch((error) => {
              console.error('Error updating pig condition:', error);
            });
        });
      } else {
        console.log('Document does not exist');
        // Handle the case where the document does not exist
      }
    });
  }
  
  
  
}
