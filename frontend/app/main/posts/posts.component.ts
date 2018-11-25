import {Component, Input, OnInit} from '@angular/core';
import {Feed, PostsService} from "./posts.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {CommentsComponent} from "./comments/comments.component";
import {rooturl} from "../../WebTool";
import {HttpClient} from "@angular/common/http";
import {ArticleUpdateComponent} from "./article-update/article-update.component";
import {Router} from "@angular/router";

const album_data = ["https://www.rice.edu/_images/feature-rice-facts.jpg",
  "https://www.rice.edu/_images/feature-why-rice.jpg",
  "https://www.rice.edu/_images/uploads/2015/baker-college-746x496.jpg",
  "https://www.rice.edu/_images/uploads/2015/martel-around-at-night-746x496.jpg"];


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  textContent = '';

  imgUrl: string;

  feedList: Feed[];

  searchCondition = '';

  searchRes: Feed[];

  netId: string;

  album = "https://www.rice.edu/_images/uploads/2015/martel-around-at-night-746x496.jpg";

  index = 0;

  selectedFile: File = null;

  @Input()
  set getNetIdFromParent(getNetIdFromParent: string){
    if(getNetIdFromParent != null && getNetIdFromParent != ''){
      const obj = JSON.parse(getNetIdFromParent);
      if(obj.flag == 1){
        this.postsService.addNewFollowingsPosts(obj.netId)
          .subscribe((res) => {
            const articles = res['articles'];
            for(let i = 0 ; i < articles.length ; i++){
              this.feedList.push(this.postsService.typeExchange(articles[i]));
            }
            this.searchRes = this.postsService.copyFeedList(this.feedList);
          });
      }else{
        this.feedList = this.postsService.removeFollowingsPosts(obj.netId, this.feedList);
        this.searchRes = this.postsService.copyFeedList(this.feedList);
      }
    }
  }

  /*modalRef: BsModalRef;*/

  constructor(private postsService: PostsService,
              private modalService: BsModalService,
              private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.feedList = [];
    this.searchRes = [];
    this.imgUrl = '../../../assets/white.jpg';
    this.getAllFeed();
    this.postsService.getProfile()
      .subscribe((user) => {
        if(user){
          this.netId = user['username'];
        }
      });
    /*setInterval(() => {
      this.index = (this.index + 1) % album_data.length;
      this.album = album_data[this.index];
    }, 2500);*/
  }

  getAllFeed(){
    this.postsService.getFeedList()
      .subscribe((res) => {
        const articles = res['articles'];
        for(let i = 0 ; i < articles.length ; i++){
          this.feedList.push(this.postsService.typeExchange(articles[i]));
        }
        this.searchRes = this.postsService.copyFeedList(this.feedList);
      });
  }

  reset(){
    this.textContent = '';
    this.imgUrl = '../../../assets/white.jpg';
  }

  postFeed(){
    if(this.textContent != ''){
      this.postsService.postFeed(this.imgUrl, this.textContent)
        .subscribe((res) =>{
          let f = new Feed();
          const date = new Date();
          f.pic = this.imgUrl;
          f.content = this.textContent;
          f.update_time = this.postsService.genStrDate(date);
          f.author = this.netId;
          this.feedList.unshift(f);
          this.searchRes = this.postsService.copyFeedList(this.feedList);
          if(this.router.url.length > 7){
            this.router.navigate(['main']);
          }else{
            this.router.navigate(['postUpdate']);
          }
        });
    }
  }

  searchPost(){
    if(this.searchCondition != ''){
      this.searchRes = this.postsService.searchPost(this.feedList, this.searchCondition);
      this.searchCondition = '';
    }else{
      this.searchRes = this.feedList;
    }
  }

  modalRef: BsModalRef;
  updateComment(postId: string, commentId: string){
    this.modalRef = this.modalService.show(CommentsComponent, {
      initialState:{
        title: 'What do you want to say?',
        commentId: commentId,
        articleId: postId
      }
    });
  }


  createComments(postId: string, commentId: string){
    this.modalRef = this.modalService.show(CommentsComponent, {
      initialState:{
        title: 'What do you want to say?',
        commentId: commentId,
        articleId: postId
      }
    });
  }

  articleModal: BsModalRef;
  updateArticle(postId: string){
    this.articleModal = this.modalService.show(ArticleUpdateComponent, {
      initialState:{
        title: 'What do you want to say?',
        articleId: postId
      }
    });
  }

  onFileSelected(event){
    if(event.target.files && event.target.files[0]){
      this.selectedFile = <File>event.target.files[0];
      const imgReader = new FileReader();
      imgReader.onload = (e : any) => this.imgUrl = e.target.result;
      imgReader.readAsDataURL(event.target.files[0]);

      let fd = new FormData();
      fd.append('image', this.selectedFile, this.selectedFile.name);
      this.postsService.uploadArticle(fd).subscribe((res) => {
        if(res['img']){
          this.imgUrl = res['img'];
        }else{
          this.imgUrl = '';
        }
      });
    }
  }

  /*onUpload(){
    const fd = new FormData();
    fd.append('imageFile', this.selectedFile);
    this.http.post(rooturl + '/imageUpload', fd, {withCredentials : true})
      .subscribe(res => {
        console.log(res);
      });
  }*/
}
