// Dharma Quest shared data — used by both index.html and dharma_quest_v7.html

var STAGES = [
  {
    id: 's0',
    rank_ja: '在家信者', rank_en: 'Lay Practitioner',
    icon: '🌱',
    pali: 'upāsaka',
    freed_ja: '（修行の入口）', freed_en: '(Entry to the path)',
    samsara_ja: '輪廻はまだ続く', samsara_en: 'Samsāra continues',
    desc_ja: '三宝（仏・法・僧）に帰依し、修行を始めた者。最初の一歩。',
    desc_en: 'One who takes refuge in the Triple Gem and begins the path.',
    color: '#25A070',
    scriptures: ['tisarana','dhp1'],
    quiz_id: 'q_s0',
  },
  {
    id: 's1',
    rank_ja: '預流果', rank_en: 'Stream-Enterer',
    icon: '📿',
    pali: 'sotāpatti-phala',
    freed_ja: '解放される結：\n① 有身見（我が恒久という信条）\n② 疑（教えへの疑い）\n③ 戒禁取（誤った戒律への執着）',
    freed_en: 'Fetters released:\n① Sakkāya-diṭṭhi (belief in a permanent self)\n② Vicikicchā (doubt about the teaching)\n③ Sīlabbata-parāmāsa (attachment to wrong rules)',
    samsara_ja: '最大7回、欲界と天界を輪廻する',
    samsara_en: 'At most 7 more rebirths in the sense and form realms',
    desc_ja: '聖者の流れに入った者。三結を断ち切り、もう三悪道（地獄・餓鬼・畜生）には生まれない。この悟りは決して崩れない。',
    desc_en: 'One who has entered the stream of the noble ones. Three fetters cut. No more rebirths in lower realms. This attainment never falls away.',
    color: '#5168C8',
    scriptures: ['dhp-nibbana','dhp-appamada','dhp-mind2'],
    quiz_id: 'q_s1',
  },
  {
    id: 's2',
    rank_ja: '一来果', rank_en: 'Once-Returner',
    icon: '🕯️',
    pali: 'sakadāgāmi-phala',
    freed_ja: '解放される結（薄まる）：\n④ 欲愛（感覚的欲望への執着）\n⑤ 瞋恚（怒り・憎しみ）',
    freed_en: 'Fetters weakened:\n④ Kāmacchanda (sensual desire)\n⑤ Vyāpāda (ill-will, anger)',
    samsara_ja: 'あと一度だけ人間として輪廻する',
    samsara_en: 'Only one more rebirth as a human being',
    desc_ja: '欲と怒りが完全には断たれていないが、大幅に弱まった者。あと一度の輪廻で涅槃に入れる。',
    desc_en: 'Sensual desire and ill-will are not yet eliminated but greatly weakened. One more rebirth remains.',
    color: '#D4A843',
    scriptures: ['metta','karaniya','bg-karma'],
    quiz_id: 'q_s2',
  },
  {
    id: 's3',
    rank_ja: '不還果', rank_en: 'Non-Returner',
    icon: '🏯',
    pali: 'anāgāmi-phala',
    freed_ja: '解放される結：\n④ 欲愛（感覚的欲望）完全断滅\n⑤ 瞋恚（怒り・憎しみ）完全断滅',
    freed_en: 'Fetters fully released:\n④ Kāmacchanda (sensual desire) — eliminated\n⑤ Vyāpāda (ill-will) — eliminated',
    samsara_ja: '欲界・天界には二度と還らない。清浄居天に生まれ、そこで涅槃に入る',
    samsara_en: 'Never returns to the sense realm. Reborn in the Pure Abodes (suddhāvāsa), attains Nibbāna there.',
    desc_ja: '欲と怒りを完全に断った者。死後は色界の最上位「清浄居天」に生まれ、そこで阿羅漢となり涅槃に入る。',
    desc_en: 'Sensual desire and ill-will fully eliminated. After death, reborn in the Pure Abodes, attains arahantship there.',
    color: '#C2396B',
    scriptures: ['dhp-path','satya','ahimsa'],
    quiz_id: 'q_s3',
  },
  {
    id: 's4',
    rank_ja: '阿羅漢果', rank_en: 'Arahant',
    icon: '🪷',
    pali: 'arahatta-phala',
    freed_ja: '解放される結（上分結すべて）：\n⑥ 色貪（色界への執着）\n⑦ 無色貪（無色界への執着）\n⑧ 慢（うぬぼれ・比較による高慢）\n⑨ 掉挙（心の昂ぶり・浮つき）\n⑩ 無明（無知・真理への根本的な誤解）',
    freed_en: 'All upper fetters released:\n⑥ Rūparāga (desire for form)\n⑦ Arūparāga (desire for formlessness)\n⑧ Māna (conceit, comparing oneself to others)\n⑨ Uddhacca (restlessness, agitation of mind)\n⑩ Avijjā (ignorance — the deepest misunderstanding of reality)',
    samsara_ja: '三界には戻らず、輪廻から完全に解放される\n「応断（殺賊）」「応不受（不生）」「応供」の三義を完成',
    samsara_en: 'Completely released from all three realms and all rebirth.\nThe three meanings of Arahant fulfilled:\n· Killed the enemy (all defilements)\n· Will not be reborn\n· Worthy of offerings',
    desc_ja: '十結すべてを断ち切り、輪廻から完全に解脱した者。阿羅漢（arahan）の語源は「相応しい者」。煩悩の賊を滅した者（殺賊）、もう生まれない者（不生）、供養を受けるに相応しい者（応供）の三義を持つ。',
    desc_en: 'All ten fetters cut. Fully liberated from samsāra. Arahant (arahan) = "worthy one." Three meanings: one who killed the enemy (defilements), one who will not be reborn, one worthy of offerings.',
    color: '#F0C84A',
    scriptures: ['dhp-nibbana','bg-karma','satya'],
    quiz_id: 'q_s4',
  }
];

