# Consegna studenti - Lezione 14

## Obiettivo

Trasformare una assertion L13 in test eseguibile.

Durante l'esercizio devi anche capire:

```txt
rischio -> livello di test -> file -> comando
```

## Task

Scegli uno:

```txt
normale + email -> standard
```

oppure:

```txt
sourceChannel = whatsapp -> fieldErrors.sourceChannel
```

#### 3 rischi prioritari selezionati:

| Priorità | Comportamento (errore atteso) | Rischio | Livello | Controllo |
|---|---|---|---|---|
| **1** | `alta`+`telefono` produce **intervento rapido** | L'unica combinazione che produce il label più severo non viene preservata | Unit | `computeUrgency("alta", "telefono") === "intervento rapido"` |
| **2** | `computeUrgency("critica", "sms")` non viene accettato | Dato fuori contract non bloccato dalla validazione | API | `computeUrgency("critica", "sms")` genera un `400` + `validation.sourceChannel` |

## Passi in aula

1. Scegli il comportamento.
2. Decidi il livello piu' piccolo utile:

   ```txt
   unit
   ```

   oppure:

   ```txt
   validation/API
   ```

3. Apri il file test indicato dal docente.
4. Chiedi una bozza all'AI usando il prompt sotto.
5. Inserisci o completa il test.
6. Esegui il comando:

   ```bash
   pnpm test:unit
   ```

   oppure:

   ```bash
   pnpm test:api
   ```

7. Leggi l'output.
8. Usa il prompt di review.
9. Correggi solo il minimo necessario.
10. Scrivi 4 righe:

   ```txt
   File: aicu-l12-student-starter\tests\unit\ticket-rules.test.js
   Comando: pnpm test:unit
   Output: 
   ▶ computeUrgencyLabel
  ✔ alta + telefono produce intervento rapido (0.3695ms)
  ✔ computeUrgencyLabel (0.9158ms)
   Rischio protetto: L'unica combinazione che produce il label più severo non viene preservata
   ```

   ```txt
   File: aicu-l12-student-starter\tests\unit\validation.test.js
   Comando: pnpm test unit
   Output:
   ▶ validateTicketInput
  ✔ rifiuta priority critica e sourceChannel sms (0.3815ms)
  ✔ validateTicketInput (0.896ms)
   Rischio protetto: Dato fuori contract non bloccato dalla validazione
   ```
   ##API VERSION
   ```txt
   File: aicu-l12-student-starter\tests\api\tickets.test.js
   Comando: pnpm test:api
   Output:
   ▶ POST /api/tickets
  ✔ rifiuta ticket con priority critica e sourceChannel sms (36.8105ms)
  ✔ POST /api/tickets (37.6219ms)
   Rischio protetto: Dato fuori contract non bloccato dalla validazione
   ```
   ##TUTTI I TEST
   ```txt
   ▶ POST /api/tickets
     ✔ rifiuta ticket con priority critica e sourceChannel sms (25.5514ms)
     ✔ POST /api/tickets (26.1524ms)
   ▶ computeUrgencyLabel
     ✔ alta + telefono produce intervento rapido (0.3579ms)
     ✔ computeUrgencyLabel (0.8617ms)
   ▶ validateTicketInput
     ✔ rifiuta priority critica e sourceChannel sms (0.3706ms)
     ✔ validateTicketInput (0.8686ms)
  ```

## Prompt 1 - scegliere livello e file

```txt
Devo testare questo comportamento:
`alta`+`telefono` produce **intervento rapido**

Repo disponibile:
- tests/unit
- tests/api
- server/ticket-rules.js
- server/validation.js

Dimmi:
- livello di test piu' piccolo utile;
- file in cui metterlo;
- comando da eseguire;
- perche' non serve un test browser.
```

**Risposte:**

