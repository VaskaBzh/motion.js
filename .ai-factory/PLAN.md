# GitHub-описание для motion.js

**Дата:** 2026-05-17
**Режим:** fast

## Настройки

- Тесты: не применимо (задача — текстовый контент)
- Логирование: не применимо
- Документация: нет

---

## Задачи

### Задача 1 — Выбрать описание репозитория

**Цель:** Добавить описание в поле «About» при создании GitHub-репозитория.

Требования:
- Упомянуть FLIP-анимацию как ключевую технику
- Подчеркнуть расширяемость через архитектуру: extensible core + framework bindings
- Указать zero runtime dependencies
- Упомянуть Vue 3 и React
- Длина: ≤160 символов (оптимально для GitHub "About")

---

## Уточнение позиционирования

Библиотека — не только FLIP-анимации карточек. Это анимационная библиотека общего назначения
с модульной архитектурой: каждый тип анимации — отдельный модуль, подключаемый независимо.
FLIP — первый модуль, в будущем планируются другие.

## Готовые варианты

Выбери один из трёх — или используй как основу:

**Вариант A** *(лаконичный, 159 симв.)*
```
Modular TypeScript animation library. Import only the animations you need. Extensible core + FLIP card module + Vue 3 and React bindings. Zero runtime deps.
```

**Вариант B** *(plug-in акцент, 157 симв.)*
```
TypeScript animation library with a plug-in module system built on Web Animations API. Zero deps, extensible. FLIP card animations included. Vue 3 & React bindings.
```

**Вариант C** *(акцент на архитектуру, 153 симв.)* — рекомендуется
```
Extensible animation library for TypeScript. Modular architecture: zero-dep core + standalone animation modules + framework bindings for Vue 3 and React.
```

---

## Рекомендация

**Вариант C** — передаёт главное: модульная архитектура, расширяемый core, не привязан к одному типу анимации. Без упоминания FLIP — чтобы не ограничивать восприятие библиотеки одной функцией.

**Вариант A** — если хочется явно упомянуть FLIP как первый конкретный модуль.
