# docs/media/

Dieser Ordner enthaelt alle visuellen Demo-Assets fuer die README und Dokumentation.

## demo.gif — Anforderungen

| Eigenschaft | Empfehlung |
| --- | --- |
| Dateiname | `demo.gif` |
| Aufloesung | 1280 × 720 px (16:9) |
| Laenge | 5–10 Sekunden |
| Schleife | Loop aktiviert (infinite) |
| Dateigrösse | max. 10 MB (GitHub-Limit fuer Inline-Previews) |
| FPS | 15–24 fps |

## GIF aus MP4 erstellen (ffmpeg)

```bash
# Schritt 1: Farbpalette generieren (bessere Qualität)
ffmpeg -i aufnahme.mp4 -vf "fps=20,scale=1280:-1:flags=lanczos,palettegen" palette.png

# Schritt 2: GIF mit Palette erzeugen
ffmpeg -i aufnahme.mp4 -i palette.png \
  -filter_complex "fps=20,scale=1280:-1:flags=lanczos[x];[x][1:v]paletteuse" \
  docs/media/demo.gif
```

## Empfohlene Flows fuer das Demo-GIF

1. Landing Page laden
2. Niche-Select durchklicken
3. Feed mit Posts zeigen
4. Mini App kurz zeigen (Farcaster-Login-Flow)

## Aufnahme-Tools

- **macOS:** QuickTime -> Bildschirmaufnahme, dann ffmpeg
- **Linux:** `simplescreenrecorder` oder `OBS Studio`, Export als MP4
- **Windows:** Xbox Game Bar (`Win + G`), dann ffmpeg
