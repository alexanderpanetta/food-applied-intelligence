/* ============================================================
   data.js — Food: Applied Intelligence
   Quiz questions, study data, chart data, advisor keywords
   ============================================================ */

// ── Quiz Questions ──────────────────────────────────────────

const CATEGORIES = {
  upf:        { name: 'Ultra-Processed Food Exposure', icon: '1' },
  liquid:     { name: 'Liquid Calories',               icon: '2' },
  portions:   { name: 'Portion Habits',                icon: '3' },
  environment:{ name: 'Food Environment',              icon: '4' },
  protective: { name: 'Protective Habits',             icon: '5' }
};

const QUIZ = [
  // ── UPF Exposure (Q1-Q3) ──
  {
    category: 'upf',
    question: 'How much of your daily food comes in packages with long ingredient lists?',
    options: [
      { text: 'Almost none — I eat mostly whole foods',       score: 10 },
      { text: 'A small amount — some packaged items',         score: 7 },
      { text: 'About half my diet',                           score: 3 },
      { text: 'Most of what I eat is packaged or pre-made',   score: 0 }
    ]
  },
  {
    category: 'upf',
    question: 'How often do you cook meals from scratch using basic ingredients?',
    options: [
      { text: 'Daily',                     score: 10 },
      { text: 'Several times a week',      score: 7 },
      { text: 'Once or twice a week',      score: 3 },
      { text: 'Rarely or never',           score: 0 }
    ]
  },
  {
    category: 'upf',
    question: 'How often do you eat foods with ingredients you couldn\'t find in a home kitchen (emulsifiers, flavour enhancers, etc.)?',
    options: [
      { text: 'Rarely — I avoid them',     score: 10 },
      { text: 'Sometimes',                 score: 7 },
      { text: 'Often',                     score: 3 },
      { text: 'Most meals contain them',   score: 0 }
    ]
  },

  // ── Liquid Calories (Q4-Q5) ──
  {
    category: 'liquid',
    question: 'How many sugar-sweetened drinks (soda, juice, sweet tea, energy drinks) do you have per day?',
    options: [
      { text: 'None',            score: 10 },
      { text: 'One',             score: 6 },
      { text: 'Two',             score: 3 },
      { text: 'Three or more',   score: 0 }
    ]
  },
  {
    category: 'liquid',
    question: 'What\'s your primary beverage throughout the day?',
    options: [
      { text: 'Water',                                   score: 10 },
      { text: 'Unsweetened tea or black coffee',          score: 8 },
      { text: 'Diet soda or flavored water',              score: 5 },
      { text: 'Regular soda, juice, or sweetened drinks', score: 0 }
    ]
  },

  // ── Portion Habits (Q6-Q8) ──
  {
    category: 'portions',
    question: 'When eating out, how often do you finish everything on your plate?',
    options: [
      { text: 'Rarely — I usually stop when full',   score: 10 },
      { text: 'Sometimes',                            score: 7 },
      { text: 'Usually',                              score: 3 },
      { text: 'Always — I clean my plate',             score: 0 }
    ]
  },
  {
    category: 'portions',
    question: 'How would friends describe your eating speed?',
    options: [
      { text: 'Slow — I\'m usually the last to finish',          score: 10 },
      { text: 'Average',                                          score: 6 },
      { text: 'Fast — I\'m usually one of the first done',       score: 2 },
      { text: 'Very fast — I eat quickly without thinking',       score: 0 }
    ]
  },
  {
    category: 'portions',
    question: 'Compared to recommended serving sizes, your typical portions are...',
    options: [
      { text: 'Smaller or right-sized',                score: 10 },
      { text: 'Slightly larger',                       score: 6 },
      { text: 'Noticeably larger',                     score: 3 },
      { text: 'I don\'t pay attention to serving sizes', score: 0 }
    ]
  },

  // ── Food Environment (Q9-Q10) ──
  {
    category: 'environment',
    question: 'How often do you eat at fast-food restaurants?',
    options: [
      { text: 'Rarely or never',       score: 10 },
      { text: 'About once a week',     score: 7 },
      { text: '2–3 times a week',      score: 3 },
      { text: '4 or more times a week', score: 0 }
    ]
  },
  {
    category: 'environment',
    question: 'When you snack, what do you typically reach for?',
    options: [
      { text: 'Fruits, vegetables, or nuts',               score: 10 },
      { text: 'Yogurt, cheese, or whole-grain crackers',   score: 7 },
      { text: 'Chips, cookies, or candy',                  score: 3 },
      { text: 'I rarely snack',                            score: 8 }
    ]
  },

  // ── Protective Habits (Q11-Q12) ──
  {
    category: 'protective',
    question: 'How many servings of fruits and vegetables do you eat daily?',
    options: [
      { text: '5 or more',    score: 10 },
      { text: '3 – 4',        score: 7 },
      { text: '1 – 2',        score: 3 },
      { text: 'Less than 1',  score: 0 }
    ]
  },
  {
    category: 'protective',
    question: 'How often do you read ingredient lists or nutrition labels when buying food?',
    options: [
      { text: 'Almost always',   score: 10 },
      { text: 'Sometimes',       score: 6 },
      { text: 'Rarely',          score: 3 },
      { text: 'Never',           score: 0 }
    ]
  }
];

