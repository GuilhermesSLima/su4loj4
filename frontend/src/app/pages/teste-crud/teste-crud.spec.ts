import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TesteCrud } from './teste-crud';

describe('TesteCrud', () => {
  let component: TesteCrud;
  let fixture: ComponentFixture<TesteCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TesteCrud],
    }).compileComponents();

    fixture = TestBed.createComponent(TesteCrud);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
