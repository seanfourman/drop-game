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
        <div class="card-header">
          <h2 class="auth-title">🎮 REGISTER 🎮</h2>
          <div class="title-decoration"></div>
        </div>

        <form (ngSubmit)="onRegister()" #registerForm="ngForm" class="auth-form">
          <div class="form-group">
            <label for="email" class="form-label">EMAIL ADDRESS</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="email"
              required
              email
              placeholder="ENTER YOUR EMAIL"
              class="form-input"
            />
            <div class="input-glow"></div>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">PASSWORD</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="password"
              required
              minlength="6"
              placeholder="ENTER YOUR PASSWORD (MIN 6 CHARS)"
              class="form-input"
            />
            <div class="input-glow"></div>
          </div>

          <div class="form-group">
            <label for="confirmPassword" class="form-label">CONFIRM PASSWORD</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              [(ngModel)]="confirmPassword"
              required
              placeholder="CONFIRM YOUR PASSWORD"
              class="form-input"
            />
            <div class="input-glow"></div>
          </div>

          <button
            type="submit"
            [disabled]="!registerForm.valid || loading || password !== confirmPassword"
            class="submit-btn"
          >
            <span class="btn-text">{{ loading ? 'CREATING ACCOUNT...' : 'JOIN ARCADE' }}</span>
            <div class="btn-glow"></div>
          </button>

          <div *ngIf="error" class="error-message">
            <span class="error-icon">⚠️</span>
            {{ error }}
          </div>

          <div *ngIf="password !== confirmPassword && confirmPassword" class="error-message">
            <span class="error-icon">❌</span>
            PASSWORDS DO NOT MATCH
          </div>
        </form>

        <div class="auth-links">
          <p class="link-text">
            ALREADY A PLAYER? <a routerLink="/login" class="link-btn">LOGIN HERE</a>
          </p>
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
