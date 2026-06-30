import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	DestroyRef,
	forwardRef,
	inject,
	input,
	OnInit
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
			multi: true
		}
	]
})
export class InputComponent implements ControlValueAccessor, OnInit {
	readonly label = input<string>('');
	readonly id = input<string>('app-input');
	readonly type = input<string>('text');
	readonly placeholder = input<string>('');
	readonly maxLength = input<number>(150);
	readonly minLength = input<number>(0);
	readonly showMaskTyped = input<boolean>(false);
	readonly control = input<FormControl<string | number | null>>(new FormControl());

	private readonly _cdr = inject(ChangeDetectorRef);
	private readonly _destroyRef = inject(DestroyRef);
	
	value: string | number | null = '';

	onChange: (value: unknown) => void = () => {};
	onTouched: () => void = () => {};

	ngOnInit() {
		this.control().valueChanges.pipe(
			takeUntilDestroyed(this._destroyRef)
		).subscribe(() => {
			this._cdr.detectChanges();
		});
	}

	writeValue(value: string | number | null): void {
		this.value = value;
		this.control().setValue(this.value, { emitEvent: false });
		this._cdr.detectChanges();
	}

	registerOnChange(fn: (value: unknown) => void): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	setDisabledState?(isDisabled: boolean): void {
		if (isDisabled) {
			this.control().disable({ emitEvent: false });
		} else {
			this.control().enable({ emitEvent: false });
		}
		this._cdr.detectChanges();
	}

	onInput(event: Event): void {
		const inputElement = event.target as HTMLInputElement;
		this.value = inputElement.value;
		this.onChange(this.value);
		this.control().setValue(this.value, { emitEvent: false });
		this._cdr.detectChanges();
	}

	onBlur() {
		if (this.value && typeof this.value === 'string') {
			this.value = this.value.trim();
			this.onChange(this.value);
			this.control().setValue(this.value, { emitEvent: false });
		}
		this.onTouched();
		this._cdr.detectChanges();
	}
}