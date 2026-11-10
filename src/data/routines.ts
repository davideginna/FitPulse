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
    goals: ['dimagrire'],
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
    goals: ['dimagrire', 'addome'],
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
    goals: ['braccia_spalle', 'petto_schiena', 'dimagrire'],
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
    goals: ['gambe_glutei', 'dimagrire'],
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
    goals: ['dimagrire', 'resistenza'],
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
    goals: ['resistenza', 'dimagrire'],
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
    goals: ['resistenza'],
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
    goals: ['gambe_glutei', 'resistenza'],
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
    description: 'Scheda pensata per chi in palestra ha il Multipower (bilanciere guidato) e la panca per addominali. Lo squat guidato lavora i muscoli più grandi in sicurezza, le macchine adductor/abductor tonificano interno coscia e glutei laterali, la panca addominali rinforza addome e obliqui, il cardio finale aumenta il consumo calorico.',
    goal: 'Gambe toniche & Girovita stretto',
    level: 'Intermedio',
    estimatedDurationMinutes: 55,
    estimatedCaloriesBurn: 400,
    tags: ['Multipower', 'Panca Addominali', 'Obliqui', 'Adductor/Abductor'],
    goals: ['gambe_glutei', 'addome'],
    exercises: [
      { exerciseId: 'smith_squat', sets: 4, reps: '10-12', restSeconds: 75, notes: 'Piedi un passo avanti rispetto al bilanciere' },
      { exerciseId: 'hip_thrust', sets: 3, reps: '12-15', restSeconds: 60, notes: 'Stringi i glutei in alto per 2 secondi' },
      { exerciseId: 'lunges', sets: 3, reps: '10 per gamba', restSeconds: 60, notes: 'Busto dritto, ginocchio posteriore vicino a terra' },
      { exerciseId: 'adductor_machine', sets: 3, reps: '12-15', restSeconds: 45, notes: 'Chiudi in 1 secondo, riapri in 3' },
      { exerciseId: 'abductor_machine', sets: 3, reps: '15-20', restSeconds: 45, notes: 'Schiena sempre appoggiata allo schienale' },
      { exerciseId: 'decline_crunch', sets: 3, reps: '12-15', restSeconds: 45, notes: 'Inizia dalla pendenza più bassa' },
      { exerciseId: 'decline_oblique_crunch', sets: 3, reps: '10 per lato', restSeconds: 45, notes: 'Gomito verso il ginocchio opposto, salita lenta' },
      { exerciseId: 'plank', sets: 3, reps: '40 sec', restSeconds: 45, notes: 'Addome contratto, bacino in linea' },
      { exerciseId: 'stair_climber', sets: 1, reps: '10 min', restSeconds: 60, notes: 'Finisher cardio a ritmo costante' }
    ]
  },
  {
    id: 'abs_express_15',
    title: '⚡ Addome Express 15\'',
    subtitle: '8 esercizi sul tappetino, 2 giri, pause minime',
    description: 'Sessione breve e intensa da fare anche a fine allenamento o a casa: 8 esercizi a tempo sul tappetino, 40 secondi di lavoro e 15 di pausa, ripetuti per 2 giri.',
    goal: 'Addome tonico in poco tempo',
    level: 'Intenso',
    estimatedDurationMinutes: 15,
    estimatedCaloriesBurn: 160,
    tags: ['Tappetino', 'Circuito', 'Breve'],
    goals: ['addome', 'dimagrire'],
    exercises: [
      { exerciseId: 'bicycle_crunch', sets: 2, reps: '40 sec', restSeconds: 15, notes: 'Ritmo costante, gomito al ginocchio opposto' },
      { exerciseId: 'leg_raises', sets: 2, reps: '40 sec', restSeconds: 15, notes: 'Scendi lento, schiena a terra' },
      { exerciseId: 'flutter_kicks', sets: 2, reps: '40 sec', restSeconds: 15, notes: 'Movimenti piccoli e veloci' },
      { exerciseId: 'reverse_crunch', sets: 2, reps: '40 sec', restSeconds: 15, notes: 'Arrotola il bacino' },
      { exerciseId: 'heel_touches', sets: 2, reps: '40 sec', restSeconds: 15, notes: 'Spalle sempre sollevate' },
      { exerciseId: 'dead_bug', sets: 2, reps: '40 sec', restSeconds: 15, notes: 'Lombare incollata al tappetino' },
      { exerciseId: 'hollow_hold', sets: 2, reps: '30 sec', restSeconds: 15, notes: 'Barchetta stabile, respira' },
      { exerciseId: 'plank', sets: 2, reps: '40 sec', restSeconds: 30, notes: 'Chiudi il giro con la tenuta' }
    ]
  },
  {
    id: 'abs_burner_20',
    title: '🔥 Core Bruciante 20\'',
    subtitle: '10 esercizi senza sosta per addome e obliqui',
    description: 'Circuito ad alta intensità: 10 esercizi da 45 secondi con 15 di pausa, 2 giri. Alterna esercizi per l\'addome basso, gli obliqui e il core profondo, con mountain climbers per alzare il battito.',
    goal: 'Addome definito & brucia calorie',
    level: 'Intenso',
    estimatedDurationMinutes: 20,
    estimatedCaloriesBurn: 230,
    tags: ['Tappetino', 'HIIT', 'Obliqui'],
    goals: ['addome', 'dimagrire'],
    exercises: [
      { exerciseId: 'mountain_climbers', sets: 2, reps: '45 sec', restSeconds: 15, notes: 'Parti forte per alzare il battito' },
      { exerciseId: 'v_ups', sets: 2, reps: '45 sec', restSeconds: 15, notes: 'Se troppo difficile piega le ginocchia' },
      { exerciseId: 'bicycle_crunch', sets: 2, reps: '45 sec', restSeconds: 15, notes: 'Ruota bene il busto' },
      { exerciseId: 'russian_twist', sets: 2, reps: '45 sec', restSeconds: 15, notes: 'Anche senza peso va bene' },
      { exerciseId: 'flutter_kicks', sets: 2, reps: '45 sec', restSeconds: 15, notes: 'Gambe basse ma schiena a terra' },
      { exerciseId: 'crunch', sets: 2, reps: '45 sec', restSeconds: 15, notes: 'Espira salendo' },
      { exerciseId: 'leg_raises', sets: 2, reps: '45 sec', restSeconds: 15, notes: 'Controlla la discesa' },
      { exerciseId: 'heel_touches', sets: 2, reps: '45 sec', restSeconds: 15, notes: 'Fianchi in tensione' },
      { exerciseId: 'hollow_hold', sets: 2, reps: '30 sec', restSeconds: 15, notes: 'Tenuta isometrica' },
      { exerciseId: 'plank', sets: 2, reps: '45 sec', restSeconds: 45, notes: 'Ultimo sforzo prima del giro successivo' }
    ]
  },
  {
    id: 'abs_complete_45',
    title: '🎯 Addome Completo 45\'',
    subtitle: 'Panca addominali + tappetino per tutta la fascia addominale',
    description: 'Scheda completa per il core: prima gli esercizi alla panca addominali con più carico, poi il lavoro a corpo libero sul tappetino e una tenuta finale. Chiude con 8 minuti di cardio per aumentare il consumo calorico.',
    goal: 'Addome forte e definito',
    level: 'Intermedio',
    estimatedDurationMinutes: 45,
    estimatedCaloriesBurn: 330,
    tags: ['Panca Addominali', 'Tappetino', 'Core'],
    goals: ['addome'],
    exercises: [
      { exerciseId: 'decline_crunch', sets: 3, reps: '12-15', restSeconds: 45, notes: 'Pendenza media' },
      { exerciseId: 'decline_oblique_crunch', sets: 3, reps: '10 per lato', restSeconds: 45, notes: 'Rotazione lenta' },
      { exerciseId: 'leg_raises', sets: 3, reps: '12', restSeconds: 40, notes: 'Addome basso' },
      { exerciseId: 'bicycle_crunch', sets: 3, reps: '20 alternati', restSeconds: 40, notes: 'Obliqui' },
      { exerciseId: 'dead_bug', sets: 3, reps: '10 per lato', restSeconds: 40, notes: 'Core profondo' },
      { exerciseId: 'russian_twist', sets: 3, reps: '20 alternati', restSeconds: 40, notes: 'Con manubrio leggero' },
      { exerciseId: 'hollow_hold', sets: 3, reps: '25 sec', restSeconds: 40, notes: 'Barchetta' },
      { exerciseId: 'plank', sets: 3, reps: '45 sec', restSeconds: 45, notes: 'Tenuta finale' },
      { exerciseId: 'stair_climber', sets: 1, reps: '8 min', restSeconds: 0, notes: 'Cardio di chiusura' }
    ]
  },
  {
    id: 'glutes_sculpt_50',
    title: '🍑 Glutei Scolpiti',
    subtitle: 'Hip thrust, multipower e macchine per glutei alti',
    description: 'Scheda dedicata ai glutei: si parte dagli esercizi con più carico (hip thrust e squat al multipower), poi affondi, stacchi e le macchine abductor/adductor per lavorare anche i glutei laterali e l\'interno coscia. Chiude con lo stair climber.',
    goal: 'Glutei alti e sodi',
    level: 'Intermedio',
    estimatedDurationMinutes: 50,
    estimatedCaloriesBurn: 400,
    tags: ['Glutei', 'Multipower', 'Macchine'],
    goals: ['gambe_glutei'],
    exercises: [
      { exerciseId: 'hip_thrust', sets: 4, reps: '10-12', restSeconds: 75, notes: 'Pausa di 2 secondi in alto' },
      { exerciseId: 'smith_squat', sets: 4, reps: '10-12', restSeconds: 75, notes: 'Piedi avanti, scendi profondo' },
      { exerciseId: 'lunges', sets: 3, reps: '10 per gamba', restSeconds: 60, notes: 'Busto leggermente inclinato in avanti per i glutei' },
      { exerciseId: 'deadlift', sets: 3, reps: '10', restSeconds: 75, notes: 'Spingi il bacino indietro' },
      { exerciseId: 'abductor_machine', sets: 3, reps: '15-20', restSeconds: 45, notes: 'Busto leggermente in avanti' },
      { exerciseId: 'adductor_machine', sets: 3, reps: '12-15', restSeconds: 45, notes: 'Chiusura controllata' },
      { exerciseId: 'stair_climber', sets: 1, reps: '10 min', restSeconds: 0, notes: 'Spinta sul tallone' }
    ]
  },
  {
    id: 'legs_strength_55',
    title: '🦵 Gambe Forti & Toniche',
    subtitle: 'Squat, pressa e affondi per tutta la coscia',
    description: 'Allenamento completo per le gambe: quadricipiti, femorali, glutei, interno ed esterno coscia. I muscoli delle gambe sono i più grandi del corpo: allenarli fa consumare molte calorie anche dopo la seduta.',
    goal: 'Gambe forti e definite',
    level: 'Intermedio',
    estimatedDurationMinutes: 55,
    estimatedCaloriesBurn: 450,
    tags: ['Gambe', 'Forza', 'Pressa'],
    goals: ['gambe_glutei', 'dimagrire'],
    exercises: [
      { exerciseId: 'squat', sets: 4, reps: '8-10', restSeconds: 90, notes: 'Carico impegnativo, tecnica pulita' },
      { exerciseId: 'leg_press', sets: 4, reps: '12', restSeconds: 75, notes: 'Non bloccare le ginocchia' },
      { exerciseId: 'lunges', sets: 3, reps: '12 per gamba', restSeconds: 60, notes: 'Passo lungo' },
      { exerciseId: 'deadlift', sets: 3, reps: '10', restSeconds: 75, notes: 'Femorali in allungamento' },
      { exerciseId: 'adductor_machine', sets: 3, reps: '15', restSeconds: 45, notes: 'Interno coscia' },
      { exerciseId: 'abductor_machine', sets: 3, reps: '15', restSeconds: 45, notes: 'Esterno coscia' },
      { exerciseId: 'recumbent_bike', sets: 1, reps: '10 min', restSeconds: 0, notes: 'Defaticamento a cadenza agile' }
    ]
  },
  {
    id: 'arms_shoulders_45',
    title: '💪 Braccia & Spalle Definite',
    subtitle: 'Bicipiti, tricipiti e deltoidi con manubri e cavi',
    description: 'Scheda per la parte superiore: spalle prima, poi bicipiti e tricipiti alternati per far recuperare un muscolo mentre lavora l\'altro. Piegamenti e plank finali per petto e core.',
    goal: 'Braccia toniche e spalle armoniose',
    level: 'Intermedio',
    estimatedDurationMinutes: 45,
    estimatedCaloriesBurn: 300,
    tags: ['Braccia', 'Spalle', 'Manubri'],
    goals: ['braccia_spalle'],
    exercises: [
      { exerciseId: 'shoulder_press', sets: 4, reps: '10-12', restSeconds: 75, notes: 'Addome contratto, niente slancio' },
      { exerciseId: 'lateral_raises', sets: 3, reps: '12-15', restSeconds: 45, notes: 'Gomiti morbidi, salita fino alle spalle' },
      { exerciseId: 'biceps_curl', sets: 4, reps: '10-12', restSeconds: 60, notes: 'Gomiti fermi ai fianchi' },
      { exerciseId: 'triceps_pushdown', sets: 4, reps: '12', restSeconds: 60, notes: 'Solo gli avambracci si muovono' },
      { exerciseId: 'row', sets: 3, reps: '12', restSeconds: 60, notes: 'Tira col gomito' },
      { exerciseId: 'pushups', sets: 3, reps: 'max', restSeconds: 60, notes: 'Anche sulle ginocchia' },
      { exerciseId: 'plank', sets: 2, reps: '45 sec', restSeconds: 45, notes: 'Chiusura per il core' }
    ]
  },
  {
    id: 'arms_pump_40',
    title: '⚡ Braccia Pump 40\'',
    subtitle: 'Superserie veloci bicipiti/tricipiti',
    description: 'Allenamento rapido a superserie: due esercizi uno dopo l\'altro senza pausa, poi recupero. Molto lavoro in poco tempo per braccia e spalle.',
    goal: 'Braccia toniche in poco tempo',
    level: 'Intenso',
    estimatedDurationMinutes: 40,
    estimatedCaloriesBurn: 280,
    tags: ['Braccia', 'Superserie', 'Veloce'],
    goals: ['braccia_spalle', 'dimagrire'],
    exercises: [
      { exerciseId: 'biceps_curl', sets: 4, reps: '12', restSeconds: 20, notes: 'Superserie con il pushdown: niente pausa' },
      { exerciseId: 'triceps_pushdown', sets: 4, reps: '12', restSeconds: 60, notes: 'Poi recupera' },
      { exerciseId: 'lateral_raises', sets: 3, reps: '15', restSeconds: 20, notes: 'Superserie con lo shoulder press' },
      { exerciseId: 'shoulder_press', sets: 3, reps: '10', restSeconds: 60, notes: 'Poi recupera' },
      { exerciseId: 'pushups', sets: 3, reps: '12', restSeconds: 20, notes: 'Superserie con i burpees' },
      { exerciseId: 'burpees', sets: 3, reps: '8', restSeconds: 60, notes: 'Chiusura metabolica' }
    ]
  },
  {
    id: 'chest_back_50',
    title: '🛡️ Petto & Schiena',
    subtitle: 'Spinte e tirate bilanciate per un busto forte',
    description: 'Scheda per la parte alta del corpo con equilibrio tra spinta (petto) e tirata (schiena): migliora la postura, apre le spalle e crea l\'effetto V-shape che fa sembrare il punto vita più stretto.',
    goal: 'Busto forte e postura dritta',
    level: 'Intermedio',
    estimatedDurationMinutes: 50,
    estimatedCaloriesBurn: 380,
    tags: ['Petto', 'Schiena', 'Postura'],
    goals: ['petto_schiena'],
    exercises: [
      { exerciseId: 'bench_press', sets: 4, reps: '8-10', restSeconds: 90, notes: 'Scapole addotte, bilanciere al petto' },
      { exerciseId: 'lat_machine', sets: 4, reps: '10-12', restSeconds: 75, notes: 'Tira alla parte alta del petto' },
      { exerciseId: 'row', sets: 4, reps: '10-12', restSeconds: 60, notes: 'Schiena piatta' },
      { exerciseId: 'pushups', sets: 3, reps: '12-15', restSeconds: 60, notes: 'Corpo in linea' },
      { exerciseId: 'deadlift', sets: 3, reps: '10', restSeconds: 90, notes: 'Carico moderato, schiena neutra' },
      { exerciseId: 'lateral_raises', sets: 3, reps: '15', restSeconds: 45, notes: 'Spalle aperte' },
      { exerciseId: 'plank', sets: 3, reps: '45 sec', restSeconds: 45, notes: 'Core stabile' }
    ]
  },
  {
    id: 'posture_45',
    title: '🧘 Schiena Sana & Postura',
    subtitle: 'Rinforzo dorsale e core profondo',
    description: 'Scheda più dolce per chi passa molte ore seduto: rinforza dorsali, spalle e core profondo con carichi moderati e movimenti controllati.',
    goal: 'Postura e schiena forte',
    level: 'Principiante',
    estimatedDurationMinutes: 45,
    estimatedCaloriesBurn: 250,
    tags: ['Postura', 'Schiena', 'Core'],
    goals: ['petto_schiena'],
    exercises: [
      { exerciseId: 'lat_machine', sets: 3, reps: '12', restSeconds: 60, notes: 'Movimento lento' },
      { exerciseId: 'row', sets: 3, reps: '12', restSeconds: 60, notes: 'Stringi le scapole' },
      { exerciseId: 'lateral_raises', sets: 3, reps: '15', restSeconds: 45, notes: 'Pesi leggeri' },
      { exerciseId: 'dead_bug', sets: 3, reps: '10 per lato', restSeconds: 40, notes: 'Lombare a terra' },
      { exerciseId: 'plank', sets: 3, reps: '40 sec', restSeconds: 45, notes: 'Bacino in linea' },
      { exerciseId: 'hip_thrust', sets: 3, reps: '12', restSeconds: 60, notes: 'Glutei forti proteggono la schiena' },
      { exerciseId: 'elliptical', sets: 1, reps: '10 min', restSeconds: 0, notes: 'Cardio dolce' }
    ]
  },
  {
    id: 'cardio_mix_45',
    title: '🏃 Cardio Misto 45\'',
    subtitle: 'Tapis, cyclette, ellittica e corpo libero',
    description: 'Allenamento di resistenza che alterna le macchine cardio a brevi blocchi a corpo libero: il cuore lavora a lungo a intensità variabile, migliorando fiato e consumo calorico.',
    goal: 'Fiato e resistenza',
    level: 'Tutti i livelli',
    estimatedDurationMinutes: 45,
    estimatedCaloriesBurn: 420,
    tags: ['Cardio', 'Macchine', 'Resistenza'],
    goals: ['resistenza', 'dimagrire'],
    exercises: [
      { exerciseId: 'treadmill', sets: 1, reps: '10 min', restSeconds: 60, notes: 'Camminata veloce in salita' },
      { exerciseId: 'jumping_jacks', sets: 3, reps: '45 sec', restSeconds: 20, notes: 'Ritmo costante' },
      { exerciseId: 'recumbent_bike', sets: 1, reps: '10 min', restSeconds: 60, notes: 'Cadenza 80 RPM' },
      { exerciseId: 'mountain_climbers', sets: 3, reps: '30 sec', restSeconds: 20, notes: 'Ginocchia al petto' },
      { exerciseId: 'elliptical', sets: 1, reps: '10 min', restSeconds: 60, notes: 'Spingi e tira' },
      { exerciseId: 'burpees', sets: 3, reps: '8', restSeconds: 45, notes: 'Al tuo ritmo' }
    ]
  },
  {
    id: 'hiit_40',
    title: '⚡ HIIT Resistenza 40\'',
    subtitle: 'Intervalli intensi per migliorare il fiato',
    description: 'Circuito ad alta intensità con kettlebell e corpo libero, seguito da intervalli sullo stair climber e sul tapis roulant. Per chi ha già una buona base di allenamento.',
    goal: 'Resistenza e capacità aerobica',
    level: 'Intenso',
    estimatedDurationMinutes: 40,
    estimatedCaloriesBurn: 470,
    tags: ['HIIT', 'Kettlebell', 'Cardio'],
    goals: ['resistenza', 'dimagrire'],
    exercises: [
      { exerciseId: 'kettlebell_swing', sets: 4, reps: '20', restSeconds: 40, notes: 'Spinta esplosiva delle anche' },
      { exerciseId: 'burpees', sets: 4, reps: '10', restSeconds: 40, notes: 'Petto a terra e salto' },
      { exerciseId: 'mountain_climbers', sets: 4, reps: '40 sec', restSeconds: 20, notes: 'Massima velocità' },
      { exerciseId: 'jumping_jacks', sets: 3, reps: '60 sec', restSeconds: 20, notes: 'Recupero attivo' },
      { exerciseId: 'stair_climber', sets: 1, reps: '8 min', restSeconds: 60, notes: '1 min veloce / 1 min lento' },
      { exerciseId: 'treadmill', sets: 1, reps: '8 min', restSeconds: 0, notes: 'Corsa leggera di chiusura' }
    ]
  }
];
