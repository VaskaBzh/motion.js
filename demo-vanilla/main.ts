import { AnimationBuilder } from '../src/core/src';
import './style.css';

interface Card { id: number; title: string; color: string; }

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#14b8a6'];
const LABELS = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta'];
const MAX_CARDS = 12;

function makeCardEl(card: Card): HTMLElement {
  const el = document.createElement('div');
  el.className = 'card';
  el.style.setProperty('--card-color', card.color);
  el.dataset['id'] = String(card.id);
  el.innerHTML = `<span class="card__title">${card.title}</span><span class="card__id">#${card.id}</span>`;
  return el;
}

function getCards(grid: HTMLElement): HTMLElement[] {
  return Array.from(grid.querySelectorAll<HTMLElement>('.card'));
}

// ── Shuffle Demo ─────────────────────────────────────────────────────────────

function mountShuffleDemo(container: HTMLElement): void {
  const shuffleCards: Card[] = [
    { id: 1, title: 'Карточка A', color: COLORS[0] },
    { id: 2, title: 'Карточка B', color: COLORS[1] },
    { id: 3, title: 'Карточка C', color: COLORS[2] },
    { id: 4, title: 'Карточка D', color: COLORS[3] },
    { id: 5, title: 'Карточка E', color: COLORS[4] },
    { id: 6, title: 'Карточка F', color: COLORS[5] },
  ];

  container.innerHTML = `
    <div class="controls">
      <label class="control">
        <span class="control__label">duration</span>
        <div class="control__row">
          <input id="s-duration" type="range" min="100" max="3000" step="50" value="500" />
          <span id="s-duration-val" class="control__value">500ms</span>
        </div>
      </label>
      <label class="control">
        <span class="control__label">stagger</span>
        <div class="control__row">
          <input id="s-stagger" type="range" min="0" max="300" step="10" value="30" />
          <span id="s-stagger-val" class="control__value">30ms</span>
        </div>
      </label>
      <label class="control">
        <span class="control__label">easing</span>
        <div class="control__row">
          <select id="s-easing">
            <option value="ease">ease</option>
            <option value="ease-in">ease-in</option>
            <option value="ease-out">ease-out</option>
            <option value="ease-in-out">ease-in-out</option>
            <option value="linear">linear</option>
            <option value="cubic-bezier(0.34, 1.56, 0.64, 1)">spring</option>
          </select>
        </div>
      </label>
      <button id="s-shuffle" class="btn-shuffle">Перемешать</button>
    </div>
    <div id="s-grid" class="card-grid"></div>
  `;

  const grid = container.querySelector<HTMLElement>('#s-grid')!;
  const btn = container.querySelector<HTMLButtonElement>('#s-shuffle')!;
  const durationInput = container.querySelector<HTMLInputElement>('#s-duration')!;
  const durationVal = container.querySelector<HTMLElement>('#s-duration-val')!;
  const staggerInput = container.querySelector<HTMLInputElement>('#s-stagger')!;
  const staggerVal = container.querySelector<HTMLElement>('#s-stagger-val')!;
  const easingSelect = container.querySelector<HTMLSelectElement>('#s-easing')!;

  durationInput.addEventListener('input', () => { durationVal.textContent = `${durationInput.value}ms`; });
  staggerInput.addEventListener('input', () => { staggerVal.textContent = `${staggerInput.value}ms`; });

  shuffleCards.forEach(card => { grid.appendChild(makeCardEl(card)); });

  const builder = new AnimationBuilder();
  let animating = false;

  btn.addEventListener('click', () => {
    if (animating) return;

    builder
      .withDuration(Number(durationInput.value))
      .withStagger(Number(staggerInput.value))
      .withEasing(easingSelect.value);

    const cards = getCards(grid);
    builder.snapshot(cards);

    // Fisher-Yates shuffle of DOM elements
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const elI = cards[i]!;
      const elJ = cards[j]!;
      const afterI = elI.nextSibling;
      const afterJ = elJ.nextSibling;
      grid.insertBefore(elJ, afterI);
      if (afterJ === elI) {
        grid.insertBefore(elI, elJ);
      } else {
        grid.insertBefore(elI, afterJ);
      }
    }

    animating = true;
    btn.disabled = true;
    btn.textContent = 'Анимация…';

    void builder.buildAnimation(getCards(grid)).play().then(() => {
      animating = false;
      btn.disabled = false;
      btn.textContent = 'Перемешать';
    });
  });
}

// ── Dynamic Demo ─────────────────────────────────────────────────────────────

