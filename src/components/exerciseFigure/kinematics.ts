/**
 * Geometria di base per le figure animate degli esercizi.
 *
 * Perché esiste: la vecchia illustrazione animava ogni segmento del corpo con
 * SMIL in modo indipendente, quindi durante il movimento gli arti cambiavano
 * lunghezza e si staccavano dalle articolazioni. Qui ogni arto è risolto con
 * una cinematica inversa a due ossa (spalla→gomito→mano, anca→ginocchio→piede):
 * la lunghezza delle ossa è sempre costante e le articolazioni restano unite.
 *
 * Sistema di coordinate: quello dell'SVG (viewBox 260x200), y cresce verso il basso.
 */

export interface Point {
  x: number;
  y: number;
}

export const pt = (x: number, y: number): Point => ({ x, y });

export const lerp = (a: number, b: number, p: number): number => a + (b - a) * p;

export const lerpPoint = (a: Point, b: Point, p: number): Point => ({
  x: lerp(a.x, b.x, p),
  y: lerp(a.y, b.y, p)
});

export const distance = (a: Point, b: Point): number => Math.hypot(b.x - a.x, b.y - a.y);

/** Punto a `length` di distanza da `origin`, nella direzione `angleDeg` (0° = verso destra, 90° = verso il basso). */
export const polar = (origin: Point, length: number, angleDeg: number): Point => {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: origin.x + length * Math.cos(rad), y: origin.y + length * Math.sin(rad) };
};

/**
 * Curva di andata e ritorno per gli esercizi di forza.
 * t ∈ [0,1) è la posizione nel ciclo; restituisce 0 in partenza (t=0),
 * 1 al picco (t=0.5) e di nuovo 0 a fine ciclo, con accelerazione morbida.
 */
export const repCurve = (t: number): number => (1 - Math.cos(2 * Math.PI * t)) / 2;

/**
 * Direzione in cui si piega l'articolazione intermedia (gomito / ginocchio)
 * rispetto alla retta radice→bersaglio.
 * Regola pratica, ruotando la retta radice→bersaglio fino a farla puntare verso il basso:
 *  1  = l'articolazione sporge verso destra (+x)
 * -1  = sporge verso sinistra (−x).
 * Per una figura rivolta a destra, in piedi: ginocchio = 1 (in avanti), gomito = -1 (indietro).
 */
export type BendDirection = 1 | -1;

export interface TwoBoneResult {
  joint: Point; // gomito o ginocchio
  end: Point; // mano o piede (coincide col bersaglio se raggiungibile)
}

/**
 * Cinematica inversa a due ossa.
 * Se il bersaglio è troppo lontano l'arto si distende verso di esso;
 * se è troppo vicino viene allontanato fino al minimo raggiungibile.
 */
export function solveTwoBone(
  root: Point,
  target: Point,
  upperLength: number,
  lowerLength: number,
  bend: BendDirection
): TwoBoneResult {
  const dx = target.x - root.x;
  const dy = target.y - root.y;
  const rawDist = Math.hypot(dx, dy) || 0.0001;
  const minReach = Math.abs(upperLength - lowerLength) + 0.5;
  const maxReach = upperLength + lowerLength - 0.01;
  const dist = Math.min(Math.max(rawDist, minReach), maxReach);

  const ux = dx / rawDist;
  const uy = dy / rawDist;

  // Legge del coseno: proiezione del giunto lungo la retta e distanza perpendicolare.
  const along = (upperLength * upperLength - lowerLength * lowerLength + dist * dist) / (2 * dist);
  const perp = Math.sqrt(Math.max(0, upperLength * upperLength - along * along));

  // Normale "a sinistra" della direzione (in coordinate schermo con y verso il basso).
  const nx = uy;
  const ny = -ux;

  const joint = {
    x: root.x + ux * along + nx * perp * bend,
    y: root.y + uy * along + ny * perp * bend
  };
  const end = { x: root.x + ux * dist, y: root.y + uy * dist };
  return { joint, end };
}
