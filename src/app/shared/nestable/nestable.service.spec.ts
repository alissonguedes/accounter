import { TestBed } from '@angular/core/testing';

import { NestableService } from './nestable.service';

describe('NestableService', () => {
  let service: NestableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NestableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
