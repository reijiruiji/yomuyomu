/**
 * app.js
 * 
 * 目的：アプリケーション全体の初期化と制御
 * 
 * 起動順序：
 * 1. チュートリアルが完了しているか確認
 * 2. チュートリアル表示 or メイン画面表示
 * 3. 各種イベントリスナー設定
 * 4. デバッグモード確認
 */

/**
 * アプリケーション起動
 */
function init_yomuyomu_app() {
  log_debug('🚀 アプリ初期化開始', 'info');
  
  const tutorial_completed = localStorage.getItem(STORAGE_KEYS.TUTORIAL_COMPLETED) === 'true';
  
  if (!tutorial_completed) {
    show_tutorial();
  } else {
    show_main_app();
  }
  
  setup_debug_mode();
  log_debug('✅ アプリ初期化完了', 'info');
}

/**
 * チュートリアルを表示
 */
function show_tutorial() {
  const container = document.getElementById('tutorial-container');
  
  const tutorial_html = `
    <div id="tutorial-screen" class="tutorial-overlay">
      <div class="tutorial-content">
        
        <!-- ステップ1 -->
        <div class="tutorial-step" id="tutorial-step-1">
          <h2>${get_message('tutorial.step1_title')}</h2>
          <p>${get_message('tutorial.step1_footer')}</p>
          <button onclick="next_tutorial()" class="btn-primary">詳しく見る →</button>
        </div>
        
        <!-- ステップ2 -->
        <div class="tutorial-step" id="tutorial-step-2" style="display: none;">
          <h2>${get_message('tutorial.step2_title')}</h2>
          <button onclick="next_tutorial()" class="btn-primary">次へ →</button>
        </div>
        
        <!-- ステップ3 -->
        <div class="tutorial-step" id="tutorial-step-3" style="display: none;">
          <h2>${get_message('tutorial.step3_title')}</h2>
          <p>${get_message('tutorial.step3_desc')}</p>
          <div class="completion-check">
            <label>
              <input type="checkbox" id="completion-check" />
              ホーム画面に追加しました ✓
            </label>
          </div>
          <button id="next-btn-step3" onclick="next_tutorial()" disabled>次へ →</button>
          <script>
            setTimeout(() => {
              const check = document.getElementById('completion-check');
              if (check) {
                check.addEventListener('change', (e) => {
                  const btn = document.getElementById('next-btn-step3');
                  btn.disabled = !e.target.checked;
                });
              }
            }, 100);
          </script>
        </div>
        
        <!-- ステップ4：スケジュール設定 -->
        <div class="tutorial-step" id="tutorial-step-4" style="display: none;">
          <h2>⏰ 毎日の通知時間を設定</h2>
          <div class="schedule-section">
            <h3>📿 ${get_term('CHANT')}の通知時間</h3>
            <select id="chant-time-select" onchange="update_chant_time_display()">
              <option value="">時間を選択してください</option>
              <option value="6">朝6時</option>
              <option value="7">朝7時</option>
              <option value="8">朝8時</option>
              <option value="20">夜8時</option>
            </select>
            <div id="chant-custom-time" style="display: none;">
              <input type="number" id="chant-custom-hour" placeholder="6" min="0" max="23" />
            </div>
          </div>
          <div class="schedule-summary" id="schedule-summary">
            <p id="schedule-summary-text">スケジュールを選択してください</p>
          </div>
          <button id="next-btn-step4" onclick="save_tutorial_schedule()" disabled>次へ →</button>
        </div>
        
        <!-- ステップ5：完了 -->
        <div class="tutorial-step" id="tutorial-step-5" style="display: none;">
          <h2>${get_message('tutorial.step5_title')}</h2>
          <p>${get_message('tutorial.step5_desc')}</p>
          <button onclick="complete_tutorial()" class="btn-primary">アプリを始める →</button>
        </div>
        
      </div>
    </div>
  `;
  
  container.innerHTML = tutorial_html;
  log_debug('【チュートリアル表示】', 'info');
}

/**
 * チュートリアルのステップを進める
 */
function next_tutorial() {
  let current_step = 1;
  for (let i = 1; i <= 5; i++) {
    const step = document.getElementById(`tutorial-step-${i}`);
    if (step && step.style.display !== 'none') {
      current_step = i;
      break;
    }
  }
  
  const next_step = current_step + 1;
  if (next_step <= 5) {
    document.getElementById(`tutorial-step-${current_step}`).style.display = 'none';
    document.getElementById(`tutorial-step-${next_step}`).style.display = 'block';
  }
}

