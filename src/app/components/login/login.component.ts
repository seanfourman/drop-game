import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async onLogin(): Promise<void> {
    if (!this.email || !this.password) return;

    this.loading = true;
    this.error = '';

    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/game']);
    } catch (error: any) {
      this.error = error.message || 'Login failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }
}
