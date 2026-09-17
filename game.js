const STORAGE_KEY = 'game-life-1933-save-v1';

const initialStats = {
  political: 50,
  economy: 50,
  military: 30,
  stability: 50,
  diplomacy: 50,
};

const eventSequence = [
  {
    title: 'You have just become Chancellor.',
    description:
      'Germany is unstable, exhausted by the political crisis, and deeply uncertain. The old republic is weakening, and the state is waiting to see what kind of government you will build.',
    options: [
      {
        label: 'Focus on consolidating political power',
        effects: { political: 14, stability: -4, diplomacy: -4, economy: 0, military: 0 },
        result:
          'You use the machinery of the state to tighten control, while opponents denounce the government as authoritarian.',
        days: 17,
      },
      {
        label: 'Focus on the economy',
        effects: { economy: 12, political: 3, stability: 2, diplomacy: -2, military: -2 },
        result:
          'You promise recovery and order, but many fear the move toward state control and rearmament.',
        days: 14,
      },
      {
        label: 'Focus on foreign relations',
        effects: { diplomacy: 12, political: -3, stability: 1, economy: 1, military: 0 },
        result:
          'You present yourself as a decisive statesman, but domestic rivals continue to test your authority.',
        days: 20,
      },
    ],
  },
  {
    title: 'Reichstag Fire',
    description:
      'The German parliament burns. The event is treated as a crisis, and a frightened public looks to you for emergency action.',
    options: [
      {
        label: 'Use the crisis to justify emergency powers',
        effects: { political: 14, stability: 6, diplomacy: -6, economy: -2, military: 0 },
        result:
          'Emergency powers expand the executive. Opponents are suppressed, but civil liberties erode rapidly.',
        days: 21,
      },
      {
        label: 'Investigate and seek broad political consensus',
        effects: { political: -4, stability: -3, diplomacy: 4, economy: 2, military: 0 },
        result:
          'You look more measured, but your opponents gain room to challenge your authority.',
        days: 18,
      },
      {
        label: 'Exploit the fire for a wider campaign against enemies of the state',
        effects: { political: 10, stability: 4, diplomacy: -8, economy: -3, military: 0 },
        result:
          'The state pushes harder against political enemies, deepening repression and fear.',
        days: 19,
      },
    ],
  },
  {
    title: 'The Enabling Act',
    description:
      'The Reichstag votes for extraordinary legislative powers. The government can now act without normal parliamentary rules for a period of years.',
    options: [
      {
        label: 'Pass the act and centralize state authority',
        effects: { political: 18, stability: 10, diplomacy: -8, economy: 0, military: 0 },
        result:
          'The legal foundations of democratic government are weakened as the executive becomes dominant.',
        days: 30,
      },
      {
        label: 'Use it carefully and seek stability',
        effects: { political: 8, stability: 5, diplomacy: 2, economy: 4, military: -2 },
        result:
          'The state grows more controlled, but you leave some space for public order and business confidence.',
        days: 25,
      },
      {
        label: 'Delay and continue the struggle for legitimacy',
        effects: { political: -6, stability: -5, diplomacy: 5, economy: 2, military: 0 },
        result:
          'The political climate becomes more unstable as rivals and moderates resist your commands.',
        days: 29,
      },
    ],
  },
  {
    title: 'Night of the Long Knives',
    description:
      'The brutal political purge of opponents inside the Nazi movement and the wider right shocks Germany and reshapes your power base.',
    options: [
      {
        label: 'Crush the SA and eliminate rivals',
        effects: { political: 18, stability: 2, diplomacy: -7, economy: -3, military: 2 },
        result:
          'The Nazi movement is made more obedient and your control is strengthened, but the violence leaves a lasting stain.',
        days: 45,
      },
      {
        label: 'Moderate the purge and preserve party unity',
        effects: { political: 5, stability: 4, diplomacy: 2, economy: 2, military: 0 },
        result:
          'The regime remains more fragile, but there is less open terror and more internal friction.',
        days: 40,
      },
      {
        label: 'Proceed with an even harsher campaign against enemies',
        effects: { political: 12, stability: -4, diplomacy: -9, economy: -4, military: 0 },
        result:
          'The violence deepens fear and exposes the regime as increasingly authoritarian and unstable.',
        days: 50,
      },
    ],
  },
  {
    title: 'Rearmament and the Saar',
    description:
      'The German economy is pulled into rearmament and public messaging about national recovery. Questions about military expansion and social sacrifice intensify.',
    options: [
      {
        label: 'Push militarization and rearmament',
        effects: { military: 16, economy: -8, political: 8, stability: -5, diplomacy: -12 },
        result:
          'Industry is redirected toward the military, but the country pays a steep economic and diplomatic cost.',
        days: 90,
      },
      {
        label: 'Balance armaments with domestic recovery',
        effects: { economy: 8, military: 8, political: 5, stability: 5, diplomacy: 0 },
        result:
          'You keep the military growing without overloading the economy, though progress is slower.',
        days: 80,
      },
      {
        label: 'Stress public order and civil employment first',
        effects: { economy: 10, stability: 7, military: -5, diplomacy: 4, political: -2 },
        result:
          'The population sees some relief, but military modernization slows and confidence in your plans erodes.',
        days: 75,
      },
    ],
  },
  {
    title: 'The Nuremberg Laws',
    description:
      'A wider legal framework begins to define Jews as outsiders and restrict their rights, marking a major escalation in state persecution.',
    options: [
      {
        label: 'Expand anti-Jewish law and segregation',
        effects: { political: 9, stability: 7, diplomacy: -14, economy: -3, military: 0 },
        result:
          'The state moves further into racial persecution, deepening exclusion and alienating Germany internationally.',
        days: 110,
      },
      {
        label: 'Push social control without escalating the laws too far',
        effects: { political: 4, stability: 3, diplomacy: -5, economy: 2, military: 0 },
        result:
          'The regime appears less extreme in public, but persecution continues in a more controlled form.',
        days: 95,
      },
      {
        label: 'Pause further legal escalation and focus on economic control',
        effects: { economy: 4, stability: 2, diplomacy: 6, political: -6, military: 0 },
        result:
          'You avoid the harshest escalation, but the regime appears less radical and less decisive.',
        days: 100,
      },
    ],
  },
  {
    title: 'Anschluss',
    description:
      'Austria is drawn into the orbit of Germany. The issue is explosive, and the broader European powers are watching closely.',
    options: [
      {
        label: 'Pursue annexation',
        effects: { political: 12, stability: 6, diplomacy: -10, economy: 4, military: 6 },
        result:
          'The annexation strengthens your prestige domestically, but it alarms Britain and France.',
        days: 180,
      },
      {
        label: 'Negotiate a limited accommodation',
        effects: { political: 3, stability: 3, diplomacy: 7, economy: 2, military: 0 },
        result:
          'You gain some diplomatic breathing room while reducing the chance of immediate confrontation.',
        days: 170,
      },
      {
        label: 'Abandon the demand and refocus on Germany',
        effects: { political: -7, stability: -3, diplomacy: 8, economy: 1, military: -3 },
        result:
          'The move avoids immediate war but is seen as a failure of momentum and resolve.',
        days: 160,
      },
    ],
  },
  {
    title: 'Munich Agreement',
    description:
      'The Western powers seek to avert war in Europe by accepting further German demands in Czechoslovakia.',
    options: [
      {
        label: 'Press for a major settlement and public victory',
        effects: { political: 15, stability: 8, diplomacy: -14, economy: 2, military: 5 },
        result:
          'You claim a diplomatic triumph, but the settlement does not settle the underlying tension in Europe.',
        days: 200,
      },
      {
        label: 'Ask for a partial concession and preserve peace',
        effects: { political: 5, stability: 4, diplomacy: 8, economy: 2, military: -3 },
        result:
          'You reduce the risk of a wider war, though your image as a hardliner is weakened.',
        days: 190,
      },
      {
        label: 'Push harder and challenge the settlement',
        effects: { political: 8, stability: -2, diplomacy: -18, economy: -1, military: 8 },
        result:
          'The pressure builds toward a more dangerous crisis as diplomacy hardens into confrontation.',
        days: 210,
      },
    ],
  },
  {
    title: 'Czechoslovakia Crumbles',
    description:
      'The political fragmentation of Czechoslovakia becomes a strategic opening. Armies on all sides are preparing for war.',
    options: [
      {
        label: 'Take the opportunity and intensify pressure',
        effects: { military: 12, political: 10, stability: 5, diplomacy: -12, economy: -3 },
        result:
          'You gamble on force and prestige, but the diplomatic climate becomes more dangerous.',
        days: 170,
      },
      {
        label: 'Use pressure diplomatically and avoid a general war',
        effects: { diplomacy: 8, political: 2, stability: 4, economy: 4, military: -2 },
        result:
          'A calmer diplomatic path emerges, but your opponents continue to watch your intentions.',
        days: 160,
      },
      {
        label: 'Take a maximalist position and risk open conflict',
        effects: { military: 10, political: 8, stability: -5, diplomacy: -20, economy: -4 },
        result:
          'Your ambition rises, but so does the risk that the international system will oppose you.',
        days: 175,
      },
    ],
  },
  {
    title: 'Invasion of Poland',
    description:
      'The German army advances into Poland. The war is no longer a distant concern. Every decision now affects the larger European balance.',
    options: [
      {
        label: 'Launch a rapid and ruthless campaign',
        effects: { military: 18, political: 18, stability: 7, diplomacy: -22, economy: -10 },
        result:
          'The war begins with spectacular surprise, but Europe now recognizes the danger of Germany as a continental aggressor.',
        days: 240,
      },
      {
        label: 'Aim for limited objectives and seek a negotiated settlement',
        effects: { military: 7, political: 3, stability: 2, diplomacy: 3, economy: 1 },
        result:
          'You appear more cautious, but the war remains highly unstable and the public is impatient.',
        days: 215,
      },
      {
        label: 'Attempt total war without restraint',
        effects: { military: 15, political: 10, stability: 2, diplomacy: -26, economy: -12 },
        result:
          'Your military may dominate the battlefield, but the political cost is enormous and the coalition against you grows.',
        days: 230,
      },
    ],
  },
  {
    title: 'Fall of France',
    description:
      'A swift campaign across Western Europe brings dramatic victories. German prestige soars, but the burden of conquest deepens the war.',
    options: [
      {
        label: 'Seize continental dominance and demand total surrender',
        effects: { military: 16, political: 16, stability: 10, diplomacy: -18, economy: -8 },
        result:
          'The regime looks unstoppable, but the broader conflict becomes more total and destructive.',
        days: 260,
      },
      {
        label: 'Seek a negotiated peace with Britain',
        effects: { diplomacy: 12, political: 3, stability: 4, economy: 4, military: -4 },
        result:
          'A period of relative calm may be possible, but the strategic initiative slips away.',
        days: 245,
      },
      {
        label: 'Press on through every available resource',
        effects: { military: 12, political: 8, stability: -2, diplomacy: -22, economy: -12 },
        result:
          'The army gains momentum, but the country is pushed toward exhaustion and wider war.',
        days: 250,
      },
    ],
  },
  {
    title: 'Air Battle and Britain',
    description:
      'The war on the seas and in the air becomes more difficult. Britain remains defiant and the war is no longer limited to continental Europe.',
    options: [
      {
        label: 'Escalate the air war and threaten invasion',
        effects: { military: 10, political: 8, stability: -3, diplomacy: -16, economy: -8 },
        result:
          'The pressure on Britain is fierce, but the strain on logistics and industry becomes severe.',
        days: 160,
      },
      {
        label: 'Concentrate on the continent and preserve resources',
        effects: { economy: 7, military: 5, political: 2, diplomacy: 8, stability: 5 },
        result:
          'The risk of overextension is reduced, but the war drags on and the initiative is harder to maintain.',
        days: 150,
      },
      {
        label: 'Attempt a broader campaign of intimidation',
        effects: { political: 6, stability: -4, diplomacy: -20, economy: -10, military: 8 },
        result:
          'You create fear and pressure, but strategy becomes increasingly dependent on coercion and exhaustion.',
        days: 170,
      },
    ],
  },
  {
    title: 'Operation Barbarossa',
    description:
      'The invasion of the Soviet Union begins. The campaign is massive, ambitious, and terrifying in scale. The country is now fighting a war on multiple fronts.',
    options: [
      {
        label: 'Advance with maximum force toward the Soviet heartland',
        effects: { military: 16, political: 18, stability: 6, diplomacy: -18, economy: -12 },
        result:
          'The offensive breaks expectations and brings early gains, but it widens the war beyond what the economy and logistics can sustain.',
        days: 320,
      },
      {
        label: 'Limit the campaign to strategic objectives',
        effects: { military: 8, political: 4, stability: 5, diplomacy: 6, economy: 6 },
        result:
          'You reduce the risk of strategic overextension, though the Soviet Union remains dangerous and resilient.',
        days: 300,
      },
      {
        label: 'Rush the offensive without adequate preparation',
        effects: { military: 12, political: 10, stability: -5, diplomacy: -24, economy: -10 },
        result:
          'The army may win temporary ground, but the campaign becomes increasingly unstable and costly.',
        days: 330,
      },
    ],
  },
  {
    title: 'Battle of Stalingrad',
    description:
      'The Soviet defense of Stalingrad is one of the decisive turning points of the war. The German army is now under tremendous strain.',
    options: [
      {
        label: 'Keep fighting for the city regardless of cost',
        effects: { military: 4, political: 8, stability: -8, diplomacy: -8, economy: -12 },
        result:
          'The battle becomes a symbol of overreach. The regime refuses to retreat even as the war turns against it.',
        days: 240,
      },
      {
        label: 'Withdraw and preserve the army',
        effects: { military: -8, political: -8, stability: 3, diplomacy: 8, economy: 3 },
        result:
          'The immediate military loss is painful, but the army survives to fight another year.',
        days: 220,
      },
      {
        label: 'Shift the army to a wider strategic defense',
        effects: { military: 3, political: 2, stability: 2, diplomacy: 4, economy: 5 },
        result:
          'The war becomes more defensive and less dramatic, but the strategic situation grows more fragile.',
        days: 230,
      },
    ],
  },
  {
    title: 'Allied Invasion and Western Pressure',
    description:
      'The western allies establish a second front and the pressure on Germany becomes impossible to ignore. The war cannot be contained to one theater.',
    options: [
      {
        label: 'Massively reinforce the west',
        effects: { military: 10, political: 7, stability: 5, diplomacy: -9, economy: -9 },
        result:
          'You defend the west, but the strain on military and industrial resources becomes severe.',
        days: 180,
      },
      {
        label: 'Lean on the east and reduce the western commitment',
        effects: { military: -2, political: -4, stability: -6, diplomacy: -6, economy: 3 },
        result:
          'The division of forces creates vulnerability and the regime appears increasingly desperate.',
        days: 170,
      },
      {
        label: 'Attempt large-scale political intimidation',
        effects: { political: 5, stability: -4, diplomacy: -15, economy: -6, military: 3 },
        result:
          'The state tries to dominate the narrative, but the military and economy are overwhelmed by events.',
        days: 175,
      },
    ],
  },
  {
    title: 'Soviet Advance',
    description:
      'The Red Army is now pushing deep into German-controlled territory. The government has to reckon with strategic collapse at home.',
    options: [
      {
        label: 'Fight to the last line and deny the Soviets any breakthrough',
        effects: { military: 6, political: 7, stability: -10, diplomacy: -7, economy: -12 },
        result:
          'You hold the line through exhaustion and terror, but the social and material destruction is massive.',
        days: 150,
      },
      {
        label: 'Prepare a defensive retreat and preserve leadership',
        effects: { military: -6, political: 4, stability: 3, diplomacy: 5, economy: 2 },
        result:
          'The retreat is less dramatic but more realistic, reducing total destruction at the cost of prestige.',
        days: 140,
      },
      {
        label: 'Attempt a final catastrophic offensive',
        effects: { military: 8, political: 9, stability: -12, diplomacy: -20, economy: -14 },
        result:
          'The regime tries to force one last decisive action, but strategic collapse is too advanced to reverse.',
        days: 145,
      },
    ],
  },
  {
    title: 'Fall of Berlin',
    description:
      'Berlin falls as the Soviet advance reaches the capital. The war is over in every meaningful sense. A final reckoning is approaching.',
    options: [
      {
        label: 'Attempt to continue the fight from outside the capital',
        effects: { political: -12, stability: -16, diplomacy: -10, economy: -10, military: -18 },
        result:
          'The regime fails to maintain order, and opposition grows more decisive by the day.',
        days: 60,
      },
      {
        label: 'Seek surrender terms and preserve what remains',
        effects: { political: -10, stability: 2, diplomacy: 12, economy: 2, military: -10 },
        result:
          'You accept a collapse in authority, but you avoid the worst escalation of continuing a hopeless war.',
        days: 50,
      },
      {
        label: 'Try to hold on through terror and command',
        effects: { political: -14, stability: -18, diplomacy: -16, economy: -15, military: -20 },
        result:
          'Authority is broken under the weight of defeat, and the regime fails to contain the collapse.',
        days: 55,
      },
    ],
  },
];

