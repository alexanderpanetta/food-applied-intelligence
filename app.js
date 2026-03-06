/* ============================================================
   app.js — Food: Applied Intelligence
   Main application logic: navigation, quiz, charts, advisor
   ============================================================ */

(function () {
  'use strict';

  // ── State ─────────────────────────────────────────────────
  let currentQuestion = 0;
  let answers = new Array(QUIZ.length).fill(null);
  let chartsRendered = false;
  let chartInstances = {};

  // ── Initialization ────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initNavigation();
    initQuiz();
    initAdvisor();
    // Charts rendered lazily on first visit to Insights
  }

  // ── Navigation ────────────────────────────────────────────

  function initNavigation() {
    document.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        showSection(this.dataset.section);
      });
    });

    document.getElementById('start-quiz-btn').addEventListener('click', function () {
      showSection('quiz-section');
    });

    document.getElementById('explore-evidence-btn').addEventListener('click', function () {
      showSection('insights');
    });

    document.getElementById('retake-btn').addEventListener('click', retakeQuiz);

    // Footer navigation links
    document.querySelectorAll('.bib-footer-link, .nav-link-footer').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        showSection(this.dataset.section);
      });
    });
  }

  function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(function (s) {
      s.classList.remove('active');
    });

    var target = document.getElementById(sectionId);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update nav active state
    document.querySelectorAll('.nav-link').forEach(function (link) {
      link.classList.toggle('active', link.dataset.section === sectionId);
    });

    // Lazy-render charts
    if (sectionId === 'insights' && !chartsRendered) {
      setTimeout(renderAllCharts, 300);
      chartsRendered = true;
    }
  }

  // ── Quiz ──────────────────────────────────────────────────

  function initQuiz() {
    showQuestion(0);
  }

  function showQuestion(index) {
    currentQuestion = index;
    var q = QUIZ[index];
    var cat = CATEGORIES[q.category];

    document.getElementById('quiz-progress-bar').style.width =
      ((index + 1) / QUIZ.length * 100) + '%';
    document.getElementById('quiz-progress-text').textContent =
      'Question ' + (index + 1) + ' of ' + QUIZ.length;

    document.getElementById('quiz-category-tag').textContent = cat.name;
    document.getElementById('quiz-question').textContent = q.question;

    var optionsEl = document.getElementById('quiz-options');
    optionsEl.innerHTML = '';

    q.options.forEach(function (opt, i) {
      var btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = opt.text;
      if (answers[index] === i) btn.classList.add('selected');

      btn.addEventListener('click', function () {
        selectAnswer(index, i, opt.score);
      });
      optionsEl.appendChild(btn);
    });

    // Re-trigger animation
    var card = document.getElementById('quiz-card');
    card.style.animation = 'none';
    card.offsetHeight; // reflow
    card.style.animation = 'fadeSlideUp 0.4s ease';
  }

  function selectAnswer(qIndex, optIndex, score) {
    answers[qIndex] = optIndex;

    // Visual feedback
    document.querySelectorAll('.quiz-option').forEach(function (btn, i) {
      btn.classList.toggle('selected', i === optIndex);
    });

    // Auto-advance after brief delay
    setTimeout(function () {
      if (qIndex < QUIZ.length - 1) {
        showQuestion(qIndex + 1);
      } else {
        calculateAndShowResults();
      }
    }, 350);
  }

  function retakeQuiz() {
    answers = new Array(QUIZ.length).fill(null);
    currentQuestion = 0;
    showQuestion(0);
    showSection('quiz-section');
  }

  // ── Scoring ───────────────────────────────────────────────

  function calculateAndShowResults() {
    // Tally by category
    var catScores = {};
    Object.keys(CATEGORIES).forEach(function (key) { catScores[key] = 0; });

    var totalScore = 0;

    QUIZ.forEach(function (q, i) {
      var selected = answers[i];
      if (selected !== null) {
        var pts = q.options[selected].score;
        catScores[q.category] += pts;
        totalScore += pts;
      }
    });

    var normalizedTotal = Math.round((totalScore / TOTAL_MAX) * 100);

    // Normalize categories to percentage
    var catPcts = {};
    Object.keys(catScores).forEach(function (key) {
      catPcts[key] = Math.round((catScores[key] / CAT_MAX[key]) * 100);
    });

    showResults(normalizedTotal, catPcts);
  }

  function showResults(score, catPcts) {
    showSection('results');

    // Determine score tier
    var tier = SCORE_LABELS[SCORE_LABELS.length - 1];
    for (var i = 0; i < SCORE_LABELS.length; i++) {
      if (score >= SCORE_LABELS[i].min) {
        tier = SCORE_LABELS[i];
        break;
      }
    }

    // Apply class for color theming
    var header = document.getElementById('results-header');
    SCORE_LABELS.forEach(function (t) { header.classList.remove(t.cls); });
    header.classList.add(tier.cls);

    // Animate score number
    animateNumber('score-number', 0, score, 1500);

    // Animate SVG arc
    var circumference = 2 * Math.PI * 85; // ~534
    var offset = circumference - (score / 100) * circumference;
    setTimeout(function () {
      document.getElementById('score-arc').style.strokeDashoffset = offset;
    }, 100);

    // Labels
    document.getElementById('score-label').textContent = tier.label;
    document.getElementById('score-message').textContent = tier.msg;

    // Category breakdown
    var breakdownEl = document.getElementById('category-breakdown');
    breakdownEl.innerHTML = '';

    // Sort by worst first
    var catKeys = Object.keys(catPcts).sort(function (a, b) {
      return catPcts[a] - catPcts[b];
    });

    catKeys.forEach(function (key) {
      var pct = catPcts[key];
      var cat = CATEGORIES[key];
      var color = pct >= 70 ? 'var(--green-mid)' : pct >= 40 ? 'var(--amber)' : 'var(--coral)';

      // Find appropriate feedback
      var fb = CAT_FEEDBACK[key][CAT_FEEDBACK[key].length - 1];
      for (var i = 0; i < CAT_FEEDBACK[key].length; i++) {
        if (pct >= CAT_FEEDBACK[key][i].threshold) {
          fb = CAT_FEEDBACK[key][i];
          break;
        }
      }

      var card = document.createElement('div');
      card.className = 'cat-card';
      card.innerHTML =
        '<div class="cat-header">' +
          '<span class="cat-name">' + cat.name + '</span>' +
          '<span class="cat-score" style="color:' + color + '">' + pct + '%</span>' +
        '</div>' +
        '<div class="cat-bar-track">' +
          '<div class="cat-bar-fill" data-width="' + pct + '" style="background:' + color + '"></div>' +
        '</div>' +
        '<div class="cat-feedback">' +
          fb.feedback +
          '<span class="citation">' + fb.citation + '</span>' +
        '</div>';

      breakdownEl.appendChild(card);
    });

    // Animate bars
    setTimeout(function () {
      document.querySelectorAll('.cat-bar-fill').forEach(function (bar) {
        bar.style.width = bar.dataset.width + '%';
      });
    }, 200);

    // Top insight card
    var worstKey = catKeys[0];
    var worstCat = CATEGORIES[worstKey];
    var topInsight = document.getElementById('top-insight');
    topInsight.innerHTML =
      '<h3>Your Biggest Opportunity</h3>' +
      '<p><strong>' + worstCat.name + '</strong> is your lowest-scoring category at ' +
      catPcts[worstKey] + '%. Improving this single area would have the largest impact on your overall score — and, based on the evidence, on your long-term health outcomes.</p>';
  }

  function animateNumber(elementId, start, end, duration) {
    var el = document.getElementById(elementId);
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + (end - start) * eased);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  // ── Charts ────────────────────────────────────────────────

  function renderAllCharts() {
    initChartTabs();
    renderPortionChart();
    renderSSBChart();
    renderDensityChart();
    renderUPFChart();
  }

  function initChartTabs() {
    document.querySelectorAll('.chart-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        document.querySelectorAll('.chart-tab').forEach(function (t) { t.classList.remove('active'); });
        document.querySelectorAll('.chart-panel').forEach(function (p) { p.classList.remove('active'); });
        this.classList.add('active');
        document.getElementById('panel-' + this.dataset.chart).classList.add('active');
      });
    });
  }

  function chartDefaults() {
    return {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: {
            font: { family: "'Inter', sans-serif", size: 13 },
            usePointStyle: true,
            pointStyle: 'rectRounded'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(26,26,46,0.9)',
          titleFont: { family: "'Inter', sans-serif", weight: '600' },
          bodyFont: { family: "'Inter', sans-serif" },
          cornerRadius: 8,
          padding: 12
        }
      }
    };
  }

  function renderPortionChart() {
    var ctx = document.getElementById('chart-portions').getContext('2d');
    var d = CHART_PORTION_DATA;

    chartInstances.portions = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: d.labels,
        datasets: [
          {
            label: '1977 (kcal per occasion)',
            data: d.data1977,
            backgroundColor: 'rgba(156,163,175,0.6)',
            borderColor: 'rgba(156,163,175,0.8)',
            borderWidth: 1,
            borderRadius: 4
          },
          {
            label: '1996 (kcal per occasion)',
            data: d.data1996,
            backgroundColor: 'rgba(231,111,81,0.7)',
            borderColor: 'rgba(231,111,81,0.9)',
            borderWidth: 1,
            borderRadius: 4
          }
        ]
      },
      options: Object.assign({}, chartDefaults(), {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Calories per eating occasion',
              font: { family: "'Inter', sans-serif", size: 12, weight: '500' }
            },
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          x: {
            grid: { display: false },
            ticks: { font: { family: "'Inter', sans-serif", size: 11 } }
          }
        },
        plugins: Object.assign({}, chartDefaults().plugins, {
          tooltip: Object.assign({}, chartDefaults().plugins.tooltip, {
            callbacks: {
              afterBody: function (context) {
                var idx = context[0].dataIndex;
                return 'Change: ' + d.increases[idx] + ' kcal';
              }
            }
          })
        })
      })
    });
  }

  function renderSSBChart() {
    var ctx = document.getElementById('chart-ssb').getContext('2d');
    var d = CHART_SSB_DATA;

    chartInstances.ssb = new Chart(ctx, {
      type: 'line',
      data: {
        labels: d.labels,
        datasets: [{
          label: 'Servings per capita per year',
          data: d.servingsPerYear,
          borderColor: 'rgba(231,111,81,0.9)',
          backgroundColor: 'rgba(231,111,81,0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 5,
          pointBackgroundColor: 'rgba(231,111,81,1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          borderWidth: 3
        }]
      },
      options: Object.assign({}, chartDefaults(), {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: '8-oz servings per capita per year',
              font: { family: "'Inter', sans-serif", size: 12, weight: '500' }
            },
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          x: {
            grid: { display: false },
            ticks: { font: { family: "'Inter', sans-serif", size: 12 } }
          }
        },
        plugins: Object.assign({}, chartDefaults().plugins, {
          tooltip: Object.assign({}, chartDefaults().plugins.tooltip, {
            callbacks: {
              afterBody: function (context) {
                var idx = context[0].dataIndex;
                var kcal = d.kcalPerDay[idx];
                return kcal ? 'Daily intake: ~' + kcal + ' kcal/day' : '';
              }
            }
          })
        })
      })
    });
  }

  function renderDensityChart() {
    var ctx = document.getElementById('chart-density').getContext('2d');
    var d = CHART_DENSITY_DATA;

    chartInstances.density = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: d.labels,
        datasets: [{
          label: 'Calories per dollar',
          data: d.kcalPerDollar,
          backgroundColor: d.colors.map(function (c) { return c + 'cc'; }),
          borderColor: d.colors,
          borderWidth: 2,
          borderRadius: 6
        }]
      },
      options: Object.assign({}, chartDefaults(), {
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Calories you can buy for $1',
              font: { family: "'Inter', sans-serif", size: 12, weight: '500' }
            },
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          y: {
            grid: { display: false },
            ticks: { font: { family: "'Inter', sans-serif", size: 13, weight: '500' } }
          }
        },
        plugins: Object.assign({}, chartDefaults().plugins, {
          legend: { display: false }
        })
      })
    });
  }

  function renderUPFChart() {
    var ctx = document.getElementById('chart-upf').getContext('2d');
    var d = CHART_UPF_DATA;

    chartInstances.upf = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: d.labels,
        datasets: [{
          label: 'Extra calories consumed (UPF vs. unprocessed)',
          data: d.excess,
          backgroundColor: [
            'rgba(233,196,106,0.7)',
            'rgba(231,111,81,0.8)',
            'rgba(231,111,81,0.6)',
            'rgba(156,163,175,0.4)'
          ],
          borderColor: [
            'rgba(233,196,106,1)',
            'rgba(231,111,81,1)',
            'rgba(231,111,81,0.8)',
            'rgba(156,163,175,0.6)'
          ],
          borderWidth: 2,
          borderRadius: 6
        }]
      },
      options: Object.assign({}, chartDefaults(), {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Excess kcal/day on ultra-processed diet',
              font: { family: "'Inter', sans-serif", size: 12, weight: '500' }
            },
            grid: { color: 'rgba(0,0,0,0.05)' },
            max: 300
          },
          x: {
            grid: { display: false },
            ticks: { font: { family: "'Inter', sans-serif", size: 13, weight: '500' } }
          }
        },
        plugins: Object.assign({}, chartDefaults().plugins, {
          legend: { display: false },
          tooltip: Object.assign({}, chartDefaults().plugins.tooltip, {
            callbacks: {
              afterBody: function (context) {
                var total = 508;
                return 'Total daily excess: +' + total + ' kcal/day (p=0.0001)';
              }
            }
          })
        })
      })
    });
  }

  // ── Recipe Advisor ────────────────────────────────────────

  function initAdvisor() {
    document.getElementById('analyze-btn').addEventListener('click', analyzeRecipe);
  }

  // ── Quantity Parsing & Calorie Estimation ─────────────────

  // Approximate calories per unit for each category
  var CAL_PER_UNIT = {
    'Added Sugars':            { cup: 770, tbsp: 48, tsp: 16, oz: 96, lb: 1540, fallback: 100 },
    'Saturated/Added Fats':    { cup: 1628, tbsp: 102, tsp: 34, oz: 204, lb: 3256, stick: 810, fallback: 150 },
    'Sugar-Sweetened Beverages':{ cup: 100, can: 140, bottle: 240, oz: 12, liter: 400, fallback: 140 },
    'Refined Grains':          { cup: 455, tbsp: 28, oz: 100, lb: 1650, fallback: 200 },
    'Hyper-Palatable Snacks':  { cup: 540, oz: 150, bag: 1200, fallback: 300 },
    'Processed Meats':         { cup: 300, slice: 45, oz: 70, lb: 1100, strip: 43, fallback: 100 },
    'Cheese / Dairy Fat':      { cup: 440, oz: 110, slice: 70, tbsp: 55, lb: 1760, fallback: 110 },
    'Frying / High-Heat Oil Cooking': { cup: 1900, tbsp: 120, tsp: 40, fallback: 200 },
    'Healthy Fats & Omega-3s': { cup: 800, tbsp: 120, oz: 55, lb: 900, fillet: 400, can: 200, fallback: 200 },
    'Whole Proteins & Dairy':  { cup: 150, oz: 45, lb: 700, fallback: 70 },
    'Vegetables & Legumes':    { cup: 35, oz: 10, lb: 130, can: 100, bunch: 30, head: 50, fallback: 30 },
    'Aromatics & Herbs':       { clove: 4, tsp: 2, tbsp: 5, bunch: 10, sprig: 1, fallback: 5 },
    'Whole Fruits':            { cup: 60, oz: 15, lb: 240, fallback: 50 }
  };

  var UNIT_MAP = {
    'cup': 'cup', 'cups': 'cup',
    'tablespoon': 'tbsp', 'tablespoons': 'tbsp', 'tbsp': 'tbsp',
    'teaspoon': 'tsp', 'teaspoons': 'tsp', 'tsp': 'tsp',
    'ounce': 'oz', 'ounces': 'oz', 'oz': 'oz',
    'pound': 'lb', 'pounds': 'lb', 'lb': 'lb', 'lbs': 'lb',
    'fillet': 'fillet', 'fillets': 'fillet',
    'slice': 'slice', 'slices': 'slice',
    'clove': 'clove', 'cloves': 'clove',
    'can': 'can', 'cans': 'can',
    'stick': 'stick', 'sticks': 'stick',
    'strip': 'strip', 'strips': 'strip',
    'bunch': 'bunch', 'bunches': 'bunch',
    'sprig': 'sprig', 'sprigs': 'sprig',
    'head': 'head', 'heads': 'head',
    'bag': 'bag', 'bags': 'bag',
    'bottle': 'bottle', 'bottles': 'bottle',
    'liter': 'liter', 'liters': 'liter'
  };

  function parseQuantityNear(input, pattern) {
    var idx = input.indexOf(pattern);
    if (idx === -1) return null;

    // Look at the 60 chars before the matched ingredient
    var prefix = input.substring(Math.max(0, idx - 60), idx);

    // Search from the last newline (stay on the same recipe line)
    var lastNL = prefix.lastIndexOf('\n');
    var linePrefix = lastNL >= 0 ? prefix.substring(lastNL + 1) : prefix;

    // Find the first number + optional unit on this line
    // Handles "3 cups white cabbage" — finds "3" + "cups" even with adjectives in between
    var numMatch = linePrefix.match(/(\d+\s+\d+\/\d+|\d+\/\d+|\d+\.?\d*)\s*(?:-\s*)?(\w+)?/);

    // If no match on current line, check the previous line (handles "6\neggs" format)
    if (!numMatch && lastNL >= 0) {
      var prevLine = prefix.substring(0, lastNL);
      var prevNL = prevLine.lastIndexOf('\n');
      prevLine = prevNL >= 0 ? prevLine.substring(prevNL + 1) : prevLine;
      numMatch = prevLine.match(/(\d+\s+\d+\/\d+|\d+\/\d+|\d+\.?\d*)\s*(?:-\s*)?(\w+)?/);
    }

    if (!numMatch) return null;

    var numStr = numMatch[1].trim();
    var unitStr = (numMatch[2] || '').toLowerCase();

    // Parse the number
    var qty;
    if (numStr.indexOf('/') !== -1) {
      var parts = numStr.split(/\s+/);
      if (parts.length === 2) {
        // "1 1/2"
        var frac = parts[1].split('/');
        qty = parseInt(parts[0]) + parseInt(frac[0]) / parseInt(frac[1]);
      } else {
        // "1/4"
        var frac2 = parts[0].split('/');
        qty = parseInt(frac2[0]) / parseInt(frac2[1]);
      }
    } else {
      qty = parseFloat(numStr);
    }

    var unit = UNIT_MAP[unitStr] || null;
    return { qty: qty, unit: unit };
  }

  function estimateCalories(category, input, matchedPatterns) {
    var calTable = CAL_PER_UNIT[category];
    if (!calTable) return calTable ? calTable.fallback : 100;

    var totalCal = 0;
    var foundQuantity = false;

    matchedPatterns.forEach(function (pattern) {
      var parsed = parseQuantityNear(input, pattern);
      if (parsed && parsed.unit && calTable[parsed.unit]) {
        totalCal += parsed.qty * calTable[parsed.unit];
        foundQuantity = true;
      } else if (parsed && parsed.qty) {
        // Have a number but no recognized unit — use fallback scaled by quantity
        totalCal += parsed.qty * calTable.fallback;
        foundQuantity = true;
      }
    });

    if (!foundQuantity) {
      // No quantity found, use fallback
      totalCal = calTable.fallback;
    }

    return totalCal;
  }

  // ── Recipe Analysis ─────────────────────────────────────────

  function analyzeRecipe() {
    var input = document.getElementById('advisor-input').value.trim().toLowerCase();
    var outputEl = document.getElementById('advisor-output');

    if (!input) {
      outputEl.classList.add('hidden');
      return;
    }

    var findings = [];
    var matchedCategories = {};

    ADVISOR_KEYWORDS.forEach(function (entry) {
      var matched = [];
      entry.patterns.forEach(function (pattern) {
        if (input.indexOf(pattern.toLowerCase()) !== -1) {
          matched.push(pattern);
        }
      });

      if (matched.length > 0 && !matchedCategories[entry.category]) {
        matchedCategories[entry.category] = true;
        findings.push({
          category: entry.category,
          matched: matched,
          finding: entry.finding,
          suggestion: entry.suggestion,
          citation: entry.citation,
          isPositive: entry.category === 'Vegetables & Legumes' ||
                      entry.category === 'Whole Fruits' ||
                      entry.category === 'Healthy Fats & Omega-3s' ||
                      entry.category === 'Whole Proteins & Dairy' ||
                      entry.category === 'Aromatics & Herbs',
          weight: entry.weight || 1
        });
      }
    });

    if (findings.length === 0) {
      outputEl.innerHTML =
        '<h3>Analysis</h3>' +
        '<p>No specific ingredients matched our 21-study evidence base. Try pasting a more detailed recipe with specific ingredients listed.</p>';
      outputEl.classList.remove('hidden');
      return;
    }

    // Sort: risks first, positives last
    findings.sort(function (a, b) {
      return (a.isPositive ? 1 : 0) - (b.isPositive ? 1 : 0);
    });

    // Calculate health score using calorie-estimated proportions
    var riskCal = 0;
    var positiveCal = 0;
    var riskCategories = [];

    findings.forEach(function (f) {
      var estCal = estimateCalories(f.category, input, f.matched);
      f.estCal = estCal;

      if (f.isPositive) {
        positiveCal += estCal;
      } else {
        riskCal += estCal;
        riskCategories.push(f.category);
      }
    });

    var totalCal = riskCal + positiveCal;
    var riskPct = totalCal > 0 ? Math.round((riskCal / totalCal) * 100) : 0;

    // Score: 10 = all positive, 1 = all risk
    var healthScore;
    if (totalCal === 0) {
      healthScore = 5;
    } else {
      var positiveRatio = positiveCal / totalCal;
      healthScore = Math.round(positiveRatio * 9) + 1;
    }
    healthScore = Math.max(1, Math.min(10, healthScore));

    var scoreClass = healthScore <= 4 ? 'score-red' : healthScore <= 7 ? 'score-yellow' : 'score-green';

    // Build risk summary
    var riskSummary = '';
    if (riskCategories.length > 0 && riskPct > 0) {
      riskSummary = 'Estimated ~' + riskPct + '% of this recipe\'s calories come from ' +
        riskCategories.slice(0, 3).join(', ').toLowerCase() + '.';
    } else {
      riskSummary = 'No significant risk categories detected.';
    }

    var html =
      '<div class="recipe-score-wrap">' +
        '<div class="recipe-score ' + scoreClass + '">' + healthScore + '<span>/10</span></div>' +
        '<div class="recipe-score-label">Health Score</div>' +
        '<div class="recipe-score-detail">' + riskSummary + '</div>' +
      '</div>';

    findings.forEach(function (f) {
      var catPct = totalCal > 0 ? Math.round((f.estCal / totalCal) * 100) : 0;
      var isMinorRisk = !f.isPositive && catPct < 15;

      if (isMinorRisk) {
        html +=
          '<div class="advisor-minor">' +
            '&#9432; ' + f.category + ': ' + f.matched.join(', ') + ' (~' + catPct + '% of recipe calories — minor)' +
          '</div>';
      } else {
        html +=
          '<div class="advisor-finding' + (f.isPositive ? ' advisor-positive' : '') + '">' +
            '<div class="advisor-finding-category">' +
              (f.isPositive ? '&#10003; ' : '&#9888; ') + f.category +
            '</div>' +
            '<div class="advisor-finding-matched">Matched: ' + f.matched.join(', ') + '</div>' +
            '<div class="advisor-finding-text">' + f.finding + '</div>' +
            '<div class="advisor-suggestion">' +
              (f.isPositive ? '' : 'Suggestion: ') + f.suggestion +
            '</div>' +
            '<span class="citation">' + f.citation + '</span>' +
          '</div>';
      }
    });

    outputEl.innerHTML = html;
    outputEl.classList.remove('hidden');
  }

})();
