import { TestBed, inject } from '@angular/core/testing';

import { FollowingService } from './following.service';
import {HttpClient, HttpHandler} from "@angular/common/http";

describe('FollowingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FollowingService, HttpClient, HttpHandler]
    });
  });

  it('should be created', inject([FollowingService], (service: FollowingService) => {
    expect(service).toBeTruthy();
  }));
});
