import {Component, OnInit} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap";
import {CommentsService} from "./comments.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  title;

  commentId;

  articleId;

  text: string;

  constructor(public modalRef: BsModalRef,
              private commentsService: CommentsService, private router: Router) { }

  ngOnInit() {
    this.text = '';
  }

  reset(){
    this.text = '';
  }

  actionSubmit(){
    this.commentsService.actionSubmit(this.articleId, this.commentId, this.text).subscribe(res => {
      this.modalRef.hide();
      if(this.router.url.length > 7){
        this.router.navigate(['main']);
      }else{
        this.router.navigate(['postUpdate']);
      }
    })
  }

  back(){
    this.modalRef.hide();
  }
}
