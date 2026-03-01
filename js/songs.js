// ============================================================
// SONG LIBRARY — 90s Country Hits
// Each song has BPM, chord progression, strumPattern, and lyrics
// ============================================================

// Common strumming patterns (8 positions = 8th notes in one 4/4 measure)
// 'D' = downstroke, 'U' = upstroke, '' = rest/skip
const STRUM = {
  COUNTRY:  ['D', '', 'D', 'U', '', 'U', 'D', 'U'],  // standard country
  BALLAD:   ['D', '', '', 'U', 'D', '', '', 'U'],      // slow ballad
  SHUFFLE:  ['D', '', 'D', 'U', '', 'D', 'U', ''],     // honky-tonk shuffle
  DRIVING:  ['D', 'D', 'U', 'D', 'U', 'D', 'U', 'D'], // uptempo driving
  WALTZ:    ['D', 'D', 'U', '', 'D', 'U', 'D', 'U'],  // country waltz feel
};

function repeatPattern(pattern, times) {
  const result = [];
  for (let i = 0; i < times; i++) result.push(...pattern);
  return result;
}

const SONGS = [
  // ----------------------------------------------------------------
  {
    id: 'friends-in-low-places',
    title: 'Friends in Low Places',
    artist: 'Garth Brooks',
    year: 1990,
    bpm: 80,
    key: 'G',
    capo: null,
    difficulty: 'beginner',
    chordsUsed: ['G', 'A7', 'D7'],
    description: 'One of the most iconic country songs ever! Perfect for beginners — only 3 chords.',
    strumPattern: STRUM.COUNTRY,
    strumLabel: 'Standard Country (D - DU - UDUDU)',
    tips: [
      'This song uses a classic I–II7–V7 progression in G major.',
      'The strumming pattern is D – DU – UDU. Start with just downstrokes on beats 1-2-3-4.',
      'Practice switching from G to A7 — that\'s the trickiest transition.',
    ],
    progression: [
      // Intro
      { chord: 'G',  beats: 4, section: 'Intro', lyric: '' },
      { chord: 'G',  beats: 4, section: 'Intro', lyric: '' },
      { chord: 'A7', beats: 4, section: 'Intro', lyric: '' },
      { chord: 'A7', beats: 4, section: 'Intro', lyric: '' },
      { chord: 'D7', beats: 4, section: 'Intro', lyric: '' },
      { chord: 'D7', beats: 4, section: 'Intro', lyric: '' },
      { chord: 'G',  beats: 4, section: 'Intro', lyric: '' },
      { chord: 'G',  beats: 4, section: 'Intro', lyric: '' },
      // Verse 1
      { chord: 'G',  beats: 4, section: 'Verse', lyric: 'Blame it all on my roots' },
      { chord: 'G',  beats: 4, section: 'Verse', lyric: 'I showed up in boots' },
      { chord: 'A7', beats: 4, section: 'Verse', lyric: 'And ruined your black tie affair' },
      { chord: 'A7', beats: 4, section: 'Verse', lyric: '' },
      { chord: 'D7', beats: 4, section: 'Verse', lyric: 'The last one to know' },
      { chord: 'D7', beats: 4, section: 'Verse', lyric: 'The last one to show' },
      { chord: 'G',  beats: 4, section: 'Verse', lyric: 'I was the last one you thought' },
      { chord: 'G',  beats: 4, section: 'Verse', lyric: "you'd see there" },
      // Verse 2
      { chord: 'G',  beats: 4, section: 'Verse', lyric: 'And I saw the surprise' },
      { chord: 'G',  beats: 4, section: 'Verse', lyric: 'And the fear in his eyes' },
      { chord: 'A7', beats: 4, section: 'Verse', lyric: 'When I took his glass of champagne' },
      { chord: 'A7', beats: 4, section: 'Verse', lyric: '' },
      { chord: 'D7', beats: 4, section: 'Verse', lyric: 'And I toasted you' },
      { chord: 'D7', beats: 4, section: 'Verse', lyric: "Said 'Honey, we may be through'" },
      { chord: 'G',  beats: 4, section: 'Verse', lyric: "But you'll never hear me complain" },
      { chord: 'G',  beats: 4, section: 'Verse', lyric: '' },
      // Chorus x2
      ...repeatPattern([
        { chord: 'G',  beats: 4, section: 'Chorus', lyric: "I've got friends in low places" },
        { chord: 'G',  beats: 4, section: 'Chorus', lyric: 'Where the whiskey drowns' },
        { chord: 'A7', beats: 4, section: 'Chorus', lyric: 'And the beer chases my blues away' },
        { chord: 'A7', beats: 4, section: 'Chorus', lyric: '' },
        { chord: 'D7', beats: 4, section: 'Chorus', lyric: "And I'll be okay" },
        { chord: 'D7', beats: 4, section: 'Chorus', lyric: "I'm not big on social graces" },
        { chord: 'G',  beats: 4, section: 'Chorus', lyric: "Think I'll slip on down to the oasis" },
        { chord: 'G',  beats: 4, section: 'Chorus', lyric: "Oh, I've got friends in low places" },
      ], 2),
    ]
  },

  // ----------------------------------------------------------------
  {
    id: 'achy-breaky-heart',
    title: 'Achy Breaky Heart',
    artist: 'Billy Ray Cyrus',
    year: 1992,
    bpm: 128,
    key: 'A',
    capo: null,
    difficulty: 'beginner',
    chordsUsed: ['A', 'E'],
    description: 'Only 2 chords! Great for absolute beginners. Fast tempo — great rhythm practice.',
    strumPattern: STRUM.DRIVING,
    strumLabel: 'Driving (DU DU DU DU)',
    tips: [
      'Just two chords — A and E. Perfect for building chord-change speed.',
      'Use a driving DU DU DU DU strum to match the energetic feel.',
      'Focus on clean transitions; at this tempo, speed matters!',
    ],
    progression: [
      // Verse x4
      ...repeatPattern([
        { chord: 'A', beats: 4, section: 'Verse', lyric: "You can tell the world you never was my girl" },
        { chord: 'A', beats: 4, section: 'Verse', lyric: "You can burn my clothes when I'm gone" },
        { chord: 'E', beats: 4, section: 'Verse', lyric: "Or you can tell your friends just what a fool I've been" },
        { chord: 'E', beats: 4, section: 'Verse', lyric: "And laugh and joke about me on the phone" },
      ], 2),
      // Chorus x2
      ...repeatPattern([
        { chord: 'A', beats: 4, section: 'Chorus', lyric: "Don't tell my heart, my achy breaky heart" },
        { chord: 'A', beats: 4, section: 'Chorus', lyric: "I just don't think he'd understand" },
        { chord: 'E', beats: 4, section: 'Chorus', lyric: "And if you tell my heart, my achy breaky heart" },
        { chord: 'E', beats: 4, section: 'Chorus', lyric: "He might blow up and kill this man" },
      ], 2),
      // Verse 2 x2
      ...repeatPattern([
        { chord: 'A', beats: 4, section: 'Verse', lyric: "You can tell your Ma I moved to Arkansas" },
        { chord: 'A', beats: 4, section: 'Verse', lyric: "You can tell your dog to bite my leg" },
        { chord: 'E', beats: 4, section: 'Verse', lyric: "Or tell your brother Cliff whose fist can tell my lip" },
        { chord: 'E', beats: 4, section: 'Verse', lyric: "He never really liked me anyway" },
      ], 2),
      // Chorus x2
      ...repeatPattern([
        { chord: 'A', beats: 4, section: 'Chorus', lyric: "Don't tell my heart, my achy breaky heart" },
        { chord: 'A', beats: 4, section: 'Chorus', lyric: "I just don't think he'd understand" },
        { chord: 'E', beats: 4, section: 'Chorus', lyric: "And if you tell my heart, my achy breaky heart" },
        { chord: 'E', beats: 4, section: 'Chorus', lyric: "He might blow up and kill this man" },
      ], 2),
      // Outro
      { chord: 'A', beats: 2, section: 'Outro', lyric: "Ooh achy" },
      { chord: 'E', beats: 2, section: 'Outro', lyric: "breaky heart" },
      { chord: 'A', beats: 4, section: 'Outro', lyric: '' },
      { chord: 'A', beats: 2, section: 'Outro', lyric: "Ooh achy" },
      { chord: 'E', beats: 2, section: 'Outro', lyric: "breaky heart" },
      { chord: 'A', beats: 4, section: 'Outro', lyric: '' },
    ]
  },

  // ----------------------------------------------------------------
  {
    id: 'chattahoochee',
    title: 'Chattahoochee',
    artist: 'Alan Jackson',
    year: 1993,
    bpm: 148,
    key: 'E',
    capo: null,
    difficulty: 'beginner',
    chordsUsed: ['E', 'A', 'B7'],
    description: 'A rollicking country classic! Fast and fun — a great test of your chord changes.',
    strumPattern: STRUM.SHUFFLE,
    strumLabel: 'Honky-Tonk Shuffle (D - DU - DU -)',
    tips: [
      'Classic I–IV–V7 progression in E major.',
      'Use a honky-tonk shuffle: D – DU – DU for that rollicking feel.',
      'The B7 can be tricky — practice it slowly before playing up to speed.',
    ],
    progression: [
      // Intro
      { chord: 'E',  beats: 4, section: 'Intro', lyric: '' },
      { chord: 'A',  beats: 4, section: 'Intro', lyric: '' },
      { chord: 'E',  beats: 4, section: 'Intro', lyric: '' },
      { chord: 'B7', beats: 4, section: 'Intro', lyric: '' },
      // Verse x2
      ...repeatPattern([
        { chord: 'E',  beats: 4, section: 'Verse', lyric: 'Way down yonder on the Chattahoochee' },
        { chord: 'A',  beats: 4, section: 'Verse', lyric: 'It gets hotter than a hoochie coochie' },
        { chord: 'E',  beats: 4, section: 'Verse', lyric: 'We laid rubber on the Georgia asphalt' },
        { chord: 'B7', beats: 4, section: 'Verse', lyric: "We got a little crazy but we never got caught" },
        { chord: 'E',  beats: 4, section: 'Verse', lyric: 'Down by the river on a Friday night' },
        { chord: 'A',  beats: 4, section: 'Verse', lyric: 'Pyramid of cans in the pale moonlight' },
        { chord: 'B7', beats: 4, section: 'Verse', lyric: "Talking 'bout cars and dreaming 'bout women" },
        { chord: 'E',  beats: 4, section: 'Verse', lyric: "Never had a plan just a-livin' for the minute" },
      ], 2),
      // Chorus x2
      ...repeatPattern([
        { chord: 'A',  beats: 4, section: 'Chorus', lyric: 'Yeah way down yonder on the Chattahoochee' },
        { chord: 'E',  beats: 4, section: 'Chorus', lyric: "Never knew how much that muddy water meant to me" },
        { chord: 'A',  beats: 4, section: 'Chorus', lyric: "But I learned how to swim and I learned who I was" },
        { chord: 'B7', beats: 4, section: 'Chorus', lyric: "A lot about living and a little 'bout love" },
        { chord: 'E',  beats: 4, section: 'Chorus', lyric: "A lot about living" },
        { chord: 'A',  beats: 4, section: 'Chorus', lyric: "And a little 'bout love" },
        { chord: 'B7', beats: 2, section: 'Chorus', lyric: '' },
        { chord: 'E',  beats: 2, section: 'Chorus', lyric: '' },
        { chord: 'E',  beats: 4, section: 'Chorus', lyric: '' },
      ], 2),
    ]
  },

  // ----------------------------------------------------------------
  {
    id: 'wide-open-spaces',
    title: 'Wide Open Spaces',
    artist: 'Dixie Chicks',
    year: 1998,
    bpm: 86,
    key: 'G',
    capo: null,
    difficulty: 'intermediate',
    chordsUsed: ['G', 'D', 'Em', 'C'],
    description: 'A beautiful, flowing song. Four chords — the classic I–V–vi–IV progression.',
    strumPattern: STRUM.COUNTRY,
    strumLabel: 'Standard Country (D - DU - UDU)',
    tips: [
      'The G–D–Em–C progression is one of the most popular in all of music!',
      'Practice smooth, flowing transitions between all four chords.',
      'Try a fingerpicking pattern instead of strumming for this ballad.',
    ],
    progression: [
      // Intro x2
      ...repeatPattern([
        { chord: 'G',  beats: 4, section: 'Intro', lyric: '' },
        { chord: 'D',  beats: 4, section: 'Intro', lyric: '' },
        { chord: 'Em', beats: 4, section: 'Intro', lyric: '' },
        { chord: 'C',  beats: 4, section: 'Intro', lyric: '' },
      ], 2),
      // Verse x2
      ...repeatPattern([
        { chord: 'G',  beats: 4, section: 'Verse', lyric: "Who doesn't know what I'm talking about" },
        { chord: 'D',  beats: 4, section: 'Verse', lyric: "Who's never left home, who's never struck out" },
        { chord: 'Em', beats: 4, section: 'Verse', lyric: "To find a dream and a life of their own" },
        { chord: 'C',  beats: 4, section: 'Verse', lyric: "A place in the clouds, a foundation of stone" },
        { chord: 'G',  beats: 4, section: 'Verse', lyric: "Many precede and many will follow" },
        { chord: 'D',  beats: 4, section: 'Verse', lyric: "A young girl's dreams no longer hollow" },
        { chord: 'C',  beats: 4, section: 'Verse', lyric: "It takes the shape of a place out west" },
        { chord: 'C',  beats: 4, section: 'Verse', lyric: "But what it holds for her, she hasn't yet guessed" },
      ], 2),
      // Chorus x2
      ...repeatPattern([
        { chord: 'G',  beats: 4, section: 'Chorus', lyric: "She needs wide open spaces" },
        { chord: 'D',  beats: 4, section: 'Chorus', lyric: "Room to make her big mistakes" },
        { chord: 'Em', beats: 4, section: 'Chorus', lyric: "She needs new faces" },
        { chord: 'C',  beats: 4, section: 'Chorus', lyric: "She knows the high stakes" },
        { chord: 'G',  beats: 4, section: 'Chorus', lyric: "She needs wide open spaces" },
        { chord: 'D',  beats: 4, section: 'Chorus', lyric: "Room to make her big mistakes" },
        { chord: 'Em', beats: 4, section: 'Chorus', lyric: "She needs new faces" },
        { chord: 'C',  beats: 4, section: 'Chorus', lyric: "She knows the high stakes" },
      ], 2),
    ]
  },

  // ----------------------------------------------------------------
  {
    id: 'strawberry-wine',
    title: 'Strawberry Wine',
    artist: 'Deana Carter',
    year: 1996,
    bpm: 82,
    key: 'D',
    capo: null,
    difficulty: 'intermediate',
    chordsUsed: ['D', 'G', 'A', 'Em'],
    description: 'A timeless country ballad. Beautiful chord progressions — great for developing feel.',
    strumPattern: STRUM.BALLAD,
    strumLabel: 'Slow Ballad (D - - U D - - U)',
    tips: [
      'Slow and soulful — focus on feel over speed.',
      'Use a gentle down-up ballad strum: D – – U D – – U.',
      'The verse uses D–G–A, and the chorus adds Em for emotional depth.',
    ],
    progression: [
      // Verse x2
      ...repeatPattern([
        { chord: 'D',  beats: 4, section: 'Verse', lyric: "He was working through college" },
        { chord: 'G',  beats: 4, section: 'Verse', lyric: "On my grandpa's farm" },
        { chord: 'A',  beats: 4, section: 'Verse', lyric: "I was thirsting for knowledge" },
        { chord: 'D',  beats: 4, section: 'Verse', lyric: "And he had a car" },
        { chord: 'D',  beats: 4, section: 'Verse', lyric: "I was caught somewhere between" },
        { chord: 'G',  beats: 4, section: 'Verse', lyric: "A woman and a child" },
        { chord: 'A',  beats: 4, section: 'Verse', lyric: "One restless summer we found love" },
        { chord: 'D',  beats: 4, section: 'Verse', lyric: "Growing wild" },
      ], 2),
      // Chorus x2
      ...repeatPattern([
        { chord: 'D',  beats: 4, section: 'Chorus', lyric: "Strawberry wine" },
        { chord: 'G',  beats: 4, section: 'Chorus', lyric: "Seventeen" },
        { chord: 'A',  beats: 4, section: 'Chorus', lyric: "The hot July moon saw everything" },
        { chord: 'Em', beats: 4, section: 'Chorus', lyric: '' },
        { chord: 'D',  beats: 4, section: 'Chorus', lyric: "My first taste of love" },
        { chord: 'G',  beats: 4, section: 'Chorus', lyric: "Oh bittersweet" },
        { chord: 'A',  beats: 4, section: 'Chorus', lyric: "Green on the vine" },
        { chord: 'D',  beats: 4, section: 'Chorus', lyric: "Like strawberry wine" },
      ], 2),
      // Bridge
      { chord: 'G',  beats: 4, section: 'Bridge', lyric: "The fields have grown over now" },
      { chord: 'A',  beats: 4, section: 'Bridge', lyric: "Years since I've been back" },
      { chord: 'G',  beats: 4, section: 'Bridge', lyric: "But I remember clear as it gets" },
      { chord: 'D',  beats: 4, section: 'Bridge', lyric: "That hot July" },
      // Chorus x1
      { chord: 'D',  beats: 4, section: 'Chorus', lyric: "Strawberry wine" },
      { chord: 'G',  beats: 4, section: 'Chorus', lyric: "Seventeen" },
      { chord: 'A',  beats: 4, section: 'Chorus', lyric: "The hot July moon saw everything" },
      { chord: 'Em', beats: 4, section: 'Chorus', lyric: '' },
      { chord: 'D',  beats: 4, section: 'Chorus', lyric: "My first taste of love" },
      { chord: 'G',  beats: 4, section: 'Chorus', lyric: "Oh bittersweet" },
      { chord: 'A',  beats: 4, section: 'Chorus', lyric: "Green on the vine" },
      { chord: 'D',  beats: 4, section: 'Chorus', lyric: "Like strawberry wine" },
    ]
  },

  // ----------------------------------------------------------------
  {
    id: 'boot-scootin-boogie',
    title: "Boot Scootin' Boogie",
    artist: 'Brooks & Dunn',
    year: 1992,
    bpm: 145,
    key: 'E',
    capo: null,
    difficulty: 'intermediate',
    chordsUsed: ['E', 'A', 'B7'],
    description: 'A high-energy honky-tonk classic. Same chords as Chattahoochee but faster and more driving!',
    strumPattern: STRUM.DRIVING,
    strumLabel: 'Driving Country (DU DU DU DU)',
    tips: [
      'Similar to Chattahoochee but with more drive. Keep your strumming tight.',
      'Drive it hard: DU DU DU DU — all 8th notes for maximum energy.',
      'This song is great for building chord-change muscle memory.',
    ],
    progression: [
      // Intro
      ...repeatPattern([
        { chord: 'E',  beats: 2, section: 'Intro', lyric: '' },
        { chord: 'E',  beats: 2, section: 'Intro', lyric: '' },
        { chord: 'A',  beats: 2, section: 'Intro', lyric: '' },
        { chord: 'A',  beats: 2, section: 'Intro', lyric: '' },
        { chord: 'B7', beats: 2, section: 'Intro', lyric: '' },
        { chord: 'B7', beats: 2, section: 'Intro', lyric: '' },
        { chord: 'E',  beats: 2, section: 'Intro', lyric: '' },
        { chord: 'E',  beats: 2, section: 'Intro', lyric: '' },
      ], 1),
      // Verse x3
      ...repeatPattern([
        { chord: 'E',  beats: 4, section: 'Verse', lyric: "Out in the country past the city limits sign" },
        { chord: 'E',  beats: 4, section: 'Verse', lyric: "Well there's a honky-tonk near the county line" },
        { chord: 'A',  beats: 4, section: 'Verse', lyric: "The joint starts jumping every night when the sun goes down" },
        { chord: 'A',  beats: 4, section: 'Verse', lyric: "They got whiskey, women, music, and smoke" },
        { chord: 'B7', beats: 4, section: 'Verse', lyric: "It's where all the cowboy folk go" },
        { chord: 'A',  beats: 4, section: 'Verse', lyric: "To boot scootin' boogie" },
        { chord: 'E',  beats: 4, section: 'Verse', lyric: '' },
        { chord: 'E',  beats: 4, section: 'Verse', lyric: '' },
      ], 3),
      // Chorus x2
      ...repeatPattern([
        { chord: 'E',  beats: 2, section: 'Chorus', lyric: "Yeah, heel-toe" },
        { chord: 'A',  beats: 2, section: 'Chorus', lyric: "dosey doe" },
        { chord: 'E',  beats: 2, section: 'Chorus', lyric: "Come on baby" },
        { chord: 'B7', beats: 2, section: 'Chorus', lyric: "let's go boot scootin'" },
        { chord: 'E',  beats: 4, section: 'Chorus', lyric: "Cadillac, black-jack" },
        { chord: 'A',  beats: 4, section: 'Chorus', lyric: "baby meet me out back" },
        { chord: 'B7', beats: 2, section: 'Chorus', lyric: "We're gonna boogie" },
        { chord: 'E',  beats: 2, section: 'Chorus', lyric: "on the Boone County Line" },
        { chord: 'E',  beats: 4, section: 'Chorus', lyric: "Boot scootin' boogie" },
      ], 2),
    ]
  },

  // ----------------------------------------------------------------
  {
    id: 'man-i-feel-like-a-woman',
    title: 'Man! I Feel Like a Woman!',
    artist: 'Shania Twain',
    year: 1999,
    bpm: 126,
    key: 'A',
    capo: null,
    difficulty: 'intermediate',
    chordsUsed: ['A', 'D', 'E'],
    description: 'A fun, upbeat anthem with big guitar energy. Three power chords drive this hit.',
    strumPattern: STRUM.WALTZ,
    strumLabel: 'Rock Country (D D - DU DU DU)',
    tips: [
      'Three-chord rock/country crossover — great for building speed.',
      'Shania\'s version has a rock feel — punch each chord change.',
      'Focus on the rhythmic power of the chord changes.',
    ],
    progression: [
      // Intro
      ...repeatPattern([
        { chord: 'A', beats: 4, section: 'Intro', lyric: '' },
        { chord: 'D', beats: 4, section: 'Intro', lyric: '' },
        { chord: 'E', beats: 4, section: 'Intro', lyric: '' },
        { chord: 'A', beats: 4, section: 'Intro', lyric: '' },
      ], 1),
      // Verse x2
      ...repeatPattern([
        { chord: 'A', beats: 4, section: 'Verse', lyric: "I'm going out tonight, I'm feeling alright" },
        { chord: 'A', beats: 4, section: 'Verse', lyric: "Gonna let it all hang out" },
        { chord: 'D', beats: 4, section: 'Verse', lyric: "Wanna make some noise, really raise my voice" },
        { chord: 'E', beats: 4, section: 'Verse', lyric: "Yeah, I wanna scream and shout" },
        { chord: 'A', beats: 4, section: 'Verse', lyric: "No inhibitions, make no conditions" },
        { chord: 'A', beats: 4, section: 'Verse', lyric: "Get a little out of line" },
        { chord: 'D', beats: 4, section: 'Verse', lyric: "I ain't gonna act politically correct" },
        { chord: 'E', beats: 4, section: 'Verse', lyric: "I only wanna have a good time" },
      ], 2),
      // Chorus x3
      ...repeatPattern([
        { chord: 'A', beats: 2, section: 'Chorus', lyric: "Man! I feel" },
        { chord: 'D', beats: 2, section: 'Chorus', lyric: "like a woman!" },
        { chord: 'E', beats: 2, section: 'Chorus', lyric: "The best thing" },
        { chord: 'A', beats: 2, section: 'Chorus', lyric: "about being a woman" },
        { chord: 'A', beats: 4, section: 'Chorus', lyric: "Is the prerogative to have a little fun" },
        { chord: 'D', beats: 4, section: 'Chorus', lyric: "Oh, oh, oh, go totally crazy" },
        { chord: 'E', beats: 2, section: 'Chorus', lyric: "Forget I'm a lady" },
        { chord: 'E', beats: 2, section: 'Chorus', lyric: "Men's shirts, short skirts" },
        { chord: 'A', beats: 4, section: 'Chorus', lyric: "Man! I feel like a woman!" },
      ], 3),
    ]
  },

  // ----------------------------------------------------------------
  {
    id: 'i-cross-my-heart',
    title: 'I Cross My Heart',
    artist: 'George Strait',
    year: 1992,
    bpm: 72,
    key: 'E',
    capo: null,
    difficulty: 'beginner',
    chordsUsed: ['E', 'A', 'B7'],
    description: "George Strait's signature ballad. Slow and soulful — perfect for learning feeling and timing.",
    strumPattern: STRUM.BALLAD,
    strumLabel: 'Slow Ballad (D - - U D - - U)',
    tips: [
      'At 72 BPM, you have plenty of time to make clean chord changes.',
      'Use a gentle ballad strum: D – – U D – – U. Let it breathe.',
      'Focus on letting each chord ring out fully and clearly.',
    ],
    progression: [
      // Intro
      { chord: 'E',  beats: 4, section: 'Intro', lyric: '' },
      { chord: 'A',  beats: 4, section: 'Intro', lyric: '' },
      { chord: 'E',  beats: 4, section: 'Intro', lyric: '' },
      { chord: 'B7', beats: 4, section: 'Intro', lyric: '' },
      // Verse x2
      ...repeatPattern([
        { chord: 'E',  beats: 4, section: 'Verse', lyric: "Our love is unconditional" },
        { chord: 'A',  beats: 4, section: 'Verse', lyric: "We knew it from the start" },
        { chord: 'E',  beats: 4, section: 'Verse', lyric: "I see it in your eyes" },
        { chord: 'B7', beats: 4, section: 'Verse', lyric: "You can feel it from my heart" },
        { chord: 'E',  beats: 4, section: 'Verse', lyric: "From here on after" },
        { chord: 'A',  beats: 4, section: 'Verse', lyric: "Let's stay the way we are" },
        { chord: 'B7', beats: 4, section: 'Verse', lyric: "You are and always will be" },
        { chord: 'E',  beats: 4, section: 'Verse', lyric: "The keeper of my heart" },
      ], 2),
      // Chorus x2
      ...repeatPattern([
        { chord: 'A',  beats: 4, section: 'Chorus', lyric: "And I cross my heart" },
        { chord: 'E',  beats: 4, section: 'Chorus', lyric: "And promise to" },
        { chord: 'A',  beats: 4, section: 'Chorus', lyric: "Give all I've got to give" },
        { chord: 'B7', beats: 4, section: 'Chorus', lyric: "To make all your dreams come true" },
        { chord: 'E',  beats: 4, section: 'Chorus', lyric: "In all the world" },
        { chord: 'A',  beats: 4, section: 'Chorus', lyric: "You'll never find" },
        { chord: 'B7', beats: 4, section: 'Chorus', lyric: "A love as true as mine" },
        { chord: 'E',  beats: 4, section: 'Chorus', lyric: '' },
      ], 2),
      // Outro
      { chord: 'A',  beats: 4, section: 'Outro', lyric: "And I cross my heart" },
      { chord: 'B7', beats: 4, section: 'Outro', lyric: '' },
      { chord: 'E',  beats: 4, section: 'Outro', lyric: '' },
      { chord: 'E',  beats: 4, section: 'Outro', lyric: '' },
    ]
  }
];

function getDifficultyStars(difficulty) {
  const map = { beginner: '★★☆☆☆', intermediate: '★★★☆☆', expert: '★★★★★' };
  return map[difficulty] || '★★☆☆☆';
}
