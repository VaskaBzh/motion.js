# Рефакторинг: типы в директории + animation plugin API

**Дата:** 2026-05-17
**Режим:** full

## Настройки

- Тесты: да — обновить существующие, добавить тест для `use()`
- Логирование: не применимо (рефакторинг, нет новой логики)
- Документация: нет

---

## Контекст

Два независимых, но связанных улучшения ядра:

1. **Типы в директорию** — `src/core/src/types.ts` → `src/core/src/types/` с логической разбивкой по файлам.
2. **Animation plugin API** — `AnimationBuilder` принимает произвольный класс анимации через `.use(AnimationClass)`, что позволяет подключать разные анимации без изменения ядра. `CardMoveAnimation` остаётся дефолтом.

Новый публичный API билдера:
```ts
import { AnimationBuilder } from 'motion.js';
import { CardMoveAnimation } from 'motion.js/animations';  // или внешний модуль

const builder = new AnimationBuilder()
  .use(CardMoveAnimation)   // явная регистрация (или дефолт без .use())
  .withDuration(500);

await builder.buildAnimation(cards).play();  // buildMoveAnimation → buildAnimation
```

---

## Задачи

### Задача 1 — Перенести типы в `src/core/src/types/`

**Файлы:**
- Удалить `src/core/src/types.ts`
- Создать `src/core/src/types/trajectory.ts` — интерфейс `Trajectory`
- Создать `src/core/src/types/animation.ts` — интерфейсы `CardMoveOptions` + новый `AnimationConstructor`
- Создать `src/core/src/types/builder.ts` — интерфейс `BuilderConfig`
- Создать `src/core/src/types/index.ts` — реэкспорт всех типов

**Новый интерфейс `AnimationConstructor`** (добавить в `animation.ts`):
```ts
import type { Trajectory } from './trajectory.js';
import type { CardMoveOptions } from './animation.js';
import type { BaseAnimation } from '../animations/BaseAnimation.js';

export interface AnimationConstructor {
  new(element: HTMLElement, trajectory: Trajectory, options?: CardMoveOptions): BaseAnimation;
}
```

**Правило:** все существующие импорты из `'../types.js'` или `'../../types.js'` обновить на `'../types/index.js'` / `'../../types/index.js'`.

Файлы, которые импортируют из `types.ts`:
- `src/core/src/animations/CardMoveAnimation.ts`
- `src/core/src/trajectory/TrajectoryCalculator.ts`
- `src/core/src/builders/AnimationBuilder.ts`
- `src/core/src/index.ts`
- `src/vue/composables/useCardAnimation.ts`
- все `__tests__` файлы

---

### Задача 2 — Обновить `AnimationBuilder`: добавить `use()`, переименовать метод

**Файл:** `src/core/src/builders/AnimationBuilder.ts`

Изменения:
1. Добавить приватное поле `#animationModule: AnimationConstructor = CardMoveAnimation`
2. Добавить метод:
   ```ts
   use(module: AnimationConstructor): this {
     this.#animationModule = module;
     return this;
   }
   ```
3. Переименовать `buildMoveAnimation()` → `buildAnimation()`. Внутри заменить `new CardMoveAnimation(...)` на `new this.#animationModule(...)`.

Итоговая сигнатура:
```ts
buildAnimation(cards: Iterable<HTMLElement>): AnimationRunner
```

Импорт `AnimationConstructor` из `'../types/index.js'`.

---

### Задача 3 — Обновить публичные реэкспорты

**Файлы:**
- `src/core/src/index.ts` — добавить реэкспорт `AnimationConstructor`, обновить путь `types`
- `src/core/index.ts` — проверить, всё ли перетягивается через `src/index.ts`

`AnimationConstructor` должен быть доступен пользователям как:
```ts
import type { AnimationConstructor } from 'motion.js';
```

---

### ~~Коммит-чекпоинт 1~~ — после задач 1–3

```
refactor(core): split types into directory, add animation plugin API

- src/core/src/types.ts → src/core/src/types/{trajectory,animation,builder,index}.ts
- AnimationConstructor interface for pluggable animation classes
- AnimationBuilder.use(module) + rename buildMoveAnimation → buildAnimation
```

---

### Задача 4 — Обновить Vue composable

**Файл:** `src/vue/composables/useCardAnimation.ts`

- Заменить `builder.buildMoveAnimation(cards)` → `builder.buildAnimation(cards)` (строка ~53)
- Обновить импорт типов на новый путь

---

### Задача 5 — Обновить тесты

**Файлы:**
- `src/core/src/builders/__tests__/AnimationBuilder.test.ts`
- `src/core/src/animations/__tests__/CardMoveAnimation.test.ts`
- `src/core/src/trajectory/__tests__/TrajectoryCalculator.test.ts`
- `src/vue/composables/__tests__/useCardAnimation.test.ts`

Что обновить:
1. Все импорты типов — новый путь `types/index.js`
2. `buildMoveAnimation` → `buildAnimation` во всех тестах
3. **Новый тест в `AnimationBuilder.test.ts`:**

```ts
it('use() подключает пользовательский класс анимации', async () => {
  const calc = new TrajectoryCalculator();
  const el = document.createElement('div');
  el.animate = vi.fn().mockReturnValue({ finished: Promise.resolve(), reverse: vi.fn() } as unknown as Animation);

  vi.spyOn(calc, 'calculate').mockReturnValue([
    { element: el, deltaX: 50, deltaY: 0 },
  ]);

  // Кастомный класс — шпион: считаем, что конструктор вызван
  const CustomAnimation = vi.fn().mockImplementation(() => ({
    play: vi.fn().mockResolvedValue(undefined),
    reverse: vi.fn().mockResolvedValue(undefined),
  }));

  const runner = new AnimationBuilder(calc)
    .use(CustomAnimation as unknown as AnimationConstructor)
    .buildAnimation([el]);

  await runner.play();

  expect(CustomAnimation).toHaveBeenCalledOnce();
  expect(CustomAnimation).toHaveBeenCalledWith(
    el,
    expect.objectContaining({ deltaX: 50 }),
    expect.any(Object),
  );
});
```

4. **Запустить `npx vitest run`** — все тесты должны пройти.

---

### Задача 6 — Обновить demo/App.vue

**Файл:** `demo/App.vue`

- Строка ~103: `builder.buildMoveAnimation(...)` → `builder.buildAnimation(...)`

---

### Задача 7 — Добавить модификаторы доступа в классы

**Файлы:**
- `src/core/src/animations/BaseAnimation.ts` — `public abstract` на оба метода
- `src/core/src/animations/CardMoveAnimation.ts` — `public override` на `play()`, `reverse()`
- `src/core/src/animations/AnimationRunner.ts` — `public` на все методы и конструктор
- `src/core/src/trajectory/TrajectoryCalculator.ts` — `public` на все методы
- `src/core/src/builders/AnimationBuilder.ts` — `public` на все методы, конструктор и `use()`

---

### ~~Коммит-чекпоинт 2~~ — после задач 4–7

```
refactor(vue,demo,core): update API, add access modifiers

- useCardAnimation: buildMoveAnimation → buildAnimation
- demo/App.vue: same rename
- tests: updated imports and added use() test
- all classes: explicit public/public abstract/public override modifiers
```

---

## Итоговая структура типов

```
src/core/src/types/
├── trajectory.ts      # Trajectory
├── animation.ts       # CardMoveOptions, AnimationConstructor
├── builder.ts         # BuilderConfig
└── index.ts           # реэкспорт всего
```
