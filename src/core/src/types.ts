/** Вычисленное смещение одной карточки (результат FLIP-расчёта). */
export interface Trajectory {
	element: HTMLElement;
	/** Горизонтальное смещение в пикселях (до − после). */
	deltaX: number;
	/** Вертикальное смещение в пикселях (до − после). */
	deltaY: number;
}

/** Опции анимации для отдельной карточки. */
export interface CardMoveOptions {
	/** Длительность анимации в мс. По умолчанию 300. */
	duration?: number;
	/** CSS-функция плавности. По умолчанию 'ease'. */
	easing?: string;
	/** Задержка старта в мс. По умолчанию 0. */
	delay?: number;
}

/** Итоговая конфигурация builder-а. */
export interface BuilderConfig {
	duration: number;
	easing: string;
	/** Задержка между анимациями соседних карточек в мс. */
	stagger: number;
}
