/**
 * Yomuyomu Odaimoku v15+ - Charts & Data Visualization
 * 
 * 責務:
 *   - Chart.js を使用したグラフ描画
 *   - 修行データの可視化
 *   - 統計情報の表示
 * 
 * グラフ種類:
 *   1. Line Chart: 修行量の推移（週別・月別）
 *   2. Bar Chart: 功徳の内訳（お題目 vs 勤行）
 *   3. Radar Chart: 9つの能力スコア
 *   4. Doughnut Chart: 修行タイプ別の内訳
 * 
 * 依存関係:
 *   - Chart.js (CDN: https://cdn.jsdelivr.net/npm/chart.js)
 *   - storage.js (データ取得)
 *   - config.js (用語・メッセージ)
 * 
 * 使用方法:
 *   - renderCharts() 呼び出し時にすべてのグラフを初期化
 *   - updateCharts() で定期的に更新
 */

// グラフインスタンスの参照を保持（再初期化・更新用）
const chartInstances = {
  practiceHistory: null,
  meritBreakdown: null,
  abilityScores: null,
  practiceComposition: null,
  statsMonthlyHistory: null,
  statsAbilityGrowth: null,
};

// グラフの色（styles.css と同じ色相 --h:35 に合わせた近似 hex）
const CHART_COLORS = {
  primary: '#bf7f2e',
  secondary: '#d9a046',
  accent: '#e8bc6a',
  lightBg: '#f5f0e8',
  error: '#d32f2f',
  warning: '#f0a500',
  info: '#2196f3',
  success: '#bf7f2e',
};

// ========== グラフ初期化 ==========

/**
 * すべてのグラフを初期化・描画
 * DOMContentLoaded 時に呼び出し
 */
async function renderCharts() {
  console.log('[Charts] Initializing all charts');

  try {
    const userData = await StorageManager.getUserData();
    if (!userData) {
      console.warn('[Charts] No user data available');
      return;
    }

    // 各グラフを初期化（ダッシュボード用。統計タブ内グラフは非表示になりがちなため遅延描画）
    renderPracticeHistoryChart(userData);
    renderMeritBreakdownChart(userData);
    renderAbilityScoresChart(userData);
    renderPracticeCompositionChart(userData);

    console.log('[Charts] All charts initialized');
  } catch (error) {
    console.error('[Charts] Failed to render charts:', error);
  }
}

/**
 * すべてのグラフを更新
 * データ更新時に呼び出し
 */
async function updateCharts() {
  console.log('[Charts] Updating all charts');

  try {
    const userData = await StorageManager.getUserData();
    if (!userData) return;

    // 既存のグラフを破棄して再描画
    Object.values(chartInstances).forEach(chart => {
      if (chart) chart.destroy();
    });

    await renderCharts();
    await refreshPracticeStatsCharts(userData);
  } catch (error) {
    console.error('[Charts] Failed to update charts:', error);
  }
}

async function refreshPracticeStatsCharts(userDataOptional) {
  if (typeof Chart === 'undefined') return;
  const userData = userDataOptional || (await StorageManager.getUserData());
  if (!userData) return;
  renderStatsMonthlyHistoryChart(userData);
  renderStatsAbilityGrowthChart(userData);
  queueMicrotask(() => {
    if (chartInstances.statsMonthlyHistory) chartInstances.statsMonthlyHistory.resize();
    if (chartInstances.statsAbilityGrowth) chartInstances.statsAbilityGrowth.resize();
  });
}

window.refreshPracticeStatsCharts = refreshPracticeStatsCharts;

// ========== 1. 修行量の推移（Line Chart） ==========

/**
 * 修行量推移グラフ（週別または月別）
 * 
 * @param {object} userData - ユーザーデータ
 * @param {string} period - 'week' または 'month'
 */