// Max possible per category
const CAT_MAX = {
  upf: 30,
  liquid: 20,
  portions: 30,
  environment: 20,
  protective: 20
};

const TOTAL_MAX = 120;

// ── Score Interpretation ────────────────────────────────────

const SCORE_LABELS = [
  { min: 85, label: 'Excellent',        cls: 'score-excellent', msg: 'Your eating habits align strongly with the best evidence for long-term health. Keep it up.' },
  { min: 70, label: 'Good',             cls: 'score-good',      msg: 'You have a solid foundation. A few targeted changes could make a meaningful difference.' },
  { min: 50, label: 'Average',          cls: 'score-average',    msg: 'Several habits are quietly working against you. The good news: small changes in the right areas can have outsized impact.' },
  { min: 30, label: 'Needs Attention',  cls: 'score-warning',    msg: 'Multiple risk factors identified across your diet. The studies show that even modest shifts — especially in the categories below — produce rapid, measurable benefits.' },
  { min: 0,  label: 'High Risk',        cls: 'score-danger',     msg: 'Your eating patterns match the profiles most strongly associated with weight gain and metabolic harm in the research. But the evidence also shows that switching to unprocessed food produces measurable improvements in as little as two weeks.' }
];

// ── Category Feedback (keyed by category, indexed by tier: 0=good, 1=ok, 2=poor) ──

