import { TestBed } from '@angular/core/testing';

import { MesesService } from './meses.service';

describe('MesesService', () => {
  let service: MesesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MesesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
