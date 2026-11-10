# FitPulse PWA - Scheda Palestra & Dimagrimento

App PWA (Progressive Web App) completa per l'allenamento in palestra focalizzata su **perdita di peso**, **bruciare grasso** e **definizione dell'addome / riduzione pancia**.

---

## 🚀 Come Avviare l'App

L'applicazione è una moderna PWA (React 19 + TypeScript + Vite + Tailwind CSS + PWA Service Worker).  
I browser moderni non consentono l'esecuzione di script ed Service Worker aprendo direttamente il file locale `file:///index.html` (per questo appariva schermata bianca).

### Avvio Veloce:
Nel terminale della cartella del progetto:

```bash
# 1. Avvia il server in modalità sviluppo:
npm run dev

# Oppure avvia la versione di produzione già compilata:
npm run preview
```

L'app sarà accessibile su:
- **Sul tuo computer:** `http://localhost:5173` (o `http://localhost:4173`)
- **Sul tuo smartphone (stesso Wi-Fi):** apri il browser del telefono (Safari o Chrome) e digita l'indirizzo di rete mostrato a video (es. `http://192.168.x.x:5173`).

### 📱 Come Installarla sul Telefono come Vera App Nativa (PWA):
- **Su iPhone (iOS / Safari):** Premi il pulsante di condivisione (icona con quadrato e freccia verso l'alto) e seleziona **"Aggiungi alla schermata Home"**.
- **Su Android (Chrome):** Tocca il pulsante **"Installa App"** in alto oppure il menu a tre puntini e seleziona **"Aggiungi a schermata Home / Installa app"**.
- Funziona al 100% anche **offline** senza connessione internet in palestra!

### 🌐 Versione online
Ogni push sul branch `main` pubblica automaticamente l'app su GitHub Pages (workflow `.github/workflows/deploy.yml`):
**https://davideginna.github.io/pt/**

---

## 🎯 Funzionalità Principali

### 1. 🏋️ Schede Pre-configurate per Dimagrimento & Pancia Piatta
- **🔥 Brucia Grassi Full-Body Express:** circuito metabolico (EPOC) per il massimo consumo calorico post-workout.
- **🎯 Pancia Piatta & Definizione Addome:** lavoro sul muscolo trasverso, plank isometrici, vacuum addominale e torsioni controllate.
- **💪 Upper Body & Torso Sculpt:** allargamento del dorso e spalle per un punto vita visivamente più stretto (V-Shape).
- **⚡ Gambe d'Acciaio & Brucia Grassi:** i muscoli più grandi per mobilizzare le riserve adipose.
- **✨ Costruttore Schede Personalizzate:** crea la tua routine su misura scegliendo esercizi, serie, target ripetizioni e recuperi.

### 2. 👁️ Guida Visiva degli Esercizi (Animazioni Grafiche SVG)
- Schede tecniche dettagliate per ogni esercizio:
  - **Animazione del movimento** e angoli di lavoro (squat, stacchi, panca, plank, ecc.).
  - **Muscoli target evidenziati**.
  - **Istruzioni passo-passo** su come impostare la postura corretta.
  - **Errori comuni da evitare** per prevenire infortuni.
  - **Sezione speciale:** *"Focus Dimagrimento & Pancia Piatta"*.

### 3. ⏱️ Timer di Recupero Automatico & Segnali Acustici
- Non appena completi una serie, si avvia in automatico il conto alla rovescia del recupero calibrato (es. 45s, 60s, 75s).
- **Segnale acustico sonoro (Beep 3, 2, 1 + Suono finale)** generato nativamente tramite Web Audio API (funziona anche con cuffie o telefono posato).
- Vibrazione aptica su dispositivi mobili supportati.
- Pulsanti rapidi `+15s`, `-15s`, riduci a icona e salta recupero.

### 4. 📝 Registro Serie e Carichi
- Segna i **kg sollevati** e le **ripetizioni effettive** per ogni serie.
- Calcolo automatico del tonnellaggio totale (kg sollevati) e stima delle calorie bruciate.
- Salvataggio locale automatico dello storico allenamenti.

### 5. 📚 Guida Scientifica & Tracker Peso
- Spiegazione scientifica del perché gli addominali da soli non bruciano il grasso addominale e come eliminare la pancia creando un deficit calorico sostenibile.
- Tracker per monitorare il peso di partenza, peso attuale e peso obiettivo.

### 6. 🎨 Temi
Pulsante tavolozza in alto a destra: Smeraldo, Oceano, Tramonto, Viola, Carbone (nero OLED) e Chiaro. La scelta viene ricordata sul dispositivo.
