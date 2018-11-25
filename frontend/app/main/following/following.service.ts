import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/index";
import {rooturl} from "../../WebTool";


export class Follower{
  netId: string;
  display_name: string;
  avatar: string;
  headline: string;
}

@Injectable({
  providedIn: 'root',
})
export class FollowingService {

  BASE_URL = rooturl;

  constructor(private http: HttpClient) { }

  initFollowingList() {
    return this.http.get(this.BASE_URL + '/following', {withCredentials: true});
  }

  getAllFollowingProfile(users: string){
    return this.http.get(this.BASE_URL + '/profiles/' + users, {withCredentials: true});
  }

  addFollower(addNetId: string, followers: Follower[], curNetId: string): any{
    if(!this.checkHasAdded(addNetId, followers)){//check whether has added
      if(curNetId != addNetId){//not self
        //check whether the addedNetId has a profile
        return true;
      }else return false;
    }else return false;
  }

  checkHasAdded(netId: string, followers: Follower[]){
    for(let i = 0 ; i < followers.length ; i++){
      if(followers[i].netId == netId) {
        return true;
      }
    }
    return false;
  }

  async updateFollowers(addNetId : string){
    await this.http.put(this.BASE_URL + '/following/' + addNetId, null, {withCredentials: true}).toPromise();
  }

  async removeFollowing(netId: string){
    await this.http.delete(this.BASE_URL + '/following/' + netId, {withCredentials: true}).toPromise();
  }

  getProfile(addNetId: string){
    return this.http.get(this.BASE_URL + '/profile/' + addNetId, {withCredentials: true});
  }
}