var QUIZZES = {
  q_s0: {
    title_ja: '三宝チェック', title_en: 'Triple Gem Check',
    questions: [
      {
        q_ja: '仏教の「三宝」（三つの宝）とは？',
        q_en: 'What are the "Three Jewels" (Triple Gem) of Buddhism?',
        choices_ja: ['仏・法・僧', '戒・定・慧', '信・解・行', '貪・瞋・痴'],
        choices_en: ['Buddha, Dhamma, Saṅgha', 'Ethics, Meditation, Wisdom', 'Faith, Understanding, Practice', 'Greed, Hatred, Delusion'],
        ans: 0,
        exp_ja: '「Buddhaṃ saraṇaṃ gacchāmi（仏に帰依します）」——仏・法・僧が三宝。',
        exp_en: '"Buddhaṃ saraṇaṃ gacchāmi" — Buddha, Dhamma, Saṅgha are the Triple Gem.',
      },
      {
        q_ja: '「saraṇaṃ」（サラナン）の意味は？',
        q_en: 'What does "saraṇaṃ" mean?',
        choices_ja: ['帰依処・避難所', '真理', '修行者', '輪廻'],
        choices_en: ['Refuge, shelter', 'Truth', 'Practitioner', 'Rebirth cycle'],
        ans: 0,
        exp_ja: '√sar（急いで向かう）から「安全な場所・帰依処」。',
        exp_en: 'From √sar (to run toward): "a place of safety, refuge."',
      },
      {
        q_ja: '「Buddho」の語源となる動詞の意味は？',
        q_en: 'What does the root verb of "Buddho" mean?',
        choices_ja: ['目覚める・知る', '輝く・光る', '生まれる', '話す'],
        choices_en: ['To awaken, to know', 'To shine, to glow', 'To be born', 'To speak'],
        ans: 0,
        exp_ja: '√budh（目覚める）から。「完全に目覚めた者」がBuddha。',
        exp_en: 'From √budh (to awaken). "The Fully Awakened One."',
      },
      {
        q_ja: 'パーリ語「Mano」と同じ語根を持つ英語は？',
        q_en: 'Which English word shares the same root as Pāli "Mano" (mind)?',
        choices_ja: ['mental（精神的な）', 'manner（作法）', 'manage（管理する）', 'manor（館）'],
        choices_en: ['mental', 'manner', 'manage', 'manor'],
        ans: 0,
        exp_ja: 'mano → Sanskrit manas → Latin mens → English "mental, mind". 印欧祖語から3000年！',
        exp_en: 'mano → Sanskrit manas → Latin mens → English "mental, mind". 3000 years from Proto-Indo-European!',
      },
    ]
  },
  q_s1: {
    title_ja: '三結チェック', title_en: 'Three Fetters Check',
    questions: [
      {
        q_ja: '預流果で断たれる「三結」の第一は何か？',
        q_en: 'What is the first of the three fetters released at stream-entry?',
        choices_ja: ['有身見（我が恒久という信条）', '疑（教えへの疑い）', '欲愛（欲望への執着）', '無明（無知）'],
        choices_en: ['Sakkāya-diṭṭhi (belief in permanent self)', 'Vicikicchā (doubt)', 'Kāmacchanda (sensual desire)', 'Avijjā (ignorance)'],
        ans: 0,
        exp_ja: '有身見（sakkāya-diṭṭhi）——五蘊を自己とみなす見解。',
        exp_en: 'Sakkāya-diṭṭhi — the view that the five aggregates constitute a permanent self.',
      },
      {
        q_ja: '「anicca（無常）」が意味することは？',
        q_en: 'What does "anicca" (impermanence) mean for practice?',
        choices_ja: ['すべては変わる・執着は苦しみを生む', 'すべては幸福である', '自己は実在する', '輪廻は終わらない'],
        choices_en: ['All things change — attachment causes suffering', 'All things lead to happiness', 'The self truly exists', 'Samsāra never ends'],
        ans: 0,
        exp_ja: 'an（否定）＋nicca（恒常）。「一切の行は無常」——三法印の第一。',
        exp_en: 'an (not) + nicca (permanent). "All formations are impermanent" — the first of the Three Marks.',
      },
      {
        q_ja: '「anattā（無我）」が最も深い洞察とされる理由は？',
        q_en: 'Why is "anattā (no-self)" considered the deepest insight?',
        choices_ja: ['固定した自己という幻想を手放すことで真の自由になる', '自己を強化することが悟りへの道', '自己は肉体と同一である', '自己を否定することが目的'],
        choices_en: ['Releasing the illusion of a fixed self brings true freedom', 'Strengthening self leads to awakening', 'Self equals the body', 'The goal is to deny the self'],
        ans: 0,
        exp_ja: 'an＋attā（自己）。三法印の第三。「固定した私」はない——エゴの解放。',
        exp_en: 'an + attā (self). Third of the Three Marks. No fixed self — the liberation of ego.',
      },
      {
        q_ja: '預流果の悟りの特徴は？',
        q_en: 'What is distinctive about the stream-entry attainment?',
        choices_ja: ['決して崩れることがない唯一の悟り', '一度崩れると元に戻れない', '出家しなければ得られない', '阿羅漢と同じ境地'],
        choices_en: ['The only attainment that never falls away', 'Once lost, cannot be regained', 'Only possible for monastics', 'Same as arahantship'],
        ans: 0,
        exp_ja: '預流果は「決して崩れない」唯一の悟り。一来果・不還果・阿羅漢果は崩れる可能性がある。',
        exp_en: 'Stream-entry is the only attainment that never falls away. Later stages can still be lost.',
      },
    ]
  },
  q_s2: {
    title_ja: '欲と怒りのチェック', title_en: 'Desire & Anger Check',
    questions: [
      {
        q_ja: '「mettā（慈しみ）」の修行は何の解毒剤か？',
        q_en: 'Mettā (loving-kindness) practice is the antidote to what?',
        choices_ja: ['瞋恚（怒り・憎しみ）', '欲愛（感覚的欲望）', '無明（無知）', '慢（うぬぼれ）'],
        choices_en: ['Vyāpāda (ill-will, anger)', 'Kāmacchanda (sensual desire)', 'Avijjā (ignorance)', 'Māna (conceit)'],
        ans: 0,
        exp_ja: 'ラーフラ経：「慈の瞑想を深めれば、どんな瞋恚も消えてしまう」。',
        exp_en: 'Mahārāhulovāda: "If you cultivate mettā, any ill-will will be abandoned."',
      },
      {
        q_ja: '「kāma（カーマ）」の本来の意味として最も適切なのは？',
        q_en: 'Which best describes the original meaning of "kāma"?',
        choices_ja: ['感覚的な喜び・欲望全般（美・芸術・愛も含む）', '性的欲求のみ', '食欲のみ', '金銭への欲望'],
        choices_en: ['All sensory pleasure and desire (including beauty, art, love)', 'Sexual desire only', 'Hunger only', 'Desire for money'],
        ans: 0,
        exp_ja: 'kāmaは性愛だけでなく、美・芸術・音楽・自然から得られる喜び全般を指す古代インドの概念。',
        exp_en: 'Kāma originally meant all sensory and aesthetic pleasure — beauty, art, music, nature — not only sexual desire.',
      },
      {
        q_ja: '「dosa（ドーサ）」とは何か？',
        q_en: 'What is "dosa" in Buddhist terms?',
        choices_ja: ['瞋恚・怒り・憎しみ（三毒の一つ）', '貪欲・執着', '無知・迷い', '慢・うぬぼれ'],
        choices_en: ['Anger, ill-will, hatred (one of the three poisons)', 'Greed, attachment', 'Ignorance, delusion', 'Conceit, arrogance'],
        ans: 0,
        exp_ja: 'dosa（パーリ）= dveṣa（サンスクリット）= anger。三毒（貪・瞋・痴）の「瞋」。',
        exp_en: 'dosa (Pāli) = dveṣa (Sanskrit) = anger/hatred. The "hatred" of the three poisons (greed, hatred, delusion).',
      },
      {
        q_ja: 'BG 2.47「karmaṇy evādhikāras te」の意味は？',
        q_en: 'What does BG 2.47 "karmaṇy evādhikāras te" mean?',
        choices_ja: ['あなたには行為する権限だけがある', '結果だけがあなたのものだ', '行為をしてはならない', '全てはブラフマンが行う'],
        choices_en: ['You have authority only over the action', 'Only results belong to you', 'You must not act', 'All is done by Brahman'],
        ans: 0,
        exp_ja: 'karma（行為）＋adhikāra（権限）。結果への執着を手放す——仏教の無執着と共鳴。',
        exp_en: 'karma (action) + adhikāra (authority). Let go of attachment to results — resonates with Buddhist non-attachment.',
      },
    ]
  },
  q_s3: {
    title_ja: '不還果チェック', title_en: 'Non-Returner Check',
    questions: [
      {
        q_ja: '七仏通誡偈の三行が表す仏教の三学は？',
        q_en: 'The three lines of the Universal Teaching represent which three trainings?',
        choices_ja: ['戒（悪をなさず）・定（善を行う）・慧（心を清める）', '信・解・行', '貪・瞋・痴', '生・老・死'],
        choices_en: ['Sīla (ethics) · Samādhi (meditation) · Paññā (wisdom)', 'Faith · Understanding · Practice', 'Greed · Hatred · Delusion', 'Birth · Aging · Death'],
        ans: 0,
        exp_ja: '「悪をなさず」=戒、「善を行う」=定、「心を清める」=慧。三学の完全な要約。',
        exp_en: '"Do no evil" = Ethics, "do good" = Meditation, "purify mind" = Wisdom. The full path in three lines.',
      },
      {
        q_ja: '「satyam eva jayate」の意味とその出典は？',
        q_en: 'What does "satyam eva jayate" mean, and where is it from?',
        choices_ja: ['「真実のみが勝利する」ムンダカ・ウパニシャッド（インド国是）', '「非暴力こそ最高の法」マハーバーラタ', '「行為における熟練がヨーガ」バガヴァッドギーター', '「涅槃は最上の楽」法句経'],
        choices_en: ['"Truth alone triumphs" Muṇḍaka Upaniṣad (India\'s motto)', '"Non-violence is the highest dharma" Mahābhārata', '"Mastery in action is yoga" Bhagavad Gītā', '"Nibbāna is the highest happiness" Dhammapada'],
        ans: 0,
        exp_ja: 'satya（真実）＋eva（のみ）＋jayate（勝利する）。インド国章・紙幣に刻まれた格言。',
        exp_en: 'satya (truth) + eva (alone) + jayate (triumphs). Inscribed on India\'s state emblem and banknotes.',
      },
      {
        q_ja: '「ahiṃsā」の語構造は？',
        q_en: 'What is the grammatical structure of "ahiṃsā"?',
        choices_ja: ['a（否定）＋hiṃsā（暴力・傷つけること）', 'a（ある）＋hiṃsā（美しさ）', 'ahi（蛇）＋ṃsā（肉）', 'a（一つ）＋hiṃsā（道）'],
        choices_en: ['a (not) + hiṃsā (harm, violence)', 'a (existence) + hiṃsā (beauty)', 'ahi (snake) + ṃsā (meat)', 'a (one) + hiṃsā (path)'],
        ans: 0,
        exp_ja: 'a（否定接頭辞）＋hiṃsā（√han「打つ・殺す」から）。「傷つけないこと」。',
        exp_en: 'a (negative prefix) + hiṃsā (from √han, "to strike, kill"). "Non-harming."',
      },
      {
        q_ja: '不還果の死後の行き先は？',
        q_en: 'Where does a Non-Returner go after death?',
        choices_ja: ['清浄居天（色界最上位）に生まれ、そこで阿羅漢となる', '欲界の天上界に生まれる', '人間界に一度だけ還る', 'すぐに涅槃に入る'],
        choices_en: ['Reborn in the Pure Abodes (highest form realm), attains arahantship there', 'Reborn in the desire-realm heavens', 'Returns once more as a human', 'Enters Nibbāna immediately'],
        ans: 0,
        exp_ja: '不還果は欲界・天界には「還らない」。色界の清浄居天に生まれ、そこで涅槃に入る。',
        exp_en: 'Non-Returner does not "return" to the sense realm. Reborn in the Pure Abodes of the form realm.',
      },
    ]
  },
  q_s4: {
    title_ja: '阿羅漢チェック', title_en: 'Arahant Check',
    questions: [
      {
        q_ja: '「avijjā（無明）」とは何か？',
        q_en: 'What is "avijjā" (ignorance)?',
        choices_ja: ['四諦・無常・無我への根本的な誤解（情報の欠如ではなく）', '単なる知識不足', '記憶力の欠如', '言語能力の欠如'],
        choices_en: ['Deep misunderstanding of the Four Truths, impermanence, no-self (not mere lack of information)', 'Simply lacking knowledge', 'Lack of memory', 'Lack of language ability'],
        ans: 0,
        exp_ja: '無明は「情報の欠如ではなく現実についての根深い誤解」(ピーター・ハーヴェイ)。十二因縁の始まり。',
        exp_en: '"Ignorance is not lack of information but a deep-seated misunderstanding of reality" (Peter Harvey). First link in the twelve-fold chain.',
      },
      {
        q_ja: '「uddhacca（掉挙）」とは？',
        q_en: 'What is "uddhacca" (restlessness)?',
        choices_ja: ['心が昂ぶり浮ついた状態（対義語：昏沈）', '深い悲しみ', '強い怒り', '激しい欲望'],
        choices_en: ['Restlessness, agitation of mind (opposite: dullness/torpor)', 'Deep sadness', 'Intense anger', 'Intense desire'],
        ans: 0,
        exp_ja: '掉挙と昏沈はどちらも平静な心を失った状態。七覚支（軽安・禅定・捨）で対治する。',
        exp_en: 'Restlessness and torpor are both loss of mental equilibrium. Countered by the awakening factors of tranquility, concentration, equanimity.',
      },
      {
        q_ja: '「māna（慢）」の本質は？',
        q_en: 'What is the essence of "māna" (conceit)?',
        choices_ja: ['他と比較して「私」を基準に物事を判断すること', '激しい怒りの感情', '貪欲な執着', '無知による迷い'],
        choices_en: ['Comparing and judging by "I" as the standard', 'Intense anger', 'Greedy attachment', 'Confusion from ignorance'],
        ans: 0,
        exp_ja: '慢は「私が優れている・等しい・劣っている」という比較から生まれる。「私という幻覚が生まれること自体が慢の始まり」。',
        exp_en: '"I am better, equal, or worse" — all comparisons using "I." "The very arising of the illusion of self is the beginning of conceit."',
      },
      {
        q_ja: '阿羅漢の三つの意味（三義）は？',
        q_en: 'What are the three meanings (three aspects) of Arahant?',
        choices_ja: ['応断（煩悩を断つ）・応不受（再生しない）・応供（供養に値する）', '三帰依・三法印・三毒', '戒・定・慧', '貪・瞋・痴'],
        choices_en: ['Killed defilements · Will not be reborn · Worthy of offerings', 'Triple Gem · Three Marks · Three Poisons', 'Ethics · Meditation · Wisdom', 'Greed · Hatred · Delusion'],
        ans: 0,
        exp_ja: '「殺賊」（煩悩の賊を断つ）「不生」（もう生まれない）「応供」（供養に相応しい）。成唯識論より。',
        exp_en: '"Killed the enemy (defilements)" · "Will not be reborn" · "Worthy of offerings." From the Chengweishi lun.',
      },
      {
        q_ja: '十結（十の束縛）がすべて断たれると何が起こるか？',
        q_en: 'When all ten fetters are completely released, what happens?',
        choices_ja: ['三界から解放され輪廻が終わる（阿羅漢果）', '七回の輪廻が始まる', '天上界に生まれ直す', '菩薩の道が始まる'],
        choices_en: ['Liberation from all three realms, samsāra ends (Arahantship)', 'Seven rebirths begin', 'Reborn in a heaven realm', 'The Bodhisattva path begins'],
        ans: 0,
        exp_ja: '上分結（⑥色貪〜⑩無明）すべてを断じると阿羅漢果。「三界には戻らず輪廻から解放」。',
        exp_en: 'When all upper fetters (⑥-⑩) are released: Arahantship. "Released from all three realms, samsāra ends."',
      },
    ]
  }
};

