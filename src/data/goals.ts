/**
 * Obiettivi di allenamento tra cui l'utente sceglie nella tab "Allenati".
 * Ogni scheda preset dichiara in `Routine.goals` a quali obiettivi appartiene;
 * la tab mostra solo le schede dell'obiettivo scelto (più quelle create dall'utente).
 */
import { GoalId } from '../types';

export interface TrainingGoal {
  id: GoalId;
  emoji: string;
  /** Etichetta breve per il selettore. */
  label: string;
  /** Titolo e descrizione del riquadro principale. */
  title: string;
  description: string;
}

export const TRAINING_GOALS: TrainingGoal[] = [
  {
    id: 'dimagrire',
    emoji: '🔥',
    label: 'Dimagrire',
    title: 'Perdere Peso & Sgonfiare la Pancia',
    description:
      'Schede basate su multiarticolari, contrazione del trasverso addominale e recuperi calibrati per massimizzare il deficit calorico.'
  },
  {
    id: 'addome',
    emoji: '🎯',
    label: 'Addome',
    title: 'Addome Scolpito',
    description:
      'Circuiti per retto addominale, obliqui e core profondo: sessioni brevi e intense sul tappetino e alla panca addominali.'
  },
  {
    id: 'gambe_glutei',
    emoji: '🍑',
    label: 'Gambe & Glutei',
    title: 'Gambe Toniche & Glutei Alti',
    description:
      'Squat, affondi, hip thrust e macchine dedicate per rassodare cosce e glutei e aumentare il metabolismo.'
  },
  {
    id: 'braccia_spalle',
    emoji: '💪',
    label: 'Braccia & Spalle',
    title: 'Braccia & Spalle Definite',
    description:
      'Bicipiti, tricipiti e deltoidi con manubri e cavi per braccia toniche e spalle armoniose.'
  },
  {
    id: 'petto_schiena',
    emoji: '🛡️',
    label: 'Petto & Schiena',
    title: 'Petto, Schiena & Postura',
    description:
      'Spinte e tirate bilanciate per un busto forte, schiena dritta e spalle aperte (effetto V-shape).'
  },
  {
    id: 'resistenza',
    emoji: '🏃',
    label: 'Resistenza',
    title: 'Fiato & Resistenza Cardio',
    description:
      'Tapis roulant, cyclette, ellittica e stair climber combinati con esercizi a corpo libero per cuore e polmoni.'
  }
];

export const DEFAULT_GOAL: GoalId = 'dimagrire';

export function getGoal(id: GoalId): TrainingGoal {
  return TRAINING_GOALS.find((g) => g.id === id) ?? TRAINING_GOALS[0];
}
