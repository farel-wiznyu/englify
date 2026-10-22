# Ollie the owl: character, poses, animation frames, scenes

> Chat A (character, reference only): paste the STYLE BIBLE, run ollie-sheet with no attachment, keep the best result as the "Ollie reference", then run ollie-expressions and ollie-base in the same chat with it attached. ollie-sheet and ollie-expressions are never shipped in the app.
> Chat B (poses and scenes): new chat, paste the STYLE BIBLE, attach the Ollie reference, then run mascot-*, signin-scene, onboard-* and state-*. At most 8 images per chat, then open a new chat, paste the STYLE BIBLE again and re-attach the reference.
> Chat C (animation frames): save the approved ollie-base.png, open a fresh chat, paste the STYLE BIBLE and attach ollie-base.png to EVERY frame prompt (always the original base, never a previous frame). These prompts start with "Edit the attached image of Ollie" on purpose. At most 6 frames per chat.
> Chat D (optional rig parts): same setup as Chat C, run the ollie-part-* items last and only if you want the puppet rig. Save every file with exactly the name in its heading.

---

## ollie-sheet.png - Turnaround of Ollie (front, three-quarter, side). Reference only, not used in the app
- Canvas: 1536x1024, plain cream #FFF6E0 background (reference only)
- Attach: none
```text
Same style bible. Original character turnaround sheet of an owl mascot named Ollie: three full-body views of the SAME character standing side by side on a plain flat cream #FFF6E0 background. Front view on the left, three-quarter view in the middle (turned toward the image's right), side view in profile on the right (facing right). All three are exactly the same height and all feet rest on one shared baseline.

Ollie's design: a round-bodied owl with an oversized head that is wider than his body, electric-purple scalloped feathers, a cream belly, two floppy ear tufts that droop outward, big round white eyes with oversized dark pupils and glossy white glints, thick curved navy eyebrow strokes, pink blush circles, big round yellow-framed glasses that sit slightly crooked (the lens on the image's left a little higher than the other), a tiny orange beak, a fluttering orange scarf whose tail flies out behind him, stubby noodle wings that each end in three feather-fingers, and tiny orange feet.

Pose and expression: neutral idle, standing with a slight cheeky lean, wings hanging loose, head tilted a few degrees, calm friendly eyes and a small cheeky closed-beak smile. Micro-gag: one stubborn cowlick feather sticks straight up between the ear tufts in every view. Composition: three figures evenly spaced, each about 80% of the canvas height, each with a small flat oval ground shadow, no labels, no text, no grid lines. 1536x1024, plain cream background (this sheet is a reference only).
```
- Tip: This image becomes the Ollie reference for everything else. If one of the three views looks like a different owl (other glasses, other scarf, other head shape), regenerate instead of patching. If ChatGPT adds labels or captions, add: "no words anywhere on the canvas".

## ollie-expressions.png - Six head close-ups of Ollie's moods. Reference only, not used in the app
- Canvas: 1536x1024, plain cream #FFF6E0 background (reference only)
- Attach: Ollie reference
```text
Same style bible. Same Ollie as the attached reference image. Expression sheet: six head-and-shoulders close-ups of Ollie in a neat grid of two rows of three, every head the same size and filling about 85% of its own slot, on a plain flat cream #FFF6E0 background, no frames, no labels, no text. Each head is caught at the PEAK of its expression, squashed or stretched and tilted to sell it. Top row, left to right: (1) HAPPY: beak stretched wide open in a giant grin, eyes huge with star-shaped glints, eyebrows high, head bouncing up, a few tiny sparkles. (2) SURPRISED: the whole head stretched tall, pupils shrunk to tiny dots inside huge white eyes, ear tufts shooting straight up, beak a tiny round O, a few small shock lines and one sweat drop. (3) THINKING: head tilted hard to one side, eyes rolled up and away, one eyebrow way up and the other squished down, beak twisted to one corner, a small thought bubble with three dots floating beside him. Bottom row, left to right: (4) SLEEPY: eyelids drooping half shut, head nodding forward, one ear tuft flopped over, beak slightly open, one small round bubble growing from the beak tip. (5) CHEEKY WINK: one eye squeezed shut in a curve, the other wide open, the tip of a pink tongue poking out of one corner of the beak, one eyebrow cocked, one sparkle on the glasses. (6) PROUD: chin lifted high, eyes half closed in a smug happy arc, eyebrows raised, a wide confident smile, one big shine sparkle on the beak. Micro-gag across all six: the single cowlick feather on top of his head reacts to each mood (bouncing, shooting straight up, curled into a question curl, drooping, winking with a tiny curl, puffed up like a flag). The crooked yellow glasses, orange scarf top and purple scalloped feathers are identical in all six. 1536x1024, plain cream background (reference only).
```
- Tip: If ChatGPT squeezes all six into one thin row with tiny heads, repeat the prompt and add: "exactly two rows of three, each head at least 450 px wide".

