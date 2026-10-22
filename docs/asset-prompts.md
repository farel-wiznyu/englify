# Englify — Paket Prompt Aset v2 ("Bouncy TV Cartoon")

144 prompt siap tempel untuk ChatGPT Image, bergaya **komik + kartun animasi TV**: bentuk karet
(squash and stretch), pose di puncak aksi, ekspresi lebay yang lucu, satu gag kecil di setiap
gambar. Paket ini menggantikan versi v1.

Prompt per grup ada di folder [`docs/asset-prompts/`](asset-prompts/):

| File | Isi | Jumlah |
|---|---|---|
| [01-ollie.md](asset-prompts/01-ollie.md) | Maskot Ollie: sheet referensi, pose, **frame animasi** (kedip, bicara, lambai, lompat), onboarding, status error, parts untuk rig (opsional) | 39 |
| [02-ui-art.md](asset-prompts/02-ui-art.md) | Avatar, trofi/balon/medali, lencana, ikon game, ikon app dan splash | 23 |
| [03-vocab-colors-animals-numbers.md](asset-prompts/03-vocab-colors-animals-numbers.md) | Kosakata: warna, hewan, angka | 24 |
| [04-vocab-fruits-family-body.md](asset-prompts/04-vocab-fruits-family-body.md) | Kosakata: buah, keluarga, anggota tubuh | 24 |
| [05-vocab-objects-school.md](asset-prompts/05-vocab-objects-school.md) | Kosakata: benda sehari-hari, sekolah | 16 |
| [06-covers-decor.md](asset-prompts/06-covers-decor.md) | Sampul kategori (opsional) dan paket stiker dekor | 18 |

Setiap prompt sudah dicek satu per satu oleh reviewer (format, gaya, tidak minta teks di gambar,
aman untuk anak, tidak meniru franchise), lalu diaudit lintas file: 144 nama file lengkap, tanpa
duplikat.

---

## 1. Cara kerja (penting, hemat banyak ulang)

1. **Satu chat per grup kecil.** Buka chat baru, tempel **STYLE BIBLE** (bagian 2) sekali di
   awal, lalu kirim prompt satu per satu. Setiap prompt di file sudah diawali "Same style bible."
   Kira-kira tiap 6–8 gambar, buka chat baru dan tempel ulang supaya gaya tidak melenceng.
2. **Mulai dari Ollie.** Kerjakan `ollie-sheet` dulu. Pilih hasil terbaik, simpan sebagai
   **"Ollie reference"**, lalu lampirkan ke semua prompt yang bertanda `Attach: Ollie reference`.
3. **Frame animasi harus lewat EDIT.** Prompt `ollie-blink-*`, `ollie-talk-*`, `ollie-wave-*`,
   `ollie-jump-*` diawali "Edit the attached image of Ollie…". Selalu lampirkan `ollie-base.png`
   yang sudah disetujui (bukan frame sebelumnya) supaya posisi dan ukuran identik antar frame.
4. **Cek `ollie-base.png` dengan teliti** (kaki di y=900, tengah di x=512). Rapikan di editor
   sekarang, karena semua frame mewarisi gambar ini.
5. **Transparansi.** Semua prompt sudah minta latar transparan. Kalau hasilnya berlatar, ulangi
   dengan *"the same image on a flat #FF00FF magenta background"*, lalu hapus magentanya
   (remove.bg, Photopea, atau Canva Background Remover).
6. **Tanpa teks di dalam gambar.** Teks komik ("POW!", "AYO!") dirender app. Pengecualian:
   angka di `numbers-*` dan `cover-numbers`, serta simbol "?" di `mascot-think`.
7. **Perkirakan ±30% perlu diulang.** Itu normal. Perbaiki yang gagal saja, dan bila ada Tip di
   bawah prompt, ikuti Tip-nya.
8. **Batas harian.** Pemakaian gratis ChatGPT membatasi jumlah gambar per hari. Kalau terbentur,
   lanjutkan besok. Urutan prioritas ada di bagian 4.

## 2. STYLE BIBLE (tempel di awal setiap chat)

