/**
 * @module Dekoratory.ts
 */

/**
 * dekorator klasy zmieniający kolory kulek na monochromatyczne
 * @param target będący this dekorowanej funkcji
 * @returns nowy konstruktor
 */
export const GrayScale = (target: any) => {
  const original = target;

  const construct = (constructor: any, args: any[]) => {
    const c: any = function () {
      //console.log(this);

      constructor.apply(this, args);

      this.object.style.filter = "grayscale(1)";
    };

    c.prototype = constructor.prototype;
    c.prototype.toString = function () {
      console.log("to string: ", ...args, this.newProperty);
    };

    return new c();
  };

  const newConstructor: any = function (...args: any[]) {
    // console.log("New: " + original.name + " " + args);
    return construct(original, args);
  };

  newConstructor.prototype = original.prototype;

  return newConstructor;
};

/**
 * dekorator parametru tworzący nowy parametr o określonych danych
 * @param ileZaGram zmienna typu number która stanie się wartość dekorowanego parametru
 * @returns nowy parametr
 */
export function KofeinaIMefedron(ileZaGram: number) {
  return (target: Object, propertyKey: string) => {
    let value: number = ileZaGram;
    const getter = function () {
      return ileZaGram;
    };
    const setter = function (newVal: number) {
      value = newVal;
    };
    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
    });
  };
}

/**
 * dekorator funkcji, tryb szydera wyświetlający losowe teksty graczowi
 * @param object
 * @param name
 * @param descriptor
 */
export function szydera(
  object: any,
  name: string,
  descriptor: PropertyDescriptor
) {
  descriptor.value = function () {
    let losowy: string =
      this.tekstySzydery[Math.floor(Math.random() * this.tekstySzydery.length)];
    for (let i: number = 0; i < 2; i++) {
      if (document.getElementById("szyder").innerHTML == losowy) {
        i--;
        losowy =
          this.tekstySzydery[
            Math.floor(Math.random() * this.tekstySzydery.length)
          ];
      } else {
        document.getElementById("szyder").innerHTML = losowy;
        break;
      }
    }
    document.getElementById("szyder").innerHTML =
      this.tekstySzydery[Math.floor(Math.random() * this.tekstySzydery.length)];
  };
}
