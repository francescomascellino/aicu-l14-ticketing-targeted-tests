## Scope
- Modifica richiesta:
  Aggiungere test per:
  1. `alta`+`telefono` → "intervento rapido" (unit)
  2. `validateTicketInput({ priority: "critica", sourceChannel: "sms" })` → rifiutato (unit)
  3. Stesso comportamento via HTTP POST /api/tickets (API test)
  4. .gitignore

- Fuori scope:
  Test browser, CI, coverage, altre funzionalita

## Prompt Strategy
- Zero-shot o few-shot: Few-shot con review inline
- Esempi usati: Test proposti → review → create
- Evidenze sintetiche richieste: Output pnpm test passanti

## Changes
- File principali:
  - tests/unit/ticket-rules.test.js
  - tests/unit/validation.test.js
  - tests/api/tickets.test.js
  - .gitignore
- Sintesi: 3 test aggiunti, tutti passing

## Validation
- Controlli eseguiti:
  - pnpm test:unit (2/2 pass)
  - pnpm test:api (1/1 pass)
  - Lint/check (package.json check script)
- Controlli non eseguiti:
  - Test browser
  - Coverage
  - Node >=26 (ambiente: 24.17.0)

## Review Notes
- Punti da controllare in review:
  1. I test coprono solo i valori specificati — mancano combinazioni invalide rimanenti?
  2. .gitignore completo per il progetto?
- Rischi o dubbi residui:
  - Node 24 vs 26 richiesto — warning ma funziona
  - Nessun test browser — se esiste logica UI di validazione, non e coperta
