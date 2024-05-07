/**
 * @module Plansza.ts
 */

import Kulka from "./Kulka";
import Timer from "./Timer";
import { Cords, Ball, ObiektKulki } from "./Interfaces";

/**
 * klasa Plansza generująca planszę do gry oraz zapewniająca
 * metody zaznaczania, pathfindingu oraz generowania kulek
 * @class Plansza
 */
export default class Plansza {
  /** tablica wartości z których losowane będą teksty szydery @protected */
  protected tekstySzydery: string[] = [
    "cienko idzie",
    "hehe pudełko",
    "tak dalej",
    "LAMA!!!",
    "NOOB",
    "YEH!",
  ];
  /** tablica dwuwymiarowa w której będą przechowywane pola planszy @protected */
  protected pola: HTMLDivElement[][] = [[], [], [], [], [], [], [], [], []];
  /** tablica dwuwymiarowa na której zaznaczane są wartości pól planszy @protected */
  protected values: string[][] = [
    ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ];
  /** tablica obiektów classy Ball zawierająca wszystkie kulki znajdujące się na planszy @protected */
  protected balls: Ball[] = [];
  /** dwuwymiarowa tablicaa służąca do śledzenia możliwych ścieżek podczas pathfindingu @protected */
  protected positions: string[][] = [[], [], [], [], [], [], [], [], []];
  /** zmienna od której zależy czy została wybrana kulka do przesunięcia @protected */
  protected start: Boolean = false;
  /** zmienna pozycji kulki wybranej do przesunięcia @protected */
  protected startPos: Cords = { x: "", y: "" };
  /** zmienna która mówi czy zostało wybrane pole na które przesunąć kulkę @protected */
  protected finish: Boolean = false;
  /** zmienna pozycji wybranej kulki po przesunięciu @protected */
  protected finishPos: Cords = { x: "", y: "" };
  /** tablica pomagająca w zamianie najkrótszej ścieżki pathfindingu na tablice pozycji pól @protected */
  protected strToTab: string[];
  /** zmienna oznaczająca czy znaleziono ścieżkę @protected */
  protected isFound: Boolean = false;
  /** ilość zdobytych przez gracza punktów @protected */
  protected points: number = 0;
  /** zmienna timera klasy Timer @protected */
  protected timer: Timer;
  /** zmienna która mówi czy gra się zakończyła @protected */
  protected czyKoniecGry: Boolean = false;

  /** tablica przechowująca 3 kolejne kulki które zostaną dodane w następnej kolejności na planszę @protected */
  protected nextBalls: Kulka[] = [new Kulka(), new Kulka(), new Kulka()];

  /**
   * konstruktor klasy w którym tworzone i dodawane są plansza z polami, pierwsze kulki oraz inicjowany jest Timer
   * @constructor
   */
  constructor() {
    this.startFinding = this.startFinding.bind(this);
    this.select = this.select.bind(this);
    this.findPath = this.findPath.bind(this);
    this.hover = this.hover.bind(this);

    let plansza: HTMLDivElement = document.createElement("div");
    plansza.className = "plansza";

    let textBox: HTMLElement = document.createElement("div");
    textBox.id = "textBox";
    let szyder = document.createElement("p");
    szyder.id = "szyder";
    let p = document.createElement("p");
    p.innerHTML = "Następne:";
    textBox.appendChild(p);
    let ballBox = document.createElement("div");
    ballBox.id = "ballBox";
    let getBallObject: ObiektKulki = this.nextBalls[0].getObject;
    ballBox.appendChild(getBallObject());
    getBallObject = this.nextBalls[1].getObject;
    ballBox.appendChild(getBallObject());
    getBallObject = this.nextBalls[2].getObject;
    ballBox.appendChild(getBallObject());
    textBox.appendChild(ballBox);
    p = document.createElement("p");
    p.id = "points";
    p.innerHTML = "Punkty: " + this.points;
    textBox.appendChild(p);
    textBox.appendChild(szyder);

    document.body.appendChild(textBox);

    for (let i: number = 0; i < 9; i++) {
      for (let j: number = 0; j < 9; j++) {
        let pole: HTMLDivElement = document.createElement("div");
        pole.className = "pole";
        pole.style.left = String(50 * j) + "px";
        pole.style.top = String(50 * i) + "px";
        pole.id = "\\" + String(i) + "-" + String(j);
        pole.addEventListener("click", this.startFinding);
        this.pola[i].push(pole);
        plansza.appendChild(pole);
      }
    }

    for (let i: number = 0; i < 3; i++) {
      let losowanko1: number = Math.floor(Math.random() * 9);
      let losowanko2: number = Math.floor(Math.random() * 9);
      if (this.values[losowanko1][losowanko2] == "0") {
        let kulka = new Kulka();
        getBallObject = kulka.getObject;
        this.pola[losowanko1][losowanko2].append(getBallObject());
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
        this.pola[losowanko1][losowanko2].removeEventListener(
          "click",
          this.startFinding
        );
      } else {
        i--;
      }
    }

    document.body.appendChild(plansza);

    this.timer = new Timer();
  }

