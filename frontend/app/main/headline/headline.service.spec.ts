import { TestBed, inject } from '@angular/core/testing';

import { HeadlineService } from './headline.service';

describe('HeadlineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeadlineService]
    });
  });

  it('should be created', inject([HeadlineService], (service: HeadlineService) => {
    expect(service).toBeTruthy();
  }));
});
