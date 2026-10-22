// One-off helper: expands the compact table below into src/data/vocabulary.json
import { writeFileSync } from 'node:fs';

const categories = [
  ['colors', 'Colors', 'Warna', '🎨', 'pink'],
  ['animals', 'Animals', 'Hewan', '🐾', 'green'],
  ['numbers', 'Numbers', 'Angka', '🔢', 'blue'],
  ['fruits', 'Fruits', 'Buah', '🍎', 'orange'],
  ['family', 'Family', 'Keluarga', '👪', 'purple'],
  ['body', 'Body Parts', 'Anggota Tubuh', '🖐️', 'pink'],
  ['objects', 'Daily Objects', 'Benda Sehari-hari', '🪑', 'blue'],
  ['school', 'School', 'Sekolah', '🎒', 'green'],
];

// [word, translation, emoji, example]
const words = {
  colors: [
    ['red', 'merah', '🔴', 'The apple is red.'],
    ['blue', 'biru', '🔵', 'The sky is blue.'],
    ['green', 'hijau', '🟢', 'The leaf is green.'],
    ['yellow', 'kuning', '🟡', 'The sun is yellow.'],
    ['orange', 'oranye', '🟠', 'I see an orange circle.'],
    ['purple', 'ungu', '🟣', 'The grape is purple.'],
    ['black', 'hitam', '⚫', 'The cat is black.'],
    ['white', 'putih', '⚪', 'The cloud is white.'],
  ],
  animals: [
    ['cat', 'kucing', '🐱', 'The cat says meow.'],
    ['dog', 'anjing', '🐶', 'The dog runs fast.'],
    ['bird', 'burung', '🐦', 'The bird can fly.'],
    ['fish', 'ikan', '🐟', 'The fish can swim.'],
    ['cow', 'sapi', '🐮', 'The cow says moo.'],
    ['duck', 'bebek', '🦆', 'The duck is in the water.'],
    ['rabbit', 'kelinci', '🐰', 'The rabbit likes carrots.'],
    ['elephant', 'gajah', '🐘', 'The elephant is big.'],
  ],
  numbers: [
    ['one', 'satu', '1️⃣', 'I have one nose.'],
    ['two', 'dua', '2️⃣', 'I have two eyes.'],
    ['three', 'tiga', '3️⃣', 'Three little birds.'],
    ['four', 'empat', '4️⃣', 'A table has four legs.'],
    ['five', 'lima', '5️⃣', 'I have five fingers.'],
    ['six', 'enam', '6️⃣', 'I see six stars.'],
    ['seven', 'tujuh', '7️⃣', 'A week has seven days.'],
    ['eight', 'delapan', '8️⃣', 'I am eight years old.'],
  ],
  fruits: [
    ['apple', 'apel', '🍎', 'I eat an apple.'],
    ['banana', 'pisang', '🍌', 'The banana is yellow.'],
    ['orange', 'jeruk', '🍊', 'The orange is sweet.'],
    ['grape', 'anggur', '🍇', 'The grape is small.'],
    ['mango', 'mangga', '🥭', 'I like mango juice.'],
    ['watermelon', 'semangka', '🍉', 'The watermelon is big.'],
    ['strawberry', 'stroberi', '🍓', 'The strawberry is red.'],
    ['pineapple', 'nanas', '🍍', 'The pineapple is sweet.'],
  ],
  family: [
    ['mother', 'ibu', '👩', 'My mother is kind.'],
    ['father', 'ayah', '👨', 'My father is strong.'],
    ['sister', 'saudara perempuan', '👧', 'My sister is funny.'],
    ['brother', 'saudara laki-laki', '👦', 'My brother plays ball.'],
    ['baby', 'bayi', '👶', 'The baby is sleeping.'],
    ['grandmother', 'nenek', '👵', 'My grandmother tells stories.'],
    ['grandfather', 'kakek', '👴', 'My grandfather is wise.'],
    ['family', 'keluarga', '👪', 'I love my family.'],
  ],
  body: [
    ['eye', 'mata', '👁️', 'I see with my eye.'],
    ['ear', 'telinga', '👂', 'I hear with my ear.'],
    ['nose', 'hidung', '👃', 'I smell with my nose.'],
    ['mouth', 'mulut', '👄', 'I eat with my mouth.'],
    ['hand', 'tangan', '✋', 'Wave your hand.'],
    ['foot', 'kaki', '🦶', 'I have two feet.'],
    ['tooth', 'gigi', '🦷', 'Brush your tooth.'],
    ['leg', 'kaki (tungkai)', '🦵', 'I kick with my leg.'],
  ],
  objects: [
    ['book', 'buku', '📖', 'I read a book.'],
    ['chair', 'kursi', '🪑', 'Sit on the chair.'],
    ['bed', 'tempat tidur', '🛏️', 'I sleep on the bed.'],
    ['door', 'pintu', '🚪', 'Open the door.'],
    ['clock', 'jam', '🕐', 'The clock is on the wall.'],
    ['cup', 'cangkir', '☕', 'I drink from a cup.'],
    ['key', 'kunci', '🔑', 'The key opens the door.'],
    ['ball', 'bola', '⚽', 'Kick the ball.'],
  ],
  school: [
    ['pencil', 'pensil', '✏️', 'I write with a pencil.'],
    ['bag', 'tas', '🎒', 'My bag is blue.'],
    ['ruler', 'penggaris', '📏', 'Use a ruler to draw.'],
    ['scissors', 'gunting', '✂️', 'Scissors cut paper.'],
    ['teacher', 'guru', '🧑‍🏫', 'The teacher is nice.'],
    ['school', 'sekolah', '🏫', 'I go to school.'],
    ['paper', 'kertas', '📄', 'Draw on the paper.'],
    ['computer', 'komputer', '💻', 'I use a computer.'],
  ],
};

const out = {
  categories: categories.map(([id, name, nameId, emoji, color]) => ({ id, name, nameId, emoji, color })),
  items: [],
  lessons: [],
};

for (const [catId, list] of Object.entries(words)) {
  const ids = [];
  for (const [word, translation, emoji, example] of list) {
    const id = `${catId}-${word}`;
    ids.push(id);
    out.items.push({ id, categoryId: catId, word, translation, emoji, example });
  }
  const cat = out.categories.find((c) => c.id === catId);
  out.lessons.push({
    id: `${catId}-1`,
    categoryId: catId,
    title: cat.name,
    itemIds: ids,
    estimatedMinutes: 5,
  });
}

writeFileSync(new URL('../src/data/vocabulary.json', import.meta.url), JSON.stringify(out, null, 2));
console.log(`categories=${out.categories.length} items=${out.items.length} lessons=${out.lessons.length}`);
