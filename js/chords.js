// ============================================================
// CHORD DEFINITIONS & SVG DIAGRAM GENERATOR
// ============================================================

// Fret array: index 0 = string 6 (low E), index 5 = string 1 (high e)
// Fret value: -1 = muted, 0 = open, 1+ = fret number
// Finger array: 0 = open/muted, 1 = index, 2 = middle, 3 = ring, 4 = pinky

const CHORD_DEFS = {
  'G': {
    fullName: 'G Major',
    frets:   [3, 2, 0, 0, 0, 3],
    fingers: [2, 1, 0, 0, 0, 4],
    startFret: 1,
    color: '#e8a534',
    tip: 'Keep your fingers curved. The pinky on the high e string is optional for beginners.'
  },
  'C': {
    fullName: 'C Major',
    frets:   [-1, 3, 2, 0, 1, 0],
    fingers: [0, 3, 2, 0, 1, 0],
    startFret: 1,
    color: '#e85d34',
    tip: 'Make sure your fingers don\'t accidentally mute the open strings.'
  },
  'D': {
    fullName: 'D Major',
    frets:   [-1, -1, 0, 2, 3, 2],
    fingers: [0, 0, 0, 1, 3, 2],
    startFret: 1,
    color: '#3498db',
    tip: 'Only strum the top 4 strings (D through high e). Keep your elbow in.'
  },
  'Em': {
    fullName: 'E Minor',
    frets:   [0, 2, 2, 0, 0, 0],
    fingers: [0, 2, 3, 0, 0, 0],
    startFret: 1,
    color: '#27ae60',
    tip: 'One of the easiest chords! Great foundation for learning other chords.'
  },
  'Am': {
    fullName: 'A Minor',
    frets:   [-1, 0, 2, 2, 1, 0],
    fingers: [0, 0, 3, 2, 1, 0],
    startFret: 1,
    color: '#c0392b',
    tip: 'Similar shape to C major — practice switching between them.'
  },
  'A': {
    fullName: 'A Major',
    frets:   [-1, 0, 2, 2, 2, 0],
    fingers: [0, 0, 1, 2, 3, 0],
    startFret: 1,
    color: '#e74c3c',
    tip: 'Squeeze your middle three fingers together on the 2nd fret. Don\'t touch the high e.'
  },
  'E': {
    fullName: 'E Major',
    frets:   [0, 2, 2, 1, 0, 0],
    fingers: [0, 2, 3, 1, 0, 0],
    startFret: 1,
    color: '#2ecc71',
    tip: 'Strum all 6 strings! This is a rich, full chord common in country music.'
  },
  'A7': {
    fullName: 'A Dominant 7th',
    frets:   [-1, 0, 2, 0, 2, 0],
    fingers: [0, 0, 2, 0, 3, 0],
    startFret: 1,
    color: '#d35400',
    tip: 'Like A major but lift your ring finger off. It has a bluesy, country sound.'
  },
  'D7': {
    fullName: 'D Dominant 7th',
    frets:   [-1, -1, 0, 2, 1, 2],
    fingers: [0, 0, 0, 3, 1, 2],
    startFret: 1,
    color: '#2980b9',
    tip: 'Similar to D major but with a different shape. Very common in country!'
  },
  'B7': {
    fullName: 'B Dominant 7th',
    frets:   [-1, 2, 1, 2, 0, 2],
    fingers: [0, 2, 1, 3, 0, 4],
    startFret: 1,
    color: '#8e44ad',
    tip: 'One of the trickier chords. Take it slow and make sure each note rings clearly.'
  },
  'G7': {
    fullName: 'G Dominant 7th',
    frets:   [3, 2, 0, 0, 0, 1],
    fingers: [3, 2, 0, 0, 0, 1],
    startFret: 1,
    color: '#d4a017',
    tip: 'Like G major but add your index finger on the 1st fret of the high e string.'
  }
};

