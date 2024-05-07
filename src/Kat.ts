/**
 * @module Kat.ts
 */

import Plansza from "./Plansza";
import Kulka from "./Kulka";
import { Index, Ball } from "./Interfaces";
import { KofeinaIMefedron, szydera } from "./Dekoratory";

/**
 * klasa zawierająca metody oznaczania kulek do zbicia, zbijania i sprawdzania czy gracz wygrał czy przegrał.
 * Stworzona do poprawienia przejrzystości kodu i oddzielenia ważnego fragmentu jakim jest zbijanie do oddzielnego pliku
 * @class
 * @extends Plansza
 */
class Kat extends Plansza {
  /**
   * zmienna przechowująca informacje (ile kulek - 1) pod rząd jest potrzebne aby oznaczyć je wszystkie do zbicia
   */
  //@KofeinaIMefedron(1)
  ileZabicSzefie: number = 4;
  /**
   * zmienna kontrolująca czas który upływa po zbiciu
   */
  //@KofeinaIMefedron(200)
  CzasCzasCzas: number = 1000;

  constructor() {
    super();

    this.szydera();
  }

  /**
   * funkcja która po udekorowaniu staje się trybem szyderki
   * @method
   * @returns
   */
  //@szydera
  szydera(): void {}

  /**
   * funkcja która wyszukuje i oznacza kulki do zbicia
   * @protected
   * @returns
   */
  protected szukaj(): void {
    //* szuaknie kulek do zbicia

    let zabij: Index[] = [];

    //! wyszukiwanie od lewej do prawej
    let podRzad: number = 0;
    let startCords: Index;
    for (let i: number = 0; i < 9; i++) {
      for (let j: number = 0; j < 9; j++) {
        if (this.values[i][j] == "0") {
          if (podRzad > this.ileZabicSzefie) {
            while (podRzad > 0) {
              zabij.push({ i: startCords.i, j: startCords.j + podRzad - 1 });
              podRzad--;
            }
          }
          podRzad = 0;
        } else if (this.values[i][j - 1] == undefined) {
          if (podRzad > this.ileZabicSzefie) {
            while (podRzad > 0) {
              zabij.push({ i: startCords.i, j: startCords.j + podRzad - 1 });
              podRzad--;
            }
          }
          podRzad = 1;
          startCords = { i: i, j: j };
        } else if (this.values[i][j] != this.values[i][j - 1]) {
          if (podRzad > this.ileZabicSzefie) {
            while (podRzad > 0) {
              zabij.push({ i: startCords.i, j: startCords.j + podRzad - 1 });
              podRzad--;
            }
          }
          podRzad = 1;
          startCords = { i: i, j: j };
        } else if (this.values[i][j] == this.values[i][j - 1]) {
          podRzad++;
        }
        if (this.values[i][j + 1] == undefined) {
          if (podRzad > this.ileZabicSzefie) {
            while (podRzad > 0) {
              zabij.push({ i: startCords.i, j: startCords.j + podRzad - 1 });
              podRzad--;
            }
          }
          podRzad = 0;
        }
      }
    }
    //! koniec wyszukiwania od lewej do prawej

    //! wyszukiwanie z góry na dół
    podRzad = 0;
    for (let i: number = 0; i < 9; i++) {
      for (let j: number = 0; j < 9; j++) {
        if (this.values[j][i] == "0") {
          if (podRzad > this.ileZabicSzefie) {
            while (podRzad > 0) {
              zabij.push({ i: startCords.j + podRzad - 1, j: startCords.i });
              podRzad--;
            }
          }
          podRzad = 0;
        } else if (j == 0) {
          if (podRzad > this.ileZabicSzefie) {
            while (podRzad > 0) {
              zabij.push({ i: startCords.j + podRzad - 1, j: startCords.i });
              podRzad--;
            }
          }
          podRzad = 1;
          startCords = { i: i, j: j };
        } else if (this.values[j][i] != this.values[j - 1][i]) {
          if (podRzad > this.ileZabicSzefie) {
            while (podRzad > 0) {
              zabij.push({ i: startCords.j + podRzad - 1, j: startCords.i });
              podRzad--;
            }
          }
          podRzad = 1;
          startCords = { i: i, j: j };
        } else if (this.values[j][i] == this.values[j - 1][i]) {
          podRzad++;
        }
        if (j == 8) {
          if (podRzad > this.ileZabicSzefie) {
            while (podRzad > 0) {
              zabij.push({ i: startCords.j + podRzad - 1, j: startCords.i });
              podRzad--;
            }
          }
          podRzad = 0;
        }
      }
    }
    //! koniec wyszukiwania z góry na dół

    //! wyszukiwanie na skos góra lewo do dół prawo
    podRzad = 0;
    for (let i: number = 0; i < 9; i++) {
      for (let j: number = 0; j < 9; j++) {
        if (i == 0) {
          let k: number = j;
          let l: number = 0;
          while (k < 9 && l < 9) {
            if (this.values[l][k] == "0") {
              if (podRzad > this.ileZabicSzefie) {
                while (podRzad > 0) {
                  zabij.push({
                    i: startCords.i + podRzad - 1,
                    j: startCords.j + podRzad - 1,
                  });
                  podRzad--;
                }
              }
              podRzad = 0;
            } else if (l == 0 || k == 0 || (l == 0 && k == 0)) {
              if (podRzad > this.ileZabicSzefie) {
                while (podRzad > 0) {
                  zabij.push({
                    i: startCords.i + podRzad - 1,
                    j: startCords.j + podRzad - 1,
                  });
                  podRzad--;
                }
              }
              podRzad = 1;
              startCords = { i: l, j: k };
            } else if (this.values[l][k] != this.values[l - 1][k - 1]) {
              if (podRzad > this.ileZabicSzefie) {
                while (podRzad > 0) {
                  zabij.push({
                    i: startCords.i + podRzad - 1,
                    j: startCords.j + podRzad - 1,
                  });
                  podRzad--;
                }
              }
              podRzad = 1;
              startCords = { i: l, j: k };
            } else if (this.values[l][k] == this.values[l - 1][k - 1]) {
              podRzad++;
            }
            if (k == 8 || l == 8 || (l == 8 && k == 8)) {
              if (podRzad > this.ileZabicSzefie) {
                while (podRzad > 0) {
                  zabij.push({
                    i: startCords.i + podRzad - 1,
                    j: startCords.j + podRzad - 1,
                  });
                  podRzad--;
                }
              }
              podRzad = 0;
            }

            l++;
            k++;
          }
        } else {
          j = 0;
          let k: number = 0;
          let l: number = i;
          while (k < 9 && l < 9) {
            if (this.values[l][k] == "0") {
              if (podRzad > this.ileZabicSzefie) {
                while (podRzad > 0) {
                  zabij.push({
                    i: startCords.i + podRzad - 1,
                    j: startCords.j + podRzad - 1,
                  });
                  podRzad--;
                }
              }
              podRzad = 0;
            } else if (l == 0 || k == 0 || (l == 0 && k == 0)) {
              if (podRzad > this.ileZabicSzefie) {
                while (podRzad > 0) {
                  zabij.push({
                    i: startCords.i + podRzad - 1,
                    j: startCords.j + podRzad - 1,
                  });
                  podRzad--;
                }
              }
              podRzad = 1;
              startCords = { i: l, j: k };
            } else if (this.values[l][k] != this.values[l - 1][k - 1]) {
              if (podRzad > this.ileZabicSzefie) {
                while (podRzad > 0) {
                  zabij.push({
                    i: startCords.i + podRzad - 1,
                    j: startCords.j + podRzad - 1,
                  });
                  podRzad--;
                }
              }
              podRzad = 1;
              startCords = { i: l, j: k };
            } else if (this.values[l][k] == this.values[l - 1][k - 1]) {
              podRzad++;
            }
            if (k == 8 || l == 8 || (l == 8 && k == 8)) {
              if (podRzad > this.ileZabicSzefie) {
                while (podRzad > 0) {
                  zabij.push({
                    i: startCords.i + podRzad - 1,
                    j: startCords.j + podRzad - 1,
                  });
                  podRzad--;
                }
              }
              podRzad = 0;
            }

            l++;
            k++;
          }
          j = 8;
        }
      }
    }
    //! koniec wyszukiwania na skos góra lewo do dół prawo

    //! wyszukiwanie na skos góra prawo do dół lewo
    podRzad = 0;
    for (let i: number = 0; i < 9; i++) {
      for (let j: number = 0; j < 9; j++) {
        if (i == 0) {
          let k: number = j;
          let l: number = 8;
          while (k < 9 && l > -1) {
            if (this.values[l][k] == "0") {
              if (podRzad > this.ileZabicSzefie) {
                while (podRzad > 0) {
                  zabij.push({
                    i: startCords.i - podRzad + 1,
                    j: startCords.j + podRzad - 1,
                  });
                  podRzad--;
                }
              }
              podRzad = 0;
            } else if (l == 8 || k == 0 || (l == 8 && k == 0)) {
              if (podRzad > this.ileZabicSzefie) {
                while (podRzad > 0) {
                  zabij.push({
                    i: startCords.i - podRzad + 1,
                    j: startCords.j + podRzad - 1,
                  });
                  podRzad--;
                }
              }
              podRzad = 1;
              startCords = { i: l, j: k };
            } else if (this.values[l][k] != this.values[l + 1][k - 1]) {
              if (podRzad > this.ileZabicSzefie) {
                while (podRzad > 0) {
                  zabij.push({
                    i: startCords.i - podRzad + 1,
                    j: startCords.j + podRzad - 1,
                  });
                  podRzad--;
                }
              }
              podRzad = 1;
              startCords = { i: l, j: k };
            } else if (this.values[l][k] == this.values[l + 1][k - 1]) {
              podRzad++;
            }
            if (k == 8 || l == 0 || (l == 0 && k == 8)) {
              if (podRzad > this.ileZabicSzefie) {
                while (podRzad > 0) {
                  zabij.push({
                    i: startCords.i - podRzad + 1,
                    j: startCords.j + podRzad - 1,
                  });
                  podRzad--;
                }
              }
              podRzad = 0;
            }

            l--;
            k++;
          }
        } else {
          j = 0;
          let k: number = 0;
          let l: number = 8 - i;
          while (k < 9 && l > -1) {
            if (this.values[l][k] == "0") {
              if (podRzad > this.ileZabicSzefie) {
                while (podRzad > 0) {
                  zabij.push({
                    i: startCords.i - podRzad + 1,
                    j: startCords.j + podRzad - 1,
                  });
                  podRzad--;
                }
              }
              podRzad = 0;
            } else if (l == 8 || k == 0 || (l == 8 && k == 0)) {
              if (podRzad > this.ileZabicSzefie) {
                while (podRzad > 0) {
                  zabij.push({
                    i: startCords.i + podRzad - 1,
                    j: startCords.j - podRzad + 1,
                  });
                  podRzad--;
                }
              }
              podRzad = 1;
              startCords = { i: l, j: k };
            } else if (this.values[l][k] != this.values[l + 1][k - 1]) {
              if (podRzad > this.ileZabicSzefie) {
                while (podRzad > 0) {
                  zabij.push({
                    i: startCords.i - podRzad + 1,
                    j: startCords.j + podRzad - 1,
                  });
                  podRzad--;
                }
              }
              podRzad = 1;
              startCords = { i: l, j: k };
            } else if (this.values[l][k] == this.values[l + 1][k - 1]) {
              podRzad++;
            }
            if (k == 8 || l == 0 || (l == 0 && k == 8)) {
              if (podRzad > this.ileZabicSzefie) {
                while (podRzad > 0) {
                  zabij.push({
                    i: startCords.i - podRzad + 1,
                    j: startCords.j + podRzad - 1,
                  });
                  podRzad--;
                }
              }
              podRzad = 0;
            }
            l--;
            k++;
          }
          j = 8;
        }
      }
    }
    //! koniec wyszukiwania na skos góra prawo do dół lewo

    this.zabij(zabij);
  }

