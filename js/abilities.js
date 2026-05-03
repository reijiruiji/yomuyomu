/**
 * 覚醒能力（9）— グラフ・テスト用ラベル
 */

const AWAKENING_ABILITIES = {
  sati: { id: 'sati', label_ja: '念（サティ）', pali: 'sati' },
  vipassana: { id: 'vipassana', label_ja: '観（ヴィパッサナー）', pali: 'vipassanā' },
  bodhi: { id: 'bodhi', label_ja: '智（ボーディ）', pali: 'bodhi' },
  prajna: { id: 'prajna', label_ja: '般若', pali: 'paññā' },
  samadhi: { id: 'samadhi', label_ja: '定（サマーディ）', pali: 'samādhi' },
  shila: { id: 'shila', label_ja: '戒（シーラ）', pali: 'sīla' },
  metta: { id: 'metta', label_ja: '慈（メッター）', pali: 'mettā' },
  karuna: { id: 'karuna', label_ja: '悲（カルナー）', pali: 'karuṇā' },
  mudita: { id: 'mudita', label_ja: '喜（ムディター）', pali: 'muditā' },
};

/**
 * 段階モデル（将来のセルフチェック UI 用メタデータ）
 * storage の ability_* や上記 AWAKENING_ABILITIES（グラフ）とはキー体系が異なります。
 * 医療・宗教的効果の主張には使いません。
 */
const PALI_STAGE_ABILITIES = {
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
    scale_max_label: 'よく集中できた',
    interpretation: '読誦中の集中の自己評価の目安（測定ではありません）。',
  },
  sila: {
    pali_name: 'Sila',
    nihongo_name: '戒（かい）',
    nihongo_short: '戒',
    nihongo_description: '行動を意図的に選ぶ感覚',
    stage: 'sati',
    stage_nihongo: '段階1：Sati（念）',
    test_type: 'daily',
    scale_min: 0,
    scale_max: 10,
    scale_min_label: '反射的だった',
    scale_max_label: '意図を持って選べた',
    interpretation: '「やる／やらない」を自分で選べた感覚のメモ用。',
  },
  indriya: {
    pali_name: 'Indriya',
    nihongo_name: '根（こん）',
    nihongo_short: '根',
    nihongo_description: '五感まわりの気づき',
    stage: 'sati',
    stage_nihongo: '段階1：Sati（念）',
    test_type: 'daily',
    sense_modalities: [
      { pali: 'cakkhu', nihongo: '視覚', category: 'sight' },
      { pali: 'sota', nihongo: '聴覚', category: 'hearing' },
      { pali: 'ghana', nihongo: '嗅覚', category: 'smell' },
      { pali: 'jivha', nihongo: '味覚', category: 'taste' },
      { pali: 'kaya', nihongo: '触覚', category: 'touch' },
    ],
    interpretation: '感覚への気づきのメモ用（臨床評価ではありません）。',
  },
  panna: {
    pali_name: 'Panna',
    nihongo_name: '慧（え）',
    nihongo_short: '慧',
    nihongo_description: '自分の思考をながめる感覚',
    stage: 'vipassana',
    stage_nihongo: '段階2：Vipassana（観）',
    test_type: 'weekly',
    scale_min: 0,
    scale_max: 10,
    scale_min_label: '思考が手探り',
    scale_max_label: '流れを言語化しやすい',
    interpretation: 'メタ認知の自己チェック用の目安。',
  },
  anatta: {
    pali_name: 'Anatta',
    nihongo_name: '無我（むが）',
    nihongo_short: '無我',
    nihongo_description: '構え・執着に気づける度合い',
    stage: 'vipassana',
    stage_nihongo: '段階2：Vipassana（観）',
    test_type: 'weekly',
    scale_min: 0,
    scale_max: 10,
    scale_min_label: '固い感覚が強い',
    scale_max_label: '状況とともに柔らかくなれる',
    interpretation: '心理的柔軟性の自己観察メモ用。',
  },
  anicca: {
    pali_name: 'Anicca',
    nihongo_name: '無常（むじょう）',
    nihongo_short: '無常',
    nihongo_description: '変化のメモ',
    stage: 'vipassana',
    stage_nihongo: '段階2：Vipassana（観）',
    test_type: 'weekly',
    input_type: 'text_array',
    interpretation: '短文で「今日いちばん変化を感じたこと」を残す想定。',
  },
  magga: {
    pali_name: 'Magga',
    nihongo_name: '道（どう）',
    nihongo_short: '道',
    nihongo_description: '次の一手の明確さ',
    stage: 'bodhi',
    stage_nihongo: '段階3：Bodhi（覚）',
    test_type: 'monthly',
    scale_min: 0,
    scale_max: 10,
    scale_min_label: '迷いが多い',
    scale_max_label: '方針が言葉にできる',
    interpretation: '意思決定の自己評価メモ用。',
  },
  phala: {
    pali_name: 'Phala',
    nihongo_name: '果（か）',
    nihongo_short: '果',
    nihongo_description: '出来事の件数ログ',
    stage: 'bodhi',
    stage_nihongo: '段階3：Bodhi（覚）',
    test_type: 'monthly',
    input_type: 'event_counter',
    event_categories: [
      { pali: 'piti', nihongo: '嬉しい出来事' },
      { pali: 'anuppatti', nihongo: '予期しない幸運' },
      { pali: 'metta_improvement', nihongo: '人間関係の改善' },
    ],
    interpretation: '一日の記録モーダルのカウンタと対応可能な分類メモ。',
  },
  nirvana: {
    pali_name: 'Nirvana',
    nihongo_name: '涅槃（ねはん）',
    nihongo_short: '涅槃',
    nihongo_description: '負担感・苦しさの主観スケール（比喩的ラベル）',
    stage: 'bodhi',
    stage_nihongo: '段階3：Bodhi（覚）',
    test_type: 'monthly',
    scale_min: 0,
    scale_max: 10,
    scale_min_label: 'しんどさを感じやすい',
    scale_max_label: '落ち着きを感じやすい',
    interpretation: '医学的抑うつ尺度ではありません。主観ログ用です。',
  },
};