## ollie-base.png - Canonical idle pose of Ollie. EDIT SOURCE for every animation frame and rig part
- Canvas: 1024x1024, transparent background
- Attach: Ollie reference
```text
Same style bible. Same Ollie as the attached reference image. Redraw Ollie as the one canonical idle pose that will become the edit source for every animation frame, so follow the placement numbers exactly.

Pose: standing in a three-quarter front view turned slightly toward the image's right, weight shifted onto his right foot (the foot on the image's left) so his whole body leans about 5 degrees toward the image's right and his head tilts a few more degrees the same way, like he is about to say something clever and is just barely off-balance. Both orange feet stay flat on the ground. His right wing (the wing on the image's LEFT) hangs low and a little out from his body with its three feather-fingers curling; his left wing (the wing on the image's right) hugs his side. The orange scarf's tail flutters out toward the image's left as if there is a gentle breeze.

Expression: cheeky and friendly, tiny orange beak closed in a small curved smile, eyes wide open with big glossy glints, pupils glancing slightly toward the image's right, thick navy eyebrows slightly raised, small pink blush circles. Micro-gag: one stubborn cowlick feather sticks straight up between his two floppy ear tufts, and his crooked yellow glasses have slid a hair too low.

Exact placement on the 1024x1024 canvas: Ollie is horizontally centered on x=512. The soles of both feet sit on a baseline at y=900 (left foot centered near x=440, right foot near x=590). The tips of the ear tufts and the cowlick feather reach up to about y=150. The oversized head is about 540 px wide and spans roughly y=200 to y=600. The glasses lenses are about 190 px across, centered near (400, 385) and (625, 405). The beak sits between the lenses with its tip at about (518, 490). The scarf wraps the neck at about y=590 to y=650. The cream belly spans about y=580 to y=890. Overall figure about 750 px tall, with empty margins left and right. One small flat soft oval ground shadow centered at (512, 905), about 380 px wide. Nothing else in the picture. 1024x1024, transparent background.
```
- Tip: Open the result in an image editor and check the guides: feet bottom at y=900, center at x=512. Nudge it in the editor if it is a little off, but do it NOW, because every frame and part inherits this exact image. If the background is not transparent, ask for "the same image on a flat #FF00FF magenta background" and remove the magenta before saving.

## mascot-happy.png - Home screen mascot, waving hello
- Canvas: 1024x1024, transparent background
- Attach: Ollie reference
```text
Same style bible. Same Ollie as the attached reference image. Ollie waving hello at the very PEAK of an over-excited wave: he is mid-hop with both feet just off the ground, his body bent in a bouncy C-curve leaning back, his right wing (on the image's left) thrown high over his head with the three feather-fingers fanned out and wobbling, the other wing flung out sideways for balance, the orange scarf whipping behind him. Expression: beak stretched wide open in a giant cheerful grin, eyes enormous and sparkling with star-shaped glints, eyebrows high, pink blush circles. Micro-gag: the wave is so enthusiastic that one purple feather has popped off the top of his head and is spinning away with a tiny sparkle trail. A few small white sparkles around him. Composition: full body, centered, filling about 85% of the canvas, with a small flat oval ground shadow far below his feet because he is in the air. 1024x1024, transparent background.
```

## mascot-cheer.png - Lesson complete screen, victory jump with confetti
- Canvas: 1024x1024, transparent background
- Attach: Ollie reference
```text
Same style bible. Same Ollie as the attached reference image. Ollie at the very top of a victory jump, caught at the highest point: his body stretched tall like rubber, both wings thrown straight up with the feather-fingers spread like fireworks, his noodly legs dangling and kicking in different directions, the orange scarf streaming down behind him. Expression: beak stretched wide open in a happy yell, eyes squeezed shut into happy upside-down U curves, eyebrows high, pink blush circles. Around him a big burst of confetti shooting outward from behind his body: stars, circles and curly streamers in pink, yellow, green, sky blue and orange, with no text anywhere. Micro-gag: a tiny paper party hat in pink and yellow is balancing on one ear tuft at a wild angle, its elastic string snapped and flapping. Composition: full body, centered, the whole burst filling about 90% of the canvas, one tiny flat oval ground shadow very far below him. 1024x1024, transparent background.
```
- Tip: If confetti or streamers cover his face, add: "all confetti stays behind Ollie, his face and glasses stay completely clear".

## mascot-think.png - Wrong answer screen, curious and not sad
- Canvas: 1024x1024, transparent background
- Attach: Ollie reference
```text
Same style bible. Same Ollie as the attached reference image. Ollie in the middle of a big curious head-scratch moment, caught at the peak of the head tilt: his head tilted about 25 degrees to one side, one wing tucked under his beak tapping his chin, the other wing behind his back, standing on one foot with the other foot lifted and the toes curled, body leaning the same way as the head. Expression: curious, NOT sad: one eyebrow shot way up and the other squished down, eyes glancing up and sideways, the beak scrunched to one side in a lopsided half-smile, a tiny gleam on the glasses. A small floating "?" symbol (about the size of one of his eyes, in sunny yellow with a navy outline) above and beside his head. Micro-gag: one of his ear tufts has curled into a loose spiral curl, as if it is thinking too (the spiral is NOT a second question mark). Composition: full body, centered, filling about 85% of the canvas, small flat oval ground shadow. 1024x1024, transparent background.
```
- Tip: If the "?" comes out huge or there are several, add: "exactly ONE small question mark, no other symbols".

## mascot-listen.png - Listening practice, headphones on
- Canvas: 1024x1024, transparent background
- Attach: Ollie reference
```text
Same style bible. Same Ollie as the attached reference image. Ollie bopping to a beat, caught at the peak of a sideways lean: he is wearing big chunky yellow over-ear headphones (one round cup on each side of his head and a thick band arching over the top between his ear tufts), one wing cupped behind the ear cup as if he is trying to hear even better, the other wing swinging out, one foot lifted off the ground mid-bounce, the orange scarf swaying. Expression: eyes wide and attentive with big glints, eyebrows raised, beak in a small delighted "ooh" curve, pink blush circles. A few music notes (eighth notes and a beamed pair in pink, blue and green) floating up around him. Micro-gag: one chunky music note has landed on top of an ear tuft and bounces along with the beat, bending the tuft down. Composition: full body, centered, filling about 85% of the canvas, small flat oval ground shadow. 1024x1024, transparent background.
```
- Tip: If the headphones come out as tiny earbuds or sit on the wrong spot, add: "big over-ear cups covering the sides of his head, the headband goes over the top between the two ear tufts".

