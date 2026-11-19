// Copy shared by the home page and the inner pages.

export const FEATURES: [icon: string, title: string, text: string][] = [
  ['corner-up-left', 'Undo, every time', 'Each result comes with Undo. New files go to the Trash, moved files go back where they were.'],
  ['sliders', 'An editor when you need one', 'Crop to a shape, adjust light and colour, add arrows and notes, rotate, resize, add a background, clean the metadata.'],
  ['film', 'Trim to the frame', 'Drag two handles on a strip of frames, press Space to play the cut, save. Video and audio.'],
  ['maximize', 'Quality you choose', 'Set JPEG, HEIC, AVIF and WebP quality, video size and quality, and audio bitrate per format.'],
  ['sparkles', 'Recipes', 'Chain steps into one choice, like resize then WebP, and run it from the dial or the halodial command.'],
  ['keyboard', 'Your keys, your fingers', 'Record your own shortcuts and wheel keys, and open the launcher with three or four fingers.'],
  ['palette', 'Glass or Solid', 'Two looks for the dial and the shelf, in any highlight colour.'],
  ['repeat', 'Learns your habits', 'The options you pick most for each kind of file move to the front of the dial.'],
];

// [kind, on the dial from the start, switched on in Settings, edit]
export const FORMATS: [kind: string, on: string, off: string, edit: string][] = [
  ['Pictures', 'AVIF HEIC PNG BMP GIF TIFF PDF', 'JPEG WebP', 'Crop, compress, rotate, resize, remove metadata, make a PDF, collage, the editor'],
  ['Video', 'MP4 MOV GIF MP3 WAV', 'M4V M4A MKV WebM AVI WMV', 'Trim to the frame, compress, audio only, mute, merge'],
  ['Audio', 'M4A CAF ALAC FLAC AIFF MP3', 'WAV OGG Opus WMA', 'Trim, compress, mono, merge'],
  ['PDF', 'DOCX PNG JPEG TXT MD HTML', 'RTF', 'Split, merge, compress, rotate, remove metadata, open in Preview'],
  ['Documents', 'PDF RTF TXT MD HTML ODT DOC', 'EPUB', 'Nothing to edit, so no Edit slot'],
  ['Spreadsheets', 'XLSX CSV TSV JSON PDF', 'ODS', 'Nothing to edit, so no Edit slot'],
  ['Slides', 'PDF PPTX ODP PNG JPEG', '', 'Nothing to edit, so no Edit slot'],
  ['Archives', 'ZIP TAR TAR.GZ', '', 'Extract; anything can be zipped from File'],
];

/** Every format named above, once each, for the moving strip on the home page. */
export const ALL_FORMATS = [...new Set(FORMATS.flatMap(([, on, off]) => `${on} ${off}`.split(' ').filter(Boolean)))];

/** Recipes: the two Halodial ships with, and ideas built only from steps the app has (Settings > Recipes). */
export type RecipeCard = { name: string; kind: string; file: string; steps: string[]; out: string; text: string; builtIn?: boolean };
export const RECIPES: RecipeCard[] = [
  { name: 'Web image', kind: 'Pictures', file: 'hero.jpg', steps: ['Resize to 1920px', 'Convert to WebP'], out: 'hero.webp', text: 'Big photos made small enough for a website, in one go.', builtIn: true },
  { name: 'Share safely', kind: 'Pictures', file: 'IMG_2041.jpg', steps: ['Remove metadata', 'Compress to 1 MB'], out: 'IMG_2041.jpg', text: 'Location and camera details gone, and small enough to send.', builtIn: true },
  { name: 'Private PDF', kind: 'PDF', file: 'contract.pdf', steps: ['Remove metadata', 'Compress'], out: 'contract.pdf', text: 'Author and app details stripped, the file made lighter for email.' },
  { name: 'Scan upright', kind: 'Pictures', file: 'receipt.jpg', steps: ['Rotate right', 'Make a PDF'], out: 'receipt.pdf', text: 'A sideways phone scan, turned the right way and saved as a PDF.' },
  { name: 'Quiet preview', kind: 'Video', file: 'demo.mp4', steps: ['Mute', 'Compress'], out: 'demo.mp4', text: 'A screen recording with the sound taken out, ready to drop into a chat.' },
  { name: 'Audio from video', kind: 'Video', file: 'talk.mp4', steps: ['Audio only', 'Compress'], out: 'talk.mp3', text: 'Just the voice from a recorded talk, at a sensible size.' },
  { name: 'Voice memo to send', kind: 'Audio', file: 'memo.mp3', steps: ['Mono', 'Compress'], out: 'memo.mp3', text: 'Half the size, and it still sounds the same on a phone.' },
  { name: 'PDF to notes', kind: 'PDF', file: 'paper.pdf', steps: ['Remove metadata', 'Convert to Markdown'], out: 'paper.md', text: 'The text of a PDF as Markdown, ready for your notes app.' },
];

/** Everything ⌘K can find: pages, formats, shortcuts and help answers. */
export type Find = { title: string; hint: string; href: string; words?: string };
export const SEARCH: Find[] = [
  { title: 'Home', hint: 'Page', href: '/' },
  { title: 'Try it in your browser', hint: 'Page', href: '/try/', words: 'playground demo desktop shelf dial' },
  { title: 'Every format', hint: 'Page', href: '/formats/' },
  { title: 'Recipes', hint: 'Page', href: '/recipes/', words: 'chain steps' },
  { title: 'Help', hint: 'Page', href: '/help/', words: 'faq questions' },
  { title: "What's new", hint: 'Page', href: '/changelog/', words: 'changelog release notes version' },
  { title: 'Privacy', hint: 'Page', href: '/privacy/', words: 'data tracking upload' },
  { title: 'Download for Mac', hint: 'Install', href: '/#download', words: 'dmg homebrew curl install' },
  { title: 'Hold ⌘ while dragging a file', hint: 'Shortcut', href: '/help/', words: 'command file dial' },
  { title: 'Shake a file to open a shelf', hint: 'Shortcut', href: '/help/', words: 'shelf park' },
  { title: 'Tap with four fingers for the launcher', hint: 'Shortcut', href: '/help/', words: 'launcher trackpad three' },
  { title: '⌥⌘Space opens the launcher', hint: 'Shortcut', href: '/help/', words: 'option command space' },
  { title: '⌥⌘C opens the dial for Finder’s selection', hint: 'Shortcut', href: '/help/', words: 'option command c finder' },
  { title: '⌥⌘S opens a new shelf', hint: 'Shortcut', href: '/help/', words: 'option command s' },
  { title: 'macOS says Apple could not verify Halodial', hint: 'Help', href: '/help/', words: 'gatekeeper open anyway notarized' },
  { title: 'Does Halodial need permissions?', hint: 'Help', href: '/help/', words: 'automation finder' },
  { title: "I can't hear the click", hint: 'Help', href: '/help/', words: 'sound audio' },
  { title: 'How do I update?', hint: 'Help', href: '/help/', words: 'sparkle brew upgrade' },
  { title: 'Convert from Terminal', hint: 'Help', href: '/help/', words: 'cli command line halodial' },
  { title: 'Remove Halodial', hint: 'Help', href: '/help/', words: 'uninstall delete' },
  ...FORMATS.map(([kind, on, off]) => ({ title: kind, hint: 'Formats', href: '/formats/', words: `${on} ${off}`.toLowerCase() })),
  ...RECIPES.map(r => ({ title: r.name, hint: 'Recipe', href: '/recipes/', words: `${r.steps.join(' ')} ${r.kind}`.toLowerCase() })),
];
