export type MuscleGroup = 
  | 'Gambe & Glutei'
  | 'Petto'
  | 'Dorso & Schiena'
  | 'Spalle'
  | 'Braccia'
  | 'Addome & Core'
  | 'Cardio & Metabolico';

export type Equipment = 
  | 'Bilanciere'
  | 'Manubri'
  | 'Macchinario'
  | 'Cavi'
  | 'Corpo Libero'
  | 'Kettlebell'
  | 'Cardio';

/**
 * Zone muscolari usate dalla mappa dei muscoli e per colorare la figura animata.
 * I disegni di ogni zona sono in src/components/muscleMap/muscleShapes.ts.
 */
export type MuscleRegion =
  | 'pettorali'
  | 'deltoidi'
  | 'bicipiti'
  | 'tricipiti'
  | 'avambracci'
  | 'trapezio'
  | 'dorsali'
  | 'lombari'
  | 'addominali'
  | 'obliqui'
  | 'flessori_anca'
  | 'glutei'
  | 'abduttori'
  | 'adduttori'
  | 'quadricipiti'
  | 'femorali'
  | 'polpacci';

export interface Exercise {
  id: string;
  name: string;
  category: MuscleGroup;
  equipment: Equipment;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzato';
  /** Descrizione libera mostrata all'utente (può citare muscoli specifici). */
  targetMuscles: string[];
  /** Zone che lavorano di più: evidenziate a colore pieno. */
  primaryMuscles: MuscleRegion[];
  /** Zone di supporto/stabilizzazione: evidenziate a colore attenuato. */
  secondaryMuscles: MuscleRegion[];
  calorieBurnRating: 'Moderata' | 'Alta' | 'Molto Alta';
  defaultSets: number;
  recommendedReps: string;
  recommendedRestSeconds: number;
  description: string;
  instructions: string[];
  tipsForFatLoss: string;
  commonMistakes: string[];
  svgType: 
    | 'squat'
    | 'deadlift'
    | 'bench_press'
    | 'pushups'
    | 'pullups'
    | 'lat_machine'
    | 'row'
    | 'shoulder_press'
    | 'lunges'
    | 'plank'
    | 'crunch'
    | 'russian_twist'
    | 'mountain_climbers'
    | 'burpees'
    | 'leg_press'
    | 'biceps_curl'
    | 'triceps_pushdown'
    | 'kettlebell_swing'
    | 'hip_thrust'
    | 'jumping_jacks'
    | 'treadmill'
    | 'stationary_bike'
    | 'elliptical'
    | 'stair_climber'
    | 'lateral_raises'
    | 'smith_squat'
    | 'decline_crunch'
    | 'decline_oblique_crunch'
    | 'adductor_machine'
    | 'abductor_machine'
    | 'leg_raises'
    | 'reverse_crunch'
    | 'bicycle_crunch'
    | 'dead_bug'
    | 'flutter_kicks'
    | 'hollow_hold'
    | 'v_ups'
    | 'heel_touches'
    | 'recumbent_bike';
}

export interface RoutineExercise {
  exerciseId: string;
  sets: number;
  reps: string;
  restSeconds: number;
  notes?: string;
}

/** Obiettivi di allenamento selezionabili (elenco e testi in src/data/goals.ts). */
export type GoalId = 'dimagrire' | 'addome' | 'gambe_glutei' | 'braccia_spalle' | 'petto_schiena' | 'resistenza';

export interface Routine {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  goal: string;
  level: 'Tutti i livelli' | 'Principiante' | 'Intermedio' | 'Avanzato' | 'Intenso';
  estimatedDurationMinutes: number;
  estimatedCaloriesBurn: number;
  tags: string[];
  /**
   * Obiettivi per cui la scheda è consigliata. Assente nelle schede create
   * dall'utente o al volo: quelle vengono mostrate con qualunque obiettivo.
   */
  goals?: GoalId[];
  exercises: RoutineExercise[];
}

export interface WorkoutSetRecord {
  setNumber: number;
  targetReps: string;
  completedReps: number;
  weightKg: number;
  completed: boolean;
}

export interface ExerciseLog {
  exerciseId: string;
  sets: WorkoutSetRecord[];
  notes?: string;
}

export interface WorkoutHistoryItem {
  id: string;
  routineTitle: string;
  startTime: string; // ISO date
  endTime: string;
  durationSeconds: number;
  estimatedCalories: number;
  totalVolumeKg: number;
  exercisesCompletedCount: number;
  logs: ExerciseLog[];
}

export interface UserStats {
  currentWeightKg?: number;
  targetWeightKg?: number;
  workoutsCompleted: number;
  totalMinutesTrained: number;
  estimatedCaloriesBurned: number;
}
