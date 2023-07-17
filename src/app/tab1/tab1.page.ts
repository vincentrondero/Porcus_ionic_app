  import { Component, OnInit } from '@angular/core';
  import { Observable, map } from 'rxjs';
  import { WeatherService } from '../weather.service';
  import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
  import { AngularFireAuth } from '@angular/fire/compat/auth';

  type Task = {
    id?: string;
    name: string;
    done: boolean;
    deadline: Date;
  };

  @Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
  })
  export class Tab1Page implements OnInit {
    weatherData$: Observable<any> | null = null;;
    locationKey: string = '';
    location: string = '';
    tasksCollection!: AngularFirestoreCollection<Task>;
    tasks$!: Observable<Task[]>;
    malePigCount$!: Observable<number>;
    femalePigCount$!: Observable<number>;
    userId: string = '';


    constructor(private weatherService: WeatherService, private firestore: AngularFirestore, private afAuth: AngularFireAuth) {
      this.tasksCollection = this.firestore.collection<Task>('tasks');
      this.tasks$ = this.tasksCollection.valueChanges();
    }

    ngOnInit() {
      this.afAuth.authState.subscribe(user => {
        if (user) {
          this.userId = user.uid;
          const pigsCollection = this.firestore.collection<any>('Pigs', ref => ref.where('userId', '==', this.userId));
  
          this.malePigCount$ = pigsCollection.valueChanges().pipe(
            map(pigs => pigs.filter(pig => pig.gender === 'Grower').length)
          );
  
          this.femalePigCount$ = pigsCollection.valueChanges().pipe(
            map(pigs => pigs.filter(pig => pig.gender === 'Sow').length)
          );
        }
      });
      this.afAuth.authState.subscribe(user => {
        if (user) {
          this.userId = user.uid;
          const tasksCollection = this.firestore.collection<Task>('tasks', ref => ref.where('userId', '==', this.userId));
      
          this.tasks$ = tasksCollection.valueChanges();
        }
      });
    }

    searchLocation() {
      this.weatherService.getLocationKey(this.location).subscribe(
        (response: any[]) => {
        
          if (response?.length > 0) {
            this.locationKey = response[0].Key;
            this.getWeatherData();
          } else {
          
            console.log('Location key not found');
          }
        },
        (error: any[]) => {
          console.log('Error occurred while fetching location key:', error);
        }
      );
    }

    getWeatherData() {
      this.weatherData$ = this.weatherService.getWeather(this.locationKey);
    }
    getWeatherIcon(condition: string): string {
      const defaultIcon = '/assets/H.png'; // Default icon if condition is not found in the mapping
    
      if (!condition) {
        console.log('Condition is undefined or empty');
        return defaultIcon;
      }
    
      const conditionKey = condition.trim();
    
      console.log('Condition:', conditionKey);
      console.log('Mapped Icon:', this.weatherIconMapping[conditionKey]);
    
      return this.weatherIconMapping[conditionKey] || defaultIcon;
    }
    
    weatherIconMapping: { [key: string]: string } = {
      'Sunny': '/assets/S.png',
      'Cloudy': '/assets/C.png',
      'Rainy': '/assets/R.png',
      'Partly sunny': '/assets/PS.png',
      'Mostly cloudy': '/assets/MC.png',
      'Clouds and sun': '/assets/MC.png',
      'Mostly sunny': '/assets/MS.png',
      // Add more mappings for different weather conditions
    };
  }
