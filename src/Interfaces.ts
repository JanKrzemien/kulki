/**
 * @module Interfaces.ts
 */

/**
 * interface klasy przechowujący metody klasy Kulka
 * @interface
 */
export interface MetodyKulki {
  getObject(): void;
  getColor(): void;
}

/**
 * interface klasy przechowujący metody klasy Timer
 * @interface
 */
export interface MetodyTimera {
  stopTimer(): number;
}

/**
 * interface typu określający współrzędne x i y pól planszy
 * @interface
 */
export interface Cords {
  x: string;
  y: string;
}

/**
 * interface typu rozszerzający klasę Cords dodając kolor dla kulek
 * @interface
 * @extends Cords
 */
export interface Ball extends Cords {
  readonly ballCollor: string;
}

/**
 * interface typu określający współrzędne kulek do zbicia
 * @interface
 */
export interface Index {
  i: number;
  j: number;
}

/**
 * interface funkcji określający zwracany obiekt
 * @interface
 */
export interface ObiektKulki {
  (): HTMLElement;
}
