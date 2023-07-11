import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Timestamp } from 'firebase/firestore';

type Task = {
  id?: string;
  name: string;
  done: boolean;
  deadline: Date;
};

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  providers: [DatePipe] 
})
export class Tab3Page {
  tasksCollection: AngularFirestoreCollection<Task>;
  tasks$: Observable<Task[]>;
  newTask: string;
  newTaskDeadline!: string;

  constructor(private firestore: AngularFirestore, private datePipe: DatePipe) {
    this.tasksCollection = this.firestore.collection<Task>('tasks');
    this.tasks$ = this.tasksCollection.valueChanges();
    this.newTask = '';
  }

  ngOnInit() {
    this.newTaskDeadline = new Date().toISOString();
  }

  div1: boolean = true;
  div2: boolean = false;
  showOverlayContent: boolean = false;

  div1Function() {
    this.div1 = true;
    this.div2 = false;
  }

  div2Function() {
    this.div2 = true;
    this.div1 = false;
  }

  isChecked = true;

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
      const taskId = this.firestore.createId();
      const task: Task = {
        id: taskId,
        name: this.newTask,
        done: false,
        deadline: new Date(this.newTaskDeadline)
      };
      this.newTaskDeadline = new Date().toISOString();
      this.tasksCollection.doc(taskId).set(task)
        .then(() => {
          this.newTask = '';
          this.newTaskDeadline = '';
        })
        .catch((error) => {
          console.error('Error adding task:', error);
        });
    }
  }
  toggleTaskDone(task: Task) {
    const docId = task.id;
    const taskRef = this.firestore.collection("tasks").doc(docId);
  
    taskRef.update({ done: true })
    .then(() => {
      console.log("Task updated successfully.");
    })
    .catch((error) => {
      console.error("Error updating task:", error);
    });
  }
  
  getFormattedDate(date: Date | Timestamp): string {
    if (date) {
      const formattedDate = date instanceof Timestamp ? date.toDate() : date;
      const formattedDateString = this.datePipe.transform(formattedDate, 'MMMM dd, yyyy') || '';
      const formattedTimeString = this.datePipe.transform(formattedDate, 'hh:mm:ss a') || '';
      const timezone = 'UTC+8';
      return `${formattedDateString} at ${formattedTimeString} ${timezone}`;
    }
    return '';
  }
}
