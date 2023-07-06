import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor() {}


  div1:boolean=true;
  div2:boolean=false;


  div1Function(){
      this.div1=true;
      this.div2=false;
  }

  div2Function(){
      this.div2=true;
      this.div1=false;
  }
  isChecked = true;

  // Function to toggle the checkbox state
  toggleCheckbox() {
    this.isChecked = !this.isChecked;
  }

}



