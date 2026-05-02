/**
 * 修行後のひとこと（軽量）
 */

function showReflectionPrompt(notePreview) {
  if (!notePreview || !notePreview.trim()) return;
  if (typeof showInfo === 'function') {
    showInfo(
      `記録しました。メモ: ${notePreview.slice(0, 80)}${notePreview.length > 80 ? '…' : ''}`,
    );
  }
}