## mascot-speak.png - Pronunciation practice, microphone and sound waves
- Canvas: 1024x1024, transparent background
- Attach: Ollie reference
```text
Same style bible. Same Ollie as the attached reference image. Ollie belting a word into a microphone, caught at the peak of the loudest moment: leaning forward on tiptoes with his chest puffed out, one wing holding a chunky red microphone (red head, cream handle, tiny white glint) held just in front of and slightly below his beak so the round "O" stays fully visible, the other wing clenched in a fist-like ball at his side. Expression: beak stretched into a perfectly round "O", eyes huge and locked forward, eyebrows high, pink blush circles. Three bold curved sound-wave arcs (yellow, orange, pink, getting bigger) radiate out from the beak toward the image's right. Micro-gag: his voice is so powerful that it blows his scarf and both ear tufts straight back behind him like a gale. Composition: full body, centered, filling about 85% of the canvas, small flat oval ground shadow. 1024x1024, transparent background.
```
- Tip: If the sound waves turn into squiggly writing, add: "plain smooth curved arcs only, no letters, no squiggle text".

## signin-scene.png - Login screen hero, Ollie on a stage disc
- Canvas: 1024x1024, transparent background
- Attach: Ollie reference
```text
Same style bible. Same Ollie as the attached reference image. Ollie proudly standing on a small round cream stage disc (a thick flat coin shape with a purple edge band and a navy outline, seen from a slightly raised angle), caught at the peak of a big proud wave: chest puffed out, chin lifted, his right wing (on the image's left) waving high with the feather-fingers fanned, the other wing planted on his hip, the orange scarf fluttering. Expression: a confident beaming grin with the beak wide open, eyes sparkling with star glints, eyebrows raised, pink blush circles. Stars and sparkles (yellow, pink, sky blue) twinkling around him, no text. Micro-gag: one of his feet has stepped half off the edge of the disc and his toes hang over it, so he is a tiny bit off-balance and has not noticed. Composition: centered square hero, Ollie and the disc together filling about 85% of the canvas, the disc taking up the bottom quarter, with a small flat oval ground shadow under the disc. 1024x1024, transparent background.
```

## ollie-blink-1.png - Blink frame 1: eyes wide open (rest frame before a blink)
- Canvas: 1024x1024, transparent background
- Attach: ollie-base
```text
Edit the attached image of Ollie. Keep the pose, outline weight, colors, scale and position IDENTICAL, and change ONLY: the two eyes inside the glasses lenses, which are now open at their absolute widest: white eyeballs at full size, pupils slightly bigger, and each glint redrawn as one big round white glint plus one tiny star-shaped glint (the micro-gag). Expression for this frame: bright, alert and cheeky, eyebrows exactly as in the base. Pose frozen exactly as in the base. Composition: Ollie stays the same size, horizontally centered at x=512 with the feet on the baseline y=900. Do not change anything outside the two eyes: head, body, wings, scarf, feet, glasses frames, beak, eyebrows, cowlick feather and ground shadow all stay identical. Same style bible and same Ollie as the attached image. 1024x1024, transparent background.
```
- Tip: This frame will look almost identical to ollie-base on purpose, it is the "eyes open" rest frame. If the whole picture comes back shifted or redrawn, repeat with: "do not redraw, only edit the pixels inside the two lenses". If the background is no longer transparent, ask for the same image on a flat #FF00FF magenta background and remove it afterwards.

## ollie-blink-2.png - Blink frame 2: eyelids half closed
- Canvas: 1024x1024, transparent background
- Attach: ollie-base
```text
Edit the attached image of Ollie. Keep the pose, outline weight, colors, scale and position IDENTICAL, and change ONLY: the two eyes inside the glasses lenses, whose upper eyelids have slid down to cover the top half of each eyeball. The lids are the same electric purple as his head feathers with a straight thick navy edge line, the pupils and glints still visible in the lower half of each eye. Micro-gag: the lids are uneven, the lid on the image's right sits a little lower than the other, so he looks silly-sleepy. Expression for this frame: relaxed, mid-blink, eyebrows exactly as in the base. Pose frozen exactly as in the base. Composition: Ollie stays the same size, horizontally centered at x=512 with the feet on the baseline y=900. Do not change anything outside the two eyes: head, body, wings, scarf, feet, glasses frames, beak, eyebrows, cowlick feather and ground shadow all stay identical. Same style bible and same Ollie as the attached image. 1024x1024, transparent background.
```

## ollie-blink-3.png - Blink frame 3: eyes fully closed as happy curves
- Canvas: 1024x1024, transparent background
- Attach: ollie-base
```text
Edit the attached image of Ollie. Keep the pose, outline weight, colors, scale and position IDENTICAL, and change ONLY: the two eyes inside the glasses lenses, which are now fully closed: the eyeball area is filled with the same electric purple as his head feathers and crossed by one thick navy happy curve (an upside-down U, like a smile) in each lens. Micro-gag: each curve ends in two tiny cartoon lash flicks at the outer corner. Expression for this frame: serene and happy, eyebrows exactly as in the base, pink blush circles unchanged. Pose frozen exactly as in the base. Composition: Ollie stays the same size, horizontally centered at x=512 with the feet on the baseline y=900. Do not change anything outside the two eyes: head, body, wings, scarf, feet, glasses frames, beak, eyebrows, cowlick feather and ground shadow all stay identical. Same style bible and same Ollie as the attached image. 1024x1024, transparent background.
```

## ollie-talk-closed.png - Talking frame 1: beak closed, small smile (rest frame)
- Canvas: 1024x1024, transparent background
- Attach: ollie-base
```text
Edit the attached image of Ollie. Keep the pose, outline weight, colors, scale and position IDENTICAL, and change ONLY: the beak, which is shut tight in a small cheeky smile: the upper and lower beak meet in one soft line that curls upward at the image's right end. Micro-gag: that curled end has a tiny dimple tick, like a smirk. The root of the beak and its top edge stay exactly where they are in the base so the frames swap without any jump. Expression for this frame: calm, friendly, cheeky. Eyes, eyebrows, glasses and blush circles exactly as in the base. Pose frozen exactly as in the base. Composition: Ollie stays the same size, horizontally centered at x=512 with the feet on the baseline y=900. Do not change anything outside the beak: head, body, wings, scarf, feet, cowlick feather and ground shadow all stay identical. Same style bible and same Ollie as the attached image. 1024x1024, transparent background.
```

