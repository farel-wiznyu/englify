# Status aset

Aset berasal dari dua zip ChatGPT. Zip pertama (`...ALL-144-Assets.zip`) hanya berisi 86 PNG dan **nama
file-nya banyak yang tidak cocok dengan isi gambar**, jadi dipetakan manual lewat
[`scripts/asset-map.json`](../scripts/asset-map.json). Zip kedua (`...Missing-61-Transparent.zip`) bernama
benar dan diproses tanpa peta.

Pipeline: `node scripts/process-assets.mjs <folder> [--map scripts/asset-map.json]` (kecilkan ukuran, hapus
latar magenta, pusatkan, kompres, lalu tulis ulang `src/lib/art.generated.ts`). Folder `assets/` sekarang
±6 MB.

## Terpasang di app

| Kelompok | Isi |
|---|---|
| Kosakata | **64 dari 64** |
| Maskot Ollie | mascot-happy, -cheer, -think, -listen, -speak, signin-scene, ollie-base |
| Onboarding | onboard-vocab, onboard-speak, onboard-games |
| Status | state-offline, state-mic, state-empty |
| Hasil game | trophy (3 bintang), medal (2), balloon (1) |
| Avatar anak (6) | bear, cat, dog, fox, lion, panda (disimpan sebagai key, mis. `bear`) |
| Lencana (6) | star, heart, trophy, lightning, fire, crown |
| Ikon game | game-match, game-listen, game-memory |
| Memory | memory-card-back (sampul kartu) |
| Ikon app | icon, adaptive foreground, monochrome, splash |

Pemetaan lencana: Langkah Pertama = star, 10 Kata = heart, Lesson Selesai = trophy, Pemain Game = lightning,
3 Hari Beruntun = fire, 10 Kata Dikuasai = crown.

Profil anak yang dibuat sebelum avatar bergambar masih menyimpan emoji, dan tetap tampil normal.

## Tidak dipasang

- **`wave-1..4`, `talk-small/wide/o`, `jump-1..3`**: isinya monster kuning, **bukan Ollie**. Tidak bisa dipakai
  sebagai frame animasi Ollie. Frame lama (`blink`, `talk-closed`) juga tidak sejajar. Ollie digerakkan lewat
  kode (melayang dan squash-stretch).
- **`cover-*`**: ada teks menempel di gambar ("PAINT PALETTE!", "MY BODY"), ukurannya tidak persegi, dan
  gayanya beda. Tidak dipakai.
- **`decor-*`** (balloon, cloud, confetti, heart, rainbow, sparkle, star, sun): bagus, tapi belum ada tempat
  yang butuh. Tersedia di zip kalau mau dipakai sebagai stiker.
- Cadangan dari zip pertama: lion, bebek kedua, jeruk kedua, semangka kedua, penggaris kedua, jam kedua,
  laptop kedua, lampu, meja.

## Catatan kualitas

- **numbers-seven**: angka 7 merah punya ekor seperti bendera dan ambigu untuk anak. Belum digenerate ulang.
- **Gaya tidak seragam.** Zip kedua bergaya kawaii dengan outline hitam, sedangkan zip pertama punya outline
  navy dan halftone. Karena gambar tampil satu-satu di kartu, perbedaannya tidak mengganggu, tapi masih
  terlihat kalau dibandingkan berdampingan.
- **badge-trophy** dan **memory-card-back** memuat teks bahasa Inggris di dalam gambar ("TROPHY WINNER!",
  "OLLIE MEMORY CARD").
- Ikon adaptive Android memakai pose Ollie badan penuh di atas latar kuning `#FFD93D`.