const CAT_FEEDBACK = {
  upf: [
    { threshold: 70, feedback: 'Low UPF exposure. In the Hall et al. NIH trial, participants on unprocessed diets spontaneously lost 0.9 kg in 2 weeks without calorie counting.', citation: 'Hall et al., 2019 — NIH randomized controlled trial' },
    { threshold: 40, feedback: 'Moderate UPF intake. Ultra-processed food drives +508 kcal/day of excess consumption — mostly because it\'s eaten faster and is more energy-dense.', citation: 'Hall et al., 2019 — Cell Metabolism' },
    { threshold: 0,  feedback: 'High UPF exposure. The NIH trial found ultra-processed diets cause 0.9 kg weight gain in just 2 weeks, driven by +508 extra kcal/day — even when meals are matched for nutrients and rated equally pleasant.', citation: 'Hall et al., 2019 — NIH randomized controlled trial, n=20' }
  ],
  liquid: [
    { threshold: 70, feedback: 'Minimal liquid calories. You\'re avoiding one of the most well-documented dietary risk factors.', citation: 'Vartanian et al., 2007 — 88-study meta-analysis' },
    { threshold: 40, feedback: 'Some sugary drink intake. Each daily SSB increases child obesity risk by 60%. Adults face doubled diabetes risk at 1+ servings/day (91,249 women, 8-year study).', citation: 'Brownell et al., 2009; Vartanian et al., 2007' },
    { threshold: 0,  feedback: 'High sugary drink intake. SSBs add calories on top of food (the body doesn\'t compensate). Women who increased intake gained 8 kg vs. 2.8 kg for those who decreased. Replacing with water eliminates the doubled diabetes risk.', citation: 'Brownell et al., 2009; Vartanian et al., 2007 — meta-analysis + longitudinal cohorts' }
  ],
  portions: [
    { threshold: 70, feedback: 'Good portion awareness. You\'re counteracting a powerful environmental driver — larger portions cause 30% more calories consumed, even when people aren\'t hungry.', citation: 'Rolls et al., 2002 — controlled experiment, n=51' },
    { threshold: 40, feedback: 'Some portion risks. People eat 30% more from larger portions (p<0.0001) and 73% more from self-refilling bowls — without feeling more full. Eating speed independently drives overconsumption across all dietary patterns.', citation: 'Rolls et al., 2002; Fazzino et al., 2023' },
    { threshold: 0,  feedback: 'Major portion risk. Since 1977, portions have grown by 50–135 kcal per item across every food category. 94% of people don\'t notice portion manipulation. An extra 10 kcal/day = ~1 lb/year of weight gain.', citation: 'Rolls et al., 2002; Young & Nestle, 2002; Nielsen & Popkin, 2003' }
  ],
  environment: [
    { threshold: 70, feedback: 'Healthy food environment. Low fast-food exposure and good snacking habits protect against the dose-response weight gain documented in the 15-year CARDIA study.', citation: 'Pereira et al., 2005 — 15-year prospective cohort, n=3,031' },
    { threshold: 40, feedback: 'Moderate environmental risk. Fast food ≥2x/week is associated with an extra 4.5 kg of weight gain and 2x greater insulin resistance increase over 15 years.', citation: 'Pereira et al., 2005 — The Lancet' },
    { threshold: 0,  feedback: 'High environmental risk. Frequent fast-food users consume 500–650 extra kcal/day, with effects that persist even after adjusting for all macronutrients. Each 3x/week reduction = 1.6–2.2 kg less weight gained over 15 years.', citation: 'Pereira et al., 2005 — The Lancet' }
  ],
  protective: [
    { threshold: 70, feedback: 'Strong protective habits. High fruit/vegetable intake and label awareness are two of the most effective defenses, especially because low-energy-density foods (0.4–2.0 kJ/g) let you feel full on fewer calories.', citation: 'Rolls et al., 1999; Drewnowski & Specter, 2004' },
    { threshold: 40, feedback: 'Some protective habits. Increasing fruits and vegetables is one of three evidence-based levers that work across every dietary pattern. Reducing energy density cuts intake by 16% with no increase in hunger.', citation: 'Rolls et al., 1999; Fazzino et al., 2023' },
    { threshold: 0,  feedback: 'Few protective habits. Low fruit/veg intake and no label reading mean you\'re missing key defenses. Vegetables and fruit provide 0.4–2.0 kJ/g vs. chips at 23 kJ/g — you can eat far more volume for fewer calories.', citation: 'Rolls et al., 1999; Drewnowski & Specter, 2004' }
  ]
};

// ── Chart Data ──────────────────────────────────────────────

const CHART_PORTION_DATA = {
  labels: ['Salty\nSnacks', 'Soft\nDrinks', 'Hamburgers', 'French\nFries', 'Mexican\nFood', 'Desserts'],
  data1977: [132, 144, 389, 188, 408, 316],
  data1996: [225, 193, 486, 256, 541, 357],
  increases: ['+93', '+49', '+97', '+68', '+133', '+41']
};

const CHART_SSB_DATA = {
  labels: ['1942', '1970', '1977', '1985', '1990', '1994', '2000'],
  servingsPerYear: [90, 200, 250, 320, 400, 500, 600],
  kcalPerDay: [null, null, 70, null, null, 141, 190]
};

const CHART_DENSITY_DATA = {
  labels: ['Cookies / Chips', 'Soft Drinks', 'Fresh Carrots', 'Orange Juice'],
  kcalPerDollar: [1200, 875, 250, 170],
  colors: ['#e76f51', '#e9c46a', '#52b788', '#2d6a4f']
};

