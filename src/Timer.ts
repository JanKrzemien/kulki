/**
 * @module Timer.ts
 */
import { MetodyTimera } from "./Interfaces";

/**
 * klasa timera
 * @class Timer
 */
export default class Timer implements MetodyTimera {
  /** zmienna przechowująca intervał @private */
  private interval: number;
  /** zmienna przechowująca aktualny czas trwania gry @private */
  private currentTime: number;

  constructor() {
    var start = Date.now();
    this.interval = window.setInterval(
      function () {
        var delta = Date.now() - start;
        this.currentTime = Math.floor(delta / 1000);
      }.bind(this),
      1000
    );
  }

  /**
   * @public
   * @returns number który jest czasem trwania gry
   */
  public stopTimer(): number {
    clearInterval(this.interval);
    return this.currentTime;
  }
}