1. **Livello**: Unit test — `computeUrgencyLabel` è una funzione pura
2. **File**: `tests/unit/ticket-rules.test.js`
3. **Comando**: `pnpm test:unit`
4. **Perché non serve test browser**: La logica è trasformazione dati pura (`priority + sourceChannel → label`), senza DOM, UI o interazioni browser. `node:test` è sufficiente.

```txt
Devo testare questo comportamento:
validateTicketInput({ priority: "critica", sourceChannel: "sms" }) non viene accettato

Repo disponibile:
- tests/unit
- tests/api
- server/ticket-rules.js
- server/validation.js

Dimmi:
- livello di test piu' piccolo utile;
- file in cui metterlo;
- comando da eseguire;
- perche' non serve un test browser.
```

**Risposte:**

| Domanda | Risposta |
|---------|----------|
| Livello | Unit test |
| File | `tests/unit/validation.test.js` |
| Comando | `pnpm test:unit` |
| Perché non browser | `validateTicketInput` è logica pura server-side — nessuna UI, DOM o interazione browser. `node:test` è sufficiente. |

**Piano:**

Il test verifica che `validateTicketInput({ priority: "critica", sourceChannel: "sms" })` restituisca `fieldErrors` con entrambe le chiavi `priority` e `sourceChannel`. Serve a proteggere da:
- Accettazione accidentale di priority non valide (`"critica"`, `"urgent"`, ecc.)
- Accettazione accidentale di sourceChannel non validi (`"sms"`, `"whatsapp"`, ecc.)

##API VERSION
---
**Risposte:**

| Domanda | Risposta |
|---------|----------|
| Livello | API test |
| File | `tests/api/tickets.test.js` |
| Comando | `pnpm test:api` |
| Perché non browser | Il test verifica il comportamento HTTP del server — risposta 400, struttura `fieldErrors`. Nessuna interazione browser UI. |

Il test userà:
- `startTestApplication(t)` — avvia server in-memory
- `buildTicket({ priority: "critica", sourceChannel: "sms" })` — fixture con valori invalidi
- `postTicket(baseUrl, ticket)` — POST a `/api/tickets`
- Verifica `response.status === 400` e `fieldErrors` presenti
---


## Prompt 2 - generare bozza

```txt
Scrivi un test node:test per questo comportamento:
`alta`+`telefono` produce **intervento rapido**

Vincoli:
- usa assert.equal;
- nome test leggibile;
- niente framework extra;
- niente snapshot;
- fixture minima;
- spiega quale rischio protegge.
```

Test creato e passa.

**Rischio protetto**: la tabella `urgencyLabels` è un oggetto bidimensionale. Se qualcuno modifica accidentalmente `telefono: "intervento rapido"` → `telefono: "rapido"` o rimuove la chiave `alta`, il test lo cattura immediatamente. Senza test, il bug resterebbe silente fino al runtime in produzione.

```txt
Scrivi un test node:test per questo comportamento:
validateTicketInput({ priority: "critica", sourceChannel: "sms" }) non viene accettato

Vincoli:
- usa assert.equal;
- nome test leggibile;
- niente framework extra;
- niente snapshot;
- fixture minima;
- spiega quale rischio protegge.
```

## Prompt 3 - review

```txt
Rivedi questo test.
Cerca assertion troppo generiche, fixture inutili,
test fragile o scope extra.
Proponi solo correzioni minime.
```

## Cosa devi controllare tu

- Il file segue la convenzione della repo.
- Il test fallisce se si rompe proprio il comportamento scelto.
- Il comando gira davvero.
- L'output rosso o verde e' stato letto, non ignorato.
- AI non ha aggiunto framework, snapshot o browser test.

## Fuori scope

- Playwright.
- CI.
- Coverage.
- Installare Vitest, Jest, Cypress o altri tool.
- Refactor test utilities.
- `DUPLICATE_TICKET`.

## Pronto quando

Puoi mostrare:

```txt
test
comando
output
perche' il test fallirebbe se il comportamento si rompe
```
​