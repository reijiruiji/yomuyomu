/**
 * abilities.js
 * 
 * 目的：アプリの『核』となる9つのパーリ語能力を定義
 * すべてのスコア・テスト・分析はここを基準に動作
 * 
 * パーリ語の能力体系：
 * 段階1：Sati（念）
 *   - Samadhi（定）
 *   - Sila（戒）
 *   - Indriya（根）
 * 
 * 段階2：Vipassana（観）
 *   - Panna（慧）
 *   - Anatta（無我）
 *   - Anicca（無常）
 * 
 * 段階3：Bodhi（覚）
 *   - Magga（道）
 *   - Phala（果）
 *   - Nirvana（涅槃）
 */

// ============================================
// 能力定義（パーリ語をキー）
// ============================================

const AWAKENING_ABILITIES = {
  // ========== 段階1：Sati（念・気づき） ==========
  samadhi: {
    pali_name: 'Samadhi',
    nihongo_name: '定（じょう）',
    nihongo_short: '定',
    nihongo_description: '心が一点に集中している状態',
    
    stage: 'sati',
    stage_nihongo: '段階1：Sati（念）',
    
    test_type: 'daily',
    scale_min: 0,
    scale_max: 10,
    scale_min_label: '雑念でいっぱい',
    scale_max_label: '完全に一点集中',
    
    interpretation: '修行中の心の集中度。雑念が減り、一点集中ができるようになった度合い。',
    health_benefit: 'ストレス低減、集中力向上',
  },
  
  sila: {
    pali_name: 'Sila',
    nihongo_name: '戒（かい）',
    nihongo_short: '戒',
    nihongo_description: '自分の行動をコントロールする能力',
    
    stage: 'sati',
    stage_nihongo: '段階1：Sati（念）',
    
    test_type: 'daily',
    scale_min: 0,
    scale_max: 10,
    scale_min_label: '反射的に行動している',
    scale_max_label: '意識的に選択できている',
    
    interpretation: '意図的に行動できるようになった度合い。『つい反応する』ではなく『選択する』ができるようになる。',
    health_benefit: '自己制御力向上、習慣改善',
  },
  
  indriya: {
    pali_name: 'Indriya',
    nihongo_name: '根（こん）',
    nihongo_short: '根',
    nihongo_description: '五感の敏感さ',
    
    stage: 'sati',
    stage_nihongo: '段階1：Sati（念）',
    
    test_type: 'daily',
    scale_min: 0,
    scale_max: 10,
    sense_modalities: [
      { pali: 'cakkhu', nihongo: '視覚（目）', category: 'sight' },
      { pali: 'sota', nihongo: '聴覚（耳）', category: 'hearing' },
      { pali: 'ghana', nihongo: '嗅覚（鼻）', category: 'smell' },
      { pali: 'jivha', nihongo: '味覚（舌）', category: 'taste' },
      { pali: 'kaya', nihongo: '触覚（皮膚）', category: 'touch' },
    ],
    
    interpretation: '五感が研ぎ澄まされた度合い。世界がより鮮明に見える・聞こえるようになる。',
    health_benefit: '感覚の敏感化、環境への気付き向上',
  },
  
  // ========== 段階2：Vipassana（観・自己認識） ==========
  panna: {
    pali_name: 'Panna',
    nihongo_name: '慧（え）',
    nihongo_short: '慧',
    nihongo_description: 'メタ認知（自分を観察する能力）',
    
    stage: 'vipassana',
    stage_nihongo: '段階2：Vipassana（観）',
    
    test_type: 'weekly',
    scale_min: 0,
    scale_max: 10,
    scale_min_label: '自分の思考が見えない',
    scale_max_label: '自分の思考パターンが完全に見える',
    
    interpretation: '自分の思考プロセスを観察できるようになった度合い。「なぜそう考えるのか」が理解できるレベル。',
    health_benefit: 'メタ認知向上、自己理解の深化',
  },
  
  anatta: {
    pali_name: 'Anatta',
    nihongo_name: '無我（むが）',
    nihongo_short: '無我',
    nihongo_description: '執着からの解放（人生への対応力）',
    
    stage: 'vipassana',
    stage_nihongo: '段階2：Vipassana（観）',
    
    test_type: 'weekly',
    scale_min: 0,
    scale_max: 10,
    scale_min_label: '「俺は俺」という感覚が強い',
    scale_max_label: '「固定的な自分」という概念がぼやけてきた',
    
    interpretation: '自分が常に変化していることの理解。「固定的な自分に執着しない」ことで得られる自由度。',
    health_benefit: 'ストレス耐性向上、柔軟性増加、人生への不安軽減',
  },
  
  anicca: {
    pali_name: 'Anicca',
    nihongo_name: '無常（むじょう）',
    nihongo_short: '無常',
    nihongo_description: '変化の理解',
    
    stage: 'vipassana',
    stage_nihongo: '段階2：Vipassana（観）',
    
    test_type: 'weekly',
    input_type: 'text_array',
    
    interpretation: '自分が常に変化していることに気付き、その変化を自然だと受け入れられる度合い。',
    health_benefit: '人生の受容性向上、成長マインドセットの定着',
  },
  
  // ========== 段階3：Bodhi（覚・解脱への道） ==========
  magga: {
    pali_name: 'Magga',
    nihongo_name: '道（どう）',
    nihongo_short: '道',
    nihongo_description: '正しい判断ができるようになった度合い',
    
    stage: 'bodhi',
    stage_nihongo: '段階3：Bodhi（覚）',
    
    test_type: 'monthly',
    scale_min: 0,
    scale_max: 10,
    scale_min_label: '判断に常に迷う',
    scale_max_label: '何をすべきかいつも明確',
    
    interpretation: '「何をすべきか」が直感的に分かるようになった度合い。判断の明確さと速度。',
    health_benefit: '意思決定能力向上、人生の方向性の明確化',
  },
  
  phala: {
    pali_name: 'Phala',
    nihongo_name: '果（か）',
    nihongo_short: '果',
    nihongo_description: '修行による『外的な恩恵』',
    
    stage: 'bodhi',
    stage_nihongo: '段階3：Bodhi（覚）',
    
    test_type: 'monthly',
    input_type: 'event_counter',
    event_categories: [
      { pali: 'piti', nihongo: '嬉しい出来事' },
      { pali: 'anuppatti', nihongo: '予期しない幸運' },
      { pali: 'metta_improvement', nihongo: '人間関係の改善' },
    ],
    
    interpretation: '修行による「外的な幸運」が増える度合い。これは『修行による他業不思議』の現れ。',
    health_benefit: '人生充実度向上、主観的幸福感の増加',
  },
  
  nirvana: {
    pali_name: 'Nirvana',
    nihongo_name: '涅槃（ねはん）',
    nihongo_short: '涅槃',
    nihongo_description: '苦からの解放',
    
    stage: 'bodhi',
    stage_nihongo: '段階3：Bodhi（覚）',
    
    test_type: 'monthly',
    scale_min: 0,
    scale_max: 10,
    scale_min_label: '人生は苦しい',
    scale_max_label: '完全に苦しみから解放されている',
    
    interpretation: '「生きることは苦しい」という感覚が減る度合い。むしろ「落ち着き」「寧静」が増す。',
    health_benefit: 'メンタルヘルス向上、人生満足度の増加',
  },
};

