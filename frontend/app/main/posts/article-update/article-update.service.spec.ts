import { TestBed, inject } from '@angular/core/testing';

import { ArticleUpdateService } from './article-update.service';

describe('ArticleUpdateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArticleUpdateService]
    });
  });

  it('should be created', inject([ArticleUpdateService], (service: ArticleUpdateService) => {
    expect(service).toBeTruthy();
  }));
});
