import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { v4 as uuidv4 } from 'uuid';
import { finalize } from 'rxjs/operators';

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
  profilePictureUrl: string = ''; // Holds the URL of the profile picture

  

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage, private afAuth: AngularFireAuth) { }

  ngOnInit() {
    this.loadGoogleMapsScript(() => {
      this.initMap();
    });

    this.fetchFarmDetails();
    this.fetchProfileDetails();
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

  async saveProfile() {
    if (this.profileName && this.profilePic && this.category) {
      const user = await this.afAuth.currentUser;
      if (user) {
        const profileData = {
          profileName: this.profileName,
          category: this.category,
          userId: user.uid // Include the user ID in profileData
        };
  
        this.firestore.collection('profiles').add(profileData)
          .then((docRef) => {
            const profileId = docRef.id;
            const filePath = `profile_pictures/${profileId}`;
            const fileRef = this.storage.ref(filePath);
            const uploadTask = fileRef.put(this.profilePic);
  
            uploadTask.snapshotChanges().pipe(
              finalize(() => {
                fileRef.getDownloadURL().subscribe((url) => {
                  const profileWithPicture = {
                    profileName: this.profileName,
                    category: this.category,
                    pictureUrl: url,
                    userId: user.uid // Include the user ID in profileWithPicture
                  };
  
                  // Update the profile document with the picture URL
                  this.firestore.collection('profiles').doc(profileId).set(profileWithPicture)
                    .then(() => {
                      console.log('Profile saved successfully.');
                      // Clear the input fields after saving
                      this.profileName = '';
                      this.profilePic = null;
                      this.category = '';
  
                      // Set the profilePictureUrl property with the retrieved URL
                      this.profilePictureUrl = url;
                    })
                    .catch((error) => {
                      console.error('Error saving profile:', error);
                    });
                });
              })
            ).subscribe();
          })
          .catch((error) => {
            console.error('Error saving profile:', error);
          });
      }
    }
  }
  
  fetchProfileDetails() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        const userId = user.uid;
        this.firestore
          .collection('profiles', (ref) => ref.where('userId', '==', userId))
          .valueChanges()
          .subscribe((data: any) => {
            if (data && data.length > 0) {
              const profile = data[0];
              this.profileName = profile.profileName;
              this.category = profile.category;
              this.profilePictureUrl = profile.pictureUrl;
              console.log('Profile details fetched successfully:', profile);
            } else {
              this.profileName = '';
              this.category = '';
              this.profilePictureUrl = '';
            }
          });
      } else {
        this.profileName = '';
        this.category = '';
        this.profilePictureUrl = '';
      }
    });
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
