/**
 * 分析タブ：週/月レポート生成 + SNSテンプレ + 出力
 * 自動投稿はしない（note自動投稿は開発者ツール側で別途）
 */

(function () {
  function isoDate(d) {
    return d.toISOString().split('T')[0];
  }

  function startOfWeekSunday(d) {
    const dt = new Date(d);
    dt.setHours(12, 0, 0, 0);
    dt.setDate(dt.getDate() - dt.getDay());
    return dt;
  }

  function endOfWeekSunday(d) {
    const s = startOfWeekSunday(d);
    const e = new Date(s);
    e.setDate(e.getDate() + 6);
    return e;
  }

  function startOfMonth(d) {
    return new Date(d.getFullYear(), d.getMonth(), 1, 12, 0, 0, 0);
  }

  function endOfMonth(d) {
    return new Date(d.getFullYear(), d.getMonth() + 1, 0, 12, 0, 0, 0);
  }

  function between(dateStr, a, b) {
    const d = new Date(`${dateStr}T12:00:00`);
    return d >= a && d <= b;
  }

  function pearson(xs, ys) {
    const pairs = [];
    for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
      const x = Number(xs[i]);
      const y = Number(ys[i]);
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
      pairs.push([x, y]);
    }
    if (pairs.length < 3) return null;
    const n = pairs.length;
    let sx = 0;
    let sy = 0;
    for (let i = 0; i < n; i++) {
      sx += pairs[i][0];
      sy += pairs[i][1];
    }
    const mx = sx / n;
    const my = sy / n;
    let num = 0;
    let dx = 0;
    let dy = 0;
    for (let i = 0; i < n; i++) {
      const vx = pairs[i][0] - mx;
      const vy = pairs[i][1] - my;
      num += vx * vy;
      dx += vx * vx;
      dy += vy * vy;
    }
    if (dx <= 0 || dy <= 0) return null;
    const r = num / Math.sqrt(dx * dy);
    if (!Number.isFinite(r)) return null;
    return Math.max(-1, Math.min(1, r));
  }

  function fmtR(r) {
    if (r == null) return '—';
    const v = Math.round(r * 100) / 100;
    return (v >= 0 ? '+' : '') + v.toFixed(2);
  }

  function summarizeRange(sessions, a, b) {
    const list = sessions.filter((s) => s?.date && between(String(s.date).split('T')[0], a, b));
    const merit = list.reduce((sum, s) => sum + (Number(s.merit) || 0), 0);
    const fortune = list.reduce((sum, s) => sum + (Number(s.journal_luck_count) || 0), 0);
    let awakeSum = 0;
    let awakeN = 0;
    list.forEach((s) => {
      if (typeof EvidenceMetrics !== 'undefined' && EvidenceMetrics.computeEvidenceDayIndex) {
        const idx = EvidenceMetrics.computeEvidenceDayIndex(s)?.index;
        if (Number.isFinite(idx)) {
          awakeSum += idx;
          awakeN += 1;
        }
      }
    });
    const awake = awakeN ? Math.round((awakeSum / awakeN) * 10) / 10 : null;
    return { list, merit, fortune, awake };
  }

  function computeCorrelations(list) {
    const merits = [];
    const fortunes = [];
    const awakes = [];
    const days = [];
    let streak = 0;
    let prev = null;
    const nextDate = (d) => {
      const dt = new Date(`${d}T12:00:00`);
      dt.setDate(dt.getDate() + 1);
      return isoDate(dt);
    };
    [...list]
      .sort((a, b) => String(a.date).localeCompare(String(b.date)))
      .forEach((s) => {
        const date = String(s.date).split('T')[0];
        if (!prev) streak = 1;
        else streak = nextDate(prev) === date ? streak + 1 : 1;
        prev = date;
        merits.push(Number(s.merit) || 0);
        fortunes.push(Number(s.journal_luck_count) || 0);
        let awake = null;
        if (typeof EvidenceMetrics !== 'undefined' && EvidenceMetrics.computeEvidenceDayIndex) {
          const idx = EvidenceMetrics.computeEvidenceDayIndex(s)?.index;
          if (Number.isFinite(idx)) awake = idx;
        }
        awakes.push(awake);
        days.push(streak);
      });
    return {
      merit_fortune: pearson(merits, fortunes),
      awakening_fortune: pearson(awakes, fortunes),
      days_awakening: pearson(days, awakes),
    };
  }

  function buildMarkdown(title, rangeLabel, sum, corr) {
    return [
      `# よむよむ修行ログ分析 | ${rangeLabel}`,
      ``,
      `## 📊 ${title}のまとめ`,
      ``,
      `- 功徳（合計）: ${Math.round(sum.merit).toLocaleString()} `,
      `- 覚醒度（記録用・平均）: ${sum.awake == null ? '—' : sum.awake}`,
      `- 幸運（件）: ${Math.round(sum.fortune)}`,
      ``,
      `## 🔎 相関（参考）`,
      ``,
      `- 修行量と幸運：相関係数 r = ${fmtR(corr.merit_fortune)}`,
      `- 覚醒度と幸運：相関係数 r = ${fmtR(corr.awakening_fortune)}`,
      `- 修行継続日数と覚醒度：相関係数 r = ${fmtR(corr.days_awakening)}`,
      ``,
      `※相関は「同時に増減しやすいか」の目安であり、原因の証明ではありません。`,
      ``,
    ].join('\n');
  }

  function buildSnsTemplates(mdSummary) {
    const lines = mdSummary.split('\n');
    const firstStats = lines.filter((l) => l.startsWith('- ')).slice(0, 3).map((l) => l.replace('- ', ''));
    const corr = lines.filter((l) => l.startsWith('- 修行量と幸運') || l.startsWith('- 覚醒度と幸運') || l.startsWith('- 修行継続日数'));
    const compact = [...firstStats, ...corr].join('\n');
    return {
      x: `📿 よむよむ 今週のログ\n${compact}\n#よむよむお題目 #修行ログ`,
      line: `よむよむ修行ログ（要約）\n${compact}`,
      ig: `よむよむ修行ログ\n${compact}\n\n#修行 #記録`,
    };
  }

  async function generateWeek() {
    const u = await StorageManager.getUserData();
    const now = new Date();
    const a = startOfWeekSunday(now);
    const b = endOfWeekSunday(now);
    const sum = summarizeRange(u.sessions || [], a, b);
    const corr = computeCorrelations(sum.list);
    const rangeLabel = `${isoDate(a)}〜${isoDate(b)}`;
    const md = buildMarkdown('この週', rangeLabel, sum, corr);
    return { md, sns: buildSnsTemplates(md) };
  }

  async function generateMonth() {
    const u = await StorageManager.getUserData();
    const now = new Date();
    const a = startOfMonth(now);
    const b = endOfMonth(now);
    const sum = summarizeRange(u.sessions || [], a, b);
    const corr = computeCorrelations(sum.list);
    const rangeLabel = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const md = buildMarkdown('この月', rangeLabel, sum, corr);
    return { md, sns: buildSnsTemplates(md) };
  }

  function setText(id, v) {
    const el = document.getElementById(id);
    if (el) el.value = v || '';
  }

  async function copyFrom(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const text = el.value || '';
    try {
      await navigator.clipboard.writeText(text);
      if (typeof showSuccess === 'function') showSuccess('コピーしました');
    } catch {
      el.focus();
      el.select();
      if (typeof showInfo === 'function') showInfo('選択しました（手動コピーしてください）');
    }
  }

  async function exportCsv() {
    const csv = await StorageManager.exportSessionsCsv();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `yomuyomu-sessions-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    if (typeof showInfo === 'function') showInfo('CSV を出力しました');
  }

  function exportJson() {
    const blob = new Blob([StorageManager.exportJson()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `yomuyomu-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    if (typeof showInfo === 'function') showInfo('エクスポートしました');
  }

  document.addEventListener('DOMContentLoaded', () => {
    let last = null;
    document.getElementById('btn-gen-week')?.addEventListener('click', async () => {
      last = await generateWeek();
      setText('report-output', last.md);
      setText('sns-output', last.sns.x);
    });
    document.getElementById('btn-gen-month')?.addEventListener('click', async () => {
      last = await generateMonth();
      setText('report-output', last.md);
      setText('sns-output', last.sns.x);
    });
    document.getElementById('btn-copy-report')?.addEventListener('click', () => {
      copyFrom('report-output');
    });
    document.getElementById('btn-copy-sns')?.addEventListener('click', () => {
      copyFrom('sns-output');
    });
    document.getElementById('btn-sns-x')?.addEventListener('click', () => {
      if (!last) return;
      setText('sns-output', last.sns.x);
    });
    document.getElementById('btn-sns-line')?.addEventListener('click', () => {
      if (!last) return;
      setText('sns-output', last.sns.line);
    });
    document.getElementById('btn-sns-ig')?.addEventListener('click', () => {
      if (!last) return;
      setText('sns-output', last.sns.ig);
    });

    document.getElementById('btn-export-csv-sessions-2')?.addEventListener('click', () => {
      exportCsv().catch((e) => console.warn('[export csv]', e));
    });
    document.getElementById('btn-export-json-2')?.addEventListener('click', exportJson);

    // ---- Dev: note auto-post (token not stored) ----
    const devCard = document.getElementById('dev-note-card');
    const debug =
      (typeof window.isDebugMode === 'function' && window.isDebugMode()) ||
      (typeof localStorage !== 'undefined' && localStorage.getItem('DEBUG_MODE') === 'true');
    if (devCard && debug) devCard.style.display = 'block';

    const buildCurl = () => {
      const token = document.getElementById('note-token')?.value || '';
      const body = document.getElementById('report-output')?.value || '';
      const payload = {
        title: `【修行データ】${new Date().toLocaleDateString('ja-JP')}`,
        body,
        tags: ['修行', 'よむよむお題目', 'データ分析'],
      };
      const safe = JSON.stringify(payload).replace(/'/g, "'\\''");
      return [
        'curl -X POST https://note.com/api/v2/notes \\',
        `  -H 'Authorization: Bearer ${token}' \\`,
        "  -H 'Content-Type: application/json' \\",
        `  --data '${safe}'`,
      ].join('\\n');
    };

    document.getElementById('btn-copy-curl')?.addEventListener('click', async () => {
      const pre = document.getElementById('note-result');
      const curl = buildCurl();
      if (pre) pre.textContent = curl;
      try {
        await navigator.clipboard.writeText(curl);
        showSuccess?.('curl をコピーしました');
      } catch {
        showInfo?.('選択して手動コピーしてください');
      }
    });

    document.getElementById('btn-post-note')?.addEventListener('click', async () => {
      const pre = document.getElementById('note-result');
      const token = document.getElementById('note-token')?.value || '';
      const body = document.getElementById('report-output')?.value || '';
      if (!token || !body) {
        if (pre) pre.textContent = 'トークンとレポート本文が必要です（先に週/月レポートを生成してください）。';
        return;
      }
      if (pre) pre.textContent = '投稿を試行中...（CORS等で失敗する場合があります）';
      try {
        const res = await fetch('https://note.com/api/v2/notes', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: `【修行データ】${new Date().toLocaleDateString('ja-JP')}`,
            body,
            tags: ['修行', 'よむよむお題目', 'データ分析'],
          }),
        });
        const txt = await res.text();
        if (!res.ok) {
          if (pre) pre.textContent = `HTTP ${res.status}\\n${txt}\\n\\n（失敗時は curl をコピーして試せます）`;
          return;
        }
        if (pre) pre.textContent = `OK\\n${txt}`;
      } catch (e) {
        if (pre) pre.textContent = `fetch で失敗しました: ${String(e)}\\n\\n（curl をコピーして手動で試せます）`;
      }
      window.generateWeekReport = async function() {
        const u = await StorageManager.getUserData();
        const now = new Date();
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        const sessions = (u.sessions || []).filter(s => new Date(s.date) >= weekAgo);
        const totalMerit = sessions.reduce((s,sum) => sum + (s.merit||0), 0);
        const totalLuck = sessions.reduce((s,sum) => sum + (s.journal_luck_count||0), 0);
        return `【今週のレポート】\n功徳合計: ${totalMerit}\n幸運件数: ${totalLuck}\n記録日数: ${sessions.length}日`;
      };
      
      window.generateMonthReport = async function() {
        const u = await StorageManager.getUserData();
        const now = new Date();
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        const sessions = (u.sessions || []).filter(s => new Date(s.date) >= monthAgo);
        const totalMerit = sessions.reduce((s,sum) => sum + (s.merit||0), 0);
        const totalLuck = sessions.reduce((s,sum) => sum + (s.journal_luck_count||0), 0);
        return `【今月のレポート】\n功徳合計: ${totalMerit}\n幸運件数: ${totalLuck}\n記録日数: ${sessions.length}日`;
      };
    });
  });
})();

