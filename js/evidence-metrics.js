/**
 * 記録・分析用メトリクス（内部アルゴリズム）
 *
 * 医学・宗教的效果を証明するものではありません。
 * 「行動量」と任意で入力される主観指標を、説明可能な形でひとつの日次インデックスにまとめるためのモデルです。
 */

(function () {
  var W_ACT = 0.52;
  var W_EMO = 0.48;

  function clampOptionalEmotion(value) {
    if (value == null || value === '') return null;
    var n = Number(value);
    if (!Number.isFinite(n)) return null;
    return Math.max(0, Math.min(10, Math.round(n)));
  }

  function hasFullEmotion(s) {
    return (
      clampOptionalEmotion(s.log_pain) != null &&
      clampOptionalEmotion(s.log_refresh) != null &&
      clampOptionalEmotion(s.log_joy) != null
    );
  }

  /**
   * 苦しさは「高いほど負側」: (refresh + joy + (10 − pain)) / 30 → 0〜1
   */
  function emotionBalance01(s) {
    var pain = clampOptionalEmotion(s.log_pain);
    var ref = clampOptionalEmotion(s.log_refresh);
    var joy = clampOptionalEmotion(s.log_joy);
    if (pain == null || ref == null || joy == null) return null;
    var relieved = ref + joy + (10 - pain);
    return Math.max(0, Math.min(1, relieved / 30));
  }

  /**
   * 活動 0〜1（唱数・功徳、飽和あり）
   */
  function activityBlend01(s) {
    var cnt = Number(s.count) || 0;
    var merit = Number(s.merit) || 0;
    return Math.max(0, Math.min(1, cnt / 75 + merit / 3500));
  }

  /**
   * 日次インデックス 0〜100（整数）
   */
  function computeEvidenceDayIndex(s) {
    var act = activityBlend01(s);
    var eb = emotionBalance01(s);
    var blended = eb != null ? W_ACT * act + W_EMO * eb : act;
    return {
      index: Math.round(100 * blended),
      activity01: act,
      emotionBalance01: eb,
      hasEmotion: eb != null,
    };
  }

  function algorithmSummaryLines() {
    return [
      '目的: 唱えた量（count / merit）と、任意の「今日の主観（pain / refresh / joy）」を、CSV やグラフで追いやすい 0〜100 の日次インデックスにまとめます。',
      '活動成分 activity = min(1, count/75 + merit/3500)。',
      '感情成分（3 つとも 0〜10 が入っているときのみ） balance = (refresh + joy + (10 − pain)) / 30 を 0〜1 にクリップ。',
      '合成: 感情あり → index = round(100 × (' +
        W_ACT +
        '×activity + ' +
        W_EMO +
        '×balance))、感情なし → round(100×activity)。',
      '注意: 医療・宗教的效果を主張するものではありません。分析はご自身の責任で匿名化・同意のうえ行ってください。',
    ];
  }

  window.EvidenceMetrics = {
    clampOptionalEmotion,
    hasFullEmotion,
    emotionBalance01,
    activityBlend01,
    computeEvidenceDayIndex,
    algorithmSummaryLines,
    WEIGHTS: { activity: W_ACT, emotion: W_EMO },
  };
})();
