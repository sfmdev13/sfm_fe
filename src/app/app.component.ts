import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sfm_fe';
  
  dataSet = [
    {
      name: 'gifino',
      age: 33,
      address: 'indo'
    },
    {
      name: 'aselole',
      age: 33,
      address: 'indo'
    }
  ]
}