function renderPracticeHistoryChart(userData, period = 'week') {
  const canvasId = 'chart-practice-history';
  const canvas = document.getElementById(canvasId);

  if (!canvas) {
    console.warn(`[Charts] Canvas not found: ${canvasId}`);
    return;
  }

  // 既存グラフを破棄
  if (chartInstances.practiceHistory) {
    chartInstances.practiceHistory.destroy();
  }

  // データを集計（3軸：功徳/幸運/覚醒度）
  const { labels, data } = aggregateThreeAxisWeekly(userData);
  const shell = document.querySelector('#screen-practice .yomy-v15-shell');
  const isDark = !!shell?.classList.contains('dark');
  const legendColor = isDark ? '#ddd' : '#333';
  const tickColor = isDark ? '#cfcfcf' : '#666';
  const gridColor = isDark ? 'rgba(255,255,255,0.08)' : '#e0e0e0';

  // グラフを描画
  chartInstances.practiceHistory = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          type: 'bar',
          label: '功徳（合計）',
          data: data.merit,
          borderColor: CHART_COLORS.primary,
          backgroundColor: `${CHART_COLORS.primary}55`,
          borderWidth: 1,
          borderRadius: 6,
          yAxisID: 'yMerit',
        },
        {
          type: 'bar',
          label: '幸運（件）',
          data: data.fortune,
          borderColor: CHART_COLORS.secondary,
          backgroundColor: `${CHART_COLORS.secondary}55`,
          borderWidth: 1,
          borderRadius: 6,
          yAxisID: 'yMerit',
        },
        {
          type: 'line',
          label: '覚醒度（記録用・0〜100）',
          data: data.awakening,
          borderColor: '#ffb300',
          backgroundColor: 'rgba(255,179,0,0.18)',
          borderWidth: 2,
          tension: 0.35,
          pointRadius: 3,
          pointHoverRadius: 5,
          fill: false,
          yAxisID: 'yAwake',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: { size: 12, family: '-apple-system, BlinkMacSystemFont, "Segoe UI"' },
            color: legendColor,
            padding: 15,
          },
        },
        title: {
          display: true,
          text: '3軸の推移（週）',
          font: { size: 14, weight: 'bold' },
          color: CHART_COLORS.primary,
          padding: 20,
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          cornerRadius: 8,
          titleFont: { size: 12, weight: 'bold' },
          bodyFont: { size: 11 },
        },
      },
      scales: {
        yMerit: {
          position: 'left',
          beginAtZero: true,
          suggestedMax: calculateMaxValue({ chanting: data.merit, gongyo: data.fortune }),
          ticks: {
            color: tickColor,
            font: { size: 11 },
          },
          grid: {
            color: gridColor,
            drawTicks: false,
          },
          title: {
            display: true,
            text: '功徳 / 幸運',
            color: tickColor,
          },
        },
        yAwake: {
          position: 'right',
          beginAtZero: true,
          suggestedMax: 100,
          ticks: {
            color: tickColor,
            font: { size: 11 },
          },
          grid: {
            drawOnChartArea: false,
          },
          title: {
            display: true,
            text: '覚醒度（記録用）',
            color: tickColor,
          },
        },
        x: {
          ticks: {
            color: tickColor,
            font: { size: 11 },
          },
          grid: {
            display: false,
          },
        },
      },
    },
  });
}

function aggregateThreeAxisWeekly(userData, weeks = 8) {
  const sessions = userData.sessions || [];
  const startOfWeek = (d) => {
    const dt = new Date(d);
    dt.setHours(12, 0, 0, 0);
    const day = dt.getDay(); // 0=Sun
    dt.setDate(dt.getDate() - day);
    return dt;
  };
  const addDays = (d, n) => {
    const dt = new Date(d);
    dt.setDate(dt.getDate() + n);
    return dt;
  };
  const fmt = (d) => d.toISOString().split('T')[0].slice(5);

  const now = new Date();
  const thisWeek = startOfWeek(now);
  const buckets = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const ws = addDays(thisWeek, -7 * i);
    const we = addDays(ws, 6);
    buckets.push({
      key: ws.toISOString().split('T')[0],
      label: `${fmt(ws)}〜${fmt(we)}`,
      merit: 0,
      fortune: 0,
      awakeSum: 0,
      awakeN: 0,
    });
  }
  const byKey = new Map(buckets.map((b) => [b.key, b]));

  sessions.forEach((s) => {
    if (!s?.date) return;
    const d = new Date(`${String(s.date).split('T')[0]}T12:00:00`);
    const ws = startOfWeek(d).toISOString().split('T')[0];
    const b = byKey.get(ws);
    if (!b) return;
    b.merit += Number(s.merit) || 0;
    b.fortune += Number(s.journal_luck_count) || 0;
    if (
      typeof EvidenceMetrics !== 'undefined' &&
      EvidenceMetrics.computeEvidenceDayIndex
    ) {
      const idx = EvidenceMetrics.computeEvidenceDayIndex(s)?.index;
      if (Number.isFinite(idx)) {
        b.awakeSum += idx;
        b.awakeN += 1;
      }
    }
  });

  return {
    labels: buckets.map((b) => b.label),
    data: {
      merit: buckets.map((b) => Math.round(b.merit)),
      fortune: buckets.map((b) => Math.round(b.fortune)),
      awakening: buckets.map((b) =>
        b.awakeN ? Math.round((b.awakeSum / b.awakeN) * 10) / 10 : null,
      ),
    },
  };
}

