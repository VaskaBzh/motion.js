import type { Ref } from 'vue';
import type { CardMoveOptions } from '../../core/src';

/** Опции инициализации composable. */
export interface CardAnimationComposableOptions extends CardMoveOptions {
	stagger?: number;
}

/** Возвращаемый интерфейс composable. */
export interface UseCardAnimationReturn {
	/** Делает снимок позиций карточек до изменения DOM. */
	snapshot: (cards: Iterable<HTMLElement>) => void;
	/** Запускает анимацию движения карточек. Вызывать после изменения DOM. */
	animateMove: (cards: Iterable<HTMLElement>) => Promise<void>;
	/** Реактивный флаг: true пока идёт анимация. */
	isAnimating: Ref<boolean>;
}
