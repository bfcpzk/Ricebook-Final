import { TestBed, inject } from '@angular/core/testing';

import { PostsService } from './posts.service';
import {HttpClient, HttpClientModule, HttpHandler} from "@angular/common/http";
import {RouterTestingModule} from "@angular/router/testing";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

describe('PostsService', () => {
  let service : PostsService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PostsService, HttpClient, HttpHandler],
      imports: [BrowserModule, FormsModule, RouterTestingModule, HttpClientModule]
    });
    service = TestBed.get(PostsService);
  });

  it('should be created', inject([PostsService], (service: PostsService) => {
    expect(service).toBeTruthy();
  }));

 /* it('should fetch articles for current logged in user', (done: DoneFn) => {
    service.getFeedList('../../../assets/articles.json').subscribe(value => {
      expect(value).toBe(!null);
      done();
    });
  });*/

  /*it('reset', () => {
    const res = service.getValue();
    expect(res).toBe(10);
  });*/
});
