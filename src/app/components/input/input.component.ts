import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	forwardRef,
	inject,
	Input,
	OnInit
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-input',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
	  {
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => InputComponent),
		multi: true,
	  },
	],
  })
  export class InputComponent implements ControlValueAccessor, OnInit {
	@Input() label: string = '';
	@Input() id: string = 'app-input';
	@Input() type: string = 'text';
	@Input() placeholder: string = '';
	@Input() maxLength = 150;
	@Input() minLength = 0;
	@Input() showMaskTyped = false;
	@Input() control: FormControl<string | number | null> = new FormControl();
  
	private _cdr = inject(ChangeDetectorRef);
	value: string | number | null = '';
  
	onChange: any = () => {};
	onTouched: any = () => {};
  
	ngOnInit() {
	  this.control.valueChanges.subscribe(() => {
		this._cdr.detectChanges();
	  });
	}
  
	writeValue(value: string | number | null): void {
	  this.value = value;
	  this.control.setValue(this.value, { emitEvent: false });
	  this._cdr.detectChanges();
	}
  
	registerOnChange(fn: any): void {
	  this.onChange = fn;
	}
  
	registerOnTouched(fn: any): void {
	  this.onTouched = fn;
	}
  
	setDisabledState?(isDisabled: boolean): void {
	  isDisabled ? this.control.disable() : this.control.enable();
	  this._cdr.detectChanges();
	}
  
	onInput(event: Event): void {
	  const input = event.target as HTMLInputElement;
	  this.value = input.value;
	  this.onChange(this.value);
	  this.control.setValue(this.value);
	  this._cdr.detectChanges();
	}
  
	onBlur() {
	  if (this.control.value && typeof this.control.value === 'string') {
		this.control.setValue(this.control.value.trim());
		this.onChange(this.control.value);
	  }
	  this.onTouched();
	}
  }