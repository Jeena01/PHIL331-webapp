import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmailCheckComponent } from './email-check.component';

describe('EmailCheckComponent', () => {
  let component: EmailCheckComponent;
  let fixture: ComponentFixture<EmailCheckComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [EmailCheckComponent, FormsModule],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate correct email format', () => {
    component.email = 'test@example.com';
    component.validateEmail();
    expect(component.isValidEmail).toBeTruthy();
  });

  it('should invalidate incorrect email format', () => {
    component.email = 'invalid-email';
    component.validateEmail();
    expect(component.isValidEmail).toBeFalsy();
  });

  it('should disable continue button when email is invalid', () => {
    component.isValidEmail = false;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBeTruthy();
  });

  it('should disable continue button while checking', () => {
    component.isValidEmail = true;
    component.isChecking = true;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBeTruthy();
  });

  it('should show loading spinner while checking', () => {
    component.isChecking = true;
    fixture.detectChanges();
    const spinner = fixture.nativeElement.querySelector('.loading-spinner');
    expect(spinner).toBeTruthy();
  });

  it('should display error message when present', () => {
    component.errorMessage = 'Test error message';
    fixture.detectChanges();
    const errorElement = fixture.nativeElement.querySelector('.text-error');
    expect(errorElement.textContent).toContain('Test error message');
  });
});
