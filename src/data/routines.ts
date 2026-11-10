import { Routine } from '../types';

export const PRESET_ROUTINES: Routine[] = [
  {
    id: 'fat_burn_fullbody',
    title: '🔥 Brucia Grassi Full-Body Express',
    subtitle: 'Massimo consumo calorico ed effetto EPOC',
    description: 'Circuito ad alta intensità metabolica che stimola i grandi gruppi muscolari. Ideale per accelerare il metabolismo, bruciare calorie e conservare la massa magra durante il dimagrimento.',
    goal: 'Perdita peso & Accelerazione metabolica',
    level: 'Intermedio',
    estimatedDurationMinutes: 45,
    estimatedCaloriesBurn: 380,
    tags: ['Dimagrimento', 'Full Body', 'Circuito', 'Alta Spesa Calorica'],
    exercises: [
      { exerciseId: 'squat', sets: 4, reps: '12', restSeconds: 60, notes: 'Scendi controllando 3 secondi, spingi forte' },
      { exerciseId: 'pushups', sets: 3, reps: '12-15', restSeconds: 45, notes: 'Addome e glutei serrati al massimo' },
      { exerciseId: 'lat_machine', sets: 3, reps: '12', restSeconds: 60, notes: 'Tira al petto e apri le spalle' },
      { exerciseId: 'lunges', sets: 3, reps: '12 per gamba', restSeconds: 60, notes: 'Passo lungo, busto dritto' },
      { exerciseId: 'plank', sets: 3, reps: '45 sec', restSeconds: 45, notes: 'Risucchia l\'ombelico verso la colonna' },
      { exerciseId: 'mountain_climbers', sets: 3, reps: '40 sec', restSeconds: 45, notes: 'Finisher metabolico ad alto ritmo' }
    ]
  },
  {
    id: 'flat_belly_core',
    title: '🎯 Pancia Piatta & Definizione Addome',
    subtitle: 'Rafforzamento trasverso e riduzione girovita',
    description: 'Protocollo mirato a rinforzare la parete addominale profonda (trasverso) che sostiene i visceri riducendo la pancia gonfia e sporgente, unito a movimenti che mantengono alto il battito cardiaco.',
    goal: 'Riduzione pancia & Tonificazione Core',
    level: 'Tutti i livelli',
    estimatedDurationMinutes: 40,
    estimatedCaloriesBurn: 320,
    tags: ['Pancia Piatta', 'Core trasverso', 'Definizione', 'Postura'],
    exercises: [
      { exerciseId: 'plank', sets: 4, reps: '50 sec', restSeconds: 45, notes: 'Attiva il vacuum addominale espirando profondamente' },
      { exerciseId: 'russian_twist', sets: 3, reps: '20 alternati', restSeconds: 45, notes: 'Usa un manubrio leggero (4-6kg), ruota bene il busto' },
      { exerciseId: 'crunch', sets: 3, reps: '15', restSeconds: 45, notes: 'Solleva il bacino senza darti slancio' },
      { exerciseId: 'hip_thrust', sets: 3, reps: '15', restSeconds: 60, notes: 'Strizza forte i glutei in alto per 2 secondi' },
      { exerciseId: 'kettlebell_swing', sets: 4, reps: '20', restSeconds: 45, notes: 'Spinta esplosiva delle anche' }
    ]
  },
  {
    id: 'upper_burn',
    title: '💪 Upper Body & Torso Sculpt',
    subtitle: 'Spalle, schiena a V e petto per una vita più stretta',
    description: 'Allargare spalle e dorso migliora istantaneamente la silhouette riducendo la percezione del girovita. Include intervalli cardio per bruciare grasso.',
    goal: 'Tonificazione superiore & Proporzioni V-Shape',
    level: 'Intermedio',
    estimatedDurationMinutes: 45,
    estimatedCaloriesBurn: 340,
    tags: ['Dorsali', 'Petto', 'V-Shape', 'Brucia Calorie'],
    exercises: [
      { exerciseId: 'lat_machine', sets: 4, reps: '10-12', restSeconds: 60, notes: 'Schiena eretta, contrazione di 1 sec' },
      { exerciseId: 'bench_press', sets: 4, reps: '10-12', restSeconds: 75, notes: 'Carico moderato, movimento pulito' },
      { exerciseId: 'row', sets: 3, reps: '12 per braccio', restSeconds: 60, notes: 'Senza dondolare con il tronco' },
      { exerciseId: 'shoulder_press', sets: 3, reps: '12', restSeconds: 60, notes: 'Core bloccato' },
      { exerciseId: 'biceps_curl', sets: 3, reps: '15', restSeconds: 45, notes: 'Controlla la discesa' },
      { exerciseId: 'triceps_pushdown', sets: 3, reps: '15', restSeconds: 45, notes: 'Gomiti fissati ai fianchi' },
      { exerciseId: 'burpees', sets: 3, reps: '10', restSeconds: 60, notes: 'Brucia-calorie finale!' }
    ]
  },
  {
    id: 'lower_calorie_crusher',
    title: '⚡ Gambe d\'Acciaio & Brucia Grassi',
    subtitle: 'Attiva i muscoli più potenti per il massimo dispendio energetico',
    description: 'Le gambe e i glutei contengono oltre il 50% della massa muscolare del corpo. Allenarli intensamente è il modo più rapido per consumare calorie e mobilizzare il grasso corporeo.',
    goal: 'Massimo consumo energetico',
    level: 'Intenso',
    estimatedDurationMinutes: 50,
    estimatedCaloriesBurn: 440,
    tags: ['Gambe', 'Glutei', 'Metabolico', 'Alta Intensità'],
    exercises: [
      { exerciseId: 'squat', sets: 4, reps: '10-12', restSeconds: 75, notes: 'Fai pause minime tra le ripetizioni' },
      { exerciseId: 'leg_press', sets: 3, reps: '15', restSeconds: 60, notes: 'Tensione continua senza bloccare le ginocchia' },
      { exerciseId: 'lunges', sets: 3, reps: '12 per gamba', restSeconds: 60, notes: 'Passi profondi e stabili' },
      { exerciseId: 'hip_thrust', sets: 3, reps: '12-15', restSeconds: 60, notes: 'Spinta potente dai talloni' },
      { exerciseId: 'plank', sets: 3, reps: '45 sec', restSeconds: 45, notes: 'Recupero attivo per il core' },
      { exerciseId: 'jumping_jacks', sets: 3, reps: '60 sec', restSeconds: 30, notes: 'Ritmo veloce e costante' }
    ]
  },
  // --- NUOVE SCHEDE BASE & CARDIO MACCHINARI ---
  {
    id: 'starter_cardio_lightweights',
    title: '🌱 Base Principiante: Tapis, Cyclette & Pesi Piccoli',
    subtitle: 'Cardio dolce, risveglio muscolare e postura senza stress',
    description: 'La scheda ideale per chi comincia o vuole rimettersi in forma gradualmente. Alterna la camminata in salita sul Tapis Roulant, tonificazione braccia e spalle con manubri leggeri (2-4 kg), pancia piatta e pedalata drenante sulla Cyclette.',
    goal: 'Avviamento al fitness & Brucia grassi dolce',
    level: 'Principiante',
    estimatedDurationMinutes: 40,
    estimatedCaloriesBurn: 300,
    tags: ['Principianti', 'Cardio Dolce', 'Pesi Piccoli', 'Tapis Roulant', 'Cyclette'],
    exercises: [
      { exerciseId: 'treadmill', sets: 1, reps: '10 min', restSeconds: 60, notes: 'Camminata a passo svelto (5.5 km/h, pendenza 4%)' },
      { exerciseId: 'squat', sets: 3, reps: '12', restSeconds: 60, notes: 'A corpo libero o con manubri leggeri' },
      { exerciseId: 'lateral_raises', sets: 3, reps: '12-15', restSeconds: 45, notes: 'Manubri piccoli (2-4kg), gomiti morbidi' },
      { exerciseId: 'biceps_curl', sets: 3, reps: '12', restSeconds: 45, notes: 'Movimento fluido senza oscillare' },
      { exerciseId: 'plank', sets: 3, reps: '35 sec', restSeconds: 45, notes: 'Respira con calma e risucchia l\'ombelico' },
      { exerciseId: 'stationary_bike', sets: 1, reps: '12 min', restSeconds: 45, notes: 'Pedalata drenante a cadenza costante (75 RPM)' }
    ]
  },
  {
    id: 'cardio_climber_burn',
    title: '🔥 Cardio Brucia Grassi: Tapis Roulant & Climber Scale',
    subtitle: 'Massima spesa calorica e gambe sgonfie con le macchine cardio',
    description: 'Protocollo cardio completo ad alta combustione. Sfrutta il Tapis Roulant in salita, lo Stair Climber (attrezzo con i gradini) per scolpire i glutei, l\'Ellittica total body e il defaticamento su cyclette.',
    goal: 'Dimagrimento rapido & Drenaggio gambe',
    level: 'Tutti i livelli',
    estimatedDurationMinutes: 45,
    estimatedCaloriesBurn: 430,
    tags: ['Cardio Macchine', 'Stair Climber', 'Tapis Roulant', 'Ellittica', 'Glutei'],
    exercises: [
      { exerciseId: 'treadmill', sets: 1, reps: '12 min', restSeconds: 60, notes: 'Camminata in salita a 5.8 km/h, pendenza 6%' },
      { exerciseId: 'stair_climber', sets: 1, reps: '10 min', restSeconds: 60, notes: 'Salita a gradini spingendo con forza sul tallone' },
      { exerciseId: 'hip_thrust', sets: 3, reps: '15', restSeconds: 45, notes: 'Contrazione massima dei glutei in alto' },
      { exerciseId: 'elliptical', sets: 1, reps: '10 min', restSeconds: 45, notes: 'Coinvolgi anche la spinta delle braccia' },
      { exerciseId: 'crunch', sets: 3, reps: '15', restSeconds: 45, notes: 'Arrotola il bacino verso l\'ombelico' },
      { exerciseId: 'stationary_bike', sets: 1, reps: '8 min', restSeconds: 30, notes: 'Pedalata defaticante finale a resistenza leggera' }
    ]
  },
  {
    id: 'elliptical_light_tone',
    title: '✨ Ellittica & Tonificazione con Pesi Piccoli',
    subtitle: 'Zero impatto articolare, braccia toniche e glutei compatti',
    description: 'Un allenamento dolce ma efficace per rimodellare la figura senza affaticare schiena e ginocchia. L\'Ellittica attiva il metabolismo mentre i manubri leggeri definiscono le braccia e le spalle.',
    goal: 'Tonificazione morbida & Brucia calorie',
    level: 'Principiante',
    estimatedDurationMinutes: 42,
    estimatedCaloriesBurn: 320,
    tags: ['Ellittica', 'Pesi Piccoli', 'Zero Impatto', 'Tonificazione', 'Girovita'],
    exercises: [
      { exerciseId: 'elliptical', sets: 1, reps: '12 min', restSeconds: 45, notes: 'Ritmo costante, spingi e tira con le impugnature mobili' },
      { exerciseId: 'lunges', sets: 3, reps: '10 per gamba', restSeconds: 60, notes: 'Affondi controllati con manubri leggeri' },
      { exerciseId: 'lateral_raises', sets: 3, reps: '12-15', restSeconds: 45, notes: 'Solleva fino alle spalle, discesa lenta di 3 sec' },
      { exerciseId: 'triceps_pushdown', sets: 3, reps: '12', restSeconds: 45, notes: 'Tricipiti sodi con peso leggero' },
      { exerciseId: 'russian_twist', sets: 3, reps: '16 alternati', restSeconds: 45, notes: 'Ruota con un pesetto da 2-3 kg' },
      { exerciseId: 'treadmill', sets: 1, reps: '10 min', restSeconds: 45, notes: 'Camminata rilassante in piano a 5 km/h' }
    ]
  },
  {
    id: 'stairmaster_glute_sculpt',
    title: '🍑 Glutei & Gambe Toniche: Climber Gradini & Pesi',
    subtitle: 'La combinazione n.1 per sollevare i glutei e snellire le cosce',
    description: 'Focalizzato sui muscoli della catena posteriore. La salita sui gradini rotanti dello Stair Climber attiva i glutei al 100%, massimizzata da hip thrust, affondi camminati e cyclette drenante anti-ritenzione.',
    goal: 'Glutei alti, cosce toniche & Riduzione ritenzione',
    level: 'Intermedio',
    estimatedDurationMinutes: 45,
    estimatedCaloriesBurn: 410,
    tags: ['Stair Climber', 'Glutei', 'Gambe Toniche', 'Cardio', 'Anti-Ritenzione'],
    exercises: [
      { exerciseId: 'stair_climber', sets: 1, reps: '12 min', restSeconds: 60, notes: 'Passo profondo, tallone aderente al gradino' },
      { exerciseId: 'hip_thrust', sets: 4, reps: '12-15', restSeconds: 60, notes: 'Trattieni 2 secondi la contrazione in cima' },
      { exerciseId: 'lunges', sets: 3, reps: '12 per gamba', restSeconds: 60, notes: 'Affondi profondi con manubri' },
      { exerciseId: 'squat', sets: 3, reps: '12', restSeconds: 60, notes: 'Squat parallelo con discesa controllata' },
      { exerciseId: 'stationary_bike', sets: 1, reps: '10 min', restSeconds: 45, notes: 'Pedalata agile per smaltire l\'acido lattico' },
      { exerciseId: 'plank', sets: 3, reps: '45 sec', restSeconds: 45, notes: 'Core brace finale per compattare l\'addome' }
    ]
  },
  {
    id: 'smith_and_ab_bench',
    title: '🏋️ Multipower & Panca Addominali',
    subtitle: 'Gambe al bilanciere guidato e addome alla panca declinata',
    description: 'Scheda pensata per chi in palestra ha il Multipower (bilanciere guidato) e la panca per addominali. Lo squat guidato lavora i muscoli più grandi in sicurezza, la panca addominali rinforza addome e obliqui, il cardio finale aumenta il consumo calorico.',
    goal: 'Gambe toniche & Girovita stretto',
    level: 'Intermedio',
    estimatedDurationMinutes: 45,
    estimatedCaloriesBurn: 360,
    tags: ['Multipower', 'Panca Addominali', 'Obliqui', 'Gambe'],
    exercises: [
      { exerciseId: 'smith_squat', sets: 4, reps: '10-12', restSeconds: 75, notes: 'Piedi un passo avanti rispetto al bilanciere' },
      { exerciseId: 'hip_thrust', sets: 3, reps: '12-15', restSeconds: 60, notes: 'Stringi i glutei in alto per 2 secondi' },
      { exerciseId: 'lunges', sets: 3, reps: '10 per gamba', restSeconds: 60, notes: 'Busto dritto, ginocchio posteriore vicino a terra' },
      { exerciseId: 'decline_crunch', sets: 3, reps: '12-15', restSeconds: 45, notes: 'Inizia dalla pendenza più bassa' },
      { exerciseId: 'decline_oblique_crunch', sets: 3, reps: '10 per lato', restSeconds: 45, notes: 'Gomito verso il ginocchio opposto, salita lenta' },
      { exerciseId: 'plank', sets: 3, reps: '40 sec', restSeconds: 45, notes: 'Addome contratto, bacino in linea' },
      { exerciseId: 'stair_climber', sets: 1, reps: '10 min', restSeconds: 60, notes: 'Finisher cardio a ritmo costante' }
    ]
  }
];
