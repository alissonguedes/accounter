import { TestBed } from '@angular/core/testing';

import { CartoesCreditoService } from './cartoes-credito.service';

describe('CartoesCreditoService', () => {
  let service: CartoesCreditoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartoesCreditoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
