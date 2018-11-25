import { Injectable } from '@angular/core';
import {rooturl} from "../../../WebTool";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http: HttpClient) { }


  actionSubmit(postId: string, commentId: string, text: string){
    return this.http.put(rooturl + '/articles/' + postId,
      {text: text, commentId: commentId}, {withCredentials: true});
  }
}
