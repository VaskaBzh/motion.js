[← Начало работы](getting-started.md) · [Back to README](../README.md) · [Архитектура →](architecture.md)

# API Reference

## AnimationBuilder

Главная точка входа. Fluent builder для настройки и запуска FLIP-анимаций.

```typescript
import { AnimationBuilder } from 'motion.js/core';
```

### Конструктор

```typescript
new AnimationBuilder(calculator?: TrajectoryCalculator)
```

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|-------------|---------|
| `calculator` | `TrajectoryCalculator` | `new TrajectoryCalculator()` | Кастомный калькулятор траекторий |

### Методы настройки

| Метод | Возвращает | Описание |
|-------|-----------|---------|
| `withDuration(ms: number)` | `this` | Длительность анимации в мс (по умолчанию 300) |
| `withEasing(easing: string)` | `this` | CSS-функция плавности (по умолчанию `'ease'`) |
| `withStagger(ms: number)` | `this` | Задержка между соседними карточками в мс (по умолчанию 0) |

### Методы pipeline

| Метод | Возвращает | Описание |
|-------|-----------|---------|
| `snapshot(cards: Iterable<HTMLElement>)` | `this` | Запоминает позиции карточек **до** изменения DOM |
| `buildMoveAnimation(cards: Iterable<HTMLElement>)` | `AnimationRunner` | Строит runner с FLIP-анимациями **после** изменения DOM |

### Пример

```typescript
const builder = new AnimationBuilder()
  .withDuration(400)
  .withEasing('cubic-bezier(0.25, 0.46, 0.45, 0.94)')
  .withStagger(25);

builder.snapshot(cards);
reorder();
await builder.buildMoveAnimation(cards).play();
```

---

## AnimationRunner

Оркестратор: запускает набор анимаций параллельно.

```typescript
import { AnimationRunner } from 'motion.js/core';
```

> Обычно ты не создаёшь `AnimationRunner` напрямую — он возвращается из `builder.buildMoveAnimation()`.

### Методы

| Метод | Возвращает | Описание |
|-------|-----------|---------|
| `add(animation: BaseAnimation)` | `this` | Добавляет анимацию в очередь |
| `play()` | `Promise<void>` | Запускает все анимации параллельно |
| `reverse()` | `Promise<void>` | Воспроизводит все анимации в обратном порядке |
| `clear()` | `this` | Очищает список анимаций |

---

## TrajectoryCalculator

Вычисляет смещения карточек по технике FLIP.

```typescript
import { TrajectoryCalculator } from 'motion.js/core';
```

### Методы

| Метод | Возвращает | Описание |
|-------|-----------|---------|
| `before(cards: Iterable<HTMLElement>)` | `this` | Запоминает позиции (**шаг First**) |
| `calculate(cards: Iterable<HTMLElement>)` | `Trajectory[]` | Вычисляет дельты (**шаг Invert**) |

> Возвращает только те карточки, у которых `deltaX !== 0 || deltaY !== 0`.

---

## CardMoveAnimation

Исполнитель FLIP-анимации для одной карточки через Web Animations API.

```typescript
import { CardMoveAnimation } from 'motion.js/core';
```

### Конструктор

```typescript
new CardMoveAnimation(element: HTMLElement, trajectory: Trajectory, options?: CardMoveOptions)
```

### Методы

| Метод | Возвращает | Описание |
|-------|-----------|---------|
| `play()` | `Promise<void>` | Анимирует карточку из старой позиции в новую |
| `reverse()` | `Promise<void>` | Анимирует в обратном направлении |

---

## Vue 3 — useCardAnimation

```typescript
import { useCardAnimation } from 'motion.js/vue';
```

### Сигнатура

```typescript
function useCardAnimation(options?: CardAnimationComposableOptions): UseCardAnimationReturn
```

### Опции

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|-------------|---------|
| `duration` | `number` | `300` | Длительность анимации в мс |
| `easing` | `string` | `'ease'` | CSS-функция плавности |
| `delay` | `number` | `0` | Задержка старта в мс |
| `stagger` | `number` | `0` | Задержка между карточками в мс |

### Возвращаемые значения

| Поле | Тип | Описание |
|------|-----|---------|
| `snapshot` | `(cards: Iterable<HTMLElement>) => void` | Делает снимок позиций до изменения DOM |
| `animateMove` | `(cards: Iterable<HTMLElement>) => Promise<void>` | Запускает анимацию после изменения DOM |
| `isAnimating` | `Ref<boolean>` | Реактивный флаг активной анимации |

---

## Типы

```typescript
/** Вычисленное смещение одной карточки (результат FLIP-расчёта). */
interface Trajectory {
  element: HTMLElement;
  deltaX: number;  // горизонтальное смещение в пикселях
  deltaY: number;  // вертикальное смещение в пикселях
}

/** Опции анимации для отдельной карточки. */
interface CardMoveOptions {
  duration?: number;  // мс, по умолчанию 300
  easing?: string;    // CSS-функция, по умолчанию 'ease'
  delay?: number;     // мс, по умолчанию 0
}

/** Итоговая конфигурация builder-а. */
interface BuilderConfig {
  duration: number;
  easing: string;
  stagger: number;  // задержка между соседними карточками
}
```

## See Also

- [Начало работы](getting-started.md) — установка и базовые примеры
- [Архитектура](architecture.md) — как добавить новый тип анимации
