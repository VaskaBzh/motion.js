import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
	plugins: [
		dts({ tsconfigPath: './tsconfig.build.json' }),
	],
	publicDir: false,
	build: {
		lib: {
			entry: {
				core: resolve(__dirname, 'src/core/index.ts'),
				vue: resolve(__dirname, 'src/vue/index.ts'),
			},
			formats: ['es', 'cjs'],
			fileName: (format, entryName) =>
				`${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
		},
		rollupOptions: {
			external: ['vue'],
			output: {
				globals: { vue: 'Vue' },
			},
		},
	},
});
