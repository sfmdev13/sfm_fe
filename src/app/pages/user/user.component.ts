import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  user_type: string = 'employee';
  

  constructor() { }

  ngOnInit(): void {
  }

  tabChange(value: any){
    console.log(value);
  }

}
