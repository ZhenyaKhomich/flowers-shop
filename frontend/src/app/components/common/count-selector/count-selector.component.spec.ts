import {CountSelectorComponent} from './count-selector.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, NgModel} from '@angular/forms';

describe('count selector', () => {
  let fixture: ComponentFixture<CountSelectorComponent>;
  let component: CountSelectorComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, CountSelectorComponent]
    })

    fixture = TestBed.createComponent(CountSelectorComponent);
    component = fixture.componentInstance;

  })

  it('should have count set', () => {
    expect(component.count).toBeDefined()
  })

  it('should change value + 1 after increasing', () => {
    component.count = 1;
    component.increaseCount();
    expect(component.count).toBe(2);
  })

  it('should not decrease value if it is equal 1', () => {
    component.count = 1;
    component.decreaseCount();
    expect(component.count).toBe(1);
  })

  it('should emit value + 1 after increasing', (done) => {
    component.count = 1;
    component.onCountChange.subscribe(value => {
      expect(value).toBe(2);
      done();
    })

    component.increaseCount();
  })

  it('should emit value - 1 after decreasing', (done) => {
    component.count = 2;
    component.onCountChange.subscribe(value => {
      expect(value).toBe(1);
      done();
    })

    component.decreaseCount();
  })

  it('should change value in input after decreasing', (done) => {


    component.count = 5;
    component.decreaseCount();

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const componentElement: HTMLElement = fixture.nativeElement;
      const input: HTMLInputElement = componentElement.querySelector('input') as HTMLInputElement;

      expect(input.value).toBe('4');

      done();
    });
  });
});
