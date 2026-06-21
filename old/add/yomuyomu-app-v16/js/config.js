/**
 * config.js
 * 
 * 目的：アプリ全体の『固有単語』『表現』を一元管理
 * 
 * このファイルをいじるだけで、アプリ全体の言葉が変わる仕組み
 * 
 * 使い方：
 * 1. 以下の TERMINOLOGY や MESSAGES を編集
 * 2. 他のファイルはこのconfig.jsを参照するだけ
 * 3. アプリ全体の表現が一括変更される
 */

// ============================================
// 固有単語リスト
// ============================================

const TERMINOLOGY = {
  // 修行という単語（後から全部変更可能）
  PRACTICE_ACTIVITY: 'おべんぎょう',  // 「修行」の代わりに使う言葉
  PRACTICE_ACTIVITY_KANJI: 'お勤行',
  
  // お題目
  CHANT: 'お題目',
  CHANT_READING: 'だいもく',
  
  // 勤行（この構成は変わらない）
  GONGYO: '勤行',
  GONGYO_READING: 'ごんぎょう',
  GONGYO_MORNING: '朝の勤行',
  GONGYO_EVENING: '夜の勤行',
  
  // 功徳
  MERIT: '功徳',
  MERIT_UNIT: '功徳',
  
  // 一日
  DAY: '一日',
  TODAY: '今日',
  
  // アプリ名
  APP_NAME: 'よむよむお題目',
  APP_NAME_SUBTITLE: 'あなたの人生が変わるアプリ',
};

// ============================================
// メッセージテンプレート
// ============================================

const MESSAGES = {
  // チュートリアル
  tutorial: {
    step1_title: '🚀 人生が変わるアプリ',
    step1_subtitle: `毎日の${TERMINOLOGY.PRACTICE_ACTIVITY}で得られるもの：`,
    step1_benefit1_title: '心が落ち着く',
    step1_benefit1_desc: '雑念が減り、判断が早くなる',
    step1_benefit2_title: '自分をコントロールできるようになる',
    step1_benefit2_desc: '『やると決めたことができる人』になる',
    step1_benefit3_title: '人生が整う',
    step1_benefit3_desc: '良い出会い、思わぬ幸運が増える',
    step1_benefit4_title: '『成功パターン』が見える',
    step1_benefit4_desc: `${TERMINOLOGY.PRACTICE_ACTIVITY}量と人生の変化が『データで繋がる』`,
    step1_footer: 'これは『信仰』ではなく『科学的な事実』です。\nあなたのデータが、それを証明します。',
    
    step2_title: '📊 3つの『変化』を可視化',
    step2_feature1_title: `1️⃣ ${TERMINOLOGY.PRACTICE_ACTIVITY}ログ`,
    step2_feature1_desc: `毎日の${TERMINOLOGY.PRACTICE_ACTIVITY}を記録`,
    step2_feature1_result: `例：「この月は3,000${TERMINOLOGY.MERIT}を積んだ」→ その月の幸運は先月の2倍`,
    
    step2_feature2_title: '2️⃣ 心の状態を数値化',
    step2_feature2_desc: 'あなたの『心の成長』が見える',
    step2_feature2_result: `例：集中度 5.0 → 7.5に向上 = 「以前より『やる気』が続く」という実感`,
    
    step2_feature3_title: '3️⃣ 人生の変化をデータで証明',
    step2_feature3_desc: '修行と現実の繋がりを見える化',
    step2_feature3_result: `例：${TERMINOLOGY.PRACTICE_ACTIVITY}が多い週は、幸運が68%増加 = データが『${TERMINOLOGY.PRACTICE_ACTIVITY}は効く』ことを証明`,
    
    step3_title: '📱 ホーム画面に追加',
    step3_warning: '⚠️ 重要な設定です',
    step3_desc: `このアプリを『毎日使う』ために、スマホのホーム画面に追加してください。`,
    
    step4_title: '⏰ 毎日の通知時間を設定',
    step4_desc1: `${TERMINOLOGY.TODAY}、何時に${TERMINOLOGY.CHANT}を読みたいですか？`,
    step4_desc2: `${TERMINOLOGY.GONGYO}は？`,
    step4_help: `毎日この時間に通知が来ます`,
    
    step5_title: '🎉 準備完了！',
    step5_desc: `あなたの${TERMINOLOGY.PRACTICE_ACTIVITY}の記録がホーム画面から始まります。\n\n毎日の${TERMINOLOGY.PRACTICE_ACTIVITY}を記録し、\nあなたのパターンを一緒に見守ります。`,
  },
  
  // メイン画面
  main: {
    practice_log_title: `📿 ${TERMINOLOGY.PRACTICE_ACTIVITY}を記録する`,
    today_summary_title: `${TERMINOLOGY.TODAY}の${TERMINOLOGY.PRACTICE_ACTIVITY}`,
    
    chant_label: `${TERMINOLOGY.CHANT}`,
    chant_placeholder: '何回？',
    chant_unit: '回',
    chant_merit: `${TERMINOLOGY.MERIT}`,
    
    gongyo_label: `${TERMINOLOGY.GONGYO}`,
    gongyo_none: 'なし',
    gongyo_result: `${TERMINOLOGY.MERIT}`,
    
    total_merit: `${TERMINOLOGY.TODAY}の${TERMINOLOGY.MERIT}`,
    total_label: '合計',
    
    save_button: '記録する',
  },
  
  // プロンプト
  prompt: {
    title: `📝 ${TERMINOLOGY.TODAY}はどんな一日だった？`,
    button_record: `${TERMINOLOGY.TODAY}の出来事を記録 →`,
    button_later: '後で',
  },
  
  // サマリーモーダル
  summary: {
    modal_title: `${TERMINOLOGY.TODAY}の一日`,
    practice_info_title: `📿 ${TERMINOLOGY.TODAY}の${TERMINOLOGY.PRACTICE_ACTIVITY}`,
    events_title: '📍 今日の出来事',
    joy_label: '嬉しい出来事',
    luck_label: '予期しない幸運',
    relation_label: '人間関係の改善',
    memo_label: '💭 今日の気づき',
    memo_placeholder: '今日の感想や気づきなど（任意）',
    awakening_test: '覚醒度テストも一緒に実施する',
    save_button: '記録する',
    cancel_button: 'キャンセル',
  },
  
  // エラー・アラート
  alerts: {
    input_error: `1回以上の数字を入力してください`,
    gongyo_type_error: `${TERMINOLOGY.GONGYO}タイプを選択してください`,
    gongyo_chars_error: '文字数を入力してください',
    save_error: '記録に失敗しました',
    save_success: '記録しました',
  },
};