/**
 * 修行データを期間別に集計
 * 
 * @param {object} userData - ユーザーデータ
 * @param {string} period - 'week' または 'month'
 * @returns {object} { labels, data }
 */
function aggregatePracticeData(userData, period = 'week') {
  const sessions = userData.sessions || [];
  const now = new Date();
  const labels = [];
  const chantingData = [];
  const gongyoData = [];

  if (period === 'week') {
    // 過去7日間のデータ
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
      labels.push(`${date.getDate()}日(${dayName})`);

      // その日のセッションデータを集計
      const daySessions = sessions.filter(s => s.date === dateStr);
      const chanting = daySessions.reduce((sum, s) => sum + (s.count_chanting || 0), 0);
      const gongyo = daySessions.reduce((sum, s) => sum + (s.count_gongyo || 0), 0);

      chantingData.push(chanting);
      gongyoData.push(gongyo);
    }
  } else {
    // 過去12ヶ月のデータ
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      labels.push(`${date.getMonth() + 1}月`);

      // その月のセッションデータを集計
      const monthSessions = sessions.filter(s => {
        const sessionDate = new Date(s.date);
        return (
          sessionDate.getFullYear() === date.getFullYear() &&
          sessionDate.getMonth() === date.getMonth()
        );
      });

      const chanting = monthSessions.reduce((sum, s) => sum + (s.count_chanting || 0), 0);
      const gongyo = monthSessions.reduce((sum, s) => sum + (s.count_gongyo || 0), 0);

      chantingData.push(chanting);
      gongyoData.push(gongyo);
    }
  }

  return {
    labels,
    data: {
      chanting: chantingData,
      gongyo: gongyoData,
    },
  };
}

/**
 * データ配列の最大値を計算（グラフスケール用）
 * 
 * @param {object} data - データオブジェクト
 * @returns {number} 最大値
 */
function calculateMaxValue(data) {
  const allValues = [
    ...data.chanting,
    ...data.gongyo,
  ].filter(v => typeof v === 'number');

  const max = Math.max(...allValues, 0);
  // グラフの見栄えのため、最大値を 20% 上げる
  return Math.ceil(max * 1.2);
}

// ========== 2. 功徳の内訳（Bar Chart） ==========

/**
 * 功徳内訳グラフ（念仏 vs 勤行）
 * 
 * @param {object} userData - ユーザーデータ
 */
function renderMeritBreakdownChart(userData) {
  const canvasId = 'chart-merit-breakdown';
  const canvas = document.getElementById(canvasId);

  if (!canvas) {
    console.warn(`[Charts] Canvas not found: ${canvasId}`);
    return;
  }

  // 既存グラフを破棄
  if (chartInstances.meritBreakdown) {
    chartInstances.meritBreakdown.destroy();
  }

  // 功徳を計算
  const sessions = userData.sessions || [];
  const meritChanting = sessions.reduce((sum, s) => sum + (s.merit_chanting || 0), 0);
  const meritGongyo = sessions.reduce((sum, s) => sum + (s.merit_gongyo || 0), 0);
  const totalMerit = meritChanting + meritGongyo;

  // グラフを描画
  chartInstances.meritBreakdown = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: [TERMINOLOGY.chanting || '念仏', TERMINOLOGY.gongyo || '勤行'],
      datasets: [
        {
          label: '功徳',
          data: [meritChanting, meritGongyo],
          backgroundColor: [CHART_COLORS.primary, CHART_COLORS.secondary],
          borderColor: [CHART_COLORS.primary, CHART_COLORS.secondary],
          borderWidth: 1,
          borderRadius: 8,
          hoverBackgroundColor: [
            lightenColor(CHART_COLORS.primary, 20),
            lightenColor(CHART_COLORS.secondary, 20),
          ],
        },
      ],
    },
    options: {
      indexAxis: 'x',
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: '功徳の内訳',
          font: { size: 14, weight: 'bold' },
          color: CHART_COLORS.primary,
          padding: 20,
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            afterLabel: (context) => {
              if (!totalMerit) return '';
              const percentage = ((context.raw / totalMerit) * 100).toFixed(1);
              return `(${percentage}%)`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#666',
            font: { size: 11 },
          },
          grid: {
            color: '#e0e0e0',
            drawTicks: false,
          },
          title: {
            display: true,
            text: '功徳',
            color: '#666',
          },
        },
        x: {
          ticks: {
            color: '#666',
            font: { size: 12 },
          },
          grid: {
            display: false,
          },
        },
      },
    },
  });
}

