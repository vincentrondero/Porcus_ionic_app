import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

declare var google: any;
declare global {
  interface Window {
    initMap: () => void;
  }
}


@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})

export class Tab4Page implements OnInit {
  profileName: string = '';
  profilePic: File | null = null;
  category: string = '';
  showOverlayContent: boolean = false;
  showOverlayContent1: boolean = false;
  farmName: string = '';
  operation: string = '';
  address: string = '';

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage, private afAuth: AngularFireAuth) { }

  ngOnInit() {
    this.loadGoogleMapsScript(() => {
      this.initMap();
    });

    this.fetchFarmDetails();
  }
  
  loadGoogleMapsScript(callback: () => void) {
    if (typeof google === 'undefined') {
      window.initMap = () => {
        callback();
      };
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAR4_X0H35IUO0gZc63dJk6RmWiteYX8FY=initMap`;
      document.body.appendChild(script);
    } else {
      callback();
    }
  }
  
  initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    });
  }
  
  showOverlay() {
    this.showOverlayContent = true;
  }

  hideOverlay() {
    this.showOverlayContent = false;
  }
  onFileSelected(event: any) {
    this.profilePic = event.target.files[0];
  }
  saveProfile() {
    if (this.profileName && this.profilePic && this.category) {
      const profileData = {
        profileName: this.profileName,
        category: this.category
      };

      this.firestore.collection('profiles').add(profileData)
      .then((docRef) => {
        const profileId = docRef.id;
        const filePath = `profile_pictures/${profileId}`;
        const fileRef = this.storage.ref(filePath);
        fileRef.put(this.profilePic)
          .then(() => {
            console.log('Profile picture uploaded successfully.');
            // Clear the input fields after saving
            this.profileName = '';
            this.profilePic = null;
            this.category = '';
          })
          .catch((error) => {
            console.error('Error uploading profile picture:', error);
          });
      })
      .catch((error) => {
        console.error('Error saving profile:', error);
      });
  }
}
showOverlay1() {
  this.showOverlayContent1 = true;
}

hideOverlay1() {
  this.showOverlayContent1 = false;
}
async saveProfile1() {
  const user = await this.afAuth.currentUser;
  if (user) {
    const userId = user.uid;
    const farmDetailsRef = this.firestore.collection('farmDetails').doc(userId);

    const farmDetails = {
      farmName: this.farmName,
      operation: this.operation,
      address: this.address
    };

    farmDetailsRef.get().subscribe((doc) => {
      if (doc.exists) {
        // Update existing farm details document
        farmDetailsRef.update(farmDetails)
          .then(() => {
            console.log('Farm details updated successfully!');
            this.farmName = '';
            this.operation = '';
            this.address = '';
          })
          .catch((error) => {
            console.error('Error updating farm details:', error);
          });
      } else {
        // Create new farm details document
        farmDetailsRef.set({
          userId: userId,
          ...farmDetails
        })
          .then(() => {
            console.log('Farm details saved successfully!');
            this.farmName = '';
            this.operation = '';
            this.address = '';
          })
          .catch((error) => {
            console.error('Error saving farm details:', error);
          });
      }
    });
  }
}

fetchFarmDetails() {
  this.afAuth.authState.subscribe(user => {
    if (user) {
      const userId = user.uid;
      this.firestore
        .collection('farmDetails', ref => ref.where('userId', '==', userId))
        .valueChanges()
        .subscribe((data: any) => {
          if (data && data.length > 0) {
            const farmDetails = data[0];
            this.farmName = farmDetails.farmName;
            this.operation = farmDetails.operation;
            this.address = farmDetails.address;
            console.log('Farm details fetched successfully:', farmDetails);
          } else {
            this.farmName = '';
            this.operation = '';
            this.address = '';
          }
        });
    }
  });
}

}
