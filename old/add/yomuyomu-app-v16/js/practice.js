/**
 * practice.js
 * 
 * 【修正点】
 * - MESSAGES と TERMINOLOGY を config.js から読み込むように変更
 * - 直接ハードコーディングされた文字列を get_message() で取得するように修正
 * - 固有単語は get_term() で取得
 * - UI テキストの変更は config.js のみで実施可能に
 * 
 * 目的：修行（Sadhana）のログ記録とカウント機能
 */

// ============================================
// 修行データ定義
// ============================================

const PRACTICE_MERIT_SYSTEM = {
  chant: {
    per_unit: 1,
    pali_name: 'Japa',
    nihongo_name: get_term('CHANT'),
  },
  
  gongyo: {
    per_char: 1,
    pali_name: 'Gongyo',
    nihongo_name: get_term('GONGYO'),
    
    types: {
      morning: {
        pali: 'purimo_gongyo',
        nihongo: get_term('GONGYO_MORNING'),
        chars: 2840,
        description: `朝の標準${get_term('GONGYO')}（約20分）`,
      },
      evening: {
        pali: 'saya_gongyo',
        nihongo: get_term('GONGYO_EVENING'),
        chars: 1420,
        description: `夜の標準${get_term('GONGYO')}（約10分）`,
      },
      custom: {
        pali: 'antaradhana_gongyo',
        nihongo: 'カスタム勤行',
        chars: null,
        description: 'ユーザーが文字数を指定',
      },
    },
  },
};

// ============================================
// 修行記録画面を作成・表示
// ============================================

/**
 * 修行記録画面を作成・表示
 */
function create_practice_log_ui() {
  const ui = `
    <div id="practice-log-container" class="practice-log">
      <h2>${get_message('main.practice_log_title')}</h2>
      
      <!-- 本日の修行情報表示 -->
      <div id="today-practice-summary" class="practice-summary">
        <!-- JavaScriptで動的に更新 -->
      </div>
      
      <!-- お題目カウント -->
      <div class="practice-input-section">
        <h3>${get_message('main.chant_label')}</h3>
        <div class="input-group">
          <label>${get_message('main.chant_label')}を記録する</label>
          <input 
            type="number" 
            id="chant-count-input" 
            placeholder="${get_message('main.chant_placeholder')}" 
            min="0"
            step="1"
          />
          <small>${get_message('main.chant_unit')}</small>
        </div>
        <button id="btn-save-chant" onclick="save_chant_practice()" class="btn-primary">
          📿 ${get_message('main.save_button')}
        </button>
      </div>
      
      <!-- 勤行選択 -->
      <div class="practice-input-section">
        <h3>${get_message('main.gongyo_label')}</h3>
        <div class="input-group">
          <label>${get_message('main.gongyo_label')}を行いましたか？</label>
          <select id="gongyo-type-select">
            <option value="">${get_message('main.gongyo_none')}</option>
            <option value="morning">${get_term('GONGYO_MORNING')}（2,840${get_term('MERIT')}）</option>
            <option value="evening">${get_term('GONGYO_EVENING')}（1,420${get_term('MERIT')}）</option>
            <option value="custom">カスタム${get_term('GONGYO')}</option>
          </select>
        </div>
        
        <!-- カスタム勤行の文字数入力 -->
        <div id="custom-gongyo-input" style="display: none;">
          <label>${get_term('GONGYO')}の文字数を入力してください</label>
          <input 
            type="number" 
            id="gongyo-custom-chars" 
            placeholder="例：2840" 
            min="0"
          />
          <small>1文字 = 1${get_term('MERIT')}で計算されます</small>
        </div>
        
        <button id="btn-save-gongyo" onclick="save_gongyo_practice()" class="btn-primary" style="display: none;">
          🙏 ${get_term('GONGYO')}を記録する
        </button>
      </div>
    </div>
  `;
  
  return ui;
}

// ============================================
// お題目カウント保存
// ============================================

/**
 * お題目を記録
 * 
 * 【動作フロー】
 * 1. ユーザーが数字を入力 → 「記録する」ボタンをクリック
 * 2. save_chant_practice() が呼ばれる
 * 3. 修行ログがstorage に保存される
 * 4. UI が更新される
 * 5. 3秒後にプロンプトが表示される
 */
function save_chant_practice() {
  const input = document.getElementById('chant-count-input');
  const chant_count = parseInt(input.value, 10);
  
  // バリデーション：数字の妥当性を確認
  if (isNaN(chant_count) || chant_count <= 0) {
    alert(get_message('alerts.input_error'));
    return;
  }
  
  const divasam = get_divasam_ajja();
  
  // 既存ログを取得：同一日の複数回記録に対応するため
  const existing_log = get_sadhana_log(divasam) || { chant_count: 0, gongyo_type: null };
  
  // 新しい修行ログを作成：新しい記録を既存データに追加
  const sadhana_data = {
    chant_count: existing_log.chant_count + chant_count,  // 累積
    gongyo_type: existing_log.gongyo_type,
  };
  
  // storage に保存：localStorage へのデータ永続化
  const success = save_sadhana_log(divasam, sadhana_data);
  
  if (success) {
    log_debug(`【記録成功】${get_term('CHANT')}を記録しました: ${chant_count}回`, 'info');
    
    // UI を更新：画面上の修行サマリーを最新状態に
    update_practice_summary();
    
    // 入力フィールドをクリア：次の入力に備える
    input.value = '';
    
    // 3秒後にプロンプトを表示：修行後の反射を促す
    setTimeout(() => {
      trigger_post_practice_reflection();
    }, 3000);
    
  } else {
    alert(get_message('alerts.save_error'));
  }
}

