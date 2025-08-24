import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface GameState {
  ballX: number;
  ballY: number;
  isMoving: boolean;
  isFalling: boolean;
  velocityX: number;
  velocityY: number;
  score: number;
  gameOver: boolean;
}

export interface GameResult {
  score: number;
  date: Date;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private gameState = new BehaviorSubject<GameState>({
    ballX: 50,
    ballY: 10,
    isMoving: true,
    isFalling: false,
    velocityX: 1,
    velocityY: 0,
    score: 0,
    gameOver: false,
  });

  private readonly GRAVITY = 0.1;
  private readonly BALL_SPEED = 1;
  private readonly TARGET_CENTER_X = 50;
  private readonly TARGET_CENTER_Y = 90;

  gameState$ = this.gameState.asObservable();

  startGame(): void {
    this.gameState.next({
      ballX: 50,
      ballY: 10,
      isMoving: true,
      isFalling: false,
      velocityX: this.BALL_SPEED,
      velocityY: 0,
      score: 0,
      gameOver: false,
    });
  }

  dropBall(): void {
    const currentState = this.gameState.value;
    if (currentState.gameOver) return; // Prevent dropping ball if game is over
    this.gameState.next({
      ...currentState,
      isMoving: false,
      isFalling: true,
      velocityX: 0,
    });
  }

  updateGame(): void {
    const currentState = this.gameState.value;

    if (currentState.gameOver) return;

    let newState = { ...currentState };

    if (currentState.isMoving) {
      // Ball moving side to side
      newState.ballX += currentState.velocityX;

      // Bounce off walls
      if (newState.ballX <= 5 || newState.ballX >= 95) {
        newState.velocityX = -newState.velocityX;
      }
    }

    if (currentState.isFalling) {
      // Ball falling with gravity
      newState.velocityY += this.GRAVITY;
      newState.ballY += newState.velocityY;

      // Check if ball hit the ground
      if (newState.ballY >= 85) {
        newState.gameOver = true;
        newState.score = this.calculateScore(newState.ballX);
      }
    }

    this.gameState.next(newState);
  }

  private calculateScore(ballX: number): number {
    const distance = Math.abs(ballX - this.TARGET_CENTER_X);

    if (distance <= 1) return 100;
    if (distance <= 2) return 75;
    if (distance <= 5) return 50;
    if (distance <= 8) return 25;
    return 0;
  }

  getCurrentState(): GameState {
    return this.gameState.value;
  }

  resetGame(): void {
    this.startGame();
  }
}
