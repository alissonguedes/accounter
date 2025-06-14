import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NestableComponent } from './nestable.component';

describe('NestableComponent', () => {
  let component: NestableComponent;
  let fixture: ComponentFixture<NestableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NestableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NestableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