  /**
   * funkcja która zbija oznaczone kulki
   * @protected
   * @returns
   */
  protected zabij(doZabicia: Index[]): void {
    let punkty = this.points;
    for (let i: number = 0; i < doZabicia.length; i++) {
      if (this.values[doZabicia[i].i][doZabicia[i].j] != "0") {
        punkty++;
        this.values[doZabicia[i].i][doZabicia[i].j] = "0";
        this.pola[doZabicia[i].i][doZabicia[i].j].innerHTML = "";
        let temp: Ball[] = [];
        for (let j: number = 0; j < this.balls.length; j++) {
          if (
            Number(this.balls[j].x) == doZabicia[i].i &&
            Number(this.balls[j].y) == doZabicia[i].j
          ) {
          } else {
            temp.push(this.balls[j]);
          }
        }
        this.balls = temp;
      }
    }

    this.points = punkty;
    document.getElementById("points").innerHTML = "Punkty: " + this.points;

    this.addBalls();
  }

  /**
   * funkcja dodaje nowe kulki nowe kulki na plansze
   * @protected
   * @returns
   */
  protected addBalls() {
    for (let i: number = 0; i < 3; i++) {
      let losowanko1: number = Math.floor(Math.random() * 9);
      let losowanko2: number = Math.floor(Math.random() * 9);
      if (this.values[losowanko1][losowanko2] == "0") {
        let kulka = this.nextBalls[i];
        this.pola[losowanko1][losowanko2].append(kulka.getObject());
        this.values[parseInt(this.pola[losowanko1][losowanko2].style.top) / 50][
          parseInt(this.pola[losowanko1][losowanko2].style.left) / 50
        ] = kulka.getColor();
        this.balls.push({
          x: String(losowanko1),
          y: String(losowanko2),
          ballCollor: kulka.getColor(),
        });
        this.pola[losowanko1][losowanko2].addEventListener(
          "click",
          this.select
        );
        this.nextBalls[i] = new Kulka();
      } else {
        i--;
      }
    }
    let ballBox: HTMLElement = document.getElementById("ballBox");
    ballBox.innerHTML = "";
    ballBox.appendChild(this.nextBalls[0].getObject());
    ballBox.appendChild(this.nextBalls[1].getObject());
    ballBox.appendChild(this.nextBalls[2].getObject());

    if (this.balls.length > 78) {
      let czasTrwania: number = this.timer.stopTimer();
      let minuty: number = Math.floor(czasTrwania / 60);
      let sekundy: number = czasTrwania - minuty * 60;
      this.czyKoniecGry = true;

      alert(
        "koniec gry. na planszy nie zmieści się więcej kulek\ngra trwała " +
          minuty +
          ":" +
          sekundy +
          " minut\nzdobyłeś " +
          this.points +
          " punktów"
      );
    } else if (this.balls.length == 0) {
      let czasTrwania: number = this.timer.stopTimer();
      let minuty: number = Math.floor(czasTrwania / 60);
      let sekundy: number = czasTrwania - minuty * 60;
      this.czyKoniecGry = true;

      alert(
        "wygrałeś. na planszy nie ma już kulek\ngra trwała " +
          minuty +
          ":" +
          sekundy +
          " minut\nzdobyłeś " +
          this.points +
          " punktów"
      );
    }

    this.szydera();

    this.strToTab = [];
    this.positions = [[], [], [], [], [], [], [], [], []];
    this.start = false;
    this.startPos = { x: "", y: "" };
    this.finish = false;
    this.finishPos = { x: "", y: "" };

    for (let i: number = 0; i < 9; i++) {
      for (let j: number = 0; j < 9; j++) {
        if (this.pola[i][j].firstChild != undefined) {
          this.pola[i][j].addEventListener("click", this.select);
        } else {
          this.pola[i][j].addEventListener("click", this.startFinding);
        }
      }
    }
  }

  /**
   * funkcja która po upływie określonego czasu usuwa kolorową ścieżkę kulki i przywraca zmienne do odpowiedniego stanu żeby było możliwę kolejne wyszukanie trasy
   * @protected
   * @returns
   */
  protected findPath(): void {
    super.findPath();

    setTimeout(async () => {
      let pos: HTMLElement;
      for (let i: number = 0; i < this.strToTab.length; i++) {
        pos = document.getElementById("\\" + this.strToTab[i]);
        pos.style.background = "none";
      }
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          this.values[i][j] = "0";
        }
      }

      this.balls.forEach((ball) => {
        this.values[Number(ball.x)][Number(ball.y)] = ball.ballCollor;
      });

      this.szukaj();
    }, this.CzasCzasCzas);
  }
}

let plansza: Kat = new Kat();
