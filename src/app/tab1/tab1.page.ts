import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  weatherData$: Observable<any> | null = null;;
  locationKey: string = '';
  location: string = '';

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    //this.weatherData$ = this.weatherService.getWeather(this.locationKey);

    //this.weatherData$.subscribe(
     // (weatherData: any[]) => {
       // console.log('Weather Data:', weatherData);
        // Your other code logic here
     // },
     // (error: any) => {
       // console.log('Error:', error);
     // }
   // );
  }

  searchLocation() {
    this.weatherService.getLocationKey(this.location).subscribe(
      (response: any[]) => {
        // Assuming the response is an array of location objects,
        // you can extract the location key from the first item in the array
        if (response?.length > 0) {
          this.locationKey = response[0].Key;
          this.getWeatherData();
        } else {
          // Handle the case where no location key is found
          console.log('Location key not found');
        }
      },
      (error: any[]) => {
        // Handle the error case
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
  
    const conditionKey = condition.trim(); // Remove leading/trailing spaces
  
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
