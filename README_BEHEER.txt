SARA LUCCARELLI — BEHEERBARE WEBSITE

Dit is de online/master-versie van de website. De vormgeving van de laatste versie is behouden,
maar foto's en series staan nu apart van de HTML.

BELANGRIJK
- index.html = structuur van de website
- style.css = vormgeving
- portfolio.js = de lijst van series en foto's
- script.js = zorgt ervoor dat de Work-blokken en fotolightboxes automatisch worden opgebouwd
- images/ = alle foto's

FOTO TOEVOEGEN AAN EEN BESTAANDE SERIE
1. Zet de nieuwe foto in de juiste map onder images/, bijvoorbeeld:
   images/sky-cutouts/
2. Geef hem een volgende naam, bijvoorbeeld 15.jpg.
3. Open portfolio.js.
4. Voeg de bestandsnaam toe aan de images-lijst van die serie.
5. Upload de gewijzigde bestanden naar GitHub.

FOTO VERWIJDEREN
1. Verwijder de bestandsnaam uit de images-lijst in portfolio.js.
2. Verwijder daarna eventueel ook het fotobestand uit de map.

NIEUWE SERIE TOEVOEGEN
Voeg in portfolio.js een nieuw blok toe met:
- slug: korte technische naam, bijvoorbeeld "new-series"
- title: naam die op de website verschijnt
- cover: eerste foto
- images: alle foto's van de serie in de gewenste volgorde

Voorbeeld:
{
  "slug": "new-series",
  "title": "NEW SERIES",
  "cover": "images/new-series/01.jpg",
  "images": [
    "images/new-series/01.jpg",
    "images/new-series/02.jpg"
  ]
}

Daarna maak je de map:
images/new-series/

en zet je daar de foto's in.

OPMERKING
Deze versie is bedoeld als de beheerbare online versie voor GitHub Pages. De vorige
zelfstandige iPhone-preview ZIP blijft apart bruikbaar als snelle offline testversie.
