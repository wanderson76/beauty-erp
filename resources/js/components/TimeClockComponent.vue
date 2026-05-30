<template>
    <div class="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md space-y-4 border border-gray-200">
        <div class="text-center">
            <h1 class="text-2xl font-bold text-gray-800">Sala de Beleza - Ponto Eletrônico</h1>
            <p class="text-gray-500 text-sm">Aproxime-se da câmera para registrar seu ponto</p>
        </div>

        <div class="w-full h-64 bg-black rounded-lg flex items-center justify-center relative overflow-hidden">
            <video ref="video" autoplay playsinline class="w-full h-full object-cover"></video>
            
            <canvas ref="canvas" class="hidden" width="640" height="480"></canvas>
            
            <div class="absolute inset-x-0 top-0 h-1 bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-bounce"></div>
        </div>

        <div class="grid grid-cols-2 gap-2">
            <button @click="type = 'input'" :class="type === 'input' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'" class="p-3 rounded-lg font-semibold transition">Entrada</button>
            <button @click="type = 'lunch_out'" :class="type === 'lunch_out' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'" class="p-3 rounded-lg font-semibold transition">Almoço (Saída)</button>
            <button @click="type = 'lunch_in'" :class="type === 'lunch_in' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'" class="p-3 rounded-lg font-semibold transition">Almoço (Retorno)</button>
            <button @click="type = 'output'" :class="type === 'output' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'" class="p-3 rounded-lg font-semibold transition">Saída</button>
        </div>

        <button @click="captureAndSend" :disabled="loading" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-4 rounded-lg shadow transition disabled:opacity-50">
            {{ loading ? 'Processando Biometria Facial...' : 'Registrar Ponto com Reconhecimento Facial' }}
        </button>

        <div v-if="message" :class="success ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'" class="p-3 rounded-lg text-center font-medium border">
            {{ message }}
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            type: 'input',
            message: '',
            success: false,
            loading: false,
            stream: null
        }
    },
    mounted() {
        this.startCamera();
    },
    beforeUnmount() {
        this.stopCamera();
    },
    methods: {
        async startCamera() {
            try {
                this.stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
                this.$refs.video.srcObject = this.stream;
            } catch (err) {
                this.message = "Erro ao acessar a webcam. Permita o acesso no navegador.";
                this.success = false;
            }
        },
        stopCamera() {
            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
            }
        },
        async captureAndSend() {
            this.loading = true;
            this.message = "Capturando imagem e analisando feições...";
            
            const video = this.$refs.video;
            const canvas = this.$refs.canvas;
            const context = canvas.getContext('2d');

            // Desenha o frame atual do vídeo no canvas oculto
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Converte o canvas em um arquivo Blob (Blob binário de imagem jpeg)
            canvas.toBlob(async (blob) => {
                if (!blob) {
                    this.message = "Falha ao processar captura.";
                    this.loading = false;
                    return;
                }

                // Prepara o formulário multipart para envio de arquivo
                const formData = new FormData();
                formData.append('image', blob, 'capture.jpg');
                formData.append('type', this.type);

                try {
                    // Envia diretamente para o endpoint de API do Laravel que criamos anteriormente
                    const response = await window.axios.post('/api/time-clock/punch', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });

                    this.success = true;
                    this.message = response.data.message;
                } catch (error) {
                    this.success = false;
                    if (error.response && error.response.data) {
                        this.message = error.response.data.message || "Erro no reconhecimento facial.";
                    } else {
                        this.message = "Erro ao conectar com o servidor do ERP.";
                    }
                } finally {
                    this.loading = false;
                }
            }, 'image/jpeg', 0.9);
        }
    }
}
</script>