import { ref, type Ref } from 'vue';
import { AnimationBuilder } from '../../core/src/index.js';
import type { CardMoveOptions } from '../../core/src/index.js';

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

/**
 * Vue composable для анимации движения карточек.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * const cards = useTemplateRef<HTMLElement[]>('cards');
 * const { snapshot, animateMove } = useCardAnimation({ duration: 350, stagger: 30 });
 *
 * async function onReorder() {
 *   snapshot(cards.value);
 *   // изменяем порядок в реактивном массиве...
 *   await nextTick();
 *   await animateMove(cards.value);
 * }
 * </script>
 * ```
 */
export function useCardAnimation(options: CardAnimationComposableOptions = {}): UseCardAnimationReturn {
	const builder = new AnimationBuilder();
	const isAnimating = ref(false);

	if (options.duration !== undefined) builder.withDuration(options.duration);
	if (options.easing !== undefined) builder.withEasing(options.easing);
	if (options.stagger !== undefined) builder.withStagger(options.stagger);

	const snapshot = (cards: Iterable<HTMLElement>): void => {
		builder.snapshot(cards);
	};

	const animateMove = async (cards: Iterable<HTMLElement>): Promise<void> => {
		isAnimating.value = true;
		try {
			const runner = builder.buildMoveAnimation(cards);
			await runner.play();
		} finally {
			isAnimating.value = false;
		}
	};

	return { snapshot, animateMove, isAnimating };
}