// ============================================
// アシスタント関数
// ============================================

/**
 * パーリ語の能力情報を取得
 * 
 * @param {string} pali_ability_name - パーリ語能力名（例：'samadhi'）
 * @returns {object} 能力情報オブジェクト
 */
function get_ability_info(pali_ability_name) {
  return AWAKENING_ABILITIES[pali_ability_name] || null;
}

/**
 * 特定の段階に属する能力をすべて取得
 * 
 * @param {string} stage - 段階（'sati', 'vipassana', 'bodhi'）
 * @returns {object[]} その段階の能力リスト
 */
function get_abilities_by_stage(stage) {
  return Object.values(AWAKENING_ABILITIES).filter(ability => ability.stage === stage);
}

/**
 * テストタイプ別に能力を取得
 * 
 * @param {string} test_type - テスト種別（'daily', 'weekly', 'monthly'）
 * @returns {object[]} そのテストタイプの能力リスト
 */
function get_abilities_by_test_type(test_type) {
  return Object.entries(AWAKENING_ABILITIES)
    .filter(([_, ability]) => ability.test_type === test_type)
    .map(([key, ability]) => ({ pali_name: key, ...ability }));
}

/**
 * 9つすべての能力キーを取得
 * 
 * @returns {string[]} パーリ語能力名の配列
 */
function get_all_ability_names() {
  return Object.keys(AWAKENING_ABILITIES);
}
