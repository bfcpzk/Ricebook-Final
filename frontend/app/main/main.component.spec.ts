import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainComponent } from './main.component';
import {FollowingComponent} from "./following/following.component";
import {HeadlineComponent} from "./headline/headline.component";
import {PostsComponent} from "./posts/posts.component";
import {CommentsComponent} from "./posts/comments/comments.component";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientModule} from "@angular/common/http";
import {BsModalService, ComponentLoaderFactory, ModalModule, PositioningService} from "ngx-bootstrap";

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MainComponent,
        FollowingComponent,
        HeadlineComponent,
        PostsComponent,
        CommentsComponent
      ],
      providers: [BsModalService, ComponentLoaderFactory, PositioningService],
      imports: [
        BrowserModule,
        FormsModule,
        RouterTestingModule,
        HttpClientModule,
        ModalModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