  /**
   * funkcja której celem jest zaznaczanie oraz odznaczanie klikniętych kulek
   * oraz zmiana zmiennej start w zależności czy można zacząć pathfinding czy nie
   * @protected
   * @param e Mouse Event służący znalezieniu klikniętego pola
   * @returns
   */
  protected select(e: MouseEvent): void {
    let target: HTMLDivElement = e.target as HTMLDivElement;
    if (!this.czyKoniecGry) {
      if (!this.start) {
        this.start = true;
        if (target.className == "kulka") {
          target.style.width = "30px";
          target.style.height = "30px";
          this.values[parseInt(target.parentElement.style.top) / 50][
            parseInt(target.parentElement.style.left) / 50
          ] += "S";
          this.startPos = {
            x: String(parseInt(target.parentElement.style.top) / 50),
            y: String(parseInt(target.parentElement.style.left) / 50),
          };
        } else {
          let elem: HTMLElement = document.querySelector(
            "#\\" + target.id + " .kulka"
          );
          elem.style.width = "30px";
          elem.style.height = "30px";

          this.values[parseInt(target.style.top) / 50][
            parseInt(target.style.left) / 50
          ] += "S";
          this.startPos = {
            x: String(parseInt(target.style.top) / 50),
            y: String(parseInt(target.style.left) / 50),
          };
        }
        for (let i: number = 0; i < 9; i++) {
          for (let j: number = 0; j < 9; j++) {
            if (this.pola[i][j].firstChild == undefined) {
              this.pola[i][j].addEventListener("mouseenter", this.hover);
            }
          }
        }
      } else {
        if (
          (this.startPos.x ==
            String(parseInt(target.parentElement.style.top) / 50) &&
            this.startPos.y ==
              String(parseInt(target.parentElement.style.left) / 50)) ||
          (this.startPos.x == String(parseInt(target.style.top) / 50) &&
            this.startPos.y == String(parseInt(target.style.left) / 50))
        ) {
          this.start = false;
          let kulki: any = document.getElementsByClassName("kulka");
          for (let i = 0; i < kulki.length; i++) {
            kulki[i].style.width = "25px";
            kulki[i].style.height = "25px";
          }
          for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
              this.values[i][j] = "0";
              this.pola[i][j].style.background = "none";
              this.pola[i][j].removeEventListener("mouseenter", this.hover);
            }
          }

          this.balls.forEach((ball) => {
            this.values[Number(ball.x)][Number(ball.y)] = ball.ballCollor;
          });
          this.startPos = {
            x: "",
            y: "",
          };
        } else {
          let kulki: any = document.getElementsByClassName("kulka");
          for (let i = 0; i < kulki.length; i++) {
            kulki[i].style.width = "25px";
            kulki[i].style.height = "25px";
          }
          for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
              this.values[i][j] = "0";
              this.pola[i][j].style.background = "none";
            }
          }
          this.balls.forEach((ball) => {
            this.values[Number(ball.x)][Number(ball.y)] = ball.ballCollor;
          });

