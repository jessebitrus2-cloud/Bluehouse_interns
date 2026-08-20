# Hearth — Recipe Finder

A Vite + React (JavaScript) kitchen app styled with Tailwind CSS. Search recipes or ingredients via [TheMealDB](https://www.themealdb.com/api.php), open a dish in a modal, and leave a star rating plus review.

## Features

- Search by recipe name and ingredient (results are merged)
- Cuisine filter and category chips
- Featured plates on load, pantry ingredient shortcuts, Surprise me
- Recipe modal with ingredients, method, video/source links
- Reviews stored in the browser (`localStorage`)
- Saved recipes (heart / pantry)

## Setup

```bash
npm install
npm run dev
```

Build for production with `npm run build`.

No API key is required for TheMealDB’s public test key (`v1/1`).
