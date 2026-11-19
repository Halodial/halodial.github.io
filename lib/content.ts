// Copy shared by the home page and the inner pages.

export const FEATURES: [icon: string, title: string, text: string][] = [
  ['corner-up-left', 'Undo, every time', 'Each result comes with Undo. New files go to the Trash, moved files go back where they were.'],
  ['sliders', 'An editor when you need one', 'Crop to a shape, adjust light and colour, add arrows and notes, rotate, resize, add a background, clean the metadata.'],
  ['film', 'Trim to the frame', 'Drag two handles on a strip of frames, press Space to play the cut, save. Video and audio.'],
  ['maximize', 'Quality you choose', 'Set JPEG, HEIC, AVIF and WebP quality, video size and quality, and audio bitrate per format.'],
  ['sparkles', 'Recipes', 'Chain steps into one choice, like resize then WebP, and run it from the dial or the halodial command.'],
  ['keyboard', 'Your keys, your fingers', 'Record your own shortcuts and wheel keys, and open the launcher with three or four fingers.'],
  ['palette', 'Glass or Solid', 'Two looks for the dial and the shelf, in any highlight colour. Try them above.'],
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