          if (target.className == "kulka") {
            target.style.width = "30px";
            target.style.height = "30px";
            this.values[parseInt(target.parentElement.style.top) / 50][
              parseInt(target.parentElement.style.left) / 50
            ] += "S";
            this.startPos = {
              x: String(parseInt(target.parentElement.style.top) / 50),
              y: String(parseInt(target.parentElement.style.left) / 50),
            };
          } else {
            let elem: HTMLElement = document.querySelector(
              "#\\" + target.id + " .kulka"
            );
            elem.style.width = "30px";
            elem.style.height = "30px";

            this.values[parseInt(target.style.top) / 50][
              parseInt(target.style.left) / 50
            ] += "S";
            this.startPos = {
              x: String(parseInt(target.style.top) / 50),
              y: String(parseInt(target.style.left) / 50),
            };
          }
          for (let i: number = 0; i < 9; i++) {
            for (let j: number = 0; j < 9; j++) {
              if (this.pola[i][j].firstChild == undefined) {
                this.pola[i][j].addEventListener("mouseenter", this.hover);
              }
            }
          }
        }
      }
    }
  }

  /**
   * wywoływana podczas zatwierdzenia przesunięcia kulki, sprawdza czy jest możliwość przesunięcia kulki w dane miejsce
   * za pomocą danych z funkcji hover. Usuwa eventListener z pól planszy i zapisuje dane punktu przesunięcia
   * @protected
   * @param e Event służący znalezieniu klikniętego pola
   * @returns
   */
  protected startFinding(e: MouseEvent): void {
    let target: HTMLDivElement = e.target as HTMLDivElement;

    if (!this.finish && this.start && this.isFound) {
      this.finish = true;

      for (let i: number = 0; i < this.pola.length; i++) {
        for (let j: number = 0; j < this.pola.length; j++) {
          this.pola[i][j].removeEventListener("click", this.startFinding);
          this.pola[i][j].removeEventListener("click", this.select);
        }
      }

      this.finishPos = {
        x: String(parseInt(target.style.top) / 50),
        y: String(parseInt(target.style.left) / 50),
      };
      this.values[parseInt(target.style.top) / 50][
        parseInt(target.style.left) / 50
      ] = "F";

      this.findPath();
    }
  }

  /**
   * funkcja po wybraniu kulki przypisywana wszystkim polom jako eventListener "hover".
   * powoduje czerwone podświetlenie przewidywanej trasy kulki obliczając za każdym razem pathfinding
   * i zapisując wyniki do zmiennych aby mogły być użyte po zatwierdzeniu przesunięcia kulki
   * @protected
   * @param e Event służący znalezieniu klikniętego pola
   * @returns
   */
  protected hover(e: MouseEvent): void {
    let target: HTMLDivElement = e.target as HTMLDivElement;
    this.finishPos = {
      x: String(parseInt(target.style.top) / 50),
      y: String(parseInt(target.style.left) / 50),
    };
    this.values[parseInt(target.style.top) / 50][
      parseInt(target.style.left) / 50
    ] = "F";
    for (let i: number = 0; i < this.pola.length; i++) {
      for (let j: number = 0; j < this.pola[i].length; j++) {
        this.pola[i][j].style.background = "none";
      }
    }
    let startPoint: HTMLElement = document.getElementById(
      "\\" + this.startPos.x + "-" + this.startPos.y
    );
    let xStart: number = parseInt(startPoint.style.left) / 50;
    let yStart: number = parseInt(startPoint.style.top) / 50;

    let temp: HTMLElement[] = [];

    let obrot: number = 0;

    let temp2: HTMLElement[] = [startPoint];

    this.isFound = false;

    while (true) {
      obrot++;
      temp = temp2;
      temp2 = [];

      while (temp.length != 0) {
        startPoint = temp[0];
        temp.shift();

        let x: number = parseInt(startPoint.style.left) / 50;
        let y: number = parseInt(startPoint.style.top) / 50;

        //-------------------------------
        if (x - 1 > -1 && this.values[y][x - 1] == "F") {
          this.positions[y][x - 1] =
            this.positions[y][x] + "," + String(y) + "-" + String(x - 1) + ",F";
          this.isFound = true;
          break;
        }
        if (y - 1 > -1 && this.values[y - 1][x] == "F") {
          this.positions[y - 1][x] =
            this.positions[y][x] + "," + String(y - 1) + "-" + String(x) + ",F";
          this.isFound = true;
          break;
        }
        if (y + 1 < 9 && this.values[y + 1][x] == "F") {
          this.positions[y + 1][x] =
            this.positions[y][x] + "," + String(y + 1) + "-" + String(x) + ",F";
          this.isFound = true;
          break;
        }
        if (x + 1 < 9 && this.values[y][x + 1] == "F") {
          this.positions[y][x + 1] =
            this.positions[y][x] + "," + String(y) + "-" + String(x + 1) + ",F";
          this.isFound = true;
          break;
        }
        //--------------------------------

        if (x - 1 > -1 && this.values[y][x - 1] == "0") {
          this.values[y][x - 1] = String(obrot);
          this.positions[y][x - 1] =
            this.positions[y][x] + "," + String(y) + "-" + String(x - 1);
          temp2.push(this.pola[y][x - 1]);
        }
        if (y - 1 > -1 && this.values[y - 1][x] == "0") {
          this.values[y - 1][x] = String(obrot);
          this.positions[y - 1][x] =
            this.positions[y][x] + "," + String(y - 1) + "-" + String(x);
          temp2.push(this.pola[y - 1][x]);
        }
        if (y + 1 < 9 && this.values[y + 1][x] == "0") {
          this.values[y + 1][x] = String(obrot);
          this.positions[y + 1][x] =
            this.positions[y][x] + "," + String(y + 1) + "-" + String(x);
          temp2.push(this.pola[y + 1][x]);
        }
        if (x + 1 < 9 && this.values[y][x + 1] == "0") {
          this.values[y][x + 1] = String(obrot);
          this.positions[y][x + 1] =
            this.positions[y][x] + "," + String(y) + "-" + String(x + 1);
          temp2.push(this.pola[y][x + 1]);
        }
      }
      if (this.isFound || temp2.length == 0) {
        break;
      }
    }

    if (this.isFound) {
      for (let i: number = 0; i < this.positions.length; i++) {
        for (let j: number = 0; j < this.positions[i].length; j++) {
          if (this.positions[i][j] != undefined) {
            if (this.positions[i][j].includes("F")) {
              this.strToTab = this.positions[i][j].split(",");
            }
          }
        }
      }

      this.strToTab.pop();
      this.strToTab[0] = yStart + "-" + xStart;

      let pos: HTMLElement;
      for (let i: number = 0; i < this.strToTab.length; i++) {
        pos = document.getElementById("\\" + this.strToTab[i]);
        pos.style.backgroundColor = "red";
      }
    }

    this.finishPos = { x: "", y: "" };
    this.values[parseInt(target.style.top) / 50][
      parseInt(target.style.left) / 50
    ] = "0";

    for (let i: number = 0; i < 9; i++) {
      for (let j: number = 0; j < 9; j++) {
        if (this.pola[i][j].firstChild == undefined) {
          this.values[i][j] = "0";
        }
      }
    }
    this.positions = [[], [], [], [], [], [], [], [], []];
  }

  /**
   * funkcja przesuwająca kulkę, aktualizująca jej dane w tablicach i aktualizująca kulki na planszy
   * @protected
   * @returns
   */
  protected findPath(): void {
    for (let i: number = 0; i < 9; i++) {
      for (let j: number = 0; j < 9; j++) {
        if (this.pola[i][j].firstChild == undefined) {
          this.pola[i][j].removeEventListener("mouseenter", this.hover);
        }
      }
    }

    let pos: HTMLElement;
    for (let i: number = 0; i < this.strToTab.length; i++) {
      pos = document.getElementById("\\" + this.strToTab[i]);
      pos.style.backgroundColor = "lightblue";
    }

    let s: HTMLElement = document.getElementById(
      "\\" + this.startPos.x + "-" + this.startPos.y
    );
    let f: HTMLElement = document.getElementById(
      "\\" + this.finishPos.x + "-" + this.finishPos.y
    );
    let tempPos: Ball = this.balls.find(
      (ball) => ball.x == this.startPos.x && ball.y == this.startPos.y
    );
    let newBallPos: Ball = {
      x: this.finishPos.x,
      y: this.finishPos.y,
      ballCollor: tempPos.ballCollor,
    };

    this.balls = this.balls.filter((x) => x != tempPos);
    this.balls.push(newBallPos);

    let elem: HTMLElement = document.querySelector("#\\" + s.id + " .kulka");
    elem.style.width = "25px";
    elem.style.height = "25px";

    f.appendChild(s.firstChild);
  }
}