```text
STYLE BIBLE - "Bouncy TV Cartoon": Original 2D animated-cartoon illustration, like a keyframe from a modern kids' TV cartoon, for a children's English-learning app (ages 4-10). Clean vector look, thick dark-navy (#1B1340) outlines with confident, slightly varying weight (thicker on the outer silhouette), rounded line ends. Flat saturated colors from this palette only: electric purple #8B7BFF, hot pink #FF7CBF, tangerine #FFA21A, sunny yellow #FFD93D, cartoon green #5CD66B, sky blue #6EC6FF, red #F2384A, cream #FFF6E0. One flat shadow tone per color plus a small white glint highlight; occasional halftone-dot shading inside shadows. SQUASH AND STRETCH: shapes are bouncy and rubbery, heads oversized, bodies short and round, limbs noodly. Every subject is caught at the PEAK of an action (an animation "extreme pose" with anticipation or follow-through: leaning, tilted, mid-bounce) with a strong readable silhouette. Expressions are huge and funny: giant glossy eyes, cheeky grins, raised eyebrows, wobbly mouths, blush circles. Comic energy marks are allowed (small motion lines, impact stars, dust puffs, sparkles, tiny sweat drops) but never text. Cheerful, silly, warm, never scary, sad or mean. No text, letters or numbers (unless explicitly asked), no watermark, signature or frame. Transparent background with only a soft flat oval ground shadow. Original designs: do not imitate any existing franchise, character or website.
```

Karakter Ollie (sudah tertanam di prompt Ollie, ini sebagai referensi):

```text
CHARACTER "Ollie": a round-bodied owl mascot with an oversized head, electric-purple scalloped feathers, cream belly, floppy ear tufts, big round white eyes with oversized pupils and glossy glints, big round yellow-framed glasses (slightly crooked), a tiny orange beak that stretches expressively, an orange scarf that flutters, stubby noodle wings with three feather-fingers, tiny orange feet. Goofy, confident, always a tiny bit off-balance in a funny way.
```

## 3. Soal "animated"

ChatGPT menghasilkan gambar diam, jadi gerakannya dibuat dari **frame** yang gue rangkai di app:

- **Kedip** (`ollie-blink-1..3`): loop pelan di layar Home dan login.
- **Bicara** (`ollie-talk-closed/small/wide/o`): mulut bergerak saat audio kata diputar.
- **Lambai** (`ollie-wave-1..4`): sapaan di Home dan onboarding.
- **Lompat** (`ollie-jump-anticipate/air/land`): saat lesson atau game selesai.
- **`ollie-part-*`** (opsional): layer terpisah untuk animasi boneka (mata, sayap, paruh) lewat
  Reanimated atau Rive. Bereksperimen saja: kalau hasilnya tidak pas, lewati dan pakai frame.

Frame-nya kecil (±768 px, PNG), jadi ringan. Peralihan antar frame berjalan di UI thread seperti
animasi lain di app.

## 4. Urutan kerja yang disarankan

| Tahap | Apa | Jumlah |
|---|---|---|
| 1. Cek gaya | `ollie-sheet`, `ollie-base`, `mascot-happy`, `mascot-cheer`, `signin-scene`, `trophy`, `balloon` | 7 |
| 2. Ikon app | `icon`, `android-icon-foreground`, `android-icon-monochrome`, `splash-icon` | 4 |
| 3. Uji kosakata | satu kategori penuh, misalnya `animals-*` | 8 |
| 4. Sisa maskot | `mascot-think/listen/speak`, `onboard-*`, `state-*`, avatar, lencana, ikon game, `memory-card-back` | ±27 |
| 5. Kosakata | warna, angka, buah, keluarga, tubuh, benda, sekolah | 56 |
| 6. Animasi | frame kedip, bicara, lambai, lompat | 14 |
| 7. Opsional | `cover-*`, `decor-*`, `ollie-part-*`, `ollie-expressions` | ±36 |

Setelah tahap 1–3, kabari gue. Kita nilai dulu apakah gayanya cocok sebelum bikin sisanya.

## 5. Ukuran akhir dan penamaan

Simpan persis dengan nama di heading prompt (huruf kecil, tanda hubung, `.png`). Kompres dengan
squoosh.app atau tinypng.com.

| Kelompok | Ukuran akhir | Folder |
|---|---|---|
| Maskot dan pose (`mascot-*`, `signin-scene`, `onboard-*`, `state-*`) | 768×768 | `assets/art/` |
| Frame animasi Ollie (`ollie-blink/talk/wave/jump-*`) | 768×768, posisi identik | `assets/art/frames/` |
| Rig parts (`ollie-part-*`) | 1024×1024 | `assets/art/parts/` |
| Avatar | 384×384 | `assets/art/` |
| Hasil, lencana, ikon game | 512 / 256 / 512 | `assets/art/` |
| Kosakata (64) | 512×512 | `assets/vocab/` |
| Sampul dan dekor | 512×512 / 256×256 | `assets/art/` |
| Ikon app, splash | 1024×1024 | `assets/images/` (ganti file bawaan) |
| Referensi (`ollie-sheet`, `ollie-expressions`) | tidak dipakai di app | simpan di luar project |

## 6. Setelah gambar jadi

Kirim kabar ke gue per tahap. Gue yang memasang ke `src/lib/art.ts`, membuat pemetaan 64
kosakata (Metro butuh `require` statis, jadi dibuat otomatis lewat skrip), menyambungkan frame
animasi, dan mengganti ikon di `app.json`.