const state = {
  date: new Date(1933, 0, 30, 8, 0),
  stats: { ...initialStats },
  eventIndex: 0,
  statusText: 'The state waits for your decision.',
  ending: null,
};

const elements = {
  dateLabel: document.getElementById('dateLabel'),
  timeLabel: document.getElementById('timeLabel'),
  eventDateLabel: document.getElementById('eventDateLabel'),
  eventTitle: document.getElementById('eventTitle'),
  eventDescription: document.getElementById('eventDescription'),
  choices: document.getElementById('choices'),
  nextDayBtn: document.getElementById('nextDayBtn'),
  statusPanel: document.getElementById('statusPanel'),
  saveBtn: document.getElementById('saveBtn'),
  loadBtn: document.getElementById('loadBtn'),
  newGameBtn: document.getElementById('newGameBtn'),
  politicalPower: document.getElementById('politicalPower'),
  economyStat: document.getElementById('economyStat'),
  militaryStat: document.getElementById('militaryStat'),
  stabilityStat: document.getElementById('stabilityStat'),
  diplomacyStat: document.getElementById('diplomacyStat'),
};

function clampStats() {
  Object.keys(state.stats).forEach((key) => {
    state.stats[key] = Math.max(0, Math.min(100, state.stats[key]));
  });
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function updateHeader() {
  elements.dateLabel.textContent = formatDate(state.date);
  elements.timeLabel.textContent = `${String(state.date.getHours()).padStart(2, '0')}:${String(
    state.date.getMinutes(),
  ).padStart(2, '0')}`;
  elements.eventDateLabel.textContent = formatDate(state.date);

  elements.politicalPower.textContent = state.stats.political;
  elements.economyStat.textContent = state.stats.economy;
  elements.militaryStat.textContent = state.stats.military;
  elements.stabilityStat.textContent = state.stats.stability;
  elements.diplomacyStat.textContent = state.stats.diplomacy;

  elements.statusPanel.textContent = state.statusText;
}

function applyEffects(effects) {
  Object.entries(effects).forEach(([key, value]) => {
    state.stats[key] = (state.stats[key] || 0) + value;
  });
  clampStats();
}

function loadEvent() {
  if (state.eventIndex >= eventSequence.length) {
    resolveEnding();
    return;
  }

  const currentEvent = eventSequence[state.eventIndex];
  elements.eventTitle.textContent = currentEvent.title;
  elements.eventDescription.textContent = currentEvent.description;
  elements.choices.innerHTML = '';

  currentEvent.options.forEach((option) => {
    const button = document.createElement('button');
    button.className = 'choice-button';
    button.textContent = option.label;
    button.addEventListener('click', () => chooseOption(option));
    elements.choices.appendChild(button);
  });

  updateHeader();
}

function chooseOption(option) {
  if (state.ending) return;

  applyEffects(option.effects);
  state.statusText = option.result;
  state.eventIndex += 1;
  state.date = new Date(state.date);
  state.date.setDate(state.date.getDate() + (option.days || 14));

  if (state.eventIndex >= eventSequence.length) {
    resolveEnding();
    return;
  }

  loadEvent();
}

function resolveEnding() {
  const { political, economy, military, stability, diplomacy } = state.stats;

  let title = 'Historical Collapse';
  let summary =
    'The government fails under the strain of war, repression, and exhaustion. Germany collapses in a way that mirrors the devastating consequences of the war.';

  if (military >= 70 && political >= 60 && stability >= 55) {
    title = 'Alternate Survival of the Regime';
    summary =
      'Your regime survives by force, intimidation, and strategic endurance. The state remains in power, though at a terrible cost to Germany and Europe.';
  } else if (diplomacy >= 65 && economy >= 60 && military >= 45) {
    title = 'Alternate Diplomatic Outcome';
    summary =
      'The regime survives through selective diplomacy and managed coercion, producing a more unstable but not immediately catastrophic course of history.';
  } else if (military < 40 || stability < 35) {
    title = 'Early Defeat';
    summary =
      'The state loses military momentum and political control. The war becomes a disaster for Germany, and the regime loses the ability to sustain itself.';
  } else if (political < 45 && stability < 50) {
    title = 'Early Political Collapse';
    summary =
      'The government cannot maintain legitimacy or cohesion and falls under the weight of its own political contradictions and repression.';
  }

  state.ending = { title, summary };
  elements.eventTitle.textContent = title;
  elements.eventDescription.textContent = summary;
  elements.choices.innerHTML = '';
  elements.nextDayBtn.textContent = 'Restart';
  elements.nextDayBtn.onclick = () => resetGame();
  updateHeader();
}

function nextDay() {
  if (state.ending) {
    resetGame();
    return;
  }

  state.date.setDate(state.date.getDate() + 1);
  state.statusText = 'A day passes. The machinery of the state continues without pause.';
  updateHeader();
}

function saveGame() {
  const payload = {
    date: state.date.toISOString(),
    stats: state.stats,
    eventIndex: state.eventIndex,
    statusText: state.statusText,
    ending: state.ending,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  state.statusText = 'Game saved successfully.';
  updateHeader();
}

function loadGame() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    state.statusText = 'No save file found yet.';
    updateHeader();
    return;
  }

  try {
    const saved = JSON.parse(raw);
    state.date = new Date(saved.date);
    state.stats = { ...initialStats, ...saved.stats };
    state.eventIndex = saved.eventIndex || 0;
    state.statusText = saved.statusText || 'Save loaded.';
    state.ending = saved.ending || null;
    elements.nextDayBtn.textContent = 'Next Day';
    elements.nextDayBtn.onclick = nextDay;
    if (state.eventIndex >= eventSequence.length || state.ending) {
      resolveEnding();
    } else {
      loadEvent();
    }
  } catch (error) {
    state.statusText = 'The save file could not be loaded.';
    updateHeader();
  }
}

function resetGame() {
  state.date = new Date(1933, 0, 30, 8, 0);
  state.stats = { ...initialStats };
  state.eventIndex = 0;
  state.statusText = 'The state waits for your decision.';
  state.ending = null;
  elements.nextDayBtn.textContent = 'Next Day';
  elements.nextDayBtn.onclick = nextDay;
  loadEvent();
}

function setup() {
  elements.nextDayBtn.onclick = nextDay;
  elements.saveBtn.onclick = saveGame;
  elements.loadBtn.onclick = loadGame;
  elements.newGameBtn.onclick = resetGame;
  loadEvent();
}

setup();
