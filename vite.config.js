import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue'; // <-- Importa o plugin do Vue

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        vue(), // <-- Ativa o compilador do Vue
    ],
    resolve: {
        alias: {
            vue: 'vue/dist/vue.esm-bundler.js', // Ajuda o Laravel a compilar templates do Vue
        },
    },
});