// ============================================
// スケジュール設定
// ============================================

const SCHEDULE_CONFIG = {
  // 通知時間のプリセット
  chant_times: [
    { label: '朝6時', value: 6 },
    { label: '朝7時', value: 7 },
    { label: '朝8時', value: 8 },
    { label: '昼12時', value: 12 },
    { label: '夕方6時', value: 18 },
    { label: '夜8時', value: 20 },
    { label: 'その他', value: 'custom' },
  ],
  
  gongyo_times: {
    morning: [
      { label: '朝5時', value: 5 },
      { label: '朝6時', value: 6 },
      { label: '朝7時', value: 7 },
      { label: 'その他', value: 'custom' },
    ],
    evening: [
      { label: '夜8時', value: 20 },
      { label: '夜9時', value: 21 },
      { label: '夜10時', value: 22 },
      { label: 'その他', value: 'custom' },
    ],
  },
};

// ============================================
// UI テキストのゲッター関数
// ============================================

/**
 * メッセージを取得
 * ネストされたオブジェクトから値を取得
 * 
 * @param {string} path - ドット区切りのパス（例：'tutorial.step1_title'）
 * @returns {string} メッセージ文字列
 */
function get_message(path) {
  const keys = path.split('.');
  let value = MESSAGES;
  
  for (const key of keys) {
    value = value[key];
    if (value === undefined) {
      console.warn(`メッセージが見つかりません: ${path}`);
      return path;  // フォールバック
    }
  }
  
  return value;
}

/**
 * 固有単語を取得
 * 
 * @param {string} term - 単語キー（例：'PRACTICE_ACTIVITY'）
 * @returns {string} 単語文字列
 */
function get_term(term) {
  return TERMINOLOGY[term] || term;
}
