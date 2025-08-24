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
          <div class="user-badge">
            <span class="user-label">PLAYER:</span>
            <span class="user-email">{{ userEmail }}</span>
          </div>
          <button (click)="logout()" class="logout-btn">EXIT GAME</button>
        </div>
        <div class="score-info">
          <div class="score-display">
            <div class="score-label">SCORE</div>
            <div class="score-value">{{ currentScore }}</div>
          </div>
          <div class="score-display">
            <div class="score-label">HIGH SCORE</div>
            <div class="score-value">{{ highScore }}</div>
          </div>
        </div>
      </div>

      <div class="game-area">
        <div class="game-frame">
          <div class="frame-border">
            <canvas #gameCanvas width="800" height="600"></canvas>
          </div>
        </div>

        <div class="game-controls">
          <div class="control-section">
            <button
              (click)="dropBall()"
              [disabled]="!canDrop || gameOver"
              class="control-btn drop-btn"
            >
              <span class="btn-text">{{ canDrop ? 'DROP BALL' : 'BALL DROPPED' }}</span>
              <div class="btn-glow"></div>
            </button>

            <button (click)="resetGame()" [disabled]="!gameOver" class="control-btn reset-btn">
              <span class="btn-text">NEW GAME</span>
              <div class="btn-glow"></div>
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="gameOver" class="game-over">
        <div class="game-over-content">
          <h2 class="game-over-title">GAME OVER!</h2>
          <div class="final-score">
            <div class="score-label">FINAL SCORE</div>
            <div class="score-value">{{ currentScore }}</div>
          </div>
          <p *ngIf="currentScore > 0" class="score-message">🏆 GREAT JOB! SCORE SAVED! 🏆</p>
          <p *ngIf="currentScore === 0" class="score-message">💀 TRY AGAIN FOR BETTER SCORE! 💀</p>
        </div>
      </div>

      <div class="leaderboard">
        <div class="leaderboard-header">
          <h3>🏆 LEADERBOARD 🏆</h3>
          <div class="leaderboard-decoration"></div>
        </div>
        <div class="scores-list">
          <div *ngFor="let score of userScores; let i = index" class="score-item">
            <div class="score-rank">#{{ i + 1 }}</div>
            <div class="score-points">{{ score.score }} PTS</div>
            <div class="score-date">{{ score.date | date : 'MMM dd' }}</div>
          </div>
          <div *ngIf="userScores.length === 0" class="no-scores">
            <div class="no-scores-icon">🎯</div>
            <div class="no-scores-text">NO SCORES YET! PLAY TO SEE RESULTS!</div>
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

    // Draw retro arcade background
    this.drawArcadeBackground(ctx, canvas);

    // Draw target with retro styling
    this.drawRetroTarget(ctx, canvas);

    // Draw ball with retro effects
    this.drawRetroBall(ctx, canvas, state);
  }

  private drawArcadeBackground(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    // Grid pattern
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Center line
    ctx.strokeStyle = 'rgba(255, 0, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.5, 0);
    ctx.lineTo(canvas.width * 0.5, canvas.height);
    ctx.stroke();
  }

  private drawRetroTarget(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    const targetX = canvas.width * 0.5;
    const targetY = canvas.height * 0.9;

    // Target outer ring with neon effect
    ctx.fillStyle = '#ff00ff';
    ctx.shadowColor = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(targetX, targetY, 60, 0, 2 * Math.PI);
    ctx.fill();

    // Target middle ring
    ctx.fillStyle = '#ff6b6b';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(targetX, targetY, 40, 0, 2 * Math.PI);
    ctx.fill();

    // Target center with glow
    ctx.fillStyle = '#ff5252';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(targetX, targetY, 20, 0, 2 * Math.PI);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;
  }

  private drawRetroBall(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    state: any
  ): void {
    const ballX = (state.ballX / 100) * canvas.width;
    const ballY = (state.ballY / 100) * canvas.height;

    // Ball glow
    ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(ballX, ballY, 20, 0, 2 * Math.PI);
    ctx.fill();

    // Main ball
    ctx.fillStyle = '#00ffff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(ballX, ballY, 15, 0, 2 * Math.PI);
    ctx.fill();

    // Ball highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(ballX - 5, ballY - 5, 5, 0, 2 * Math.PI);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;
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
