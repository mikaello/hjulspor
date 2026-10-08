# Hjulspor

Hjulspor er en norsk veiviser for deg som vil registrere syklene dine på forhånd, har mistet en sykkel eller har funnet en.
Første versjon lenker til eksisterende registre og offisielle råd, uten konto, skjema, API-søk eller lagring av sykkelopplysninger.

## Kjør lokalt

Du trenger bare en lokal webserver, for eksempel `python3 -m http.server 4173`.
Åpne deretter `http://localhost:4173/`.

## Innhold

- `index.html` er forsiden.
- `mistet/`, `funnet/` og `registrer/` er de tre veiviserne.
- `rammenummer/` viser hvor rammenummeret vanligvis finnes.
- `styles.css` og `assets/` inneholder designet.
- `docs/first-release.md` beskriver den avtalte første versjonen.

Nettstedet kan publiseres på en vanlig statisk webvert, også uten eget domene.

## GitHub Pages

Publiseringsarbeidsflyten i `.github/workflows/publish-pages.yml` kjører automatisk når endringer lander på `main`.
Den kan også startes manuelt med `gh workflow run publish-pages.yml --ref main`.
Den laster opp `dist/` til GitHub Pages på `https://mikaello.github.io/hjulspor/`.
