import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
	Input,
	OnInit
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-input',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent implements OnInit {
	@Input() label: string = '';
	@Input() id: string = 'app-input';
	@Input() type: string = 'text';
	@Input() placeholder: string = '';
	@Input() maxLength = 150;
	@Input() minLength = 0;
	@Input() showMaskTyped = false;
	@Input() control: FormControl<string | number | null> = new FormControl();
	private _cdr = inject(ChangeDetectorRef);

	ngOnInit() {
		this.control.valueChanges.subscribe(() => {
			this._cdr.detectChanges();
		});
	}

	onBlur() {
		if (this.control.value && typeof this.control.value === 'string') {
			this.control.setValue(this.control.value.trim());
		}
	}
}
