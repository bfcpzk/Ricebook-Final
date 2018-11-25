import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {HeadlineService} from "./headline.service";
import {User} from "../../auth/registeration/registeration.service";

@Component({
  selector: 'app-headline',
  templateUrl: './headline.component.html',
  styleUrls: ['./headline.component.css']
})
export class HeadlineComponent implements OnInit {

  constructor(private router: Router,
              private headlineService: HeadlineService) { }

  newStatus : string;

  user: User;

  ngOnInit() {
    this.user = new User();
    this.headlineService.getUser()
      .subscribe((user) => {
        if(user){
          this.user.netId = user['username'];
          this.user.display_name = user['display_name'];
          this.user.email = user['email'];
          this.user.phone = user['phone'];
          this.user.dob = user['dob'];
          this.user.zipcode = user['zipcode'];
          this.user.avatar = user['avatar'];
          this.user.headline = user['headline'];
        }
      });
  }

  async updateHeadline(){
    if(this.newStatus != ''){
      await this.headlineService.updateHeadline(this.newStatus).toPromise();
      if(this.newStatus.length > 16){
        this.user.headline = this.newStatus.substr(0, 16) + "..";
      }else{
        this.user.headline = this.newStatus;
      }
    }
    this.newStatus = '';
  }

  logout(){
    this.headlineService.logout()
      .subscribe((res) => {
        this.router.navigate(['auth']);
      });
  }

  toProfile(){
    this.router.navigate(['profile']);
  }
}
