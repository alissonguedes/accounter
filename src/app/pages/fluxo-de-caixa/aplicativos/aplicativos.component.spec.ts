import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AplicativosComponent } from './aplicativos.component';

describe('AplicativosComponent', () => {
  let component: AplicativosComponent;
  let fixture: ComponentFixture<AplicativosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AplicativosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AplicativosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