## ollie-talk-small.png - Talking frame 2: beak slightly open
- Canvas: 1024x1024, transparent background
- Attach: ollie-base
```text
Edit the attached image of Ollie. Keep the pose, outline weight, colors, scale and position IDENTICAL, and change ONLY: the beak, which is open just a crack: the lower beak drops a few pixels so there is a narrow gap about 20 px tall showing a sliver of dark red mouth. Micro-gag: the very tip of a hot-pink tongue peeks into the gap. The root of the beak and the top edge of the upper beak stay exactly where they are in the base. Expression for this frame: mid-word, friendly, a touch surprised. Eyes, eyebrows, glasses and blush circles exactly as in the base. Pose frozen exactly as in the base. Composition: Ollie stays the same size, horizontally centered at x=512 with the feet on the baseline y=900. Do not change anything outside the beak: head, body, wings, scarf, feet, cowlick feather and ground shadow all stay identical. Same style bible and same Ollie as the attached image. 1024x1024, transparent background.
```

## ollie-talk-wide.png - Talking frame 3: beak wide open, tongue visible
- Canvas: 1024x1024, transparent background
- Attach: ollie-base
```text
Edit the attached image of Ollie. Keep the pose, outline weight, colors, scale and position IDENTICAL, and change ONLY: the beak, which is flung wide open in a big "aaah" shape: the lower beak stretches rubbery-long and drops about 80 px, the opening shows a big dark red mouth with a fat hot-pink tongue inside. Micro-gag: the tongue tip curls up and wiggles like a happy little worm. The root of the beak and the top edge of the upper beak stay exactly where they are in the base, and the mouth stays inside the face area without covering the glasses. Expression for this frame: mid-word, loud and cheerful. Eyes, eyebrows, glasses and blush circles exactly as in the base. Pose frozen exactly as in the base. Composition: Ollie stays the same size, horizontally centered at x=512 with the feet on the baseline y=900. Do not change anything outside the beak: head, body, wings, scarf, feet, cowlick feather and ground shadow all stay identical. Same style bible and same Ollie as the attached image. 1024x1024, transparent background.
```
- Tip: If the tongue or mouth looks realistic or the beak turns into lips, add: "cartoon beak only, flat colors, no teeth, no realistic mouth".

## ollie-talk-o.png - Talking frame 4: beak in a round O shape
- Canvas: 1024x1024, transparent background
- Attach: ollie-base
```text
Edit the attached image of Ollie. Keep the pose, outline weight, colors, scale and position IDENTICAL, and change ONLY: the beak, which is squeezed into a perfectly round "O", like a rubber ring: an orange ring about 85 px across with a dark red hole in the middle and only a tiny pink dot of tongue at the bottom of the hole. Micro-gag: the O is so perfectly round it looks like a donut, with a tiny white glint on the ring. The root of the beak stays exactly where it is in the base, and the ring never covers the glasses. Expression for this frame: saying "ooh", eyebrows exactly as in the base. Eyes, glasses and blush circles exactly as in the base. Pose frozen exactly as in the base. Composition: Ollie stays the same size, horizontally centered at x=512 with the feet on the baseline y=900. Do not change anything outside the beak: head, body, wings, scarf, feet, cowlick feather and ground shadow all stay identical. Same style bible and same Ollie as the attached image. 1024x1024, transparent background.
```

## ollie-wave-1.png - Wave frame 1: right wing low
- Canvas: 1024x1024, transparent background
- Attach: ollie-base
```text
Edit the attached image of Ollie. Keep the pose, outline weight, colors, scale and position IDENTICAL, and change ONLY: his right wing (the wing on the image's LEFT), which swings up and out into the LOW wave position: the wing lifted outward about 40 degrees away from his body, wing tip near (185, 720), the three feather-fingers loosely spread. Micro-gag: the pinky feather-finger flops limply downward, late to the party. Expression for this frame: exactly as in the base (cheeky closed-beak smile, eyes open, eyebrows slightly raised). The body, head, left wing and feet do not move at all. Composition: Ollie stays the same size, horizontally centered at x=512 with the feet on the baseline y=900. Do not add motion lines or any other marks. Everything outside the right wing (head, body, left wing, scarf, feet, glasses, beak, cowlick feather, ground shadow) stays identical. Same style bible and same Ollie as the attached image. 1024x1024, transparent background.
```

## ollie-wave-2.png - Wave frame 2: right wing rising
- Canvas: 1024x1024, transparent background
- Attach: ollie-base
```text
Edit the attached image of Ollie. Keep the pose, outline weight, colors, scale and position IDENTICAL, and change ONLY: his right wing (the wing on the image's LEFT), which is now RISING: lifted out to roughly horizontal, about 95 degrees away from his body, wing tip near (120, 560), the three feather-fingers fanned wide and bending slightly upward like a cartoon glove. Micro-gag: the middle feather-finger lags behind and bends back against the motion, a classic follow-through drag. Expression for this frame: exactly as in the base (cheeky closed-beak smile, eyes open, eyebrows slightly raised). The body, head, left wing and feet do not move at all. Composition: Ollie stays the same size, horizontally centered at x=512 with the feet on the baseline y=900. Do not add motion lines or any other marks. Everything outside the right wing (head, body, left wing, scarf, feet, glasses, beak, cowlick feather, ground shadow) stays identical. Same style bible and same Ollie as the attached image. 1024x1024, transparent background.
```

