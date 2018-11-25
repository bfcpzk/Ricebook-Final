import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {rooturl} from "../../WebTool";
import {text} from "@angular/core/src/render3/instructions";

export class Feed{
  _id: string;
  author: string;
  update_time: string;
  content: string;
  pic: string;
  comments: Com[];
}

export class Com{
  _id: string;
  author: string;
  content: string;
  update_time: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  BASE_URL = rooturl;

  constructor(private http: HttpClient) { }

  searchPost(feedList: Feed[], searchCondition: string) {
    let tmpArr = [];
    for(let i = 0 ; i < feedList.length ; i++){
      if(feedList[i].content.includes(searchCondition)
        || feedList[i].author.toLowerCase() == searchCondition.toLowerCase()){
        tmpArr.push(feedList[i]);
      }
    }
    return tmpArr;
  }

  getFeedList(){
    return this.http.get(this.BASE_URL + '/articles', {withCredentials: true});
  }

  genStrDate(date: Date): string{
    const month = (date.getMonth() < 9) ? ("0" + (date.getMonth() + 1)) : ("" + (date.getMonth() + 1));
    const day = (date.getDate() < 10) ? ("0" + date.getDate()) : ("" + date.getDate());
    return date.getFullYear() + '-' + month + '-' + day;
  }

  postFeed(imgUrl: string, textContent: string){
    return this.http.post(this.BASE_URL + '/article', {image: imgUrl, text: textContent}, {withCredentials: true});
  }

  copyFeedList(tmpFeedList: Feed[]){
    let feedList = [];
    for(let i = 0 ; i < tmpFeedList.length ; i++){
      feedList.push(tmpFeedList[i]);
    }
    return feedList;
  }

  addNewFollowingsPosts(newNetId: string){
    return this.http.get(this.BASE_URL + '/articles/' + newNetId, {withCredentials: true});
  }

  removeFollowingsPosts(newNetId: string, feedList: Feed[]) {
    let tmpArr = [];
    for (let i = 0; i < feedList.length; i++) {
      if (feedList[i].author != newNetId) tmpArr.push(feedList[i]);
    }
    return tmpArr;
  }

  typeExchange(article : any): Feed{
    let feed = new Feed();
    feed._id = article._id;
    feed.author = article.author;
    feed.content = article.content;
    feed.update_time = this.genStrDate(new Date(article.update_time));
    feed.pic = article.pic;
    feed.comments = [];
    const comments_i = article.comments;
    for(let j = 0 ; j < comments_i.length ; j++){
      let comment = new Com();
      comment._id = comments_i[j]._id;
      comment.author = comments_i[j].author;
      comment.content = comments_i[j].content;
      comment.update_time = this.genStrDate(new Date(comments_i[j].update_time));
      feed.comments.push(comment);
    }
    return feed;
  }

  uploadArticle(fd: FormData){
    return this.http.put(this.BASE_URL + '/uploadArticle', fd, {withCredentials: true});
  }

  getProfile(){
    return this.http.get(this.BASE_URL + '/profile', {withCredentials: true});
  }
}
