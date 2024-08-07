import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeHairCutComponent } from './type-hair-cut.component';

describe('TypeHairCutComponent', () => {
  let component: TypeHairCutComponent;
  let fixture: ComponentFixture<TypeHairCutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeHairCutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypeHairCutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