const CHART_UPF_DATA = {
  labels: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'],
  excess: [144, 248, 108, 8]
};

// ── Advisor Keyword Database ────────────────────────────────

const ADVISOR_KEYWORDS = [
  {
    patterns: ['sugar', 'corn syrup', 'high fructose', 'honey', 'maple syrup', 'agave', 'brown sugar', 'cane sugar', 'molasses', 'dextrose', 'sucrose'],
    category: 'Added Sugars',
    finding: 'Added sugars contribute to energy-dense, nutrient-poor diets. Per-capita added sugar rose from 235 to 318 kcal/day between 1977 and 1996. The US diet derives ~50% of energy from added sugars and fat combined.',
    suggestion: 'In baking: cut sugar by 25-33% (often unnoticeable). In sauces/dressings: swap for mashed banana, unsweetened applesauce, or pureed dates. For sweetening drinks: try cinnamon, vanilla extract, or whole fruit muddled in.',
    citation: 'Drewnowski & Specter, 2004; Vartanian et al., 2007'
  },
  {
    patterns: ['butter', 'cream', 'heavy cream', 'cream cheese', 'lard', 'shortening', 'margarine'],
    category: 'Saturated/Added Fats',
    finding: 'Fat content alone doesn\'t drive overconsumption — energy density does (Rolls 1999). But added fats increase energy density dramatically. At equal energy density, high-fat and low-fat meals produce identical intake.',
    suggestion: 'In baking: use half the butter and substitute mashed banana, pumpkin puree, or applesauce for the rest. For sauteing: use olive oil or broth. For cream sauces: blend silken tofu, cashew cream, or pureed white beans to add body at lower energy density. For spreads: try hummus, ricotta, or mashed avocado depending on flavor profile.',
    citation: 'Rolls et al., 1999 — controlled experiment'
  },
  {
    patterns: ['soda', 'cola', 'soft drink', 'sprite', 'fanta', 'mountain dew', 'dr pepper', 'pepsi', 'coke', 'ginger ale'],
    category: 'Sugar-Sweetened Beverages',
    finding: 'Liquid calories add to total intake without displacing food calories. Each daily SSB serving doubles diabetes risk (91,249 women, 8 years). Effect sizes are 4-5x larger in non-industry-funded studies.',
    suggestion: 'Replace with water, sparkling water, or unsweetened tea. The diabetes risk doubling disappears when diet drinks replace SSBs.',
    citation: 'Brownell & Frieden, 2009; Brownell et al., 2009; Vartanian et al., 2007'
  },
  {
    patterns: ['white flour', 'all-purpose flour', 'bread flour', 'enriched flour', 'bleached flour', 'white bread', 'white rice', 'instant rice'],
    category: 'Refined Grains',
    finding: 'Refined grains have higher energy density and lower fiber than whole grains. Ultra-processed diets contain only ~16% insoluble fiber vs. ~77% in unprocessed diets — a difference that may reduce metabolizable energy by ~330 kcal/day.',
    suggestion: 'Try a 50/50 blend of whole wheat and all-purpose flour (works in most recipes without texture changes). Swap white rice for brown rice, quinoa, or cauliflower rice. For breading: use oats or almond meal instead of white breadcrumbs.',
    citation: 'Hall et al., 2019 — NIH randomized controlled trial'
  },
  {
    patterns: ['chips', 'doritos', 'cheetos', 'pringles', 'potato chips', 'tortilla chips', 'corn chips', 'cheese puffs'],
    category: 'Hyper-Palatable Snacks',
    finding: 'Chips have an energy density of ~23 kJ/g — among the highest of any food. Salty snack portions grew from 132 to 225 kcal per eating occasion between 1977 and 1996. Hyper-palatable foods drive overconsumption independently of energy density.',
    suggestion: 'For crunch: roasted chickpeas (1/3 the energy density), air-popped popcorn, or baked kale chips. For dipping: swap chips for cucumber rounds, bell pepper strips, or jicama sticks with hummus or guacamole.',
    citation: 'Nielsen & Popkin, 2003; Drewnowski & Specter, 2004; Fazzino et al., 2023'
  },
  {
    patterns: ['bacon', 'sausage', 'hot dog', 'salami', 'pepperoni', 'deli meat', 'bologna', 'ham', 'processed meat'],
    category: 'Processed Meats',
    finding: 'Processed meats are classified as ultra-processed (NOVA Group 4) when they contain additives beyond salt. They tend to be energy-dense and high in sodium. The NIH trial found sodium intake was 5.8 g/day on ultra-processed vs. 4.6 g/day on unprocessed diets.',
    suggestion: 'For pizza/pasta: swap pepperoni or sausage for roasted vegetables, mushrooms, or grilled chicken. For sandwiches: use leftover roast chicken, canned tuna, or sliced hard-boiled eggs. For breakfast: try eggs with vegetables instead of bacon or sausage.',
    citation: 'Hall et al., 2019; Monteiro et al., 2010, 2019'
  },
  {
    patterns: ['cheese', 'cheddar', 'mozzarella', 'parmesan', 'american cheese', 'velveeta', 'cheese sauce', 'nacho cheese'],
    category: 'Cheese / Dairy Fat',
    finding: 'Cheese is energy-dense but classified as processed (NOVA Group 3), not ultra-processed, when made from simple ingredients. Among highest-income Brazilian households, cheese contributes significantly more to caloric intake.',
    suggestion: 'Use smaller amounts of stronger cheeses (Parmesan, aged cheddar, feta) for more flavor with less volume. For cheese sauces: blend nutritional yeast with cashews or white beans for a lower-density alternative. Avoid ultra-processed cheese products (Velveeta, cheese sauce).',
    citation: 'Monteiro et al., 2010, 2019'
  },
  {
    patterns: ['olive oil', 'avocado', 'salmon', 'nuts', 'almonds', 'walnuts', 'flaxseed', 'chia', 'fish', 'tuna', 'sardine', 'mackerel'],
    category: 'Healthy Fats & Omega-3s',
    finding: 'Unprocessed diets in the NIH trial had an omega-6:omega-3 ratio of 5:1 vs. 11:1 in ultra-processed diets. Participants lost 0.9 kg in 2 weeks on the unprocessed diet and showed improved inflammation markers.',
    suggestion: 'These are positive ingredients. Keep them — they\'re part of the unprocessed, nutrient-dense diet pattern associated with spontaneous weight loss.',
    citation: 'Hall et al., 2019 — NIH randomized controlled trial'
  },
  {
    patterns: ['broccoli', 'spinach', 'kale', 'lettuce', 'tomato', 'carrot', 'cucumber', 'pepper', 'onion', 'garlic', 'celery', 'zucchini', 'cauliflower', 'cabbage', 'mushroom', 'asparagus', 'green bean', 'peas', 'bean', 'lentil', 'chickpea'],
    category: 'Vegetables & Legumes',
    finding: 'Vegetables and fruit have energy densities of 0.4–2.0 kJ/g vs. 18–23 kJ/g for chips, chocolate, and doughnuts. A diet emphasizing low-energy-density foods reduced ad libitum intake by 16% with no increase in hunger in both lean and obese women.',
    suggestion: 'Positive ingredients — increase them. They lower the overall energy density of any meal, which is one of three universal levers for reducing calorie intake.',
    citation: 'Rolls et al., 1999; Drewnowski & Specter, 2004; Fazzino et al., 2023'
  },
  {
    patterns: ['apple', 'banana', 'orange', 'berry', 'blueberry', 'strawberry', 'raspberry', 'grape', 'melon', 'watermelon', 'mango', 'peach', 'pear', 'pineapple', 'kiwi'],
    category: 'Whole Fruits',
    finding: 'Whole fruits are low in energy density (high water and fiber content) and contribute to the volumetrics effect — eating more volume for fewer calories. The proportion of women eating fruit daily was double for highest-income vs. lowest-income groups.',
    suggestion: 'Positive ingredients. Whole fruits (not juices) are part of the protective pattern across multiple studies.',
    citation: 'Rolls et al., 1999; Drewnowski & Specter, 2004'
  }
];
