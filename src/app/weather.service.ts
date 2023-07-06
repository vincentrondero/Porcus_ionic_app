import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = 'VPcg8jZgxsOMNzGGo9qQ3TbP6HwiSGcD';
  private apiUrl = 'https://dataservice.accuweather.com';

  constructor(private http: HttpClient) {}

  getWeather(locationKey: string): Observable<any> {
    const encodedLocationKey = encodeURIComponent(locationKey);
    const url = `${this.apiUrl}/currentconditions/v1/${encodedLocationKey}?apikey=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      tap((response: any) => console.log(JSON.stringify(response.condition)))
    );
  }
  getLocationKey(location: string): Observable<any> {
    const encodedLocation = encodeURIComponent(location);
    const url = `${this.apiUrl}/locations/v1/cities/autocomplete?apikey=${this.apiKey}&q=${encodedLocation}`;
    return this.http.get<any>(url);
  }
}
