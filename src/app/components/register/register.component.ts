import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
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
