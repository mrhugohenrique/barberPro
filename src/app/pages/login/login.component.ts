import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { InputComponent } from '../../components/input/input.component';
@Component({
  selector: 'app-login',
  standalone: true,
  providers: [AuthService],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputComponent],
  templateUrl: './login.component.html',

})
export class LoginComponent {
  isRegister: boolean = false;
   _notifications= inject(ToastrService);
  readonly _formGroup = new FormGroup({
    email: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
    name: new FormControl(null),
  });

  constructor(private authService: AuthService, private router: Router, private _cdr: ChangeDetectorRef) {}
  toggleForm() {
    this.isRegister = !this.isRegister;
  }

  onSubmit() {
    const { email, password } = this._formGroup.value;
    if (email && password) {
      this.authService.login(email, password).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }

  onSubmitRegister() {
    if (this.isRegister) {
      const { name, email, password } = this._formGroup.value;
      if (name && email && password) {
        this.authService.register(name, email, password).subscribe(() => {
          this.isRegister = false;
        });
      }else{
        this._formGroup.markAllAsTouched();
        this._formGroup.markAsDirty();
        this._notifications.warning('Preencha todos os campos');
      }
    }
  }

  register() {
    this._formGroup.reset();
    this.isRegister = !this.isRegister;
    this._cdr.detectChanges();
  }
}
