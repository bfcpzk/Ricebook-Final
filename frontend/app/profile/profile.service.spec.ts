import { TestBed, inject } from '@angular/core/testing';

import { ProfileService } from './profile.service';
import {HttpClient, HttpHandler} from "@angular/common/http";

describe('ProfileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfileService, HttpClient, HttpHandler]
    });
  });

  it('should be created', inject([ProfileService], (service: ProfileService) => {
    expect(service).toBeTruthy();
  }));
});
