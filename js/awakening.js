(function() {
  function todayIso() { return window.getTodayDateString?.() || new Date().toISOString().split('T')[0]; }

  async function loadTodayJoyCount() {
    if (typeof StorageManager === 'undefined') return 0;
    const u = await StorageManager.getUserData();
    const today = todayIso();
    const session = u.sessions.find(s => s.date === today);
    const joy = session?.journal_joy_count || 0;
    const joySlider = document.getElementById('new-joy');
    if (joySlider) {
      joySlider.value = Math.min(10, joy);
      document.getElementById('new-score-joy').innerText = Math.min(10, joy);
    }
  }

  async function saveNewAwakening() {
    const focus = parseInt(document.getElementById('new-focus').value);
    const relax = parseInt(document.getElementById('new-relax').value);
    const awareness = parseInt(document.getElementById('new-awareness').value);
    const joy = parseInt(document.getElementById('new-joy').value);
    
    const total = focus + relax + awareness + joy;
    const score = Math.round((total / 40) * 100);
    
    let comment = '';
    if (score >= 80) comment = '今日は素晴らしい一日でした！この調子で';
    else if (score >= 60) comment = 'まずまず良い日ですね。あと少しで更に良くなります';
    else if (score >= 40) comment = '普通の一日。明日に期待しましょう';
    else comment = '少し疲れ気味かもしれません。ゆっくり休んでください';
    
    const resultText = `集中: ${focus} / リラックス: ${relax} / 気づき: ${awareness} / 嬉しい: ${joy}\n総合スコア: ${score}\nコメント: ${comment}`;
    document.getElementById('newResultText').innerHTML = resultText.replace(/\n/g, '<br>');
    document.getElementById('newAwakeningResult').style.display = 'block';
    
    if (typeof StorageManager !== 'undefined') {
      const today = todayIso();
      await StorageManager.mergeSessionDay(today, {
        count: 0, duration: 0, merit: 0,
        count_chanting:0, count_gongyo:0, merit_chanting:0, merit_gongyo:0,
        journal_joy_count: joy,
        log_pain: null, log_refresh: relax, log_joy: focus,
        aw_focus: focus, aw_relax: relax, aw_awareness: awareness,
      });
    }
    
    window.__lastReflectionText = `よむよむお題目 今日の振り返り\n${resultText}\n#よむよむお題目`;
  }

  function shareToX() {
    const text = window.__lastReflectionText;
    if (text) window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  }

  function shareToLine() {
    const text = window.__lastReflectionText;
    if (text) window.open(`https://line.me/R/share?text=${encodeURIComponent(text)}`, '_blank');
  }

  function copyText() {
    const text = window.__lastReflectionText;
    if (text) { navigator.clipboard.writeText(text); alert('コピーしました'); }
  }

  function openNewAwakening() {
    loadTodayJoyCount();
    document.getElementById('newAwakeningResult').style.display = 'none';
    document.getElementById('awakeningNewOverlay').classList.add('show');
  }

  function closeNewAwakening() {
    document.getElementById('awakeningNewOverlay').classList.remove('show');
  }

  document.addEventListener('DOMContentLoaded', () => {
    const btns = ['openReflectionFromChant', 'openReflectionFromGongyo', 'openReflectionFromStats'];
    btns.forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', openNewAwakening);
    });
    document.getElementById('saveNewAwakening')?.addEventListener('click', saveNewAwakening);
    document.getElementById('closeNewAwakening')?.addEventListener('click', closeNewAwakening);
    document.getElementById('shareX')?.addEventListener('click', shareToX);
    document.getElementById('shareLine')?.addEventListener('click', shareToLine);
    document.getElementById('shareCopy')?.addEventListener('click', copyText);
  });
})();