/**
 * Generates an SVG chord diagram
 * @param {string} chordName - The chord name key from CHORD_DEFS
 * @param {number} width - SVG width in pixels
 * @param {number} height - SVG height in pixels
 * @returns {string} SVG markup string
 */
function generateChordSVG(chordName, width = 160, height = 200) {
  const chord = CHORD_DEFS[chordName];
  if (!chord) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <text x="${width/2}" y="${height/2}" text-anchor="middle" fill="#aaa" font-size="14">?</text>
    </svg>`;
  }

  const margin = { top: 38, bottom: 10, left: 28, right: 14 };
  const gridW = width - margin.left - margin.right;
  const gridH = height - margin.top - margin.bottom;

  const numStrings = 6;
  const numFrets = 4;

  const stringGap = gridW / (numStrings - 1);
  const fretGap = gridH / numFrets;

  const startX = margin.left;
  const startY = margin.top;

  // x position of each string (index 0 = low E = leftmost)
  const strX = (i) => startX + i * stringGap;
  // y position of fret line (0 = nut, 4 = 4th fret line)
  const fretLineY = (f) => startY + f * fretGap;
  // y center of fret slot (between fret line f-1 and fret line f), relative to startFret
  const noteDotY = (fret) => startY + (fret - chord.startFret + 0.5) * fretGap;

  const dotRadius = Math.min(stringGap, fretGap) * 0.33;
  const color = chord.color || '#e8a534';

  let els = [];

  // Nut or fret number label
  if (chord.startFret === 1) {
    // Thick nut line
    els.push(`<rect x="${startX - 2}" y="${startY - 5}" width="${gridW + 4}" height="5" fill="#d4c5a9" rx="1"/>`);
  } else {
    // Fret position marker
    els.push(`<text x="${startX - 6}" y="${fretLineY(1) + 4}" text-anchor="end" fill="#999" font-size="11" font-family="Arial,sans-serif">${chord.startFret}fr</text>`);
  }

  // Fret lines (horizontal)
  for (let f = 0; f <= numFrets; f++) {
    const y = fretLineY(f);
    const sw = f === 0 ? 1.5 : 1;
    const sc = f === 0 ? '#666' : '#3a3530';
    els.push(`<line x1="${startX}" y1="${y}" x2="${startX + gridW}" y2="${y}" stroke="${sc}" stroke-width="${sw}"/>`);
  }

  // String lines (vertical)
  for (let s = 0; s < numStrings; s++) {
    const x = strX(s);
    els.push(`<line x1="${x}" y1="${startY}" x2="${x}" y2="${startY + gridH}" stroke="#4a4540" stroke-width="1.5"/>`);
  }

  // Open/muted indicators and fretted dots
  for (let s = 0; s < numStrings; s++) {
    const fret = chord.frets[s];
    const finger = chord.fingers[s];
    const x = strX(s);

    if (fret === -1) {
      // Muted: X above nut
      const y = startY - 20;
      els.push(`<text x="${x}" y="${y}" text-anchor="middle" fill="#e74c3c" font-size="13" font-weight="bold" font-family="Arial,sans-serif">×</text>`);
    } else if (fret === 0) {
      // Open: hollow circle above nut
      const y = startY - 14;
      els.push(`<circle cx="${x}" cy="${y}" r="${dotRadius * 0.65}" fill="none" stroke="#999" stroke-width="1.5"/>`);
    } else {
      // Fretted: filled dot
      const y = noteDotY(fret);
      els.push(`<circle cx="${x}" cy="${y}" r="${dotRadius}" fill="${color}"/>`);
      if (finger > 0) {
        els.push(`<text x="${x}" y="${y + 4}" text-anchor="middle" fill="#111" font-size="10" font-weight="bold" font-family="Arial,sans-serif">${finger}</text>`);
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="display:block">${els.join('')}</svg>`;
}

/**
 * Returns the chord color for a given chord name
 */
function getChordColor(chordName) {
  return (CHORD_DEFS[chordName] && CHORD_DEFS[chordName].color) || '#e8a534';
}
