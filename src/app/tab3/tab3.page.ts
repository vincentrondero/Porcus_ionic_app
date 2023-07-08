import { Component } from '@angular/core';

type Task = {
  name: string;
  done: boolean;
  deadline: Date;
};


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  tasks: Task[] = [];
  newTask!: string;
  doneTasks: Task[] = [];
  newTaskDeadline!: string;
  

  constructor() {}


  div1:boolean=true;
  div2:boolean=false;
  showOverlayContent: boolean = false;


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
  showOverlay() {
    this.showOverlayContent = true;
  }

  hideOverlay() {
    this.showOverlayContent = false;
  }

  addTask() {
    if (this.newTask && this.newTaskDeadline) {
      const task: Task = {
        name: this.newTask,
        done: false,
        deadline: new Date(this.newTaskDeadline)
      };
      this.tasks.push(task);
      this.newTask = '';
      this.newTaskDeadline = '';
    }
  }
  toggleTaskDone(task: Task) {
    task.done = true;
    const index = this.tasks.indexOf(task);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      this.doneTasks.push(task);
    }
  }
  
}



