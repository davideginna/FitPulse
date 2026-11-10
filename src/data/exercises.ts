import { Exercise, MuscleGroup } from '../types';

export const EXERCISES: Exercise[] = [
  // --- GAMBE & METABOLISMO ---
  {
    id: 'squat',
    name: 'Squat con Bilanciere o Manubri',
    category: 'Gambe & Glutei',
    equipment: 'Bilanciere',
    difficulty: 'Intermedio',
    targetMuscles: ['Quadricipiti', 'Glutei', 'Core (Addome profondo)', 'Femorali'],
    calorieBurnRating: 'Molto Alta',
    defaultSets: 4,
    recommendedReps: '10 - 12',
    recommendedRestSeconds: 75,
    description: 'Il re degli esercizi per bruciare calorie. Coinvolge i muscoli più grandi del corpo stimolando il metabolismo anche ore dopo l\'allenamento.',
    instructions: [
      'Posiziona i piedi alla larghezza delle spalle con le punte leggermente extraruotate.',
      'Mantieni il petto alto, le scapole addotte e l\'addome ben contratto (core brace).',
      'Scendi spingendo il bacino indietro e piegando le ginocchia, fino a rompere il parallelo se la mobilità lo consente.',
      'Spingi con tutta la pianta del piede verso il pavimento per tornare in posizione eretta senza bloccare violentemente le ginocchia.'
    ],
    tipsForFatLoss: 'Essendo un esercizio ad altissimo costo energetico, attiva un forte consumo calorico post-allenamento (EPOC). Concentrati su un movimento controllato nella discesa (3 secondi) per aumentare il lavoro muscolare.',
    commonMistakes: [
      'Portare il peso sulle punte dei piedi staccando i talloni',
      'Incurvare la schiena nella parte bassa',
      'Far collassare le ginocchia verso l\'interno (valgismo)'
    ],
    svgType: 'squat'
  },
  {
    id: 'smith_squat',
    name: 'Squat al Multipower (Bilanciere Guidato)',
    category: 'Gambe & Glutei',
    equipment: 'Macchinario',
    difficulty: 'Principiante',
    targetMuscles: ['Quadricipiti', 'Glutei', 'Femorali', 'Core'],
    calorieBurnRating: 'Molto Alta',
    defaultSets: 4,
    recommendedReps: '10 - 12',
    recommendedRestSeconds: 75,
    description: 'Squat con il bilanciere che scorre su guide verticali. La traiettoria fissa dà sicurezza e permette di concentrarsi sulla spinta delle gambe anche senza esperienza col bilanciere libero.',
    instructions: [
      'Posiziona il bilanciere sui trapezi (non sul collo) e sblocca i ganci ruotando i polsi.',
      'Porta i piedi leggermente avanti rispetto alla linea del bilanciere, larghezza spalle.',
      'Scendi spingendo il bacino indietro e in basso fino a cosce parallele al pavimento, busto alto.',
      'Risali spingendo con tutta la pianta del piede; a fine serie riaggancia ruotando i polsi.'
    ],
    tipsForFatLoss: 'La guida riduce il lavoro di equilibrio: puoi usare carichi un po\' più alti e recuperi brevi (60-75 s) per mantenere alto il dispendio calorico.',
    commonMistakes: [
      'Tenere i piedi esattamente sotto il bilanciere, sovraccaricando le ginocchia',
      'Dimenticare di riagganciare i fermi a fine serie',
      'Scendere con il bacino in retroversione (schiena che si arrotonda)'
    ],
    svgType: 'smith_squat'
  },
  {
    id: 'lunges',
    name: 'Affondi Camminati con Manubri',
    category: 'Gambe & Glutei',
    equipment: 'Manubri',
    difficulty: 'Principiante',
    targetMuscles: ['Glutei', 'Quadricipiti', 'Femorali', 'Core stabilizzatore'],
    calorieBurnRating: 'Molto Alta',
    defaultSets: 3,
    recommendedReps: '12 per gamba',
    recommendedRestSeconds: 60,
    description: 'Esercizio dinamico unilaterale che accelera il battito cardiaco, tonifica i glutei e richiede un continuo controllo addominale per l\'equilibrio.',
    instructions: [
      'Impugna due manubri ai lati del corpo con postura eretta e spalle basse.',
      'Fai un passo avanti ampio piegando entrambe le ginocchia a circa 90 gradi.',
      'Il ginocchio posteriore deve sfiorare il suolo senza impattare.',
      'Spingi sul tallone anteriore per avanzare con l\'altra gamba in maniera fluida.'
    ],
    tipsForFatLoss: 'Ottimo per alzare i battiti cardiaci senza sovraccaricare la colonna vertebrale. Mantieni un ritmo costante senza pause tra un passo e l\'altro.',
    commonMistakes: [
      'Passo troppo corto provocando eccessivo carico sul ginocchio',
      'Inclinare il busto in avanti o oscillare con le spalle'
    ],
    svgType: 'lunges'
  },
  {
    id: 'deadlift',
    name: 'Stacco da Terra (Deadlift)',
    category: 'Dorso & Schiena',
    equipment: 'Bilanciere',
    difficulty: 'Avanzato',
    targetMuscles: ['Dorsali', 'Glutei', 'Femorali', 'Erettori spinali', 'Core'],
    calorieBurnRating: 'Molto Alta',
    defaultSets: 4,
    recommendedReps: '8 - 10',
    recommendedRestSeconds: 90,
    description: 'Esercizio globale che recluta quasi tutti i muscoli posteriori del corpo. Massimizza il rilascio ormonale anabolico e lipolitico.',
    instructions: [
      'Piedi sotto il bilanciere, tibia a 2-3 cm dalla sbarra.',
      'Afferra la sbarra con presa prona poco più larga delle gambe.',
      'Abbassa le anche, petto fiero in fuori, schiena con curva lombare neutra.',
      'Spingi il pavimento via coi piedi sollevando la barra a contatto con le gambe fino alla totale estensione dell\'anca.'
    ],
    tipsForFatLoss: 'Uno degli esercizi a più alto impatto metabolico. Mantenere l\'addome contratto (manovra di Valsalva) è fondamentale per proteggere la schiena e stimolare il torchio addominale.',
    commonMistakes: [
      'Arrotondare la zona lombare',
      'Allontanare il bilanciere dal corpo durante la salita'
    ],
    svgType: 'deadlift'
  },
  {
    id: 'hip_thrust',
    name: 'Hip Thrust con Bilanciere o Macchina',
    category: 'Gambe & Glutei',
    equipment: 'Bilanciere',
    difficulty: 'Intermedio',
    targetMuscles: ['Glutei', 'Femorali', 'Core'],
    calorieBurnRating: 'Alta',
    defaultSets: 3,
    recommendedReps: '12 - 15',
    recommendedRestSeconds: 60,
    description: 'Focalizzato sulla catena posteriore con grande attivazione dei glutei e dispendio energetico elevato.',
    instructions: [
      'Appoggia la parte centrale della schiena su una panca robusta, bilanciere posizionato sul bacino con imbottitura.',
      'Piedi piantati a terra alla larghezza delle spalle.',
      'Spingi attraverso i talloni sollevando i fianchi fino a creare una linea retta tra ginocchia e spalle.',
      'Stringi i glutei al massimo per 1-2 secondi in cima prima di scendere controllato.'
    ],
    tipsForFatLoss: 'La pausa isometrica di 2 secondi in alto fa bruciare tantissimo glicogeno muscolare senza stressare la colonna vertebrale.',
    commonMistakes: [
      'Iperestendere la zona lombare invece di spingere coi glutei',
      'Piedi posizionati troppo avanti o troppo indietro'
    ],
    svgType: 'hip_thrust'
  },
  {
    id: 'leg_press',
    name: 'Leg Press a 45°',
    category: 'Gambe & Glutei',
    equipment: 'Macchinario',
    difficulty: 'Principiante',
    targetMuscles: ['Quadricipiti', 'Glutei', 'Femorali'],
    calorieBurnRating: 'Alta',
    defaultSets: 3,
    recommendedReps: '12 - 15',
    recommendedRestSeconds: 60,
    description: 'Permette di spingere carichi consistenti in totale sicurezza, favorendo l\'esaurimento delle fibre muscolari e il consumo calorico.',
    instructions: [
      'Siediti sulla macchina con la schiena e la testa ben adese allo schienale.',
      'Posiziona i piedi a centro pedana alla larghezza delle spalle.',
      'Sblocca la sicurezza e scendi controllando il carico fino a formare un angolo di 90° con le ginocchia.',
      'Spingi forte tornando quasi all\'estensione completa, senza bloccare l\'articolazione del ginocchio.'
    ],
    tipsForFatLoss: 'Mantieni un TUT (tempo sotto tensione) di 3 secondi in discesa e 1 secondo in salita.',
    commonMistakes: [
      'Staccare il bacino o il sacro dallo schienale',
      'Iperestendere le ginocchia al culmine della spinta'
    ],
    svgType: 'leg_press'
  },

  // --- PETTO & SPINTA ---
  {
    id: 'bench_press',
    name: 'Panca Piana con Bilanciere o Manubri',
    category: 'Petto',
    equipment: 'Bilanciere',
    difficulty: 'Intermedio',
    targetMuscles: ['Pettorali', 'Deltoidi anteriori', 'Tricipiti'],
    calorieBurnRating: 'Alta',
    defaultSets: 4,
    recommendedReps: '10 - 12',
    recommendedRestSeconds: 75,
    description: 'Il fondamentale di spinta per la parte superiore. Costruisce massa magra sul torace, aumentando il metabolismo basale.',
    instructions: [
      'Sdraiati sulla panca con occhi sotto il bilanciere, piedi saldi a terra.',
      'Adduci e deprimi le scapole (chiudi le scapole dietro).',
      'Impugna il bilanciere a larghezza leggermente superiore alle spalle.',
      'Abbassa la barra in modo controllato fino a sfiorare la parte medio-bassa del petto.',
      'Spingi verso l\'alto tornando alla posizione di partenza.'
    ],
    tipsForFatLoss: 'Costruire muscolo nel petto e spalle allarga la parte superiore del tronco, creando visivamente un effetto a V che fa risaltare la vita più stretta.',
    commonMistakes: [
      'Spalle che si sollevano dalla panca durante la spinta',
      'Far rimbalzare il bilanciere sullo sterno'
    ],
    svgType: 'bench_press'
  },
  {
    id: 'pushups',
    name: 'Piegamenti sulle Braccia (Push-ups)',
    category: 'Petto',
    equipment: 'Corpo Libero',
    difficulty: 'Principiante',
    targetMuscles: ['Pettorali', 'Core / Addome', 'Tricipiti', 'Spalle'],
    calorieBurnRating: 'Alta',
    defaultSets: 3,
    recommendedReps: '12 - 15',
    recommendedRestSeconds: 45,
    description: 'Non è solo un esercizio per il petto: è un plank in movimento! Richiede una fortissima contrazione addominale per tutta la durata.',
    instructions: [
      'Mani a terra poco più larghe delle spalle, dita aperte.',
      'Corpo in linea retta dalla testa ai talloni: glutei e addome serrati.',
      'Scendi piegando i gomiti mantenendoli a circa 45° rispetto al busto.',
      'Sfiora il pavimento con il petto e spingi forte per risalire.'
    ],
    tipsForFatLoss: 'Per chi vuole togliere la pancia, i piegamenti rinforzano la parete addominale trasversa impedendo il rilassamento viscerale.',
    commonMistakes: [
      'Lasciar cadere il bacino verso il basso inarcando la schiena',
      'Gomiti aperti a 90° stile croce che stressano le spalle'
    ],
    svgType: 'pushups'
  },

  // --- DORSO & TIRATA ---
  {
    id: 'lat_machine',
    name: 'Lat Machine avanti al Petto',
    category: 'Dorso & Schiena',
    equipment: 'Macchinario',
    difficulty: 'Principiante',
    targetMuscles: ['Gran Dorsale', 'Bicipiti', 'Trapezio', 'Romboidi'],
    calorieBurnRating: 'Alta',
    defaultSets: 4,
    recommendedReps: '10 - 12',
    recommendedRestSeconds: 60,
    description: 'Sviluppa la larghezza della schiena, migliora la postura eretta e stimola grandi masse muscolari bruciando calorie.',
    instructions: [
      'Siediti regolando i rulli sulle cosce per rimanere bloccato a terra.',
      'Impugna la sbarra con presa prona larga oltre le spalle.',
      'Inclina leggermente il busto indietro (10-15°), petto aperto.',
      'Tira la sbarra verso la parte alta dello sterno guidando coi gomiti verso il basso.',
      'Risali controllando il movimento fino a sentire l\'allungamento dei dorsali.'
    ],
    tipsForFatLoss: 'Una schiena forte sostiene la colonna, corregge la lordosi e riduce l\'effetto "pancia in fuori" causato da una postura incurvata.',
    commonMistakes: [
      'Dondolare con la schiena per sfruttare l\'inerzia',
      'Tirare dietro il collo (sconsigliato per la cervicale)'
    ],
    svgType: 'lat_machine'
  },
  {
    id: 'row',
    name: 'Rematore con Manubrio su Panca',
    category: 'Dorso & Schiena',
    equipment: 'Manubri',
    difficulty: 'Intermedio',
    targetMuscles: ['Dorsali', 'Trapezio', 'Deltoide posteriore', 'Core'],
    calorieBurnRating: 'Alta',
    defaultSets: 3,
    recommendedReps: '10 - 12 per lato',
    recommendedRestSeconds: 60,
    description: 'Esercizio unilaterale di spessore per la schiena. Rafforza la muscolatura posturale e richiede stabilità rotazionale del core.',
    instructions: [
      'Appoggia ginocchio e mano omologa sulla panca, schiena parallela al terreno.',
      'Afferra il manubrio con l\'altra mano a braccio disteso.',
      'Tira il gomito indietro e verso l\'alto sfiorando il fianco.',
      'Contrai la schiena in cima per 1 secondo, poi riabbassa controllando.'
    ],
    tipsForFatLoss: 'Evita pause tra il braccio destro e quello sinistro per mantenere alto il ritmo cardiaco e bruciare più calorie.',
    commonMistakes: [
      'Ruotare eccessivamente il busto per sollevare il peso',
      'Tirare solo di bicipite invece di arretrare il gomito'
    ],
    svgType: 'row'
  },

  // --- SPALLE & BRACCIA ---
  {
    id: 'shoulder_press',
    name: 'Military Press / Spinte Spalle con Manubri',
    category: 'Spalle',
    equipment: 'Manubri',
    difficulty: 'Intermedio',
    targetMuscles: ['Deltoidi', 'Tricipiti', 'Trapezio', 'Core'],
    calorieBurnRating: 'Alta',
    defaultSets: 3,
    recommendedReps: '10 - 12',
    recommendedRestSeconds: 60,
    description: 'Costruisce spalle rotonde e toniche, attivando il torchio addominale per stabilizzare il corpo in posizione eretta o seduta.',
    instructions: [
      'Seduto su panca a 80-85° o in piedi, manubri all\'altezza delle spalle.',
      'Spingi i manubri verso l\'alto in traiettoria ad arco fino a stendere quasi le braccia.',
      'Contrai l\'addome per evitare di inarcare la schiena.',
      'Riscendi lentamente portando i manubri all\'altezza delle orecchie.'
    ],
    tipsForFatLoss: 'Se eseguito in piedi, richiede un lavoro doppio del core per non sbilanciarsi.',
    commonMistakes: [
      'Inarcare eccessivamente la bassa schiena',
      'Schiacciare i manubri tra loro in alto con violenza'
    ],
    svgType: 'shoulder_press'
  },
  {
    id: 'biceps_curl',
    name: 'Curl Bicipiti con Manubri a Martello',
    category: 'Braccia',
    equipment: 'Manubri',
    difficulty: 'Principiante',
    targetMuscles: ['Bicipiti', 'Brachiale', 'Avambracci'],
    calorieBurnRating: 'Moderata',
    defaultSets: 3,
    recommendedReps: '12 - 15',
    recommendedRestSeconds: 45,
    description: 'Tonifica le braccia e rinforza la presa. Ideale inserito in superset metabolico.',
    instructions: [
      'In piedi, manubri ai lati del corpo con palmi rivolti uno verso l\'altro (presa neutra).',
      'Gomiti fermi e vicini ai fianchi.',
      'Fletti le braccia portando i manubri verso l\'alto.',
      'Scendi controllando la discesa per 2 secondi.'
    ],
    tipsForFatLoss: 'Associa questo esercizio in superset con i tricipiti o con un esercizio per l\'addome per non perdere tempo di riposo passivo.',
    commonMistakes: [
      'Oscillare col busto per darsi la spinta',
      'Muovere i gomiti in avanti staccandoli dal busto'
    ],
    svgType: 'biceps_curl'
  },
  {
    id: 'triceps_pushdown',
    name: 'Pushdown Tricipiti ai Cavi',
    category: 'Braccia',
    equipment: 'Cavi',
    difficulty: 'Principiante',
    targetMuscles: ['Tricipiti'],
    calorieBurnRating: 'Moderata',
    defaultSets: 3,
    recommendedReps: '12 - 15',
    recommendedRestSeconds: 45,
    description: 'Isola i tricipiti eliminando il rilassamento cutaneo posteriore delle braccia.',
    instructions: [
      'Di fronte alla carrucola alta, impugna la corda o la sbarra dritta.',
      'Gomiti fissati ai fianchi, busto leggermente flesso in avanti.',
      'Spingi verso il basso fino alla completa estensione delle braccia, aprendo la corda in basso se usata.',
      'Ritorna lentamente piegando le braccia a 90 gradi.'
    ],
    tipsForFatLoss: 'Ottimo recupero attivo tra serie di esercizi più faticosi.',
    commonMistakes: [
      'Allargare i gomiti durante la spinta',
      'Usare il peso corporeo buttandosi sulla sbarra'
    ],
    svgType: 'triceps_pushdown'
  },

  // --- ADDOME & CORE (PANCIA PIATTA) ---
  {
    id: 'plank',
    name: 'Plank Isometrico & Abdominal Vacuum',
    category: 'Addome & Core',
    equipment: 'Corpo Libero',
    difficulty: 'Principiante',
    targetMuscles: ['Trasverso dell\'addome', 'Retto addominale', 'Obliqui', 'Bassa schiena'],
    calorieBurnRating: 'Alta',
    defaultSets: 3,
    recommendedReps: '40 - 60 sec',
    recommendedRestSeconds: 45,
    description: 'Il miglior esercizio per "sgonfiare" e stringere la pancia. Attiva il muscolo trasverso, la vera guaina naturale che contiene i visceri.',
    instructions: [
      'Appoggia gli avambracci a terra con i gomiti sotto le spalle.',
      'Gambe tese indietro con piedi puntati.',
      'Risucchia l\'ombelico verso la colonna vertebrale (attivazione del trasverso) e stringi forte i glutei.',
      'Mantieni il corpo perfettamente allineato come una tavola senza far cedere il bacino.'
    ],
    tipsForFatLoss: 'Non limitarti a resistere: prova ad "avvicinare attivamente" gomiti e punte dei piedi sul pavimento senza muoverli (RKC Plank). Aumenta la contrazione del 200%!',
    commonMistakes: [
      'Bacino che sprofonda verso il pavimento inarcando la schiena',
      'Bacino troppo alto a V rovesciata',
      'Trattenere il fiato: respira con calma e regolarità'
    ],
    svgType: 'plank'
  },
  {
    id: 'russian_twist',
    name: 'Russian Twist con Peso o Corpo Libero',
    category: 'Addome & Core',
    equipment: 'Manubri',
    difficulty: 'Intermedio',
    targetMuscles: ['Obliqui interni ed esterni', 'Retto addominale'],
    calorieBurnRating: 'Alta',
    defaultSets: 3,
    recommendedReps: '20 alternati',
    recommendedRestSeconds: 45,
    description: 'Lavora sui muscoli rotatori del tronco e definisce i fianchi, aumentando la stabilità del core e la spesa calorica.',
    instructions: [
      'Siediti sul tappetino con ginocchia piegate e talloni leggermente sollevati o sfioranti il suolo.',
      'Inclina il busto indietro a circa 45° mantenendo la schiena dritta.',
      'Tieni un manubrio o disco con entrambe le mani davanti al petto.',
      'Ruota il busto controllato verso destra portando il peso vicino al fianco, poi ruota verso sinistra.'
    ],
    tipsForFatLoss: 'Non muovere solo le braccia: la rotazione deve partire dalle costole e dal tronco per attivare davvero gli obliqui.',
    commonMistakes: [
      'Incurvare completamente la schiena a gobba',
      'Muovere solo le braccia senza ruotare la cassa toracica'
    ],
    svgType: 'russian_twist'
  },
  {
    id: 'mountain_climbers',
    name: 'Mountain Climbers (Scalatore)',
    category: 'Addome & Core',
    equipment: 'Corpo Libero',
    difficulty: 'Intermedio',
    targetMuscles: ['Addome basso', 'Flessori dell\'anca', 'Cardio / Sistema cardiovascolare'],
    calorieBurnRating: 'Molto Alta',
    defaultSets: 3,
    recommendedReps: '30 - 45 sec',
    recommendedRestSeconds: 45,
    description: 'Mix perfetto tra lavoro per gli addominali e impennata della frequenza cardiaca per bruciare calorie e grasso.',
    instructions: [
      'Parti in posizione di push-up con mani salde a terra sotto le spalle.',
      'Porta rapidamente un ginocchio verso il petto senza toccare terra col piede.',
      'Inverti le gambe con un movimento scattante e ritmico come se stessi correndo sul posto.',
      'Mantieni le spalle sopra le mani e l\'addome serrato.'
    ],
    tipsForFatLoss: 'Eseguito con ritmo serrato crea un forte debito d\'ossigeno, ideale per massimizzare la lipolisi e la definizione addominale.',
    commonMistakes: [
      'Alzare il sedere in alto perdendo la linea del plank',
      'Rimbalzare sulle spalle'
    ],
    svgType: 'mountain_climbers'
  },
  {
    id: 'crunch',
    name: 'Reverse Crunch (Crunch Inverso su Tappetino)',
    category: 'Addome & Core',
    equipment: 'Corpo Libero',
    difficulty: 'Principiante',
    targetMuscles: ['Basso Addome', 'Retto Addominale'],
    calorieBurnRating: 'Moderata',
    defaultSets: 3,
    recommendedReps: '15',
    recommendedRestSeconds: 45,
    description: 'Isola la parte inferiore del retto dell\'addome senza stressare il collo o i dischi cervicali.',
    instructions: [
      'Sdraiati a terra a pancia in su, braccia lungo i fianchi con palmi verso il basso.',
      'Solleva le gambe piegando le ginocchia a circa 90°.',
      'Espirando, contrai l\'addome per sollevare il bacino e il sacro dal tappetino portando le ginocchia verso il petto.',
      'Riscendi lentamente senza toccare terra coi piedi per mantenere la tensione costante.'
    ],
    tipsForFatLoss: 'Espira tutta l\'aria fuori nella massima contrazione: svuotando i polmoni permetti una contrazione addominale molto più profonda.',
    commonMistakes: [
      'Darsi slancio spingendo coi piedi come una molla',
      'Staccare le spalle da terra'
    ],
    svgType: 'crunch'
  },
  {
    id: 'decline_crunch',
    name: 'Crunch su Panca Addominali Declinata',
    category: 'Addome & Core',
    equipment: 'Macchinario',
    difficulty: 'Intermedio',
    targetMuscles: ['Retto dell\'addome', 'Obliqui', 'Flessori dell\'anca'],
    calorieBurnRating: 'Moderata',
    defaultSets: 3,
    recommendedReps: '12 - 15',
    recommendedRestSeconds: 45,
    description: 'Crunch sulla panca inclinata per addominali con i piedi agganciati ai rulli. La pendenza aumenta il carico sul retto addominale rispetto al crunch a terra.',
    instructions: [
      'Regola la pendenza: più è inclinata, più è difficile. Inizia dalla posizione più bassa.',
      'Aggancia i piedi sotto i rulli e sdraiati con la schiena appoggiata, mani dietro la testa senza tirare il collo.',
      'Espira e arrotola il busto staccando prima le spalle, poi la parte alta della schiena.',
      'Torna giù lentamente senza appoggiare del tutto le spalle, per mantenere la tensione.'
    ],
    tipsForFatLoss: 'Rinforza la parete addominale ma non brucia il grasso localmente: abbinalo a esercizi multiarticolari e cardio per vedere la pancia scendere.',
    commonMistakes: [
      'Tirare la testa con le mani',
      'Salire di slancio usando solo i flessori dell\'anca',
      'Scegliere subito una pendenza troppo alta'
    ],
    svgType: 'decline_crunch'
  },
  {
    id: 'decline_oblique_crunch',
    name: 'Crunch Obliquo con Torsione su Panca Addominali',
    category: 'Addome & Core',
    equipment: 'Macchinario',
    difficulty: 'Intermedio',
    targetMuscles: ['Obliqui interni ed esterni', 'Retto dell\'addome', 'Trasverso'],
    calorieBurnRating: 'Moderata',
    defaultSets: 3,
    recommendedReps: '10 per lato',
    recommendedRestSeconds: 45,
    description: 'Variante del crunch sulla panca addominali: salendo si ruota il busto portando il gomito verso il ginocchio opposto, per lavorare i fianchi (obliqui).',
    instructions: [
      'Piedi agganciati ai rulli, schiena sulla panca, mani dietro la testa.',
      'Espirando sali con il busto e ruota portando la spalla e il gomito verso il ginocchio opposto.',
      'Torna giù controllando la discesa, poi ripeti dall\'altro lato.',
      'Alterna i lati oppure completa tutte le ripetizioni di un lato prima di cambiare.'
    ],
    tipsForFatLoss: 'Obliqui forti stringono il girovita come una cintura naturale. Il movimento è lento e controllato: la qualità conta più della velocità.',
    commonMistakes: [
      'Ruotare solo il gomito senza girare il busto',
      'Tirare il collo con le mani',
      'Scendere di colpo perdendo la tensione'
    ],
    svgType: 'decline_oblique_crunch'
  },

  // --- CARDIO & METABOLICO FINISHER ---
  {
    id: 'kettlebell_swing',
    name: 'Kettlebell Swing',
    category: 'Cardio & Metabolico',
    equipment: 'Kettlebell',
    difficulty: 'Intermedio',
    targetMuscles: ['Glutei', 'Femorali', 'Core', 'Spalle', 'Cardio'],
    calorieBurnRating: 'Molto Alta',
    defaultSets: 3,
    recommendedReps: '15 - 20',
    recommendedRestSeconds: 45,
    description: 'Il bruciatore di grassi per eccellenza. Un movimento balistico dell\'anca che fa schizzare la frequenza cardiaca.',
    instructions: [
      'Piedi poco più larghi delle spalle, impugna il kettlebell a due mani.',
      'Esegui un "hip hinge" (piegamento d\'anca indietro) portando il kettlebell tra le gambe.',
      'Spingi in avanti con esplosività i fianchi stringendo i glutei.',
      'Lascia che il kettlebell salga all\'altezza del petto per inerzia, senza tirare di braccia.',
      'Ritorna subito nella fase di caricamento.'
    ],
    tipsForFatLoss: '20 ripetizioni di swing bruciano circa le stesse calorie di uno sprint di 100 metri, tonificando contemporaneamente glutei e pancia.',
    commonMistakes: [
      'Fare uno squat invece di piegare i fianchi all\'indietro',
      'Sollevare il peso con la forza delle braccia anziché dell\'anca'
    ],
    svgType: 'kettlebell_swing'
  },
  {
    id: 'burpees',
    name: 'Burpees senza Pushup o Completi',
    category: 'Cardio & Metabolico',
    equipment: 'Corpo Libero',
    difficulty: 'Intermedio',
    targetMuscles: ['Full Body', 'Addome', 'Pettorali', 'Gambe', 'Cardio'],
    calorieBurnRating: 'Molto Alta',
    defaultSets: 3,
    recommendedReps: '10 - 12',
    recommendedRestSeconds: 60,
    description: 'L\'esercizio total-body più intenso: combina squat, plank e salto per massimizzare la spesa calorica al minuto.',
    instructions: [
      'Dalla posizione eretta, scendi in squat e appoggia le mani a terra davanti ai piedi.',
      'Con un balzo stendi le gambe all\'indietro arrivando in posizione di plank.',
      'Opzionale: tocca il petto a terra o rimani in plank solido.',
      'Con un balzo riporta i piedi verso le mani.',
      'Salta verso l\'alto battendo le mani sopra la testa ed atterra morbidamente.'
    ],
    tipsForFatLoss: 'Perfetto come "finisher" a fine allenamento per svuotare le riserve energetiche e velocizzare la perdita di peso.',
    commonMistakes: [
      'Spanciare inarcando la schiena quando si atterra in plank',
      'Atterrare sui talloni a gambe tese durante il salto'
    ],
    svgType: 'burpees'
  },
  {
    id: 'jumping_jacks',
    name: 'Jumping Jacks Metabolici',
    category: 'Cardio & Metabolico',
    equipment: 'Corpo Libero',
    difficulty: 'Principiante',
    targetMuscles: ['Cardiovascolare', 'Polpacci', 'Deltoidi', 'Core'],
    calorieBurnRating: 'Alta',
    defaultSets: 3,
    recommendedReps: '45 - 60 sec',
    recommendedRestSeconds: 30,
    description: 'Ideale per riscaldamento o per mantenere elevata la frequenza cardiaca tra le serie.',
    instructions: [
      'In piedi con braccia lungo i fianchi e piedi uniti.',
      'Salta allargando le gambe e sollevando le braccia sopra la testa.',
      'Salta nuovamente tornando nella posizione di partenza a piedi uniti.',
      'Mantieni un rimbalzo leggero sull\'avampiede con ritmo costante.'
    ],
    tipsForFatLoss: 'Usalo nei momenti di recupero attivo tra gli esercizi di forza per bruciare il 30% in più di calorie durante la sessione.',
    commonMistakes: [
      'Atterrare col tallone rigido',
      'Perdere la coordinazione braccia/gambe'
    ],
    svgType: 'jumping_jacks'
  },
  // --- CARDIO MACCHINE & TONO BASE ---
  {
    id: 'treadmill',
    name: 'Tapis Roulant (Camminata in Pendenza & Corsa)',
    category: 'Cardio & Metabolico',
    equipment: 'Cardio',
    difficulty: 'Principiante',
    targetMuscles: ['Cardiovascolare', 'Polpacci', 'Femorali', 'Glutei', 'Core'],
    calorieBurnRating: 'Molto Alta',
    defaultSets: 1,
    recommendedReps: '10 - 15 min',
    recommendedRestSeconds: 60,
    description: 'La camminata veloce con pendenza (incline walk al 6-10%) o la corsa a intervalli massimizza l\'ossidazione lipidica senza sovraccaricare le ginocchia.',
    instructions: [
      'Imposta la velocità tra 5.0 e 6.5 km/h e una pendenza tra il 4% e l\'8%.',
      'Mantieni il busto alto, spalle rilassate e lo sguardo in avanti.',
      'Evita di aggrapparti con forza ai corrimano laterali: muovi le braccia piegate a 90° seguendo il ritmo del passo.',
      'Appoggia il piede con rullata naturale dal tallone all\'avampiede.'
    ],
    tipsForFatLoss: 'La camminata in salita a passo svelto brucia fino al 60% in più di grassi rispetto alla corsa in piano, preservando la massa magra delle cosce.',
    commonMistakes: [
      'Aggrapparsi ai maniglioni scaricando il peso del corpo',
      'Camminare con il tronco inclinato indietro'
    ],
    svgType: 'treadmill'
  },
  {
    id: 'stationary_bike',
    name: 'Cyclette da Palestra (Stationary Bike)',
    category: 'Cardio & Metabolico',
    equipment: 'Cardio',
    difficulty: 'Principiante',
    targetMuscles: ['Quadricipiti', 'Polpacci', 'Cardiovascolare', 'Glutei'],
    calorieBurnRating: 'Alta',
    defaultSets: 1,
    recommendedReps: '12 - 15 min',
    recommendedRestSeconds: 45,
    description: 'Cardio a zero impatto sulle articolazioni. Perfetta per stimolare la circolazione delle gambe, drenare i liquidi e bruciare calorie.',
    instructions: [
      'Regola il sellino all\'altezza del fianco in modo che a gamba distesa il ginocchio sia leggermente flesso (circa 25°).',
      'Afferra il manubrio mantenendo la schiena neutra e le spalle basse.',
      'Mantieni una cadenza costante tra 70 e 85 RPM (giri al minuto) con resistenza moderata.',
      'Spingi sui pedali con la pianta del piede attivando anche i glutei.'
    ],
    tipsForFatLoss: 'Ideale a inizio o fine seduta per favorire il ritorno venoso e sgonfiare le gambe senza produrre acido lattico in eccesso.',
    commonMistakes: [
      'Sellino troppo basso causando sovraccarico sulla rotula',
      'Ciondolare con le spalle durante la pedalata'
    ],
    svgType: 'stationary_bike'
  },
  {
    id: 'elliptical',
    name: 'Ellittica Total Body (Elliptical Trainer)',
    category: 'Cardio & Metabolico',
    equipment: 'Cardio',
    difficulty: 'Principiante',
    targetMuscles: ['Total Body', 'Gambe', 'Dorsali', 'Glutei', 'Cardiovascolare'],
    calorieBurnRating: 'Molto Alta',
    defaultSets: 1,
    recommendedReps: '10 - 15 min',
    recommendedRestSeconds: 45,
    description: 'Coinvolge braccia e gambe in un moto ellittico fluido e continuo, attivando oltre l\'80% dei muscoli corporei con zero stress articolare.',
    instructions: [
      'Sali sui pedali tenendo la pianta del piede ben aderente alla superficie.',
      'Impugna le leve mobili sincronizzando la spinta e trazione delle braccia con il passo.',
      'Mantieni il core attivo e la schiena diritta, senza rimbalzare sui talloni.',
      'Spingi in avanti con le gambe mantenendo un ritmo fluido e costante.'
    ],
    tipsForFatLoss: 'Coinvolgendo sia la parte superiore che inferiore del corpo, il dispendio calorico per minuto è tra i più elevati dell\'intera sala pesi.',
    commonMistakes: [
      'Staccare i talloni dai pedali caricando eccessivamente i polpacci',
      'Lasciare che solo le gambe lavorino senza spingere/tirare con le braccia'
    ],
    svgType: 'elliptical'
  },
  {
    id: 'stair_climber',
    name: 'Stair Climber (Simulatore di Scale & Gradini)',
    category: 'Cardio & Metabolico',
    equipment: 'Cardio',
    difficulty: 'Intermedio',
    targetMuscles: ['Glutei', 'Quadricipiti', 'Femorali', 'Polpacci', 'Core'],
    calorieBurnRating: 'Molto Alta',
    defaultSets: 1,
    recommendedReps: '8 - 12 min',
    recommendedRestSeconds: 60,
    description: 'Il macchinario con gradini rotanti più efficace per sollevare i glutei, definire le gambe e bruciare fino a 500 kcal l\'ora.',
    instructions: [
      'Sali sulla scaletta impostando un livello di velocità che consenta passi ampi e controllati.',
      'Appoggia l\'intero piede su ciascun gradino e spingi attraverso il tallone per attivare i glutei.',
      'Tieni le mani sui sensori o corrimano solo per equilibrio, senza sostenere il peso del corpo.',
      'Mantieni il busto leggermente inclinato in avanti a colonna neutra.'
    ],
    tipsForFatLoss: 'Spingere forte col tallone anziché sulla punta del piede massimizza il reclutamento del grande gluteo raddoppiando l\'efficacia snellente.',
    commonMistakes: [
      'Piegarsi sui braccioli laterali dimezzando lo sforzo delle gambe',
      'Salire solo sulle punte dei piedi affaticando i polpacci'
    ],
    svgType: 'stair_climber'
  },
  {
    id: 'lateral_raises',
    name: 'Alzate Laterali con Manubri Piccoli',
    category: 'Spalle',
    equipment: 'Manubri',
    difficulty: 'Principiante',
    targetMuscles: ['Deltoidi laterali', 'Trapezi superiori', 'Core'],
    calorieBurnRating: 'Moderata',
    defaultSets: 3,
    recommendedReps: '12 - 15',
    recommendedRestSeconds: 45,
    description: 'Esercizio fondamentale di tonificazione con manubri leggeri (2-5 kg) per snellire e definire le spalle, donando eleganza e postura aperta al busto.',
    instructions: [
      'In piedi, piedi larghezza spalle, impugna due manubri leggeri lungo i fianchi.',
      'Gomiti leggermente flessi (10-15°), petto fiero e addome compatto.',
      'Solleva le braccia lateralmente fino all\'altezza delle spalle (circa 90° dal busto).',
      'Fai una pausa di 1 secondo in cima e scendi controllando la discesa in 2-3 secondi.'
    ],
    tipsForFatLoss: 'Allargare dolcemente le spalle crea un effetto ottico che fa apparire istantaneamente il girovita più stretto e snello.',
    commonMistakes: [
      'Usare pesi troppo pesanti oscillando con la schiena',
      'Sollevare le mani più in alto dei gomiti disattivando i deltoidi'
    ],
    svgType: 'lateral_raises'
  }
];

export const MUSCLE_GROUPS: MuscleGroup[] = [
  'Addome & Core',
  'Gambe & Glutei',
  'Dorso & Schiena',
  'Petto',
  'Spalle',
  'Braccia',
  'Cardio & Metabolico'
];
