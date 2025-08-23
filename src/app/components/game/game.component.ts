import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { GameService, GameState } from '../../services/game.service';
import { ScoreService } from '../../services/score.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="game-container">
      <div class="game-header">
        <div class="user-info">
          <span>Welcome, {{ userEmail }}</span>
          <button (click)="logout()" class="logout-btn">Logout</button>
        </div>
        <div class="score-info">
          <span>Current Score: {{ currentScore }}</span>
          <span>High Score: {{ highScore }}</span>
        </div>
      </div>

      <div class="game-area">
        <canvas #gameCanvas width="800" height="600"></canvas>

        <div class="game-controls">
          <button (click)="dropBall()" [disabled]="!canDrop || gameOver" class="drop-btn">
            {{ canDrop ? 'Drop Ball' : 'Ball Dropped' }}
          </button>

          <button (click)="resetGame()" [disabled]="!gameOver" class="reset-btn">New Game</button>
        </div>
      </div>

      <div *ngIf="gameOver" class="game-over">
        <h2>Game Over!</h2>
        <p>Final Score: {{ currentScore }}</p>
        <p *ngIf="currentScore > 0">Great job! Your score has been saved.</p>
        <p *ngIf="currentScore === 0">Try again to get a better score!</p>
      </div>

      <div class="leaderboard">
        <h3>Your Recent Scores</h3>
        <div class="scores-list">
          <div *ngFor="let score of userScores" class="score-item">
            <span>{{ score.score }} points</span>
            <span>{{ score.date | date : 'short' }}</span>
          </div>
          <div *ngIf="userScores.length === 0" class="no-scores">
            No scores yet. Play a game to see your results!
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('gameCanvas', { static: false }) gameCanvas!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private gameLoop!: any;
  private gameStateSubscription!: Subscription;
  private userScoresSubscription!: Subscription;

  userEmail: string = '';
  currentScore: number = 0;
  highScore: number = 0;
  gameOver: boolean = false;
  canDrop: boolean = true;
  userScores: any[] = [];

  constructor(
    private authService: AuthService,
    private gameService: GameService,
    private scoreService: ScoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }

      this.userEmail = user.email || '';
      this.loadUserScores();
    });

    this.gameStateSubscription = this.gameService.gameState$.subscribe((state) => {
      this.currentScore = state.score;
      this.gameOver = state.gameOver;
      this.canDrop = !state.isFalling && !state.gameOver;

      if (state.gameOver && state.score > 0) {
        this.saveScore();
      }
    });
  }

  ngAfterViewInit(): void {
    this.initializeCanvas();
    this.startGameLoop();
  }

  ngOnDestroy(): void {
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
    }
    if (this.gameStateSubscription) {
      this.gameStateSubscription.unsubscribe();
    }
    if (this.userScoresSubscription) {
      this.userScoresSubscription.unsubscribe();
    }
  }

  private initializeCanvas(): void {
    const canvas = this.gameCanvas.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    if (this.ctx) {
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';
    }
  }

  private startGameLoop(): void {
    this.gameLoop = setInterval(() => {
      this.gameService.updateGame();
      this.drawGame();
    }, 16); // ~60 FPS
  }

  private drawGame(): void {
    if (!this.ctx) return;

    const canvas = this.gameCanvas.nativeElement;
    const ctx = this.ctx;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get current game state
    const state = this.gameService.getCurrentState();

    // Draw background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw target (bottom center)
    const targetX = canvas.width * 0.5;
    const targetY = canvas.height * 0.9;

    // Target outer circle
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(targetX, targetY, 60, 0, 2 * Math.PI);
    ctx.fill();

    // Target inner circle
    ctx.fillStyle = '#ff8e8e';
    ctx.beginPath();
    ctx.arc(targetX, targetY, 40, 0, 2 * Math.PI);
    ctx.fill();

    // Target center
    ctx.fillStyle = '#ff5252';
    ctx.beginPath();
    ctx.arc(targetX, targetY, 20, 0, 2 * Math.PI);
    ctx.fill();

    // Draw ball
    const ballX = (state.ballX / 100) * canvas.width;
    const ballY = (state.ballY / 100) * canvas.height;

    ctx.fillStyle = '#4ecdc4';
    ctx.beginPath();
    ctx.arc(ballX, ballY, 15, 0, 2 * Math.PI);
    ctx.fill();

    // Ball shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.beginPath();
    ctx.arc(ballX + 2, ballY + 2, 15, 0, 2 * Math.PI);
    ctx.fill();
  }

  dropBall(): void {
    this.gameService.dropBall();
  }

  resetGame(): void {
    this.gameService.resetGame();
  }

  private async saveScore(): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (user && this.currentScore > 0) {
      try {
        await this.scoreService.saveScore(this.currentScore, user.uid);
        this.loadUserScores();
      } catch (error) {
        console.error('Error saving score:', error);
      }
    }
  }

  private loadUserScores(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userScoresSubscription = this.scoreService
        .getUserScores(user.uid)
        .subscribe((scores) => {
          this.userScores = scores;
          this.highScore = scores.length > 0 ? Math.max(...scores.map((s) => s.score)) : 0;
        });
    }
  }

  logout(): void {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