// ============================================================
// SCRIPTURES
// ============================================================

var SCRIPTURES = [
  {
    id:'dhp1', icon:'📿', collection:'Dhammapada', ref:'Dhp. 1–2',
    theme_ja:'心の力・因果', theme_en:'The Power of Mind',
    title_ja:'心が先行する', title_en:'Mind leads all things',
    iyaku_ja:'汚れた心で語り、行動すれば\n苦しみが荷車の轍のように後を追う。\n清らかな心なら\n幸福が影のように決して離れない。',
    iyaku_en:'Speak or act with a corrupted mind —\nsuffering follows like a wheel follows the ox.\nAct from a clear mind —\nhappiness follows like a shadow that never departs.',
    ctx_ja:'法句経冒頭の二偈。「心が現実をつくる」という仏教の根本命題。心次第で、同じ出来事がまったく異なる経験になる。',
    ctx_en:'Opening verses of the Dhammapada. The fundamental proposition: mind shapes reality. The same event becomes entirely different depending on the state of mind.',
    lines:[
      {pali:'Manopubbaṅgamā dhammā,',words:[
        {w:'Mano',pos_ja:'名詞・主格',pos_en:'noun, nominative',m_ja:'心・意',m_en:'mind',ety_ja:'印欧祖語 *men- →サンスクリット manas →ラテン語 mens →英語 "mental, mind"',ety_en:'PIE *men- → Sanskrit manas → Latin mens → English "mental, mind"',note_ja:'3000年かけてインドからヨーロッパへ伝わった語根。',note_en:'A root that travelled from India to Europe over 3,000 years.'},
        {w:'pubbaṅgamā',pos_ja:'形容詞・主格複数',pos_en:'adjective, nominative pl.',m_ja:'先行する',m_en:'forerunner, that which goes before',note_ja:'pubba(前)＋gama(行く)。「最初に動くもの」。',note_en:'pubba (before) + gama (going). "That which moves first."'},
        {w:'dhammā',pos_ja:'名詞・主格複数',pos_en:'noun, nominative pl.',m_ja:'諸々の現象',m_en:'all phenomena, things',note_ja:'この偈の主語。心が先行する一切の出来事・言動。',note_en:'The subject: all events, words, and actions that mind leads.'}
      ]},
      {pali:'Manasā ce paduṭṭhena',words:[
        {w:'Manasā',pos_ja:'名詞・具格',pos_en:'noun, instrumental',m_ja:'心によって',m_en:'by means of the mind',note_ja:'具格(instrumental)＝手段・原因を示す格。',note_en:'Instrumental case — the case of means and causes.'},
        {w:'paduṭṭhena',pos_ja:'形容詞・具格',pos_en:'adjective, instrumental',m_ja:'汚れた・悪意ある',m_en:'corrupted, defiled',note_ja:'pa（強意）＋duṭṭha（汚れ）。「深く汚れた心で」。',note_en:'pa (intensifier) + duṭṭha (defiled). "With a deeply corrupted mind."'}
      ]},
      {pali:'Tato naṃ dukkhamanveti',words:[
        {w:'dukkham',pos_ja:'名詞・主格',pos_en:'noun, nominative',m_ja:'苦しみ',m_en:'suffering, unsatisfactoriness',ety_ja:'du（悪い）＋kha（空間・軸穴）という語源説。対語 sukha（良い空間）',ety_en:'du (bad) + kha (space/axle-hole) — opposite of sukha (good space)',note_ja:'四聖諦の第一。「思い通りにならない状態」全般。',note_en:'The First Noble Truth. The pervasive unsatisfactoriness of conditioned existence.'},
        {w:'anveti',pos_ja:'動詞・現在三人称',pos_en:'verb, 3rd sg. present',m_ja:'後を追う',m_en:'follows, pursues',note_ja:'anu（後に）＋eti（行く）。',note_en:'anu (after) + eti (goes).'}
      ]},
      {pali:'cakkaṃva vahato padaṃ.',words:[
        {w:'cakkaṃ',pos_ja:'名詞・主格',pos_en:'noun',m_ja:'車輪',m_en:'wheel',note_ja:'牛車の輪。雨季の轍は深く刻まれ消えない——確実さの比喩。',note_en:'The wheel of an ox-cart, leaving an inevitable track.'},
        {w:'padaṃ',pos_ja:'名詞・対格',pos_en:'noun, accusative',m_ja:'足跡',m_en:'footstep, track',note_ja:'pada＝足・歩み・詩節・境地。パーリ語最多義語の一つ。',note_en:'pada: foot, step, verse, state, path — one of the richest Pāli words.'}
      ]}
    ],
    summary_ja:'汚れた心で語り行えば苦しみが追う。清らかな心なら幸福が離れない影のように従う。',
    summary_en:'Act from a corrupted mind — suffering follows like a wheel. Act from a clear mind — happiness follows like a shadow.'
  },
  {
    id:'dhp-appamada', icon:'📿', collection:'Dhammapada', ref:'Dhp. 21',
    theme_ja:'不放逸・目覚め', theme_en:'Heedfulness — path to the deathless',
    title_ja:'不放逸は不死の道', title_en:'Heedfulness is the path to the deathless',
    iyaku_ja:'怠りなき注意（不放逸）は不死への道。\n放逸は死への道。\n不放逸な者は死なず\n放逸な者はすでに死んでいる。',
    iyaku_en:'Heedfulness is the path to the deathless.\nHeedlessness is the path to death.\nThe heedful do not die.\nThe heedless are as if already dead.',
    ctx_ja:'「不放逸（appamāda）」はブッダの最後の言葉にも登場する概念。「vayadhammā saṅkhārā, appamādena sampādethā」——諸行は無常、怠ることなく修めよ。',
    ctx_en:'"Appamāda" appeared in the Buddha\'s very last words: "All conditioned things are impermanent — work out your salvation with diligence."',
    lines:[
      {pali:'Appamādo amatapadaṃ,',words:[
        {w:'Appamādo',pos_ja:'名詞・主格',pos_en:'noun, nominative',m_ja:'不放逸・怠りなき注意',m_en:'heedfulness, diligence',ety_ja:'a（否定）＋pamāda（放逸・油断）',ety_en:'a (not) + pamāda (negligence, intoxication)',note_ja:'ブッダ最後の言葉にも登場。',note_en:'Appeared in the Buddha\'s very last words.'},
        {w:'amatapadaṃ',pos_ja:'複合名詞・主格',pos_en:'compound, nominative',m_ja:'不死の道・甘露の境地',m_en:'path to the deathless',ety_ja:'amata＝Sanskrit amṛta＝Greek ambrosia＝Latin immortalis。同じ語根！',ety_en:'amata = Sanskrit amṛta = Greek ambrosia = Latin immortalis. Same root!',note_ja:'「不死・甘露」を意味するamataはギリシャ語のambrosia、英語のimmortalと同語源。',note_en:'"Deathless, ambrosia" — amata is cognate with Greek ambrosia and Latin immortalis.'}
      ]},
      {pali:'pamādo maccuno padaṃ.',words:[
        {w:'pamādo',pos_ja:'名詞・主格',pos_en:'noun, nominative',m_ja:'放逸・怠惰・油断',m_en:'heedlessness, negligence',note_ja:'appamādaの対語。「心が散漫な状態」。',note_en:'Opposite of appamāda. "Mental scattering and carelessness."'},
        {w:'maccuno',pos_ja:'名詞・属格',pos_en:'noun, genitive',m_ja:'死の・死神の',m_en:'of death, of the Death',note_ja:'maccu（死・死神）の属格。',note_en:'Genitive of maccu (death, the Ender).'}
      ]}
    ],
    summary_ja:'不放逸は不死の道。ブッダが生涯説いた最重要概念。',
    summary_en:'Heedfulness is the path to the deathless. The most important concept the Buddha taught throughout his life.'
  },
  {
    id:'dhp-nibbana', icon:'🪷', collection:'Dhammapada', ref:'Dhp. 203–204',
    theme_ja:'涅槃・最上の楽', theme_en:'Nibbāna — supreme happiness',
    title_ja:'涅槃は最上の楽', title_en:'Nibbāna is the highest happiness',
    iyaku_ja:'飢えは最大の病。\n存在への執着は最大の苦しみ。\nそして——涅槃は最上の楽である。',
    iyaku_en:'Hunger is the foremost illness.\nConditioned existence is the foremost suffering.\nAnd Nibbāna — is the supreme happiness.',
    ctx_ja:'三つの「最大・最上」を並べた詩的な偈。涅槃（nibbāna）の語源は「炎が吹き消される」——貪り・怒り・迷いの三毒の炎。',
    ctx_en:'Three superlatives in contrast. Nibbāna literally means "the blowing out" — the extinguishing of the three fires: greed, hatred, delusion.',
    lines:[
      {pali:'Jighacchāparamā rogā,',words:[
        {w:'Jighacchā',pos_ja:'名詞・主格',pos_en:'noun',m_ja:'飢え',m_en:'hunger',note_ja:'執着の根源的な比喩として選ばれた語。',note_en:'Chosen as the primal metaphor for craving.'},
        {w:'paramā',pos_ja:'形容詞',pos_en:'adjective',m_ja:'最大の・最上の',m_en:'foremost, supreme',note_ja:'この偈に三回登場する。',note_en:'Appears three times in this verse.'}
      ]},
      {pali:'Nibbānaṃ paramaṃ sukhaṃ.',words:[
        {w:'Nibbānaṃ',pos_ja:'名詞・主格',pos_en:'noun, nominative',m_ja:'涅槃',m_en:'Nibbāna (Nirvāṇa)',ety_ja:'nir（完全に）＋√vā（吹く・消える）。サンスクリット nirvāṇa = "blowing out"',ety_en:'nir (completely) + √vā (to blow out). Sanskrit nirvāṇa = "blowing out"',note_ja:'三毒（貪・瞋・痴）の炎が完全に消えた状態。',note_en:'Complete extinguishing of the three fires of greed, hatred, delusion.'},
        {w:'sukhaṃ',pos_ja:'名詞・主格',pos_en:'noun, nominative',m_ja:'楽・安楽',m_en:'happiness, ease',ety_ja:'su（良い）＋kha（空間）。dukkha（du＋kha）の対語。',ety_en:'su (good) + kha (space). Opposite of dukkha (du + kha = bad space).',note_ja:'「良い空間」vs「悪い空間」——sukhaとdukkhaの語源的対比。',note_en:'"Good space" vs "bad space" — the etymological contrast of sukha and dukkha.'}
      ]}
    ],
    summary_ja:'飢えは最大の病、行の苦は最大の苦、涅槃は最上の楽——三段対比の詩。',
    summary_en:'Hunger: greatest illness. Conditioned existence: greatest suffering. Nibbāna: supreme happiness.'
  },
  {
    id:'dhp-path', icon:'🏯', collection:'Dhammapada', ref:'Dhp. 183',
    theme_ja:'仏教倫理の核心', theme_en:'Heart of Buddhist ethics',
    title_ja:'七仏通誡偈', title_en:'Universal Teaching of All Buddhas',
    iyaku_ja:'すべての悪をなさず\n善を十分に行い\n自分の心を清めること\n——これが、すべての仏陀の教えである。',
    iyaku_en:'Do no evil.\nDo good fully.\nPurify the mind.\n— This is the teaching of all Buddhas.',
    ctx_ja:'過去七仏すべてが共通して説いた偈。三行で仏教の全体構造（戒・定・慧）を表す。禅宗で今も暗唱される。',
    ctx_en:'Said to have been taught by all seven past Buddhas. Three lines encode the entire path: ethics, meditation, wisdom.',
    lines:[
      {pali:'Sabbapāpassa akaraṇaṃ,',words:[
        {w:'pāpassa',pos_ja:'名詞・属格',pos_en:'noun, genitive',m_ja:'悪の',m_en:'of evil',note_ja:'対語はkusala（善・熟練）。',note_en:'Opposite: kusala (wholesome, skilful).'},
        {w:'akaraṇaṃ',pos_ja:'名詞・主格',pos_en:'noun, nominative',m_ja:'なさないこと',m_en:'non-doing, refraining',note_ja:'a（否定）＋karaṇa（なすこと）。',note_en:'a (not) + karaṇa (doing).'}
      ]},
      {pali:'kusalassa upasampadā;',words:[
        {w:'kusalassa',pos_ja:'名詞・属格',pos_en:'noun, genitive',m_ja:'善の・熟練の',m_en:'of the wholesome, skilful',note_ja:'「巧みになされること」。単なる「良いこと」ではない。',note_en:'Not simply "good" but "skilfully done."'},
        {w:'upasampadā',pos_ja:'名詞・主格',pos_en:'noun, nominative',m_ja:'具足・十分に行うこと',m_en:'full accomplishment',note_ja:'僧侶の具足戒授戒にも使われる語。',note_en:'Also used for monastic ordination.'}
      ]},
      {pali:'etaṃ Buddhānasāsanaṃ.',words:[
        {w:'Buddhāna',pos_ja:'名詞・属格複数',pos_en:'noun, genitive pl.',m_ja:'諸仏の',m_en:'of the Buddhas',note_ja:'過去・現在・未来のすべての仏陀たち。',note_en:'All Buddhas — past, present, future.'},
        {w:'sāsanaṃ',pos_ja:'名詞・主格',pos_en:'noun, nominative',m_ja:'教え',m_en:'teaching, dispensation',note_ja:'√sās（教える）から。',note_en:'From √sās (to teach, instruct).'}
      ]}
    ],
    summary_ja:'悪をなさず、善を成就し、心を清めること——これが諸仏の教えである。',
    summary_en:'Do no evil, do good fully, purify the mind — this is the teaching of all Buddhas.'
  },
  {
    id:'dhp-mind2', icon:'📿', collection:'Dhammapada', ref:'Dhp. 33',
    theme_ja:'心を調える', theme_en:'Taming the mind',
    title_ja:'揺れ動く心', title_en:'The wandering mind',
    iyaku_ja:'揺れ動き、ふらつき\n守り難く、抑え難い心を\n智慧ある者は真っ直ぐにする\n矢師が矢を真っ直ぐにするように。',
    iyaku_en:'The mind is wavering, unsteady,\nhard to guard, hard to restrain.\nThe wise one straightens it\nlike a fletcher straightens an arrow.',
    ctx_ja:'Dhp.33。「心」をテーマにした章の冒頭。矢師が曲がった矢をゆっくりと真っ直ぐにする——その丁寧な手仕事が瞑想の比喩。',
    ctx_en:'Opening the chapter on mind. The fletcher painstakingly straightening a crooked arrow — a metaphor for patient meditation.',
    lines:[
      {pali:'Phandanaṃ capalaṃ cittaṃ,',words:[
        {w:'Phandanaṃ',pos_ja:'形容詞',pos_en:'adjective',m_ja:'揺れ動く',m_en:'quivering, trembling',note_ja:'√phand（揺れる）から。',note_en:'From √phand (to quiver).'},
        {w:'capalaṃ',pos_ja:'形容詞',pos_en:'adjective',m_ja:'ふらつく・軽はずみな',m_en:'flighty, unsteady',note_ja:'あちこちに飛び回るさま。',note_en:'"Flitting about" — restless, easily distracted.'},
        {w:'cittaṃ',pos_ja:'名詞・主格',pos_en:'noun, nominative',m_ja:'心',m_en:'mind',note_ja:'√cit（知る）から。この章の主題語。',note_en:'From √cit (to perceive). The subject of this chapter.'}
      ]},
      {pali:'Usujjalissatī dhīro, usukāro va tejanam.',words:[
        {w:'dhīro',pos_ja:'名詞・主格',pos_en:'noun, nominative',m_ja:'智慧ある者',m_en:'the wise one',note_ja:'dhī（知恵・洞察）から。',note_en:'From dhī (wisdom, insight).'},
        {w:'usukāro',pos_ja:'名詞・主格',pos_en:'noun, nominative',m_ja:'矢師',m_en:'fletcher, arrow-maker',note_ja:'usu（矢）＋kāra（作る者）。',note_en:'usu (arrow) + kāra (maker).'},
        {w:'tejanam',pos_ja:'名詞・対格',pos_en:'noun, accusative',m_ja:'矢',m_en:'arrow shaft',note_ja:'比喩の対象。矢師が真っ直ぐに削る木の棒。',note_en:'The object of the fletcher\'s work — the metaphor.'}
      ]}
    ],
    summary_ja:'智慧ある者は揺れ動く心を真っ直ぐにする——矢師が矢を整えるように。',
    summary_en:'The wise one straightens the wavering mind — just as a fletcher straightens an arrow.'
  },
  {
    id:'tisarana', icon:'🙏', collection:'Khuddakapāṭha', ref:'Khp. 1',
    theme_ja:'帰依・三宝', theme_en:'The Three Refuges',
    title_ja:'三帰依', title_en:'Tisaraṇa — Three Refuges',
    iyaku_ja:'私は仏陀を帰依処として向かいます。\n私は法（真理）を帰依処として向かいます。\n私は僧伽（修行者の共同体）を帰依処として向かいます。',
    iyaku_en:'I take refuge in the Buddha.\nI take refuge in the Dhamma.\nI take refuge in the Saṅgha.',
    ctx_ja:'全仏教圏で毎日唱えられる三帰依文。構造は完璧に対称。仏（目覚めた者）・法（真理）・僧（実践の共同体）を三宝という。',
    ctx_en:'Recited daily in all Buddhist traditions. Perfectly symmetrical structure. The Triple Gem: Buddha, Dhamma, Saṅgha.',
    lines:[
      {pali:'Buddhaṃ saraṇaṃ gacchāmi.',words:[
        {w:'Buddhaṃ',pos_ja:'名詞・対格',pos_en:'noun, accusative',m_ja:'仏陀を',m_en:'the Buddha',ety_ja:'√budh（目覚める・知る）の過去分詞',ety_en:'Past participle of √budh (to awaken, know)',note_ja:'対格は向かう先を示す格。',note_en:'Accusative marks the destination.'},
        {w:'saraṇaṃ',pos_ja:'名詞・対格',pos_en:'noun, accusative',m_ja:'帰依処として',m_en:'as refuge',ety_ja:'√sar（急いで向かう）→「避難所・安全な場所」',ety_en:'√sar (to run toward) → "place of safety, shelter"',note_ja:'「急いで向かう場所」が語源。',note_en:'"The place one rushes toward for safety."'},
        {w:'gacchāmi',pos_ja:'動詞・一人称現在',pos_en:'verb, 1st sg. present',m_ja:'私は向かいます',m_en:'I go, I take',note_ja:'gam語根「行く」の一人称単数。能動的選択。',note_en:'1st sg. of gam- (to go). An active, voluntary choice.'}
      ]},
      {pali:'Dhammaṃ saraṇaṃ gacchāmi.',words:[
        {w:'Dhammaṃ',pos_ja:'名詞・対格',pos_en:'noun, accusative',m_ja:'法を',m_en:'the Dhamma (Truth)',ety_ja:'√dhṛ（支える・保つ）→「宇宙と存在を支える真理」',ety_en:'√dhṛ (to hold, sustain) → "truth that sustains the universe"',note_ja:'最も多義的な仏教語：教え・真理・法則・事物・徳。',note_en:'The most polysemous word in Buddhist thought: teaching, truth, law, phenomenon, virtue.'}
      ]},
      {pali:'Saṅghaṃ saraṇaṃ gacchāmi.',words:[
        {w:'Saṅghaṃ',pos_ja:'名詞・対格',pos_en:'noun, accusative',m_ja:'僧伽を',m_en:'the Saṅgha',ety_ja:'saṃ（共に）＋√hañ（まとめる）→「共に集まる人々」',ety_en:'saṃ (together) + √hañ (to collect) → "those who gather together"',note_ja:'現代語「サンガ」の原語。修行者の共同体。',note_en:'Origin of modern "sangha." The community of practitioners.'}
      ]}
    ],
    summary_ja:'仏・法・僧の三宝を帰依処として向かう。構造の単純さに深さが宿る。',
    summary_en:'Taking the Triple Gem as refuge. The depth hidden in perfect simplicity.'
  },
  {
    id:'metta', icon:'💛', collection:'Sutta Nipāta', ref:'Sn. 1.8',
    theme_ja:'慈しみ・無量心', theme_en:'Boundless Loving-Kindness',
    title_ja:'全世界に慈しみを', title_en:'Loving-kindness for all the world',
    iyaku_ja:'全世界に向けて\n上にも下にも横にも\n障害なく、怨みなく、敵意なく\n測り知れない慈しみの心を育てよ。',
    iyaku_en:'Toward the entire world —\nabove, below, and across —\nwithout obstruction, enmity, or hostility —\ncultivate a boundless heart of loving-kindness.',
    ctx_ja:'慈経の核心偈。世界中の仏教寺院で毎日唱えられる。瞋恚（怒り）の解毒剤。「慈の瞑想を深めれば、どんな瞋恚も消えてしまう」（ラーフラ経）。',
    ctx_en:'Heart of the Metta Sutta, chanted daily worldwide. The antidote to ill-will. "If you cultivate mettā, any ill-will will be abandoned" (Mahārāhulovāda).',
    lines:[
      {pali:'Mettaṃ ca sabbalokasmiṃ',words:[
        {w:'Mettaṃ',pos_ja:'名詞・対格',pos_en:'noun, accusative',m_ja:'慈しみを',m_en:'loving-kindness',note_ja:'四無量心（慈・悲・喜・捨）の第一。',note_en:'First of the Four Immeasurables (brahmavihāra).'},
        {w:'sabbalokasmiṃ',pos_ja:'名詞・処格',pos_en:'noun, locative',m_ja:'全世界において',m_en:'in/toward all the world',note_ja:'sabba（全て）＋loka（世界）の処格。',note_en:'sabba (all) + loka (world). Locative case.'}
      ]},
      {pali:'mānasaṃ bhāvaye aparimāṇaṃ;',words:[
        {w:'bhāvaye',pos_ja:'動詞・願望法',pos_en:'verb, optative',m_ja:'育てるべし',m_en:'one should cultivate',note_ja:'「cultivate」が最も近い英訳——植物を育てるような忍耐強い実践。',note_en:'"Cultivate" — patient, active growth, like tending a plant.'},
        {w:'aparimāṇaṃ',pos_ja:'形容詞',pos_en:'adjective',m_ja:'無量の・測り知れない',m_en:'immeasurable, boundless',note_ja:'a（否定）＋parimāṇa（測定）。「四無量心」の「無量」。',note_en:'a (not) + parimāṇa (measure). The "immeasurable" in Four Immeasurables.'}
      ]},
      {pali:'asambādhaṃ averaṃ asapattaṃ.',words:[
        {w:'averaṃ',pos_ja:'形容詞',pos_en:'adjective',m_ja:'怨みなく',m_en:'without enmity',note_ja:'「怨みは怨みによって静まらない」（Dhp.5）に対応。',note_en:'Corresponds to Dhp.5: "Hatred is never appeased by hatred."'},
        {w:'asapattaṃ',pos_ja:'形容詞',pos_en:'adjective',m_ja:'敵意なく',m_en:'without hostility',note_ja:'三つの「なく」の詩的頂点。',note_en:'The poetic climax of three negations.'}
      ]}
    ],
    summary_ja:'全世界に向けて、障害なく・怨みなく・敵意なく、無量の慈しみを育てよ。',
    summary_en:'Cultivate boundless loving-kindness toward all the world — without obstruction, enmity, or hostility.'
  },
  {
    id:'karaniya', icon:'💛', collection:'Sutta Nipāta', ref:'Sn. 1.8 冒頭',
    theme_ja:'なすべきこと・実践指針', theme_en:'What Should Be Done',
    title_ja:'Karaṇīya — なすべきこと', title_en:'Karaṇīya — What Should Be Done',
    iyaku_ja:'安楽の境地を十分に理解し\nそこへ向かおうとする者は\n有能であれ、正直であれ\n非常に正直で、言葉を素直に受け取れ\n柔軟で、傲慢でなくあれ。',
    iyaku_en:'By one skilled in goodness\nwho knows the path of peace:\nLet them be able, upright, truly upright,\neasy to speak to, gentle, without conceit.',
    ctx_ja:'慈経の冒頭偈。「安楽の境地（santaṃ padaṃ）」を目指す者の具体的な内的態度のリスト。抽象的な倫理ではなく、性質の具体的な描写。',
    ctx_en:'Opening of the Metta Sutta. Concrete qualities of one genuinely aiming for peace — not abstract ethics but specific character traits.',
    lines:[
      {pali:'Karaṇīyam atthakusalena,',words:[
        {w:'Karaṇīyam',pos_ja:'動詞的形容詞',pos_en:'gerundive',m_ja:'なされるべきこと',m_en:'what should be done',note_ja:'√kar（する）の未来受動分詞。全文の主語。',note_en:'Gerundive of √kar (to do). The subject of the entire verse.'},
        {w:'atthakusalena',pos_ja:'複合名詞・具格',pos_en:'compound, instrumental',m_ja:'利益に熟練した者によって',m_en:'by one skilled in the beneficial',note_ja:'attha（利益・目的）＋kusala（熟練）の具格。',note_en:'attha (benefit) + kusala (skilled). Instrumental case.'}
      ]},
      {pali:'Sakko ujū ca sūjū ca,',words:[
        {w:'Sakko',pos_ja:'形容詞',pos_en:'adjective',m_ja:'有能な',m_en:'able, capable',note_ja:'「実際にできる」具体的な能力。',note_en:'The concrete ability to actually do what needs doing.'},
        {w:'ujū',pos_ja:'形容詞',pos_en:'adjective',m_ja:'まっすぐな・正直な',m_en:'upright, straight',note_ja:'弓のまっすぐさから内面の直実さへ。',note_en:'Straight as a bow — inner uprightness.'},
        {w:'sūjū',pos_ja:'形容詞',pos_en:'adjective',m_ja:'非常にまっすぐな',m_en:'very upright',note_ja:'su（強意）＋ujū。強調形。',note_en:'su (intensifier) + ujū. Intensified form.'}
      ]},
      {pali:'suvaco cassa mudu anatimānī.',words:[
        {w:'suvaco',pos_ja:'形容詞',pos_en:'adjective',m_ja:'素直な・言いやすい',m_en:'easy to speak to',note_ja:'su（良い）＋vaca（言葉）。',note_en:'su (good) + vaca (speech).'},
        {w:'mudu',pos_ja:'形容詞',pos_en:'adjective',m_ja:'柔軟な・優しい',m_en:'gentle, soft',note_ja:'心の硬直を溶かす語。',note_en:'The quality that dissolves mental rigidity.'},
        {w:'anatimānī',pos_ja:'形容詞',pos_en:'adjective',m_ja:'傲慢でない',m_en:'without conceit',note_ja:'an＋ati（過度）＋māna（慢）。',note_en:'an + ati (excess) + māna (conceit, pride).'}
      ]}
    ],
    summary_ja:'安楽の境地を目指す者は：有能で、正直で、柔軟で、傲慢でなくあれ。',
    summary_en:'Aiming for peace: be able, upright, gentle, easy to speak to, and without conceit.'
  },
  {
    id:'bg-karma', icon:'🌸', collection:'Bhagavad Gītā', ref:'BG 2.47',
    theme_ja:'行為・執着なき行動', theme_en:'Action without attachment',
    title_ja:'行為のみが権限', title_en:'Only the action is yours',
    iyaku_ja:'あなたには行為する権限だけがある。\n結果は決してあなたのものではない。\n結果のために行動するな。\nかといって不行為に執着するな。',
    iyaku_en:'You have authority only over the action,\nnever over the fruits thereof.\nLet not the fruits be your motive,\nnor let attachment to inaction be your refuge.',
    ctx_ja:'BG 2.47。インド哲学で最も引用される一節。「結果への執着を手放す」は仏教の無執着と深く共鳴する。禅の「只管打坐」にも通じる。',
    ctx_en:'BG 2.47 — one of the most quoted verses in Indian philosophy. "Let go of attachment to results." Resonates with Buddhist non-attachment.',
    lines:[
      {pali:'karmaṇy evādhikāras te',words:[
        {w:'karmaṇi',pos_ja:'名詞・処格',pos_en:'noun, locative',m_ja:'行為において',m_en:'in action',ety_ja:'karma＝√kar（する）。仏教のkamma（業）と同語。ラテン語creare、英語createと同語根とも',ety_en:'karma = √kar (to do). Same as Buddhist kamma. Related to Latin creare, English "create"',note_ja:'「なされたこと・行為」。',note_en:'"That which is done, action."'},
        {w:'adhikāras',pos_ja:'名詞・主格',pos_en:'noun, nominative',m_ja:'権限',m_en:'authority, right',note_ja:'adhi（上に）＋kāra（なすこと）。',note_en:'adhi (over) + kāra (doing).'}
      ]},
      {pali:'yogaḥ karmasu kauśalam.',words:[
        {w:'yogaḥ',pos_ja:'名詞・主格',pos_en:'noun, nominative',m_ja:'ヨーガ',m_en:'Yoga',ety_ja:'√yuj（繋ぐ・くびき）→ラテン語 iugum →英語 "yoke"。同語根！',ety_en:'√yuj (to yoke) → Latin iugum → English "yoke". Same root!',note_ja:'「自己を真理に繋ぐ実践」。',note_en:'"Yoking oneself to truth."'},
        {w:'kauśalam',pos_ja:'名詞・主格',pos_en:'noun, nominative',m_ja:'熟練・技術',m_en:'skill, mastery',note_ja:'「行為における完璧な熟練」——これがヨーガの定義。',note_en:'"Perfect mastery in action" — this IS yoga.'}
      ]}
    ],
    summary_ja:'行為においてのみ権限がある。結果を動機とするな——行為における熟練がヨーガ。',
    summary_en:'Authority lies only in action. Never let results be the motive — mastery in action, that is yoga.'
  },
  {
    id:'satya', icon:'💎', collection:'Sanskrit Maxims', ref:'Muṇḍaka Up. 3.1.6',
    theme_ja:'真実・インド国是', theme_en:'Truth — India\'s national motto',
    title_ja:'Satyameva jayate', title_en:'Truth alone triumphs',
    iyaku_ja:'真実のみが勝利する。\n虚偽はそうではない。\n真実の道によって\n神々への道は開かれる。',
    iyaku_en:'Truth alone triumphs, not falsehood.\nThrough truth the divine path is opened.',
    ctx_ja:'ムンダカ・ウパニシャッドの格言。ガンジーが独立運動の精神的支柱とし、独立後のインド国是となった。紙幣・国章に刻まれている。',
    ctx_en:'From the Muṇḍaka Upaniṣad. Gandhi\'s spiritual foundation for independence. Now India\'s national motto, inscribed on coins and the state emblem.',
    lines:[
      {pali:'Satyam eva jayate nānṛtam',words:[
        {w:'Satyam',pos_ja:'名詞・主格',pos_en:'noun, nominative',m_ja:'真実',m_en:'truth, reality',ety_ja:'√sat（存在する・真である）→「存在するもの」。英語 "is"、ラテン語 esse（存在する）と同語根',ety_en:'√sat (to be, to be true) → "that which is". Cognate with Latin esse (to be), English "is"',note_ja:'sat＝being（存在）。真実は「存在するもの」。',note_en:'sat = being/existence. Truth is "that which truly is."'},
        {w:'eva',pos_ja:'強調不変化詞',pos_en:'emphatic particle',m_ja:'のみ・まさに',m_en:'alone, indeed',note_ja:'「まさに真実だけが」という強調。',note_en:'"Truth and nothing but truth" — emphatic.'},
        {w:'jayate',pos_ja:'動詞・受動態',pos_en:'verb, passive',m_ja:'勝利する',m_en:'triumphs, is victorious',ety_ja:'√ji（勝つ）→ サンスクリット jaya（勝利）',ety_en:'√ji (to conquer) → Sanskrit jaya (victory)',note_ja:'「勝利が与えられる」受動態。',note_en:'Passive voice: "victory is won."'}
      ]}
    ],
    summary_ja:'真実のみが勝利する——インドの国是。ムンダカ・ウパニシャッド。',
    summary_en:'Truth alone triumphs — India\'s national motto, from the Muṇḍaka Upaniṣad.'
  },
  {
    id:'ahimsa', icon:'🕊️', collection:'Sanskrit Maxims', ref:'Mahābhārata',
    theme_ja:'非暴力・最高の法', theme_en:'Non-violence — the supreme law',
    title_ja:'Ahiṃsā paramo dharmaḥ', title_en:'Non-violence is the highest dharma',
    iyaku_ja:'非暴力こそが最高の法（ダルマ）である。\n非暴力こそが最高の苦行。\n非暴力こそが最高の真実。\n非暴力こそが最高の教えである。',
    iyaku_en:'Non-violence is the highest dharma.\nNon-violence is the highest austerity.\nNon-violence is the highest truth.\nNon-violence is the highest teaching.',
    ctx_ja:'マハーバーラタで繰り返される格言。ガンジーのサティヤーグラハ（真実の力）の思想的核。仏教の不殺生戒と深く共鳴する。',
    ctx_en:'Repeated throughout the Mahābhārata. Core of Gandhi\'s satyāgraha. Resonates with the Buddhist precept of non-killing.',
    lines:[
      {pali:'Ahiṃsā paramo dharmaḥ',words:[
        {w:'Ahiṃsā',pos_ja:'名詞・主格',pos_en:'noun, nominative',m_ja:'非暴力',m_en:'non-violence, non-harming',ety_ja:'a（否定）＋hiṃsā（傷つけること）。√han（打つ・殺す）から',ety_en:'a (not) + hiṃsā (harm), from √han (to strike, kill)',note_ja:'仏教の不殺生戒と同語。',note_en:'Same as the Buddhist precept of non-killing.'},
        {w:'paramo',pos_ja:'形容詞',pos_en:'adjective',m_ja:'最高の',m_en:'highest, supreme',note_ja:'para（向こう・超えた）から。',note_en:'From para (beyond, the other side).'},
        {w:'dharmaḥ',pos_ja:'名詞・主格',pos_en:'noun, nominative',m_ja:'法・ダルマ',m_en:'dharma, law, duty',ety_ja:'√dhṛ（支える・保つ）→パーリ語 dhamma と同語',ety_en:'√dhṛ (to hold, sustain) → same as Pāli dhamma',note_ja:'宇宙的秩序・義務・真理。最も多義的な概念語。',note_en:'Cosmic order, duty, truth — the most polysemous concept in Indian thought.'}
      ]}
    ],
    summary_ja:'非暴力こそ最高の法——マハーバーラタ。ガンジーの思想的核。',
    summary_en:'Non-violence is the highest dharma — Mahābhārata. The core of Gandhi\'s philosophy.'
  },
  {
    id:'ten-fetters', icon:'⛓️', collection:'Abhidhamma / Sutta', ref:'十結',
    theme_ja:'十結——解脱を妨げる10の束縛', theme_en:'Ten Fetters — 10 bonds that bind us',
    title_ja:'十結（十の束縛）', title_en:'Dasa Saṃyojanāni — Ten Fetters',
    iyaku_ja:'十の束縛が輪廻をつなぎとめる。\n下分結（欲界への結びつき）：\n有身見・疑・戒禁取・欲愛・瞋恚\n\n上分結（三界への結びつき）：\n色貪・無色貪・慢・掉挙・無明\n\nすべての束縛が断たれたとき\n——阿羅漢果、輪廻からの解放。',
    iyaku_en:'Ten fetters bind us to samsāra.\nLower fetters (binding to sense realm):\nBelief in self · Doubt · Wrong rules · Desire · Ill-will\n\nUpper fetters (binding to all three realms):\nDesire for form · For formlessness · Conceit · Restlessness · Ignorance\n\nWhen all are released:\n— Arahantship. Liberation from rebirth.',
    ctx_ja:'四向四果の解脱の地図。預流果で3つ、一来果で4〜5つが薄れ、不還果で5つが完全に断たれ、阿羅漢果ですべて断たれる。',
    ctx_en:'The map of liberation through the four paths and fruits. Stream-entry: 3 released. Once-return: 4-5 weakened. Non-return: 5 fully released. Arahantship: all ten gone.',
    lines:[
      {pali:'sakkāya-diṭṭhi',words:[
        {w:'sakkāya-diṭṭhi',pos_ja:'複合名詞',pos_en:'compound noun',m_ja:'有身見——五蘊を自己とみなす見解',m_en:'belief in a permanent self — seeing the five aggregates as "I"',note_ja:'sat（存在）＋kāya（身体）＋diṭṭhi（見解）。預流果で断たれる第一の結。',note_en:'sat (existence) + kāya (body) + diṭṭhi (view). The first fetter released at stream-entry.'}
      ]},
      {pali:'vicikicchā',words:[
        {w:'vicikicchā',pos_ja:'名詞',pos_en:'noun',m_ja:'疑——教えに対する疑い',m_en:'doubt — doubt about the teaching and path',note_ja:'教義・仏法への疑い。預流果で断たれる第二の結。',note_en:'The second fetter released at stream-entry.'}
      ]},
      {pali:'kāmacchanda',words:[
        {w:'kāmacchanda',pos_ja:'複合名詞',pos_en:'compound noun',m_ja:'欲愛——感覚的欲望への執着',m_en:'sensual desire — craving for sense pleasures',note_ja:'kāma（欲）＋chanda（欲する）。不還果で完全に断たれる。',note_en:'kāma (desire) + chanda (wishing). Fully released at non-return.'}
      ]},
      {pali:'avijjā',words:[
        {w:'avijjā',pos_ja:'名詞',pos_en:'noun',m_ja:'無明——真理への根本的な誤解',m_en:'ignorance — deep misunderstanding of reality',ety_ja:'a（否定）＋vijjā（知識・明知）。サンスクリット avidyā',ety_en:'a (not) + vijjā (knowledge). Sanskrit: avidyā',note_ja:'十二因縁の最初の輪。阿羅漢果で断たれる最後の結。「情報の欠如ではなく根深い誤解」。',note_en:'First link in the twelve-fold chain. Last fetter released at arahantship. "Not lack of information but deep-seated misunderstanding."'}
      ]}
    ],
    summary_ja:'十の束縛が輪廻をつなぎとめる。四向四果の修行によってこれらが段階的に解放され、最終的に阿羅漢果で完全解脱が実現する。',
    summary_en:'Ten fetters bind us to samsāra. Through the four stages of the path, they are progressively released, culminating in complete liberation at arahantship.'
  }
];

