/**
 * @module Kulka.ts
 */
import { MetodyKulki } from "./Interfaces";
import { GrayScale } from "./Dekoratory";

/**
 * klasa kulki
 * @class Kulka
 * @implements MetodyKulki
 */
//@GrayScale
class Kulka implements MetodyKulki {
  /**
   * zmienna przechowująca wszystkie możliwe kolory kulek
   * @private
   * @readonly
   */
  private readonly colors: string[] = [
    "rgb(0, 0, 255)",
    "rgb(173, 216, 230)",
    "rgb(255, 0, 0)",
    "rgb(255, 165, 0)",
    "rgb(255, 192, 203)",
    "rgb(165, 42, 42)",
    "rgb(144, 238, 144)",
  ];
  /**
   * zmienna przechowująca losowany przy tworzeniu obiektu kolor kulki
   * @private
   * @readonly
   */
  private readonly color: string =
    this.colors[Math.floor(Math.random() * this.colors.length)];
  /**
   * zmienna przechowująca obiekt kulki
   * @private
   */
  private object: HTMLElement;
  constructor() {
    this.getObject = this.getObject.bind(this);

    this.object = document.createElement("div");
    this.object.className = "kulka";
    this.object.style.background = this.color;
  }

  /**
   * @public
   * @returns HTMLElement obiekt kulki
   */
  public getObject(): HTMLElement {
    return this.object;
  }

  /**
   * @public
   * @returns string kolor kulki
   */
  public getColor(): string {
    return this.color;
  }
}

export default Kulka;