function mountDynamicDemo(container: HTMLElement): void {
  let nextId = 5;
  function newCard(): Card {
    const idx = nextId % COLORS.length;
    return { id: nextId++, title: `Карточка ${LABELS[idx] ?? String(nextId)}`, color: COLORS[idx] ?? '#6366f1' };
  }

  container.innerHTML = `
    <div class="dynamic-actions">
      <button id="d-add-start" class="btn-action">+ в начало</button>
      <button id="d-add-end" class="btn-action">+ в конец</button>
      <button id="d-add-mid" class="btn-action">+ в середину</button>
      <button id="d-remove-first" class="btn-action">− первую</button>
      <button id="d-remove-last" class="btn-action">− последнюю</button>
      <span id="d-counter" class="card-counter">4 / ${MAX_CARDS} карточек</span>
    </div>
    <div id="d-grid" class="card-grid"></div>
  `;

  const grid = container.querySelector<HTMLElement>('#d-grid')!;
  const counter = container.querySelector<HTMLElement>('#d-counter')!;
  const btns = {
    addStart: container.querySelector<HTMLButtonElement>('#d-add-start')!,
    addEnd: container.querySelector<HTMLButtonElement>('#d-add-end')!,
    addMid: container.querySelector<HTMLButtonElement>('#d-add-mid')!,
    removeFirst: container.querySelector<HTMLButtonElement>('#d-remove-first')!,
    removeLast: container.querySelector<HTMLButtonElement>('#d-remove-last')!,
  };

  const initialCards: Card[] = [
    { id: 1, title: 'Карточка Alpha', color: COLORS[0] },
    { id: 2, title: 'Карточка Beta', color: COLORS[1] },
    { id: 3, title: 'Карточка Gamma', color: COLORS[2] },
    { id: 4, title: 'Карточка Delta', color: COLORS[3] },
  ];
  initialCards.forEach(card => { grid.appendChild(makeCardEl(card)); });

  const builder = new AnimationBuilder();
  let animating = false;

  function updateButtons(): void {
    const count = grid.childElementCount;
    const full = count >= MAX_CARDS;
    const empty = count === 0;
    counter.textContent = `${count} / ${MAX_CARDS} карточек`;
    btns.addStart.disabled = animating || full;
    btns.addEnd.disabled = animating || full;
    btns.addMid.disabled = animating || full;
    btns.removeFirst.disabled = animating || empty;
    btns.removeLast.disabled = animating || empty;
  }

  function animate(action: () => void): void {
    if (animating) return;
    builder.withDuration(400).withStagger(25);
    builder.snapshot(getCards(grid));
    action();
    animating = true;
    updateButtons();
    void builder.buildAnimation(getCards(grid)).play().then(() => {
      animating = false;
      updateButtons();
    });
  }

  btns.addStart.addEventListener('click', () => {
    animate(() => { grid.insertBefore(makeCardEl(newCard()), grid.firstChild); });
  });

  btns.addEnd.addEventListener('click', () => {
    animate(() => { grid.appendChild(makeCardEl(newCard())); });
  });

  btns.addMid.addEventListener('click', () => {
    animate(() => {
      const children = getCards(grid);
      const mid = Math.floor(children.length / 2);
      grid.insertBefore(makeCardEl(newCard()), children[mid] ?? null);
    });
  });

  btns.removeFirst.addEventListener('click', () => {
    animate(() => { grid.firstElementChild?.remove(); });
  });

  btns.removeLast.addEventListener('click', () => {
    animate(() => { grid.lastElementChild?.remove(); });
  });

  updateButtons();
}

// ── App shell ────────────────────────────────────────────────────────────────

function mount(): void {
  const root = document.getElementById('app')!;
  root.innerHTML = `
    <div class="demo-layout">
      <header class="demo-header">
        <h1>motion<span>.js</span> Vanilla demo</h1>
        <nav class="tabs">
          <button class="tab-btn tab-btn--active" data-tab="shuffle">Shuffle</button>
          <button class="tab-btn" data-tab="dynamic">Dynamic</button>
        </nav>
      </header>
      <div id="tab-content"></div>
    </div>
  `;

  const content = root.querySelector<HTMLElement>('#tab-content')!;
  const tabBtns = root.querySelectorAll<HTMLButtonElement>('.tab-btn');

  function renderTab(tab: string): void {
    content.innerHTML = '';
    tabBtns.forEach(btn => {
      btn.classList.toggle('tab-btn--active', btn.dataset['tab'] === tab);
    });
    if (tab === 'shuffle') mountShuffleDemo(content);
    else mountDynamicDemo(content);
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => { renderTab(btn.dataset['tab'] ?? 'shuffle'); });
  });

  renderTab('shuffle');
}

mount();
