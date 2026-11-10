/**
 * Forme della mappa dei muscoli.
 *
 * Ogni vista (fronte / retro) è un corpo alto ~190 unità in un riquadro 100x200,
 * centrato su x = 50. Si disegna solo la METÀ SINISTRA (x ≤ 50): il componente
 * la specchia per ottenere il lato destro. Ogni forma è un poligono [x, y][].
 *
 * Il tipo Record<MuscleRegion, …> obbliga ad avere una voce per ogni zona
 * definita in src/types: aggiungendo una zona senza disegnarla il build fallisce.
 */
import { MuscleRegion } from '../../types';

export type Polygon = [number, number][];

export interface MuscleShape {
  /** Nome mostrato nella legenda. */
  label: string;
  front?: Polygon[];
  back?: Polygon[];
}

/** Sagoma del corpo (metà sinistra), da collo a piede e ritorno sulla linea centrale. */
export const BODY_OUTLINE_LEFT: Polygon = [
  [50, 29], [44, 30], [36, 32], [29, 36], [26, 44], [25, 58], [23, 72], [21, 86], [19, 96],
  [22, 99], [26, 89], [29, 75], [31, 63], [33, 53], [34, 66], [33, 80], [32, 92], [33, 106],
  [35, 124], [36, 140], [35, 158], [36, 176], [34, 186], [45, 188], [44, 178], [43, 160],
  [45, 140], [46, 122], [48, 104], [50, 99]
];

export const HEAD = { cx: 50, cy: 16, r: 11 };

const DELTOID: Polygon = [[36, 32], [29, 36], [27, 44], [31, 47], [35, 40]];
const FOREARM: Polygon = [[28, 63], [32, 62], [28, 80], [24, 82], [24, 74]];

export const MUSCLE_SHAPES: Record<MuscleRegion, MuscleShape> = {
  trapezio: {
    label: 'Trapezio',
    front: [[[47, 29], [38, 32], [46, 34]]],
    back: [[[50, 26], [44, 30], [36, 33], [42, 38], [50, 50]]]
  },
  deltoidi: { label: 'Spalle', front: [DELTOID], back: [DELTOID] },
  pettorali: { label: 'Pettorali', front: [[[48, 35], [37, 35], [34, 40], [36, 47], [48, 48]]] },
  bicipiti: { label: 'Bicipiti', front: [[[30, 47], [34, 46], [33, 58], [29, 60], [28, 54]]] },
  tricipiti: { label: 'Tricipiti', back: [[[30, 47], [34, 46], [34, 58], [30, 60], [28, 54]]] },
  avambracci: { label: 'Avambracci', front: [FOREARM], back: [FOREARM] },
  addominali: { label: 'Addominali', front: [[[49, 50], [44, 50], [44, 82], [49, 86]]] },
  obliqui: { label: 'Obliqui', front: [[[42, 50], [36, 49], [34, 62], [35, 76], [42, 80]]] },
  flessori_anca: { label: 'Flessori anca', front: [[[43, 85], [38, 83], [40, 93], [46, 98]]] },
  dorsali: { label: 'Dorsali', back: [[[49, 52], [42, 40], [36, 42], [35, 56], [40, 66], [49, 72]]] },
  lombari: { label: 'Lombari', back: [[[49, 74], [44, 72], [43, 84], [49, 86]]] },
  glutei: { label: 'Glutei', back: [[[49, 89], [41, 90], [35, 95], [36, 105], [42, 108], [49, 106]]] },
  abduttori: {
    label: 'Abduttori',
    front: [[[34, 82], [37, 84], [36, 98], [33, 96]]],
    back: [[[42, 84], [35, 82], [34, 90], [40, 91]]]
  },
  adduttori: {
    label: 'Adduttori',
    front: [[[47, 100], [49, 99], [49, 112], [46, 118]]],
    back: [[[48, 110], [49, 110], [49, 122], [47, 122]]]
  },
  quadricipiti: { label: 'Quadricipiti', front: [[[37, 100], [46, 100], [46, 108], [45, 124], [38, 126], [35, 112]]] },
  femorali: { label: 'Femorali', back: [[[37, 110], [47, 110], [46, 128], [39, 130], [36, 120]]] },
  polpacci: {
    label: 'Polpacci',
    front: [[[37, 136], [41, 134], [42, 156], [38, 160], [36, 148]]],
    back: [[[37, 134], [46, 134], [45, 152], [41, 160], [37, 152]]]
  }
};
