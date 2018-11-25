import { Component, OnInit } from '@angular/core';
import {BsModalRef} from "ngx-bootstrap";
import {ArticleUpdateService} from "./article-update.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-article-update',
  templateUrl: './article-update.component.html',
  styleUrls: ['./article-update.component.css']
})
export class ArticleUpdateComponent implements OnInit {

  title;

  articleId;

  text: string;

  constructor(public articleModal: BsModalRef,
              private articleUpdateService: ArticleUpdateService,
              private router: Router) { }

  ngOnInit() {
    this.text = '';
  }

  reset(){
    this.text = '';
  }

  actionSubmit(){
    this.articleUpdateService.actionSubmit(this.articleId, this.text).subscribe(res => {
      this.articleModal.hide();
      if(this.router.url.length > 7){
        this.router.navigate(['main']);
      }else{
        this.router.navigate(['postUpdate']);
      }
    })
  }

  back(){
    this.articleModal.hide();
  }
}
