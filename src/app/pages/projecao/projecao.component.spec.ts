import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjecaoComponent } from './projecao.component';

describe('ProjecaoComponent', () => {
  let component: ProjecaoComponent;
  let fixture: ComponentFixture<ProjecaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjecaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjecaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
