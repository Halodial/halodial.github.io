// Wires the page to the dial: kind chips, style, highlight colour, sound, the result toast; fills the feature ledger.
(() => {
  'use strict';
  const { Dial, Sound, KINDS } = window.Halodial;
  const $ = s => document.querySelector(s);
  const icon = n => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;

  // the result toast, with Undo like the app
  const toastEl = $('#toast');
  let hide;
  function toast(text, undo) {
    toastEl.querySelector('span').textContent = text;
    toastEl.classList.toggle('undo', !!undo);
    toastEl.querySelector('button').onclick = undo ? () => toast(undo) : null;
    toastEl.classList.add('show');
    clearTimeout(hide);
    hide = setTimeout(() => toastEl.classList.remove('show'), undo ? 4200 : 2400);
  }

  const dial = new Dial($('#dial'), { onToast: toast, live: $('#live'), onKind: k => {
    document.querySelectorAll('#kinds .chip').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.kind === k)));
  } });

  // kind chips
  $('#kinds').innerHTML = Object.entries(KINDS).map(([k, v]) =>
    `<button type="button" class="chip" data-kind="${k}" aria-pressed="${k === 'image'}">${v.chip}</button>`).join('');
  $('#kinds').addEventListener('click', e => {
    const b = e.target.closest('.chip');
    if (!b) return;
    Sound.init();
    dial.setKind(b.dataset.kind);
  });

  // Solid / Glass
  document.querySelectorAll('[data-style]').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('[data-style]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    dial.style = b.dataset.style;
    dial.dirty = true;
  }));

  // highlight colours (the app's presets)
  const colours = [['White', '#FFFFFF'], ['Gold', '#FFD17D'], ['Lilac', '#C9B6FF'], ['Sky', '#7FC8FF'], ['Mint', '#8FE3A2'], ['Pink', '#FF9ED8'], ['Coral', '#FF8A6B']];
  $('#dots').innerHTML = colours.map(([n, h], i) =>
    `<button type="button" class="dot" style="background:${h}" data-hex="${h}" aria-label="${n}" title="${n}" aria-pressed="${i === 0}"></button>`).join('');
  $('#dots').addEventListener('click', e => {
    const b = e.target.closest('.dot');
    if (!b) return;
    document.querySelectorAll('.dot').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    dial.accent = b.dataset.hex;
    dial.dirty = true;
  });

  // sound
  const snd = $('#sound');
  snd.addEventListener('click', () => {
    Sound.init();
    Sound.on = !Sound.on;
    snd.setAttribute('aria-pressed', String(Sound.on));
    snd.querySelector('span').textContent = Sound.on ? 'Sound on' : 'Sound off';
    snd.querySelector('.on').style.opacity = Sound.on ? 1 : 0;
    if (Sound.on) Sound.play('click');
  });

  // features
  const features = [
    ['corner-up-left', 'Undo, every time', 'Each result comes with Undo. New files go to the Trash, moved files go back where they were.'],
    ['sliders', 'An editor when you need one', 'Crop to a shape, adjust light and colour, add arrows and notes, rotate, resize, add a background, clean the metadata.'],
    ['film', 'Trim to the frame', 'Drag two handles on a strip of frames, press Space to play the cut, save. Video and audio.'],
    ['maximize', 'Quality you choose', 'Set JPEG, HEIC, AVIF and WebP quality, video size and quality, and audio bitrate per format.'],
    ['sparkles', 'Recipes', 'Chain steps into one choice, like resize then WebP, and run it from the dial or the halodial command.'],
    ['keyboard', 'Your keys, your fingers', 'Record your own shortcuts and wheel keys, and open the launcher with three or four fingers.'],
    ['palette', 'Glass or Solid', 'Two looks for the dial and the shelf, in any highlight colour. Try them above.'],
    ['repeat', 'Learns your habits', 'The options you pick most for each kind of file move to the front of the dial.'],
  ];
  ICONS.palette = ICONS.palette || '<circle cx="12" cy="12" r="9"/><circle cx="8" cy="10" r="1"/><circle cx="12" cy="7.5" r="1"/><circle cx="16" cy="10" r="1"/>';
  $('#ledger').innerHTML = features.map(([i, t, d]) => `<div>${icon(i)}<h3>${t}</h3><p>${d}</p></div>`).join('');
})();