## ollie-wave-3.png - Wave frame 3: right wing high, tilted left
- Canvas: 1024x1024, transparent background
- Attach: ollie-base
```text
Edit the attached image of Ollie. Keep the pose, outline weight, colors, scale and position IDENTICAL, and change ONLY: his right wing (the wing on the image's LEFT), which is raised HIGH beside his head, about 150 degrees from his body, the whole wing tilted so its tip leans AWAY from his head toward the image's left, wing tip near (130, 250), the three feather-fingers fully fanned. Micro-gag: the feather-finger tips trail behind in a little arc, like they are still catching up with the wave. Expression for this frame: exactly as in the base (cheeky closed-beak smile, eyes open, eyebrows slightly raised). The body, head, left wing and feet do not move at all. Composition: Ollie stays the same size, horizontally centered at x=512 with the feet on the baseline y=900. Do not add motion lines or any other marks. Everything outside the right wing (head, body, left wing, scarf, feet, glasses, beak, cowlick feather, ground shadow) stays identical. Same style bible and same Ollie as the attached image. 1024x1024, transparent background.
```

## ollie-wave-4.png - Wave frame 4: right wing high, tilted right
- Canvas: 1024x1024, transparent background
- Attach: ollie-base
```text
Edit the attached image of Ollie. Keep the pose, outline weight, colors, scale and position IDENTICAL, and change ONLY: his right wing (the wing on the image's LEFT), which is raised HIGH beside his head, about 165 degrees from his body, the whole wing now tilted so its tip leans BACK toward his head and the image's right, wing tip near (250, 190), the three feather-fingers fanned and bent the opposite way from the previous swing. The wing may overlap the edge of his ear tuft but must never cover his glasses or eyes. Micro-gag: the feather-fingers wiggle with a little curl at their tips, like a cartoon glove waving. Expression for this frame: exactly as in the base (cheeky closed-beak smile, eyes open, eyebrows slightly raised). The body, head, left wing and feet do not move at all. Composition: Ollie stays the same size, horizontally centered at x=512 with the feet on the baseline y=900. Do not add motion lines or any other marks. Everything outside the right wing (head, body, left wing, scarf, feet, glasses, beak, cowlick feather, ground shadow) stays identical. Same style bible and same Ollie as the attached image. 1024x1024, transparent background.
```
- Tip: If the wing ends up in front of his eye, add: "the wing tip stays at least 40 px away from the glasses".

## ollie-jump-anticipate.png - Jump frame 1: deep squash crouch before the jump
- Canvas: 1024x1024, transparent background
- Attach: ollie-base
```text
Edit the attached image of Ollie. Keep the pose, outline weight, colors, scale and position IDENTICAL, and change ONLY: his body pose, which becomes the anticipation crouch of a jump (the character design, colors, outline weight, head size and the feet baseline stay identical). A deep squash: the head sinks down into the shoulders, the whole body is squashed to about 75% of its normal height and about 120% as wide, the feet planted wider apart but still sitting on the baseline y=900, the tips of the ear tufts now near y=330, both wings swung back and down behind him with the feather-fingers trailing like he is winding up a throw, the orange scarf bunched up on his shoulders. Expression for this frame: determined and fired up: upper eyelids pressed halfway down in a flat line, pupils small and locked straight ahead, thick navy eyebrows angled steeply down toward the middle, beak pressed shut in a tight little line. Micro-gag: a tiny white gleam streak flashes across each glasses lens. Composition: Ollie stays horizontally centered at x=512, the ground shadow oval slightly wider at (512, 905), no other marks. Same style bible and same Ollie as the attached image. 1024x1024, transparent background.
```

## ollie-jump-air.png - Jump frame 2: full stretch in the air
- Canvas: 1024x1024, transparent background
- Attach: ollie-base
```text
Edit the attached image of Ollie. Keep the pose, outline weight, colors, scale and position IDENTICAL, and change ONLY: his body pose, which becomes the peak of the jump (the character design, colors, outline weight and head size stay identical). A full rubbery stretch: the body about 107% as tall as the base and a little narrower, both wings thrown straight up above his head with the feather-fingers spread wide, the feet tucked up under his belly with the toes curled, the bottoms of the feet at about y=840, the tips of the ear tufts and wings near y=40. The orange scarf streams straight DOWN below him. Three or four short vertical speed lines below the tucked feet. The ground shadow shrinks to about half its width and gets paler at (512, 905). Expression for this frame: shocked-happy: eyes wide open with big glints, eyebrows high, beak wide open in a joyful yell. Micro-gag: the scarf streams downward as if gravity is one second late. Composition: Ollie stays horizontally centered at x=512. Same style bible and same Ollie as the attached image. 1024x1024, transparent background.
```
- Tip: If the wing tips touch or leave the top edge, ask the wings to bend slightly at the tips instead of shrinking Ollie, because the scale must stay the same as the other frames.

## ollie-jump-land.png - Jump frame 3: squash on landing with a tiny dust puff
- Canvas: 1024x1024, transparent background
- Attach: ollie-base
```text
Edit the attached image of Ollie. Keep the pose, outline weight, colors, scale and position IDENTICAL, and change ONLY: his body pose, which becomes the landing squash (the character design, colors, outline weight and head size stay identical). The body is squashed to about 78% of its normal height and about 118% as wide, the feet flat and splayed wide on the baseline y=900, both wings flung out sideways and drooping from inertia, the orange scarf flopped forward over one shoulder. Two small cream dust puffs with navy outlines (each about 120 px wide) burst out to the left and right of his feet. Expression for this frame: eyes squeezed shut into happy upside-down curves, beak open in a small cheeky "oof" grin, eyebrows high. Micro-gag: both ear tufts and the cowlick feather spring straight up on a one-frame delay, boing. Composition: Ollie stays horizontally centered at x=512, the ground shadow oval wider at (512, 905). Same style bible and same Ollie as the attached image. 1024x1024, transparent background.
```

