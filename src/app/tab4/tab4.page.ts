import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
    this.loadGoogleMapsScript(() => {
      this.initMap();
    });
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
}
