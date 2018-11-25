import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  getNetIdFromFollowing: string;


  constructor() {}

  ngOnInit() {}

  getNewNetId(event){
    this.getNetIdFromFollowing = event;
  }
}