## onboard-vocab.png - Onboarding slide 1: Ollie holding up a picture card (vocabulary)
- Canvas: 1024x1024, transparent background
- Attach: Ollie reference
```text
Same style bible. Same Ollie as the attached reference image. Ollie hoisting a giant blank cream picture card high in front of him with both wings (a rounded rectangle with a thick navy outline and a purple border band, as tall as his whole body), caught at the peak of a top-heavy teeter: he is up on tiptoes leaning back under the weight, one foot kicked up behind him, wobbling like he might topple, the orange scarf swinging forward. On the card, big and clear and filling most of it, is a single shiny red apple with a green leaf and a white glint, and nothing else (no text on the card). Expression: beak open in a proud "ta-da" grin, eyes huge and sparkling, eyebrows high, his face peeking out from beside the top of the card. Micro-gag: the apple's little green leaf is flapping like it is cheering too. Composition: centered, Ollie and the card together filling about 85% of the canvas, the apple instantly readable at 120 px wide, small flat oval ground shadow. 1024x1024, transparent background.
```
- Tip: If a word or letters appear on the card, add: "the card has no words, no letters, only the apple".

## onboard-speak.png - Onboarding slide 2: Ollie with microphone and sound waves (speaking)
- Canvas: 1024x1024, transparent background
- Attach: Ollie reference
```text
Same style bible. Same Ollie as the attached reference image. Ollie rocking out with a red microphone, caught at the peak of a dramatic lean-back: he holds a chunky red microphone (red head, cream handle, white glint) up to his beak with one wing, the other wing thrown into the air, one foot kicked up behind him like a rock star, the orange scarf flying. Bold, thick sound waves (three big curved arcs in yellow, orange and pink) blast out toward the image's right. Floating beside him, a big smiling cartoon mouth icon (a wide happy smile with a row of white teeth and a hot-pink tongue, thick navy outline, no realistic lips) hovering in the air with a few sparkles. Expression: eyes squeezed shut in a happy curve, beak wide open belting a word, eyebrows high, pink blush circles. Micro-gag: the floating mouth icon is copying Ollie: it tilts the same way as his head, like a little echo. Composition: centered, Ollie, the waves and the mouth icon together filling about 90% of the canvas, small flat oval ground shadow under Ollie. 1024x1024, transparent background.
```

## onboard-games.png - Onboarding slide 3: Ollie with a game controller and three stars (games)
- Canvas: 1024x1024, transparent background
- Attach: Ollie reference
```text
Same style bible. Same Ollie as the attached reference image. Ollie hammering a chunky game controller (sky-blue body with two fat grips, a d-pad, two round thumb sticks and four colorful round buttons in yellow, red, green and pink, with no symbols or text on them), held in both wings with the feather-fingers mashing the buttons. Peak moment: his whole body leans hard to one side as if the controller were a steering wheel, one foot off the ground, the orange scarf swinging the opposite way. Three big yellow stars with navy outlines pop up above him with small burst lines. Expression: intense and delighted: eyes locked forward with big glints, eyebrows pushed down in cheeky focus, the tip of a pink tongue sticking out of the corner of his beak. Micro-gag: the tongue sticks out and leans with the rest of him, as if he is steering with it. Composition: centered, Ollie and the three stars together filling about 85% of the canvas, small flat oval ground shadow. 1024x1024, transparent background.
```

## state-offline.png - Error screen when there is no internet connection
- Canvas: 1024x1024, transparent background
- Attach: Ollie reference
```text
Same style bible. Same Ollie as the attached reference image. Ollie holding up a thick unplugged cable end (a chunky plug with two metal prongs and a long curly cable that loops down and trails off in a spiral) in one wing and inspecting it, the other wing scratching the side of his head. Peak moment: his head is tilted hard to one side as he squints at the plug, the body leaning in, one foot lifted. Above him floats a tiny cloud drawn only with a dotted sky-blue outline, empty inside. Expression: puzzled but friendly: one eyebrow up and the other down, eyes glancing from the plug up to the cloud, the beak a small wobbly smile off to one side. Micro-gag: the plug throws off two or three tiny yellow sparkles, and both ear tufts are frizzed straight up like static electricity (cute and harmless, not scary). Composition: centered, Ollie and the cloud together filling about 85% of the canvas, small flat oval ground shadow. 1024x1024, transparent background.
```

## state-mic.png - Error screen when the microphone is unavailable or blocked
- Canvas: 1024x1024, transparent background
- Attach: Ollie reference
```text
Same style bible. Same Ollie as the attached reference image. Ollie giving a sheepish apologetic shrug, caught at the peak of the shrug: his shoulders squeezed up to his head, one wing holding a chunky red microphone (red head, cream handle) out to the side, the other wing raised with its palm-side up in a "sorry, not working" gesture, his head tilted and his knees bent. Floating beside the microphone is a small red circle with a diagonal slash across it (a "no" symbol, no letters inside). Expression: gentle apologetic smile, the beak a small crooked curve, eyebrows tilted up in the middle, big soft glints in the eyes, one small sweat drop on his forehead, pink blush circles. Micro-gag: the microphone head droops limply to one side like a wilted flower. Composition: centered, Ollie, the microphone and the slash symbol together filling about 85% of the canvas, small flat oval ground shadow. 1024x1024, transparent background.
```
- Tip: If the slash symbol turns into an X or a crossed-out microphone, ask for "a circle with exactly one diagonal slash, floating beside the microphone".

## state-empty.png - Empty list screen, nothing here yet
- Canvas: 1024x1024, transparent background
- Attach: Ollie reference
```text
Same style bible. Same Ollie as the attached reference image. Ollie popping up out of an empty open cardboard box (tangerine cardboard with cream inner flaps and a cream tape strip, thick navy outline, seen from the front and slightly above), caught at the peak of a curious peek: only his head, glasses, the top of his scarf and his two wings are above the front rim, the feather-fingers gripping the rim, his body leaning to one side as he looks around the empty space. The inside of the box visible on both sides of him is plainly empty: just flat cardboard, nothing in it. Expression: curious and hopeful: eyes wide and glancing to one side with big glints, one eyebrow raised, the beak a tiny "hm" curve. Micro-gag: one of the box flaps has flopped down over an ear tuft like a floppy hat brim. Composition: centered, the box and Ollie together filling about 85% of the canvas, small flat oval ground shadow under the box. 1024x1024, transparent background.
```

