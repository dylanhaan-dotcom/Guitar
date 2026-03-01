// ============================================================
// SONG LIBRARY — 90s Country Hits
// Each song has BPM, chord progression, and section labels
// ============================================================

// Helper: repeat a pattern array N times
function repeatPattern(pattern, times) {
  const result = [];
  for (let i = 0; i < times; i++) result.push(...pattern);
  return result;
}

const SONGS = [
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
    tips: [
      'This song uses a classic I–II7–V7 progression in G major.',
      'The strumming pattern is mostly downstrokes on the beat.',
      'Practice switching from G to A7 — that\'s the trickiest transition.',
    ],
    progression: [
      ...repeatPattern([
        { chord: 'G',  beats: 4, section: 'Intro' },
        { chord: 'G',  beats: 4, section: 'Intro' },
        { chord: 'A7', beats: 4, section: 'Intro' },
        { chord: 'A7', beats: 4, section: 'Intro' },
        { chord: 'D7', beats: 4, section: 'Intro' },
        { chord: 'D7', beats: 4, section: 'Intro' },
        { chord: 'G',  beats: 4, section: 'Intro' },
        { chord: 'G',  beats: 4, section: 'Intro' },
      ], 1),
      ...repeatPattern([
        { chord: 'G',  beats: 4, section: 'Verse' },
        { chord: 'G',  beats: 4, section: 'Verse' },
        { chord: 'A7', beats: 4, section: 'Verse' },
        { chord: 'A7', beats: 4, section: 'Verse' },
        { chord: 'D7', beats: 4, section: 'Verse' },
        { chord: 'D7', beats: 4, section: 'Verse' },
        { chord: 'G',  beats: 4, section: 'Verse' },
        { chord: 'G',  beats: 4, section: 'Verse' },
      ], 2),
      ...repeatPattern([
        { chord: 'G',  beats: 4, section: 'Chorus' },
        { chord: 'G',  beats: 4, section: 'Chorus' },
        { chord: 'A7', beats: 4, section: 'Chorus' },
        { chord: 'A7', beats: 4, section: 'Chorus' },
        { chord: 'D7', beats: 4, section: 'Chorus' },
        { chord: 'D7', beats: 4, section: 'Chorus' },
        { chord: 'G',  beats: 4, section: 'Chorus' },
        { chord: 'G',  beats: 4, section: 'Chorus' },
      ], 2),
    ]
  },

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
    tips: [
      'Just two chords — A and E. Perfect for building chord-change speed.',
      'The song has a driving rhythm — practice strumming steadily.',
      'Focus on clean transitions; at this tempo, speed matters!',
    ],
    progression: [
      ...repeatPattern([
        { chord: 'A', beats: 4, section: 'Verse' },
        { chord: 'A', beats: 4, section: 'Verse' },
        { chord: 'E', beats: 4, section: 'Verse' },
        { chord: 'E', beats: 4, section: 'Verse' },
      ], 4),
      ...repeatPattern([
        { chord: 'A', beats: 4, section: 'Chorus' },
        { chord: 'A', beats: 4, section: 'Chorus' },
        { chord: 'E', beats: 4, section: 'Chorus' },
        { chord: 'E', beats: 4, section: 'Chorus' },
        { chord: 'A', beats: 4, section: 'Chorus' },
        { chord: 'A', beats: 4, section: 'Chorus' },
        { chord: 'E', beats: 4, section: 'Chorus' },
        { chord: 'E', beats: 4, section: 'Chorus' },
      ], 2),
      ...repeatPattern([
        { chord: 'A', beats: 4, section: 'Verse' },
        { chord: 'A', beats: 4, section: 'Verse' },
        { chord: 'E', beats: 4, section: 'Verse' },
        { chord: 'E', beats: 4, section: 'Verse' },
      ], 2),
      ...repeatPattern([
        { chord: 'A', beats: 2, section: 'Outro' },
        { chord: 'E', beats: 2, section: 'Outro' },
        { chord: 'A', beats: 4, section: 'Outro' },
      ], 2),
    ]
  },

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
    tips: [
      'Classic I–IV–V7 progression in E major.',
      'The B7 can be tricky — practice it slowly before playing up to speed.',
      'This is one of Alan Jackson\'s signature songs — great rhythm feel.',
    ],
    progression: [
      ...repeatPattern([
        { chord: 'E',  beats: 4, section: 'Intro' },
        { chord: 'A',  beats: 4, section: 'Intro' },
        { chord: 'E',  beats: 4, section: 'Intro' },
        { chord: 'B7', beats: 4, section: 'Intro' },
      ], 1),
      ...repeatPattern([
        { chord: 'E',  beats: 4, section: 'Verse' },
        { chord: 'A',  beats: 4, section: 'Verse' },
        { chord: 'E',  beats: 4, section: 'Verse' },
        { chord: 'B7', beats: 4, section: 'Verse' },
        { chord: 'E',  beats: 4, section: 'Verse' },
        { chord: 'A',  beats: 4, section: 'Verse' },
        { chord: 'B7', beats: 4, section: 'Verse' },
        { chord: 'E',  beats: 4, section: 'Verse' },
      ], 2),
      ...repeatPattern([
        { chord: 'A',  beats: 4, section: 'Chorus' },
        { chord: 'E',  beats: 4, section: 'Chorus' },
        { chord: 'A',  beats: 4, section: 'Chorus' },
        { chord: 'B7', beats: 4, section: 'Chorus' },
        { chord: 'E',  beats: 4, section: 'Chorus' },
        { chord: 'A',  beats: 4, section: 'Chorus' },
        { chord: 'B7', beats: 2, section: 'Chorus' },
        { chord: 'E',  beats: 2, section: 'Chorus' },
        { chord: 'E',  beats: 4, section: 'Chorus' },
      ], 2),
    ]
  },

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
    tips: [
      'The G–D–Em–C progression is one of the most popular in all of music!',
      'Practice smooth, flowing transitions between all four chords.',
      'Try a fingerpicking pattern instead of strumming for this ballad.',
    ],
    progression: [
      ...repeatPattern([
        { chord: 'G',  beats: 4, section: 'Intro' },
        { chord: 'D',  beats: 4, section: 'Intro' },
        { chord: 'Em', beats: 4, section: 'Intro' },
        { chord: 'C',  beats: 4, section: 'Intro' },
      ], 2),
      ...repeatPattern([
        { chord: 'G',  beats: 4, section: 'Verse' },
        { chord: 'D',  beats: 4, section: 'Verse' },
        { chord: 'Em', beats: 4, section: 'Verse' },
        { chord: 'C',  beats: 4, section: 'Verse' },
        { chord: 'G',  beats: 4, section: 'Verse' },
        { chord: 'D',  beats: 4, section: 'Verse' },
        { chord: 'C',  beats: 4, section: 'Verse' },
        { chord: 'C',  beats: 4, section: 'Verse' },
      ], 2),
      ...repeatPattern([
        { chord: 'G',  beats: 4, section: 'Chorus' },
        { chord: 'D',  beats: 4, section: 'Chorus' },
        { chord: 'Em', beats: 4, section: 'Chorus' },
        { chord: 'C',  beats: 4, section: 'Chorus' },
        { chord: 'G',  beats: 4, section: 'Chorus' },
        { chord: 'D',  beats: 4, section: 'Chorus' },
        { chord: 'G',  beats: 4, section: 'Chorus' },
        { chord: 'G',  beats: 4, section: 'Chorus' },
      ], 2),
    ]
  },

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
    tips: [
      'Slow and soulful — focus on feel over speed.',
      'The verse uses D–G–A, and the chorus adds Em for emotional depth.',
      'Try gentle down-up strumming to match the song\'s tender mood.',
    ],
    progression: [
      ...repeatPattern([
        { chord: 'D',  beats: 4, section: 'Verse' },
        { chord: 'G',  beats: 4, section: 'Verse' },
        { chord: 'A',  beats: 4, section: 'Verse' },
        { chord: 'D',  beats: 4, section: 'Verse' },
      ], 2),
      ...repeatPattern([
        { chord: 'D',  beats: 4, section: 'Chorus' },
        { chord: 'G',  beats: 4, section: 'Chorus' },
        { chord: 'A',  beats: 4, section: 'Chorus' },
        { chord: 'Em', beats: 4, section: 'Chorus' },
        { chord: 'D',  beats: 4, section: 'Chorus' },
        { chord: 'G',  beats: 4, section: 'Chorus' },
        { chord: 'A',  beats: 4, section: 'Chorus' },
        { chord: 'D',  beats: 4, section: 'Chorus' },
      ], 2),
      ...repeatPattern([
        { chord: 'D',  beats: 4, section: 'Verse' },
        { chord: 'G',  beats: 4, section: 'Verse' },
        { chord: 'A',  beats: 4, section: 'Verse' },
        { chord: 'D',  beats: 4, section: 'Verse' },
      ], 2),
      { chord: 'G',  beats: 4, section: 'Bridge' },
      { chord: 'A',  beats: 4, section: 'Bridge' },
      { chord: 'G',  beats: 4, section: 'Bridge' },
      { chord: 'D',  beats: 4, section: 'Bridge' },
      ...repeatPattern([
        { chord: 'D',  beats: 4, section: 'Chorus' },
        { chord: 'G',  beats: 4, section: 'Chorus' },
        { chord: 'A',  beats: 4, section: 'Chorus' },
        { chord: 'Em', beats: 4, section: 'Chorus' },
        { chord: 'D',  beats: 4, section: 'Chorus' },
        { chord: 'G',  beats: 4, section: 'Chorus' },
        { chord: 'A',  beats: 4, section: 'Chorus' },
        { chord: 'D',  beats: 4, section: 'Chorus' },
      ], 1),
    ]
  },

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
    tips: [
      'Similar to Chattahoochee but with more drive. Keep your strumming tight.',
      'At this tempo, use mostly downstrokes for a punchy sound.',
      'This song is great for building chord-change muscle memory.',
    ],
    progression: [
      ...repeatPattern([
        { chord: 'E',  beats: 2, section: 'Intro' },
        { chord: 'E',  beats: 2, section: 'Intro' },
        { chord: 'A',  beats: 2, section: 'Intro' },
        { chord: 'A',  beats: 2, section: 'Intro' },
        { chord: 'B7', beats: 2, section: 'Intro' },
        { chord: 'B7', beats: 2, section: 'Intro' },
        { chord: 'E',  beats: 2, section: 'Intro' },
        { chord: 'E',  beats: 2, section: 'Intro' },
      ], 1),
      ...repeatPattern([
        { chord: 'E',  beats: 4, section: 'Verse' },
        { chord: 'E',  beats: 4, section: 'Verse' },
        { chord: 'A',  beats: 4, section: 'Verse' },
        { chord: 'A',  beats: 4, section: 'Verse' },
        { chord: 'B7', beats: 4, section: 'Verse' },
        { chord: 'A',  beats: 4, section: 'Verse' },
        { chord: 'E',  beats: 4, section: 'Verse' },
        { chord: 'E',  beats: 4, section: 'Verse' },
      ], 3),
      ...repeatPattern([
        { chord: 'E',  beats: 2, section: 'Chorus' },
        { chord: 'A',  beats: 2, section: 'Chorus' },
        { chord: 'E',  beats: 2, section: 'Chorus' },
        { chord: 'B7', beats: 2, section: 'Chorus' },
        { chord: 'E',  beats: 4, section: 'Chorus' },
        { chord: 'A',  beats: 4, section: 'Chorus' },
        { chord: 'B7', beats: 2, section: 'Chorus' },
        { chord: 'E',  beats: 2, section: 'Chorus' },
        { chord: 'E',  beats: 4, section: 'Chorus' },
      ], 2),
    ]
  },

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
    tips: [
      'Three-chord rock/country crossover — great for building speed.',
      'Shania\'s version uses power chords (A5, D5, E5) but open chords sound great too.',
      'Focus on the rhythmic punch of each chord change.',
    ],
    progression: [
      ...repeatPattern([
        { chord: 'A', beats: 4, section: 'Intro' },
        { chord: 'D', beats: 4, section: 'Intro' },
        { chord: 'E', beats: 4, section: 'Intro' },
        { chord: 'A', beats: 4, section: 'Intro' },
      ], 1),
      ...repeatPattern([
        { chord: 'A', beats: 4, section: 'Verse' },
        { chord: 'A', beats: 4, section: 'Verse' },
        { chord: 'D', beats: 4, section: 'Verse' },
        { chord: 'E', beats: 4, section: 'Verse' },
        { chord: 'A', beats: 4, section: 'Verse' },
        { chord: 'A', beats: 4, section: 'Verse' },
        { chord: 'D', beats: 4, section: 'Verse' },
        { chord: 'E', beats: 4, section: 'Verse' },
      ], 2),
      ...repeatPattern([
        { chord: 'A', beats: 2, section: 'Chorus' },
        { chord: 'D', beats: 2, section: 'Chorus' },
        { chord: 'E', beats: 2, section: 'Chorus' },
        { chord: 'A', beats: 2, section: 'Chorus' },
        { chord: 'A', beats: 4, section: 'Chorus' },
        { chord: 'D', beats: 4, section: 'Chorus' },
        { chord: 'E', beats: 2, section: 'Chorus' },
        { chord: 'E', beats: 2, section: 'Chorus' },
        { chord: 'A', beats: 4, section: 'Chorus' },
      ], 3),
    ]
  },

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
    tips: [
      'At 72 BPM, you have plenty of time to make clean chord changes.',
      'Focus on letting each chord ring out fully and clearly.',
      'The king of country keeps it simple — but make every note count!',
    ],
    progression: [
      ...repeatPattern([
        { chord: 'E',  beats: 4, section: 'Intro' },
        { chord: 'A',  beats: 4, section: 'Intro' },
        { chord: 'E',  beats: 4, section: 'Intro' },
        { chord: 'B7', beats: 4, section: 'Intro' },
      ], 1),
      ...repeatPattern([
        { chord: 'E',  beats: 4, section: 'Verse' },
        { chord: 'A',  beats: 4, section: 'Verse' },
        { chord: 'E',  beats: 4, section: 'Verse' },
        { chord: 'B7', beats: 4, section: 'Verse' },
        { chord: 'E',  beats: 4, section: 'Verse' },
        { chord: 'A',  beats: 4, section: 'Verse' },
        { chord: 'B7', beats: 4, section: 'Verse' },
        { chord: 'E',  beats: 4, section: 'Verse' },
      ], 2),
      ...repeatPattern([
        { chord: 'A',  beats: 4, section: 'Chorus' },
        { chord: 'E',  beats: 4, section: 'Chorus' },
        { chord: 'A',  beats: 4, section: 'Chorus' },
        { chord: 'B7', beats: 4, section: 'Chorus' },
        { chord: 'E',  beats: 4, section: 'Chorus' },
        { chord: 'A',  beats: 4, section: 'Chorus' },
        { chord: 'B7', beats: 4, section: 'Chorus' },
        { chord: 'E',  beats: 4, section: 'Chorus' },
      ], 2),
      { chord: 'A',  beats: 4, section: 'Outro' },
      { chord: 'B7', beats: 4, section: 'Outro' },
      { chord: 'E',  beats: 4, section: 'Outro' },
      { chord: 'E',  beats: 4, section: 'Outro' },
    ]
  }
];

/**
 * Returns difficulty stars string
 */
function getDifficultyStars(difficulty) {
  const map = { beginner: '★★☆☆☆', intermediate: '★★★☆☆', expert: '★★★★★' };
  return map[difficulty] || '★★☆☆☆';
}
