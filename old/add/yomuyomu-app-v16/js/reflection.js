/**
 * reflection.js
 * 
 * 目的：修行終了後 3秒で「今日はどんな一日？」プロンプトを表示
 * 
 * UI フロー：
 * 1. ユーザーが修行を記録
 * 2. 3秒後に trigger_post_practice_reflection() が呼ばれる
 * 3. ランダム（70%の確率）でプロンプトが表示される
 * 4. ユーザーがタップ → open_daily_summary() でモーダルが開く
 */

/**
 * 修行後プロンプトのUIを作成
 */
function create_post_practice_prompt_ui() {
  const html = `
    <div id="post-practice-prompt" class="post-practice-reflection" style="display: none;">
      <div class="reflection-content">
        <p>${get_message('prompt.title')}</p>
        <div class="prompt-buttons">
          <button onclick="open_daily_summary()" class="btn-primary">
            ${get_message('prompt.button_record')}
          </button>
          <button onclick="dismiss_post_practice_prompt()" class="btn-secondary">
            ${get_message('prompt.button_later')}
          </button>
        </div>
      </div>
    </div>
  `;
  return html;
}

/**
 * 修行後プロンプトを表示（70%の確率）
 */
function trigger_post_practice_reflection() {
  const should_show = Math.random() < 0.7;
  if (!should_show) {
    log_debug('プロンプト非表示（確率外）', 'info');
    return;
  }
  
  const prompt = document.getElementById('post-practice-prompt');
  if (!prompt) {
    log_debug('プロンプト要素が見つかりません', 'error');
    return;
  }
  
  prompt.style.display = 'block';
  prompt.style.animation = 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
  log_debug('修行後プロンプト表示', 'info');
}

/**
 * プロンプトを非表示
 */
function dismiss_post_practice_prompt() {
  const prompt = document.getElementById('post-practice-prompt');
  if (prompt) {
    prompt.style.display = 'none';
  }
}

/**
 * 日次サマリーモーダルを作成
 */
function create_daily_summary_modal() {
  const html = `
    <div id="daily-summary-modal" class="modal" style="display: none;">
      <div class="modal-overlay" onclick="close_daily_summary()"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>${get_message('summary.modal_title')}</h3>
          <button class="close-btn" onclick="close_daily_summary()">✕</button>
        </div>
        <div class="modal-body">
          <div class="section">
            <h4>${get_message('summary.practice_info_title')}</h4>
            <p id="modal-practice-info"></p>
          </div>
          <div class="section">
            <h4>${get_message('summary.events_title')}</h4>
            <div class="event-input-group">
              <label>${get_message('summary.joy_label')}</label>
              <input type="number" id="daily-joy-count" placeholder="0" min="0" />
            </div>
            <div class="event-input-group">
              <label>${get_message('summary.luck_label')}</label>
              <input type="number" id="daily-luck-count" placeholder="0" min="0" />
            </div>
            <div class="event-input-group">
              <label>${get_message('summary.relation_label')}</label>
              <input type="number" id="daily-relation-count" placeholder="0" min="0" />
            </div>
          </div>
          <div class="section">
            <h4>${get_message('summary.memo_label')}</h4>
            <textarea id="daily-memo" placeholder="${get_message('summary.memo_placeholder')}" rows="3"></textarea>
          </div>
          <div class="section">
            <label>
              <input type="checkbox" id="include-awakening-test" />
              ${get_message('summary.awakening_test')}
            </label>
          </div>
        </div>
        <div class="modal-footer">
          <button onclick="save_daily_summary()" class="btn-primary">
            ${get_message('summary.save_button')}
          </button>
          <button onclick="close_daily_summary()" class="btn-secondary">
            ${get_message('summary.cancel_button')}
          </button>
        </div>
      </div>
    </div>
  `;
  return html;
}

/**
 * 日次サマリーモーダルを開く
 */
function open_daily_summary() {
  const modal = document.getElementById('daily-summary-modal');
  if (!modal) {
    log_debug('サマリーモーダルが見つかりません', 'error');
    return;
  }
  
  const divasam = get_divasam_ajja();
  const log = get_sadhana_log(divasam);
  
  if (log) {
    const chant_merit = log.chant_count * PRACTICE_MERIT_SYSTEM.chant.per_unit;
    const gongyo_merit = log.total_gongyo_chars || 0;
    const total_merit = chant_merit + gongyo_merit;
    
    const info_html = `
      ${get_term('CHANT')} ${log.chant_count}回 + ${get_term('GONGYO')} ${log.total_gongyo_chars || 0}文字<br>
      = 合計 <strong>${total_merit}${get_term('MERIT')}</strong>
    `;
    document.getElementById('modal-practice-info').innerHTML = info_html;
  }
  
  modal.style.display = 'flex';
  dismiss_post_practice_prompt();
}

/**
 * 日次サマリーモーダルを閉じる
 */
function close_daily_summary() {
  const modal = document.getElementById('daily-summary-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

/**
 * 日次サマリーを保存
 */
function save_daily_summary() {
  const divasam = get_divasam_ajja();
  
  const phala_data = {
    joy_count: parseInt(document.getElementById('daily-joy-count').value, 10) || 0,
    luck_count: parseInt(document.getElementById('daily-luck-count').value, 10) || 0,
    relation_count: parseInt(document.getElementById('daily-relation-count').value, 10) || 0,
    memo: document.getElementById('daily-memo').value,
  };
  
  const success = save_phala_log(divasam, phala_data);
  
  if (success) {
    log_debug('【記録成功】日次サマリーを保存しました', 'info');
    close_daily_summary();
    document.getElementById('daily-joy-count').value = '';
    document.getElementById('daily-luck-count').value = '';
    document.getElementById('daily-relation-count').value = '';
    document.getElementById('daily-memo').value = '';
  } else {
    alert(get_message('alerts.save_error'));
  }
}