## ollie-part-body.png - OPTIONAL rig layer: torso and head without face parts, wings, scarf or tufts
- Canvas: 1024x1024, transparent background
- Attach: ollie-base
```text
Same style bible. Same Ollie as the attached reference image, which is the ollie-base pose. Draw ONLY the body layer of this exact Ollie, at the exact same size, angle and position it has in the attached image so it lines up when stacked with the other layers: the oversized purple scalloped-feather head and the round cream-bellied torso, WITHOUT eyes, beak, glasses, scarf, wings or ear tufts, plus the two tiny orange feet and the flat oval ground shadow (no other layer carries them). The face area where the eyes and beak go is plain smooth purple feathers, with only the pink blush circles and the two thick navy eyebrow strokes painted on, the eyebrows slightly raised as in the base. Draw every region COMPLETE even where it was hidden in the base: the neck behind the scarf, the shoulders behind both wings, the top of the head behind the ear tufts and the cowlick feather. Micro-gag: the slightly off-balance lean of the body and head is kept exactly as in the base. Composition: same position as ollie-base (centered on x=512, feet on the baseline y=900), nothing else in the picture. 1024x1024, fully transparent background.
```
- Tip: Experimental. If the result drifts from ollie-base in size or position, skip the ollie-part-* set and use the frame sets (blink, talk, wave, jump) instead. Quick check: put the part over ollie-base at 50% opacity in an image editor.

## ollie-part-wing-left.png - OPTIONAL rig layer: Ollie's left wing (the wing on the image's right)
- Canvas: 1024x1024, transparent background
- Attach: ollie-base
```text
Same style bible. Same Ollie as the attached reference image, which is the ollie-base pose. Draw ONLY Ollie's LEFT wing (the wing on the image's RIGHT side, hugging his side) at the exact same size, angle and position it has in the attached image, so it lines up when stacked with the other layers: a stubby noodle wing in electric purple with a darker flat shadow tone, ending in three feather-fingers. Draw it COMPLETE as a whole closed shape with its own outline all the way around, including the rounded shoulder end that is hidden behind the body and the scarf in the base. Micro-gag: the tip of one feather-finger curls up cheekily. Composition: same position as ollie-base, nothing else in the picture, no body, no shadow. 1024x1024, fully transparent background.
```
- Tip: Experimental. If the result drifts from ollie-base in size or position, skip the ollie-part-* set and use the frame sets (blink, talk, wave, jump) instead.

## ollie-part-wing-right.png - OPTIONAL rig layer: Ollie's right wing (the wing on the image's left)
- Canvas: 1024x1024, transparent background
- Attach: ollie-base
```text
Same style bible. Same Ollie as the attached reference image, which is the ollie-base pose. Draw ONLY Ollie's RIGHT wing (the wing on the image's LEFT side, hanging low and slightly out from his body with its three feather-fingers curling) at the exact same size, angle and position it has in the attached image, so it lines up when stacked with the other layers: a stubby noodle wing in electric purple with a darker flat shadow tone. Draw it COMPLETE as a whole closed shape with its own outline all the way around, including the rounded shoulder end that is hidden behind the body and the scarf in the base. Micro-gag: the middle feather-finger is bent like a tiny hook. Composition: same position as ollie-base, nothing else in the picture, no body, no shadow. 1024x1024, fully transparent background.
```
- Tip: Experimental. If the result drifts from ollie-base in size or position, skip the ollie-part-* set and use the frame sets (blink, talk, wave, jump) instead.

## ollie-part-eyes.png - OPTIONAL rig layer: both eyeballs with pupils and glints
- Canvas: 1024x1024, transparent background
- Attach: ollie-base
```text
Same style bible. Same Ollie as the attached reference image, which is the ollie-base pose. Draw ONLY Ollie's two eyeballs at the exact same size and position they have in the attached image, so they line up when stacked with the other layers: two big round white eyes with a thick navy outline (each about 150 px across, centered near (400, 385) and (625, 405)), each with an oversized dark navy pupil glancing slightly toward the image's right, and glossy white glints. Draw both eyes as COMPLETE full circles, including the parts that are covered by the glasses rims, the eyelids and the eyebrows in the base. Expression: wide open and bright, as in the base. Micro-gag: each glint is one big round highlight plus one tiny star-shaped highlight. Composition: same position as ollie-base, nothing else in the picture (no glasses, no head, no eyelids). 1024x1024, fully transparent background.
```
- Tip: Experimental. If the result drifts from ollie-base in size or position, skip the ollie-part-* set and use the frame sets (blink, talk, wave, jump) instead.

## ollie-part-eyelids.png - OPTIONAL rig layer: both eyelids in the closed position
- Canvas: 1024x1024, transparent background
- Attach: ollie-base
```text
Same style bible. Same Ollie as the attached reference image, which is the ollie-base pose. Draw ONLY Ollie's two eyelids, in the fully CLOSED position, at the exact same size and position as the two eyeballs in the attached image (each about 150 px across, centered near (400, 385) and (625, 405)), so the app can slide them open and shut over the eyes: two round lid shapes in the same electric purple as his head feathers with a thick navy outline, each crossed by one thick navy happy curve (an upside-down U, like a smile). Draw each lid as a COMPLETE full shape. Expression: serene and happy when closed. Micro-gag: each curve ends in two tiny cartoon lash flicks at the outer corner. Composition: same position as ollie-base, nothing else in the picture (no eyes, no glasses, no head). 1024x1024, fully transparent background.
```
- Tip: Experimental. If the result drifts from ollie-base in size or position, skip the ollie-part-* set and use the frame sets (blink, talk, wave, jump) instead. This layer shows the CLOSED state on purpose, so stacking all layers will look like a blink unless the lids are hidden.