// ========== 3. 能力スコア（Radar Chart） ==========

/**
 * 9つの能力スコアをレーダーチャートで表示
 * 
 * @param {object} userData - ユーザーデータ
 */
function renderAbilityScoresChart(userData) {
  const canvasId = 'chart-ability-scores';
  const canvas = document.getElementById(canvasId);

  if (!canvas) {
    console.warn(`[Charts] Canvas not found: ${canvasId}`);
    return;
  }

  // 既存グラフを破棄
  if (chartInstances.abilityScores) {
    chartInstances.abilityScores.destroy();
  }

  // 9つの能力スコアを取得
  const scores = {
    sati: (userData.ability_sati || 0) * 10,        // 念
    vipassana: (userData.ability_vipassana || 0) * 10, // 観
    bodhi: (userData.ability_bodhi || 0) * 10,      // 智
    prajna: (userData.ability_prajna || 0) * 10,    // 般若
    samadhi: (userData.ability_samadhi || 0) * 10,  // 定
    shila: (userData.ability_shila || 0) * 10,      // 戒
    metta: (userData.ability_metta || 0) * 10,      // 慈
    karuna: (userData.ability_karuna || 0) * 10,    // 悲
    mudita: (userData.ability_mudita || 0) * 10,    // 喜
  };

  const labels = [
    '念',   // Sati
    '観',   // Vipassana
    '智',   // Bodhi
    '般若', // Prajna
    '定',   // Samadhi
    '戒',   // Shila
    '慈',   // Metta
    '悲',   // Karuna
    '喜',   // Mudita
  ];

  const data = Object.values(scores);

  chartInstances.abilityScores = new Chart(canvas, {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [
        {
          label: '能力スコア',
          data: data,
          borderColor: CHART_COLORS.primary,
          backgroundColor: `${CHART_COLORS.primary}20`,
          borderWidth: 2,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: CHART_COLORS.primary,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: '9つの能力スコア',
          font: { size: 14, weight: 'bold' },
          color: CHART_COLORS.primary,
          padding: 20,
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          cornerRadius: 8,
        },
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: {
            color: '#666',
            font: { size: 10 },
            stepSize: 20,
          },
          grid: {
            color: '#e0e0e0',
          },
          pointLabels: {
            color: '#333',
            font: { size: 12, weight: 'bold' },
          },
        },
      },
    },
  });
}

// ========== 4. 修行タイプ別内訳（Doughnut Chart） ==========

/**
 * 修行タイプ別内訳グラフ（念仏 vs 勤行）
 * 
 * @param {object} userData - ユーザーデータ
 */
function renderPracticeCompositionChart(userData) {
  const canvasId = 'chart-practice-composition';
  const canvas = document.getElementById(canvasId);

  if (!canvas) {
    console.warn(`[Charts] Canvas not found: ${canvasId}`);
    return;
  }

  // 既存グラフを破棄
  if (chartInstances.practiceComposition) {
    chartInstances.practiceComposition.destroy();
  }

  // 修行回数を計算
  const sessions = userData.sessions || [];
  const totalChanting = sessions.reduce((sum, s) => sum + (s.count_chanting || 0), 0);
  const totalGongyo = sessions.reduce((sum, s) => sum + (s.count_gongyo || 0), 0);
  const total = totalChanting + totalGongyo || 1; // ゼロ除算対策

  chartInstances.practiceComposition = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: [TERMINOLOGY.chanting || '念仏', TERMINOLOGY.gongyo || '勤行'],
      datasets: [
        {
          data: [totalChanting, totalGongyo],
          backgroundColor: [CHART_COLORS.primary, CHART_COLORS.secondary],
          borderColor: '#fff',
          borderWidth: 2,
          hoverOffset: 10,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { size: 12 },
            color: '#333',
            padding: 15,
          },
        },
        title: {
          display: true,
          text: '修行内訳（総実行数）',
          font: { size: 14, weight: 'bold' },
          color: CHART_COLORS.primary,
          padding: 20,
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: (context) => {
              const percentage = ((context.raw / total) * 100).toFixed(1);
              return `${context.label}: ${context.raw}回 (${percentage}%)`;
            },
          },
        },
      },
    },
  });
}

