# Novità

<!--
Questo file viene mostrato anche nell'app (pulsante "Novità" in alto).
L'app capisce solo questo formato:
  ## <versione> — <AAAA-MM-GG>     una release, la più recente in cima
  ### <sezione>                    es. Nuovo, Migliorato, Corretto
  - <voce>                         una riga per voce; ammessi **grassetto** e `codice`
Ad ogni release aggiornare anche "version" in package.json.
-->

## 1.4.0 — 2026-11-16

### Nuovo
- **Allenamento guidato**: lo schermo mostra in grande la fase (pausa di avvio, esecuzione, recupero), il tempo e l'esercizio da fare, e passa da solo alla fase successiva con i segnali sonori.
- Gli esercizi **a tempo** (tapis roulant, cyclette, plank…) hanno il loro conto alla rovescia; quelli a ripetizioni un cronometro che si ferma con «Serie fatta».
- **Pausa** dell'intero allenamento, durata della pausa di avvio a scelta, tempo extra con un tocco.
- **Pesi consigliati** per ogni esercizio: la prima volta un carico di partenza, poi l'ultimo peso che hai usato.
- Due sedute da un'ora **«Ora Brucia Grassi» A e B**: riscaldamento, lavoro aerobico e pesi, **stretching** finale guidato.
- 5 esercizi di **stretching** con animazione (quadricipiti, femorali, polpacci, petto e spalle, schiena).
- **Cronometro** nella tab Timer; il timer HIIT ora ha la pausa di avvio e mostra quanto manca alla fine.
- Lo **schermo resta acceso** durante l'allenamento e con un timer in corso.
- Se l'app viene chiusa a metà allenamento, alla riapertura lo ritrovi in pausa dove l'avevi lasciato.
- Muscoli coinvolti visibili direttamente nella schermata di allenamento.

### Corretto
- Il timer di recupero poteva bloccarsi o andare fuori tempo durante l'allenamento.
- Il tempo totale perdeva secondi a schermo spento o con l'app in background.
- Il timer HIIT aggiungeva un riposo inutile dopo l'ultimo round.
- «X» e «Termina» ora chiedono conferma: prima un tocco per sbaglio faceva perdere l'allenamento.
- Calorie stimate in base al tuo peso (impostalo in Guida & Dati); niente più minimo fisso di 80 kcal.
- Gli esercizi contati nello storico sono solo quelli davvero fatti.

## 1.3.0 — 2026-11-11

### Nuovo
- Schede filtrabili per **difficoltà** (facile, media, difficile) e **durata**, con ordinamento: di base dalla più facile.
- Pagina **Novità** (questa) per vedere cosa cambia a ogni aggiornamento.
- Pulsante **bug** in alto per segnalare un problema (apre una issue su GitHub).

### Migliorato
- Nuova grafica in stile **Material 3**: barre più pulite, pulsanti a pillola, dettagli che salgono dal basso.
- Font Roboto e numeri del timer più leggibili.

### Corretto
- Dal dettaglio di una scheda, chiudendo la guida di un esercizio si torna all'elenco esercizi invece di chiudere tutto.
- I pannelli aperti dentro una tab finivano sotto le barre in alto e in basso.

## 1.2.0 — 2026-11-11

### Nuovo
- **Obiettivi** nella tab Allenati: dimagrire, addome, gambe e glutei, braccia e spalle, petto e schiena, resistenza.
- **Mappa dei muscoli** fronte/retro nel dettaglio di ogni esercizio.
- 8 esercizi per l'addome sul tappetino e le sessioni brevi "Addome Express 15'" e "Core Bruciante 20'".
- Cyclette con schienale e 11 nuove schede da 40–55 minuti.

### Migliorato
- Omino delle animazioni più realistico, con la traccia del movimento.
- Il timer continua a girare cambiando tab e anche dopo aver ricaricato la pagina.

### Corretto
- Nomi e descrizioni degli esercizi non vengono più tagliati.
- Attrezzi e pavimento quasi invisibili nel tema chiaro.

## 1.1.0 — 2026-11-11

### Nuovo
- Esercizi alla macchina per **adduttori** e **abduttori**.

## 1.0.0 — 2026-11-11

### Nuovo
- Prima versione: schede, libreria esercizi animata, timer di recupero e HIIT, storico allenamenti, temi, funziona offline.