function getPaliStageAbilityInfo(key) {
  return PALI_STAGE_ABILITIES[key] || null;
}

function getPaliStageByStage(stage) {
  return Object.values(PALI_STAGE_ABILITIES).filter((a) => a.stage === stage);
}

function getPaliStageByTestType(testType) {
  return Object.entries(PALI_STAGE_ABILITIES)
    .filter(([, a]) => a.test_type === testType)
    .map(([key, ability]) => ({ key, ...ability }));
}

function getAllPaliStageKeys() {
  return Object.keys(PALI_STAGE_ABILITIES);
}

function calcMajjha(numbers) {
  if (!numbers || !numbers.length) return 0;
  const sum = numbers.reduce((a, b) => a + b, 0);
  return Math.round((sum / numbers.length) * 100) / 100;
}

function calcVuddhiPercent(previous, current) {
  if (previous === 0) return current === 0 ? 0 : 100;
  return Math.round(((current - previous) / previous) * 100);
}

const PALI_TO_NIHONGO = {
  samadhi: '定（じょう）',
  sila: '戒（かい）',
  indriya: '根（こん）',
  panna: '慧（え）',
  anatta: '無我（むが）',
  anicca: '無常（むじょう）',
  magga: '道（どう）',
  phala: '果（か）',
  nirvana: '涅槃（ねはん）',
};

function paliToNihongo(paliName) {
  return PALI_TO_NIHONGO[paliName] || paliName;
}

/** 段階モデル PALI_STAGE_ABILITIES 用（グラフ用 AWAKENING_ABILITIES とは別） */
window.get_pali_stage_ability = getPaliStageAbilityInfo;
window.get_pali_stage_by_stage = getPaliStageByStage;
window.get_pali_stage_by_test_type = getPaliStageByTestType;
window.get_all_pali_stage_keys = getAllPaliStageKeys;

window.get_ability_info = getPaliStageAbilityInfo;
window.get_abilities_by_stage = getPaliStageByStage;
window.get_abilities_by_test_type = getPaliStageByTestType;
window.get_all_ability_names = getAllPaliStageKeys;
window.calc_majjha = calcMajjha;
window.calc_vuddhi_percent = calcVuddhiPercent;
window.pali_to_nihongo = paliToNihongo;
window.PALI_STAGE_ABILITIES = PALI_STAGE_ABILITIES;
