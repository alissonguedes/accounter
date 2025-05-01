import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteirasDigitaisComponent } from './carteiras-digitais.component';

describe('CarteirasDigitaisComponent', () => {
  let component: CarteirasDigitaisComponent;
  let fixture: ComponentFixture<CarteirasDigitaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarteirasDigitaisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarteirasDigitaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
