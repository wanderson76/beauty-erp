//port './bootstrap';
import { createApp } from 'vue';
import TimeClockComponent from './components/TimeClockComponent.vue';

const app = createApp({});

// Registra o componente do relógio de ponto
app.component('time-clock-component', TimeClockComponent);

app.mount('#app');