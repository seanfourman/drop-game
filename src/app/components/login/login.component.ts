import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="card-header">
          <h2 class="auth-title">🎮 LOGIN 🎮</h2>
          <div class="title-decoration"></div>
        </div>

        <form (ngSubmit)="onLogin()" #loginForm="ngForm" class="auth-form">
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
              placeholder="ENTER YOUR PASSWORD"
              class="form-input"
            />
            <div class="input-glow"></div>
          </div>

          <button type="submit" [disabled]="!loginForm.valid || loading" class="submit-btn">
            <span class="btn-text">{{ loading ? 'LOGGING IN...' : 'START GAME' }}</span>
            <div class="btn-glow"></div>
          </button>

          <div *ngIf="error" class="error-message">
            <span class="error-icon">⚠️</span>
            {{ error }}
          </div>
        </form>

        <div class="auth-links">
          <p class="link-text">
            NEW PLAYER? <a routerLink="/register" class="link-btn">REGISTER HERE</a>
          </p>
        </div>
      </div>
    </div>
  `,
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
