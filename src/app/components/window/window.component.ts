import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-window',
  standalone: true,
  imports: [],
  templateUrl: './window.component.html',
  styleUrl: './window.component.scss'
})
export class WindowComponent {
  @Input() title: string = 'Default Title';

  constructor(private _rounter: Router) { }

  close() {
    this._rounter.navigate(['']);
    window.close();
  }
}