// ============================================
// 勤行記録
// ============================================

/**
 * 勤行選択UIのイベントリスナー設定
 */
function setup_gongyo_listener() {
  const select = document.getElementById('gongyo-type-select');
  const custom_input = document.getElementById('custom-gongyo-input');
  const btn_save = document.getElementById('btn-save-gongyo');
  
  select.addEventListener('change', (e) => {
    // カスタム勤行を選んだ場合：文字数入力フィールドを表示
    if (e.target.value === 'custom') {
      custom_input.style.display = 'block';
      btn_save.style.display = 'block';
    } 
    // 何も選ばない場合：フィールドと保存ボタンを非表示
    else if (e.target.value === '') {
      custom_input.style.display = 'none';
      btn_save.style.display = 'none';
    } 
    // 朝夜の標準勤行を選んだ場合：文字数入力を非表示、保存ボタンのみ表示
    else {
      custom_input.style.display = 'none';
      btn_save.style.display = 'block';
    }
  });
}

/**
 * 勤行を記録
 */
function save_gongyo_practice() {
  const select = document.getElementById('gongyo-type-select');
  const gongyo_type = select.value;
  
  // バリデーション：勤行タイプが選択されているか確認
  if (!gongyo_type) {
    alert(get_message('alerts.gongyo_type_error'));
    return;
  }
  
  const divasam = get_divasam_ajja();
  const existing_log = get_sadhana_log(divasam) || { chant_count: 0, gongyo_type: null };
  
  // 勤行の文字数を計算：タイプに応じて文字数を決定
  let gongyo_chars = 0;
  if (gongyo_type === 'custom') {
    // カスタム：ユーザー入力の文字数を使用
    const custom_chars = parseInt(
      document.getElementById('gongyo-custom-chars').value,
      10
    );
    if (isNaN(custom_chars) || custom_chars <= 0) {
      alert(get_message('alerts.gongyo_chars_error'));
      return;
    }
    gongyo_chars = custom_chars;
  } else {
    // 標準勤行：プリセット値を使用
    gongyo_chars = PRACTICE_MERIT_SYSTEM.gongyo.types[gongyo_type].chars;
  }
  
  // ログ保存：複数の勤行に対応するため、配列に追加
  const gongyo_list = existing_log.gongyo_list || [];
  gongyo_list.push({
    type: gongyo_type,
    chars: gongyo_chars,
    timestamp: new Date().toISOString(),
  });
  
  // データ構造を更新：修行ログに勤行情報を追加
  const sadhana_data = {
    chant_count: existing_log.chant_count,
    gongyo_list: gongyo_list,
    total_gongyo_chars: gongyo_list.reduce((sum, g) => sum + g.chars, 0),
  };
  
  // storage に保存：データの永続化
  const success = save_sadhana_log(divasam, sadhana_data);
  
  if (success) {
    log_debug(`【記録成功】${get_term('GONGYO')}を記録しました: ${gongyo_type}`, 'info');
    
    // UI を更新：画面上の修行サマリーを最新状態に
    update_practice_summary();
    
    // フォームをリセット：次の入力に備える
    select.value = '';
    document.getElementById('custom-gongyo-input').style.display = 'none';
    document.getElementById('btn-save-gongyo').style.display = 'none';
    
    // 3秒後にプロンプトを表示：修行後の反射を促す
    setTimeout(() => {
      trigger_post_practice_reflection();
    }, 3000);
  } else {
    alert(get_message('alerts.save_error'));
  }
}

// ============================================
// 修行サマリー表示
// ============================================

/**
 * 本日の修行サマリーを表示・更新
 */
function update_practice_summary() {
  const divasam = get_divasam_ajja();
  const log = get_sadhana_log(divasam);
  
  const summary_container = document.getElementById('today-practice-summary');
  
  // データが存在しない場合：未記録表示
  if (!log) {
    summary_container.innerHTML = `<p>${get_message('main.today_summary_title')}はまだ記録がありません</p>`;
    return;
  }
  
  // 功徳を計算：お題目と勤行の功徳を合算
  const chant_merit = log.chant_count * PRACTICE_MERIT_SYSTEM.chant.per_unit;
  const gongyo_merit = log.total_gongyo_chars || 0;
  const total_merit = chant_merit + gongyo_merit;
  
  // HTML を構築：修行サマリーの表示フォーマット
  const html = `
    <div class="summary-grid">
      <div class="summary-item">
        <h4>${get_message('main.chant_label')}</h4>
        <p class="big-number">${log.chant_count}</p>
        <p class="small-text">${get_message('main.chant_unit')} = ${chant_merit}${get_term('MERIT')}</p>
      </div>
      
      <div class="summary-item">
        <h4>${get_message('main.gongyo_label')}</h4>
        <p class="big-number">${log.total_gongyo_chars || 0}</p>
        <p class="small-text">文字 = ${gongyo_merit}${get_term('MERIT')}</p>
      </div>
      
      <div class="summary-item highlight">
        <h4>${get_message('main.total_merit')}</h4>
        <p class="big-number" style="color: #2e7d32;">${total_merit}</p>
        <p class="small-text">${get_message('main.total_label')}</p>
      </div>
    </div>
  `;
  
  summary_container.innerHTML = html;
}
