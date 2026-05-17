/** Итоговая конфигурация builder-а. */
export interface BuilderConfig {
	duration: number;
	easing: string;
	/** Задержка между анимациями соседних карточек в мс. */
	stagger: number;
}
