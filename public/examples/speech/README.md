# Speech example audio

Filenames come from the `audio` field in
`src/features/developers/data/transcribeExamples.js` — **extension included**, so
the name here must match exactly. (An earlier version guessed `.wav` then `.mp3`;
that misfired on the mp3 file, so paths are now explicit.)

## Present

| File | Example |
|---|---|
| `bhojpuri-bank-details.mp3` | Bhojpuri · spoken account number, thirteen digits |
| `sanskrit-shlok.wav` | Sanskrit · shloka recitation |
| `tamil-thirukkural.wav` | Tamil · classical verse |
| `santali-parcel.wav` | Santali · spontaneous conversation, Ol Chiki |

## Still needed

These four are wired up with their transcripts already; the player will just be
silent until the files land:

| File | Example |
|---|---|
| `hindi-song-clip.mp3` | Hindi · film song, sung over music |
| `hindi-child-voice.mp3` | Hindi · child speaker |
| `punjabi-stem.mp3` | Punjabi · STEM classroom, English physics terms code-switched |
| `english-assamese-accent.mp3` | English · spoken with an Assamese accent |

## Format

mp3 at 64–96 kbps mono is plenty for speech and keeps each clip well under
100 KB. The three current `.wav` files total ~2.3 MB between them; converting
them to mp3 would cut that by roughly 20×. All clips use `preload="metadata"`,
so only headers load until someone presses play.
