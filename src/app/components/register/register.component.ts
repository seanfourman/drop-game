import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Register</h2>
        <form (ngSubmit)="onRegister()" #registerForm="ngForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="email"
              required
              email
              placeholder="Enter your email"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="password"
              required
              minlength="6"
              placeholder="Enter your password (min 6 characters)"
            />
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              [(ngModel)]="confirmPassword"
              required
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            [disabled]="!registerForm.valid || loading || password !== confirmPassword"
          >
            {{ loading ? 'Creating account...' : 'Register' }}
          </button>

          <div *ngIf="error" class="error-message">
            {{ error }}
          </div>

          <div *ngIf="password !== confirmPassword && confirmPassword" class="error-message">
            Passwords do not match
          </div>
        </form>

        <div class="auth-links">
          <p>Already have an account? <a routerLink="/login">Login here</a></p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async onRegister(): Promise<void> {
    if (!this.email || !this.password || this.password !== this.confirmPassword) return;

    this.loading = true;
    this.error = '';

    try {
      await this.authService.register(this.email, this.password);
      this.router.navigate(['/game']);
    } catch (error: any) {
      this.error = error.message || 'Registration failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }
}