// ========== 統計画面（月別推移・能力成長） ==========

function renderStatsMonthlyHistoryChart(userData) {
  const canvasId = 'chart-monthly-history';
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === 'undefined') return;

  if (chartInstances.statsMonthlyHistory) {
    chartInstances.statsMonthlyHistory.destroy();
  }

  const sessions = userData.sessions || [];
  const now = new Date();
  const labels = [];
  const totals = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(`${d.getMonth() + 1}月`);
    const y = d.getFullYear();
    const m = d.getMonth();
    let sum = 0;
    sessions.forEach((s) => {
      const sd = new Date(s.date);
      if (sd.getFullYear() === y && sd.getMonth() === m) {
        sum += s.count || 0;
      }
    });
    totals.push(sum);
  }

  chartInstances.statsMonthlyHistory = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: '念仏回数（合計）',
          data: totals,
          backgroundColor: `${CHART_COLORS.primary}66`,
          borderColor: CHART_COLORS.primary,
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: '月別の念仏回数',
          font: { size: 14, weight: 'bold' },
          color: CHART_COLORS.primary,
        },
      },
      scales: {
        y: { beginAtZero: true, ticks: { color: '#666' } },
        x: { ticks: { color: '#666' }, grid: { display: false } },
      },
    },
  });
}

function renderStatsAbilityGrowthChart(userData) {
  const canvasId = 'chart-ability-growth';
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === 'undefined') return;

  if (chartInstances.statsAbilityGrowth) {
    chartInstances.statsAbilityGrowth.destroy();
  }

  const sessions = userData.sessions || [];
  const now = new Date();
  const labels = [];
  const cumulativeMerit = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(`${d.getMonth() + 1}月`);
    const y = d.getFullYear();
    const m = d.getMonth();
    let meritMonth = 0;
    sessions.forEach((s) => {
      const sd = new Date(s.date);
      if (sd.getFullYear() === y && sd.getMonth() === m) {
        meritMonth += s.merit || 0;
      }
    });
    const prev = cumulativeMerit.length ? cumulativeMerit[cumulativeMerit.length - 1] : 0;
    cumulativeMerit.push(prev + meritMonth);
  }

  chartInstances.statsAbilityGrowth = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: '累計功徳',
          data: cumulativeMerit,
          borderColor: CHART_COLORS.secondary,
          backgroundColor: `${CHART_COLORS.secondary}22`,
          fill: true,
          tension: 0.35,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: '功徳の累積推移（概観）',
          font: { size: 14, weight: 'bold' },
          color: CHART_COLORS.primary,
        },
      },
      scales: {
        y: { beginAtZero: true, ticks: { color: '#666' } },
        x: { ticks: { color: '#666' }, grid: { display: false } },
      },
    },
  });
}

// ========== ユーティリティ関数 ==========

/**
 * 16進数カラーを明るくする
 * 
 * @param {string} color - 16進数カラーコード（例: #2d7a4a）
 * @param {number} percent - 明るくする度合い（0-100）
 * @returns {string} 明るくなったカラーコード
 */
function lightenColor(color, percent) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
  const B = Math.min(255, (num & 0x0000FF) + amt);
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}

/**
 * 16進数カラーを暗くする
 * 
 * @param {string} color - 16進数カラーコード
 * @param {number} percent - 暗くする度合い（0-100）
 * @returns {string} 暗くなったカラーコード
 */
function darkenColor(color, percent) {
  return lightenColor(color, -percent);
}

/**
 * RGB カラーコード to 16進数
 * 
 * @param {number} r - 赤 (0-255)
 * @param {number} g - 緑 (0-255)
 * @param {number} b - 青 (0-255)
 * @returns {string} 16進数カラーコード
 */
function rgbToHex(r, g, b) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// ========== DOM 準備完了時の初期化 ==========

/**
 * Chart.js ライブラリの読み込み確認
 * index.html に以下を追加：
 * <script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof Chart !== 'undefined') {
      renderCharts();
    } else {
      console.error('[Charts] Chart.js library not loaded');
    }
  });
} else {
  if (typeof Chart !== 'undefined') {
    renderCharts();
  }
}

// ========== エクスポート ==========
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderCharts,
    updateCharts,
    renderPracticeHistoryChart,
    renderMeritBreakdownChart,
    renderAbilityScoresChart,
    renderPracticeCompositionChart,
  };
}