## ollie-part-beak-closed.png - OPTIONAL rig layer: beak in the closed position
- Canvas: 1024x1024, transparent background
- Attach: ollie-base
```text
Same style bible. Same Ollie as the attached reference image, which is the ollie-base pose. Draw ONLY Ollie's tiny orange beak, closed, at the exact same size, angle and position it has in the attached image (tip near (518, 490), between the glasses lenses), so it lines up when stacked with the other layers: a small rounded orange beak with a flat darker-orange shadow tone, shut in a small curved smile line. Draw it COMPLETE, including the root of the beak that is hidden behind the glasses bridge and under the eyebrows in the base. Expression: cheeky, friendly. Micro-gag: a tiny dimple tick at the curled end of the smile and one small white glint on the beak. Composition: same position as ollie-base, nothing else in the picture. 1024x1024, fully transparent background.
```
- Tip: Experimental. If the result drifts from ollie-base in size or position, skip the ollie-part-* set and use the frame sets (blink, talk, wave, jump) instead.

## ollie-part-beak-open.png - OPTIONAL rig layer: beak in the open position
- Canvas: 1024x1024, transparent background
- Attach: ollie-base
```text
Same style bible. Same Ollie as the attached reference image, which is the ollie-base pose. Draw ONLY Ollie's tiny orange beak, wide open, at the exact same size and position as the closed beak in the attached image, so it swaps with the closed-beak layer without any jump: the upper beak has exactly the same shape, root and tip position as the closed beak (tip near (518, 490)), and the lower beak drops about 80 px (same as the ollie-talk-wide frame) and stretches rubbery, showing a dark red mouth with a fat hot-pink tongue inside. Draw it COMPLETE, including the root of the beak that is hidden behind the glasses bridge and under the eyebrows in the base. Expression: loud and cheerful, mid-word. Micro-gag: the tongue tip curls up like a happy worm. Composition: same position as ollie-base, nothing else in the picture. 1024x1024, fully transparent background.
```
- Tip: Experimental. If the result drifts from ollie-base in size or position, skip the ollie-part-* set and use the frame sets (blink, talk, wave, jump) instead.

## ollie-part-glasses.png - OPTIONAL rig layer: the crooked round yellow glasses
- Canvas: 1024x1024, transparent background
- Attach: ollie-base
```text
Same style bible. Same Ollie as the attached reference image, which is the ollie-base pose. Draw ONLY Ollie's big round yellow-framed glasses at the exact same size, angle and position they have in the attached image, so they line up when stacked with the other layers: two thick sunny-yellow rims with navy outlines (each lens about 190 px across, centered near (400, 385) and (625, 405), so the image-left lens sits a little higher), a short bridge between them, and the small side arms that run back toward the sides of the head. The lenses are completely EMPTY transparent holes (see-through, not white, not grey, not filled), each with only one diagonal white glint streak on the rim side. Draw the whole frame COMPLETE with outlines all the way around. Expression: none, but the glasses stay slightly crooked and slid a hair too low as in the base. Micro-gag: a tiny star-shaped sparkle on the top of one rim. Composition: same position as ollie-base, nothing else in the picture (no eyes, no head). 1024x1024, fully transparent background.
```
- Tip: Experimental. If the result drifts from ollie-base in size or position, skip the ollie-part-* set and use the frame sets (blink, talk, wave, jump) instead. If the lenses come out filled or with a checkerboard baked in, repeat with: "the inside of each lens is an empty hole with nothing drawn in it".

## ollie-part-scarf.png - OPTIONAL rig layer: the fluttering orange scarf
- Canvas: 1024x1024, transparent background
- Attach: ollie-base
```text
Same style bible. Same Ollie as the attached reference image, which is the ollie-base pose. Draw ONLY Ollie's orange scarf at the exact same size, angle and position it has in the attached image (the band around the neck at about y=590 to y=650, with the tail fluttering out toward the image's left), so it lines up when stacked with the other layers: tangerine orange with a darker flat shadow tone and two cream stripes near the end of the tail. Draw it COMPLETE, including the back part of the loop that passes behind the neck and the portions that are hidden behind the head, the belly and the wings in the base, with a clean outline around every edge. Expression: none, but the tail looks lively. Micro-gag: the tip of the tail curls into a tiny loop like a pig tail. Composition: same position as ollie-base, nothing else in the picture. 1024x1024, fully transparent background.
```
- Tip: Experimental. If the result drifts from ollie-base in size or position, skip the ollie-part-* set and use the frame sets (blink, talk, wave, jump) instead.

## ollie-part-tuft.png - OPTIONAL rig layer: the two ear tufts and the cowlick feather
- Canvas: 1024x1024, transparent background
- Attach: ollie-base
```text
Same style bible. Same Ollie as the attached reference image, which is the ollie-base pose. Draw ONLY Ollie's two floppy ear tufts and the single cowlick feather between them, at the exact same size, angle and position they have in the attached image (tuft roots near the top corners of the head at about (310, 215) and (715, 215), the cowlick standing straight up at about (512, 200), the tufts rise from their roots and then flop outward, and the highest points of the tufts and the cowlick tip reach about y=150), so they line up when stacked with the other layers: electric-purple feathers with a darker flat shadow tone and thick navy outlines. Draw every tuft and the cowlick COMPLETE, including the root ends that are hidden inside the top of the head in the base, each with a clean outline all the way around. Expression: none, but the tufts look springy. Micro-gag: the cowlick feather is stubbornly straight while both tufts flop outward. Composition: same position as ollie-base, nothing else in the picture. 1024x1024, fully transparent background.
```
- Tip: Experimental. If the result drifts from ollie-base in size or position, skip the ollie-part-* set and use the frame sets (blink, talk, wave, jump) instead.
