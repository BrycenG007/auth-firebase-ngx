import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NgxAuthFirebaseuiLoginComponent} from './ngx-auth-firebaseui-login.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule, MatSnackBarModule} from '@angular/material';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AuthProcessService} from '../../services/auth-process.service';
import {FirestoreSyncService} from '../../services/firestore-sync.service';
import {NgxAuthFirebaseUIConfigToken, UserProvidedConfigToken} from '../../../module/ngx-auth-firebase-u-i.module';
import {AngularFireModule} from '@angular/fire';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuthStub, FirestoreStub} from '../../tests/helper';
import {AngularFireAuth} from '@angular/fire/auth';
import {ngxAuthFirebaseUIConfigFactory} from '../../interfaces/config.interface';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

describe('NgxAuthFirebaseuiLoginComponent', () => {
  let component: NgxAuthFirebaseuiLoginComponent;
  let fixture: ComponentFixture<NgxAuthFirebaseuiLoginComponent>;
  let testBedService: AuthProcessService;
  let componentService: AuthProcessService;

  beforeEach(async(() => {

    Object.defineProperty(window, 'matchMedia', {
      value: jest.fn(() => {
        return {matches: true}
      })
    });


    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
        MatSnackBarModule,
      ],
      providers: [
        HttpClientTestingModule,
        FirestoreSyncService,
        AngularFireModule,
        {provide: AngularFirestore, useValue: FirestoreStub},
        {provide: AngularFireAuth, useValue: AngularFireAuthStub},
        {provide: UserProvidedConfigToken, useValue: {}},
        {provide: NgxAuthFirebaseUIConfigToken, useFactory: ngxAuthFirebaseUIConfigFactory, deps: [UserProvidedConfigToken]},
        AuthProcessService
      ],
      declarations: [NgxAuthFirebaseuiLoginComponent]
    })
      .compileComponents().then(() => {
      fixture = TestBed.createComponent(NgxAuthFirebaseuiLoginComponent);
      component = fixture.componentInstance;

      // AuthService provided by Component, (should return MockAuthService)
      componentService = fixture.debugElement.injector.get(AuthProcessService);

      component.ngOnInit();
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('login form invalid when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('email field validity', () => {
    let errors = {};
    const email = component.loginForm.controls['email'];
    errors = email.errors || {};
    expect(errors['required']).toBeTruthy();
    expect(email.valid).toBeFalsy();

    email.setValue('test');
    email.setValue('test');
    errors = email.errors || {};
    expect(errors['email']).toBeTruthy();
  });

  it('password field validity', () => {
    let errors = {};
    const password = component.loginForm.controls['password'];
    errors = password.errors || {};
    expect(errors['required']).toBeTruthy();
    expect(password.valid).toBeFalsy();

    password.setValue('test');
    password.setValue('test');
    errors = password.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('login form validity', () => {
    expect(component.loginForm.valid).toBeFalsy();
    component.loginForm.controls['email'].setValue('test@test.com');
    component.loginForm.controls['password'].setValue('123456789');
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should login button be disabled if the login form is invalid', () => {
    const loginButton: DebugElement = fixture.debugElement.query(By.css('#loginButton'));
    expect(loginButton.nativeElement.disabled).toBeTruthy();
    console.log('loginButton', loginButton);
  });

  it('should login button be enabled if the login form is valid', () => {
    const loginButton: DebugElement = fixture.debugElement.query(By.css('#loginButton'));
    component.loginForm.controls['email'].setValue('test@test.com');
    component.loginForm.controls['password'].setValue('123456789');
    fixture.detectChanges();
    expect(loginButton.nativeElement.disabled).toBeFalsy();
  });

  it('should trigger onCreateAccountRequested event when its requested via create account button', () => {
    const createAccountButton = fixture.nativeElement.querySelector('#createAccountButton');
    spyOn(component.onCreateAccountRequested, 'emit');
    createAccountButton.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(component.onCreateAccountRequested.emit).toHaveBeenCalled();

  });
});
