export function kgToLb(kg: number) { return kg * 2.2046226218; }
export function lbToKg(lb: number) { return lb / 2.2046226218; }

export function cmToIn(cm: number) { return cm / 2.54; }
export function inToCm(inches: number) { return inches * 2.54; }

export function ftInToCm(feet: number, inches: number) { return inToCm(feet * 12 + inches); }
export function cmToFtIn(cm: number) {
  const totalIn = cmToIn(cm);
  const ft = Math.floor(totalIn / 12);
  const inch = Math.round((totalIn - ft * 12) * 10) / 10;
  return { ft, inch };
}