/**
 * スケジュール設定を表示更新（リアルタイム）
 */
function update_chant_time_display() {
  const select = document.getElementById('chant-time-select');
  const btn = document.getElementById('next-btn-step4');
  
  if (select.value) {
    document.getElementById('schedule-summary-text').textContent = 
      `${hour_to_nihongo(parseInt(select.value))}にお題目通知`;
    btn.disabled = false;
  } else {
    btn.disabled = true;
  }
}

/**
 * スケジュール設定を保存
 */
function save_tutorial_schedule() {
  const chant_select = document.getElementById('chant-time-select');
  const chant_hour = parseInt(chant_select.value, 10);
  
  if (chant_hour >= 0 && chant_hour <= 23) {
    save_chant_schedule(chant_hour);
  }
  
  document.getElementById('tutorial-step-4').style.display = 'none';
  document.getElementById('tutorial-step-5').style.display = 'block';
  
  request_notification_permission();
  log_debug('【スケジュール保存】チュートリアル設定完了', 'info');
}

/**
 * チュートリアルを完了
 */
function complete_tutorial() {
  localStorage.setItem(STORAGE_KEYS.TUTORIAL_COMPLETED, 'true');
  document.getElementById('tutorial-container').innerHTML = '';
  show_main_app();
  log_debug('【チュートリアル完了】メインアプリ起動', 'info');
}

/**
 * メインアプリを表示
 */
function show_main_app() {
  const app_container = document.getElementById('app');
  
  const practice_ui = create_practice_log_ui();
  const summary_modal = create_daily_summary_modal();
  const prompt = create_post_practice_prompt_ui();
  
  app_container.innerHTML = practice_ui + summary_modal + prompt;
  
  setup_gongyo_listener();
  update_practice_summary();
  
  log_debug('【メインアプリ表示】起動完了', 'info');
}

/**
 * デバッグモードをセットアップ
 */
function setup_debug_mode() {
  window.enable_debug_mode = function() {
    const password = prompt('デバッグモードパスワード：');
    if (password !== 'namu_myoho_renge_kyo') {
      console.log('❌ パスワードが間違っています');
      return;
    }
    
    localStorage.setItem(STORAGE_KEYS.DEBUG_MODE, 'true');
    show_debug_panel();
    console.log('✅ デバッグモード有効化');
  };
  
  if (is_debug_mode()) {
    show_debug_panel();
  }
}

/**
 * デバッグパネルを表示
 */
function show_debug_panel() {
  const container = document.getElementById('debug-panel-container');
  
  const debug_html = `
    <div id="debug-panel" style="
      position: fixed;
      bottom: 20px;
      left: 20px;
      width: 300px;
      background: #1a1a1a;
      color: #00ff00;
      padding: 15px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 11px;
      z-index: 9999;
    ">
      <h4 style="margin: 0 0 10px 0; color: #ffff00;">🛠️ DEBUG PANEL</h4>
      <button onclick="debug_show_schedules()" style="margin: 2px;">📅 スケジュール確認</button>
      <button onclick="debug_show_storage_stats()" style="margin: 2px;">💾 ストレージ確認</button>
      <button onclick="close_debug_panel()" style="margin-top: 10px;">✕ 閉じる</button>
    </div>
  `;
  
  container.innerHTML = debug_html;
  container.style.display = 'block';
}

/**
 * デバッグパネルを閉じる
 */
function close_debug_panel() {
  document.getElementById('debug-panel-container').style.display = 'none';
}

/**
 * スケジュール確認（デバッグ）
 */
function debug_show_schedules() {
  const chant = get_chant_schedule();
  const morning = get_gongyo_schedule('morning');
  const evening = get_gongyo_schedule('evening');
  
  console.log('【スケジュール情報】');
  console.log(`お題目: ${chant ? `${hour_to_nihongo(chant.hour)}` : '未設定'}`);
  console.log(`朝勤行: ${morning ? `${hour_to_nihongo(morning.hour)}` : '未設定'}`);
  console.log(`夜勤行: ${evening ? `${hour_to_nihongo(evening.hour)}` : '未設定'}`);
}

/**
 * ストレージ確認（デバッグ）
 */
function debug_show_storage_stats() {
  const stats = get_storage_stats();
  console.log('【ストレージ情報】');
  console.log(`合計: ${stats.total_size_kb} KB`);
  console.log(`アイテム数: ${stats.item_count}`);
}

// 初期化実行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init_yomuyomu_app);
} else {
  init_yomuyomu_app();
}