// ── BADGES ──────────────────────────────────

var BADGES = [
  {id:'b1',icon:'🌱',name_ja:'初転法輪',name_en:'First Turn',desc_ja:'修行を始める',desc_en:'Begin the path',cond:function(s){return s.stagesDone.has('s0')||s.read.size>=1}},
  {id:'b2',icon:'📿',name_ja:'三帰依者',name_en:'Triple Refuge',desc_ja:'三帰依を読む',desc_en:'Read the Three Refuges',cond:function(s){return s.read.has('tisarana')}},
  {id:'b3',icon:'💛',name_ja:'慈心者',name_en:'Loving Heart',desc_ja:'慈経を読む',desc_en:'Read the Metta Sutta',cond:function(s){return s.read.has('metta')}},
  {id:'b4',icon:'📿',name_ja:'預流果',name_en:'Stream-Enterer',desc_ja:'Stage 1 クリア',desc_en:'Stage 1 cleared',cond:function(s){return s.stagesDone.has('s1')}},
  {id:'b5',icon:'🕯️',name_ja:'一来果',name_en:'Once-Returner',desc_ja:'Stage 2 クリア',desc_en:'Stage 2 cleared',cond:function(s){return s.stagesDone.has('s2')}},
  {id:'b6',icon:'🏯',name_ja:'不還果',name_en:'Non-Returner',desc_ja:'Stage 3 クリア',desc_en:'Stage 3 cleared',cond:function(s){return s.stagesDone.has('s3')}},
  {id:'b7',icon:'🪷',name_ja:'阿羅漢',name_en:'Arahant',desc_ja:'Stage 4 クリア——解脱！',desc_en:'Stage 4 cleared — Liberation!',cond:function(s){return s.stagesDone.has('s4')}},
  {id:'b8',icon:'⛓️',name_ja:'十結を知る者',name_en:'Knower of Ten Fetters',desc_ja:'十結の原典を読む',desc_en:'Read the Ten Fetters scripture',cond:function(s){return s.read.has('ten-fetters')}},
  {id:'b9',icon:'🌌',name_ja:'聖域の守護者',name_en:'Sacred Keeper',desc_ja:'プレミアム加入',desc_en:'Premium member',cond:function(s){return s.premium}},
  {id:'b10',icon:'💎',name_ja:'全原典読破',name_en:'All Read',desc_ja:'すべての原典を読む',desc_en:'Read all scriptures',cond:function(s){return s.read.size>=SCRIPTURES.length}},
];

// ── STATE ────────────────────────────────────

var XP_LV = [0,80,200,380,600,900,1300];