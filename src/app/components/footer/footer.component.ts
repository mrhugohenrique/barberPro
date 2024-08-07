import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AuthGuard } from '../../guard/auth.guard';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [HttpClientModule],
  providers: [AuthService, AuthGuard],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  year: number = new Date().getFullYear();
}
