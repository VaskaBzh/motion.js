# AGENTS.md

> Этот файл — структурная карта проекта для AI-агентов и новых разработчиков. Поддерживайте его актуальным при значительных изменениях структуры.

## Обзор проекта

`motion.js` — TypeScript-библиотека для плавной анимации карточек на основе FLIP-техники (First → Last → Invert → Play) с использованием нативного Web Animations API. Предоставляет фреймворк-нейтральный core и интеграции для Vue 3 и React.

## Стек технологий

- **Язык:** TypeScript 6
- **Сборщик:** Vite 8
- **Интеграции:** Vue 3, React (планируется)
- **Тестирование:** Vitest (планируется)
- **Линтинг:** ESLint 10 + typescript-eslint

## Структура проекта

```
motion.js/
├── src/
│   ├── core/                         # Фреймворк-нейтральный core-движок
│   │   ├── index.ts                  # Реэкспорт публичного API core
│   │   └── src/
│   │       ├── index.ts              # Экспорты core-модуля
│   │       ├── types.ts              # Общие интерфейсы (Trajectory, CardMoveOptions, BuilderConfig)
│   │       ├── animations/
│   │       │   ├── BaseAnimation.ts      # Абстрактный контракт анимации
│   │       │   ├── AnimationRunner.ts    # Оркестратор параллельного запуска
│   │       │   └── CardMoveAnimation.ts  # FLIP-исполнитель через Web Animations API
│   │       ├── builders/
│   │       │   └── AnimationBuilder.ts   # Fluent builder (точка входа)
│   │       └── trajectory/
│   │           └── TrajectoryCalculator.ts # Расчёт FLIP-дельт (First/Last шаги)
│   └── vue/                          # Vue 3 интеграция
│       ├── index.ts                  # Реэкспорт Vue-интеграции
│       ├── src/
│       │   └── index.ts              # Внутренние экспорты Vue-модуля
│       └── composables/
│           └── useCardAnimation.ts   # Vue composable с реактивным isAnimating
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── .ai-factory/                      # AI Factory контекст
│   ├── config.yaml                   # Настройки AI Factory
│   ├── DESCRIPTION.md               # Описание проекта
│   └── rules/
│       └── base.md                   # Базовые соглашения кодовой базы
├── index.html                        # Vite entry point (демо/sandbox)
├── package.json
├── tsconfig.json
└── eslint.config.js
```

## Ключевые точки входа

| Файл | Назначение |
|------|-----------|
| `src/core/src/builders/AnimationBuilder.ts` | Точка входа для пользователей: fluent builder FLIP-анимаций |
| `src/core/src/types.ts` | Все публичные интерфейсы и типы |
| `src/vue/composables/useCardAnimation.ts` | Vue 3 composable для анимации карточек |
| `src/core/index.ts` | Публичный API core-модуля |
| `src/vue/index.ts` | Публичный API Vue-интеграции |
| `tsconfig.json` | TypeScript конфигурация (strict mode) |
| `vite.config` | Конфигурация сборщика (если создана) |

## Документация

| Документ | Путь | Описание |
|----------|------|---------|
| README | README.md | Лендинг, быстрый старт |
| Начало работы | docs/getting-started.md | Установка, настройка, первые шаги |
| API Reference | docs/api.md | Классы, методы, типы |
| Архитектура | docs/architecture.md | Структура проекта, расширение |
| Contributing | docs/contributing.md | Участие в разработке |
| CI/CD | .github/workflows/ci.yml | GitHub Actions: lint → typecheck → security → build |
| Описание проекта | .ai-factory/DESCRIPTION.md | Стек, возможности, требования |
| Архитектурные решения | .ai-factory/ARCHITECTURE.md | Паттерны, зависимости, анти-паттерны |
| Базовые правила | .ai-factory/rules/base.md | Соглашения кодовой базы |

## AI-контекстные файлы

| Файл | Назначение |
|------|-----------|
| AGENTS.md | Структурная карта проекта для AI-агентов |
| .ai-factory/DESCRIPTION.md | Спецификация проекта: стек, возможности, требования |
| .ai-factory/ARCHITECTURE.md | Архитектурные паттерны и структурные решения |
| CLAUDE.md | Инструкции для Claude Code (если создан) |

## Быстрые команды (Makefile)

```bash
make install     # Установка зависимостей
make dev         # Dev sandbox (Vite)
make build       # Сборка библиотеки
make check       # lint + typecheck
make test        # Unit-тесты (Vitest)
make ci          # install → check → build
make clean       # Очистка артефактов
```

## Правила для агентов

- Всегда декомпозируй shell-команды на независимые шаги
  - Неверно: `git checkout main && git pull`
  - Верно: сначала `git checkout main`, затем `git pull origin main`
- ESM-only проект: импорты всегда с расширением `.js` (даже для `.ts` файлов)
- Приватные поля: используй нативные `#` (не TypeScript `private`)
- Fluent builder: методы должны возвращать `this`
- `override` ключевое слово обязательно при переопределении методов
