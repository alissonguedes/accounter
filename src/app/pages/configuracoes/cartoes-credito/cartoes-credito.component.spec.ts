import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartoesCreditoComponent } from './cartoes-credito.component';

describe('CartoesCreditoComponent', () => {
  let component: CartoesCreditoComponent;
  let fixture: ComponentFixture<CartoesCreditoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartoesCreditoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartoesCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
