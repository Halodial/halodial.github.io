'use client';
import { useState } from 'react';

/** An install command with a Copy button; if the clipboard is blocked, selects the text and says how to copy it. */
export default function CopyCommand({ command }: { command: string }) {
  const [label, setLabel] = useState('Copy');
  async function copy(e: React.MouseEvent<HTMLButtonElement>) {
    try { await navigator.clipboard.writeText(command); setLabel('Copied'); }
    catch {
      const code = e.currentTarget.previousElementSibling;
      if (code) getSelection()?.selectAllChildren(code);
      setLabel('Press ⌘C');
    }
    setTimeout(() => setLabel('Copy'), 1800);
  }
  return (
    <div className="cmd">
      <code>{command}</code>
      <button type="button" onClick={copy} aria-live="polite">{label}</button>
    </div>
  );
}
