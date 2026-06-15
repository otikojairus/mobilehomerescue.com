# Mobile Home Rescue

Next.js site for mobile home plumbing, RV plumbing, emergency plumbing, and water damage restoration pages.

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run start
```

## Docker

Build and run with Compose:

```bash
docker compose up --build
```

The container serves the app on `http://localhost:3000`.

Build the image directly:

```bash
docker build -t mobilehomerescue:latest .
docker run --rm -p 3000:3000 mobilehomerescue:latest
```
