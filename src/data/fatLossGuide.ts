export interface FatLossPillar {
  title: string;
  badge: string;
  icon: string;
  summary: string;
  practicalTips: string[];
}

export const FAT_LOSS_PILLARS: FatLossPillar[] = [
  {
    title: 'La Verità sul Grasso Addominale',
    badge: 'Fisiologia',
    icon: 'target',
    summary: 'Il dimagrimento localizzato non esiste: fare 1.000 addominali non brucia direttamente il grasso della pancia. Il corpo attinge alle riserve adipose sistemiche in deficit calorico.',
    practicalTips: [
      'Allenare l\'addome rinforza e "tira indentro" la parete addominale (trasverso), appiattendo visibilmente la pancia.',
      'Gli esercizi che bruciano più grasso sono quelli multiarticolari pesanti (Squat, Panca, Stacchi, Circuiti) perché richiedono un enorme apporto di calorie.',
      'Per vedere gli addominali scolpiti è necessario combinare allenamento contro resistenze e moderato deficit calorico a tavola.'
    ]
  },
  {
    title: 'Come Gestire i Tempi di Recupero',
    badge: 'Metabolismo',
    icon: 'timer',
    summary: 'Per dimagrire e definire i muscoli, i recuperi ideali sono tra i 45 e i 75 secondi. Questo mantiene alta la frequenza cardiaca e stimola l\'acido lattico (GH booster).',
    practicalTips: [
      'Usa il timer integrato nell\'app: ogni secondo di riposo non controllato riduce l\'intensità metabolica.',
      'Recuperi 45-60s per addome e isolamento per massimizzare la congestione.',
      'Recuperi 75-90s solo sui grandi multiarticolari (Squat e Stacchi) per non compromettere la sicurezza della tecnica.'
    ]
  },
  {
    title: 'Ripetizioni Ideali per Perdere Peso',
    badge: 'Allenamento',
    icon: 'dumbbell',
    summary: 'La fascia tra 10 e 15 ripetizioni con carichi sfidanti (a 1-2 ripetizioni dal cedimento) stimola l\'ipertrofia e consuma elevate riserve di glicogeno.',
    practicalTips: [
      'Non usare pesi troppo leggeri "per asciugare": se un carico permette 30 ripetizioni facili, non crea lo stimolo necessario per preservare i muscoli.',
      'Il muscolo è il "motore" che consuma calorie 24 ore su 24: più mantieni il muscolo solido, più calorie brucerai anche a riposo!',
      'Registra sempre il peso usato nei log dell\'app per monitorare i progressi.'
    ]
  },
  {
    title: 'Alimentazione & Deficit Sostenibile',
    badge: 'Nutrizione',
    icon: 'flame',
    summary: 'Per perdere pancia serve un deficit calorico moderato (circa 300-500 kcal al giorno sotto il fabbisogno), non diete da fame estreme che svuotano i muscoli.',
    practicalTips: [
      'Assumi 1.6 - 2.0g di proteine per kg di peso corporeo (pollo, pesce, uova, tofu, legumi, proteine in polvere) per saziarti e proteggere i muscoli.',
      'Bevi almeno 2.5 - 3 litri d\'acqua al giorno: la ritenzione idrica è spesso confusa con grasso sulla pancia.',
      'Riduci zuccheri raffinati, cibi ultra-processati e bevande alcoliche, che gonfiano la digestione e stimolano il deposito di grasso viscerale.'
    ]
  }
];
