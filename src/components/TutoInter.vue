<template>
  <div class="container">
    <h2 class="title">Tutorial adição de serviço a conta do paciente:</h2>

    <div class="carousel">
      <div class="carousel-item" :key="currentIndex">
        <h3>{{ currentStep.title }}</h3>
        <img :src="currentStep.image" alt="Step Image" />
        <p>{{ currentStep.description }}</p>
      </div>
    </div>

    <div class="controls">
      <button @click="prevStep" :disabled="currentIndex === 0">Retroceder</button>
      <button @click="nextStep" :disabled="currentIndex === steps.length - 1">Avançar</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
interface Step {
  title: string;
  image: string;
  description: string;
}


export default defineComponent({
  name: "TutorialInternacao",

 

  data() {
    return {
      steps: [
        {
          title: "Passo 1",
          image: require("../assets/tutorial/ACESSO-SISTEMA.jpg"),
          description: "Descrição do Passo X",
        },
        {
          title: "Passo 2",
          image: require("../assets/tutorial/ACESSAR-MODULO-INTERNAMENTO.jpg"),
          description: "Descrição do Passo Y",
        },
        {
          title: "Passo 3",
          image: require("../assets/tutorial/CLICAR-CONTA.jpg"),
          description: "Descrição do Passo X",
        },
        {
          title: "Passo 4",
          image: require("../assets/tutorial/NOME-PACIENTE-F4.jpg"),
          description: "Descrição do Passo Y",
        },
        {
          title: "Passo 5",
          image: require("../assets/tutorial/PESQUISA-PACIENTE.jpg"),
          description: "Descrição do Passo Y",
        },
        {
          title: "Passo 6",
          image: require("../assets/tutorial/CLICAR-AVANCAR-2X.jpg"),
          description: "Descrição do Passo Y",
        },
        {
          title: "Passo 7",
          image: require("../assets/tutorial/CLICAR-OPCAO-4.jpg"),
          description: "Descrição do Passo Y",
        },
        {
          title: "Passo 8",
          image: require("../assets/tutorial/DIGITAR-COD-TAB.jpg"),
          description: "Descrição do Passo Y",
        },
        {
          title: "Passo 9",
          image: require("../assets/tutorial/CLICAR-GRAVAR.jpg"),
          description: "Descrição do Passo Y",
        },
        {
          title: "Final",
          image: require("../assets/tutorial/DISCLAIMER.jpg"),
          description: "Descrição do Passo Y",
        },
        // Adicione os demais passos aqui com seus títulos, imagens e descrições
      ] as Step[],
      currentIndex: 0,
    };
  },
  computed: {
    currentStep(): Step {
      return this.steps[this.currentIndex];
    },
  },
  methods: {
    nextStep() {
      if (this.currentIndex < this.steps.length - 1) {
        this.currentIndex++;
      }
    },
    prevStep() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
    },
  },
});
</script>

<style scoped>
.carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  /* Adicione outros estilos de acordo com suas necessidades */
}

.carousel-item {
  flex: 0 0 auto;
  min-width: 100%;
  scroll-snap-align: start;
  text-align: center;
  /* Estilos para cada item do carrossel */
}

.carousel-item img {
  max-width: 100%;
  height: auto;
  /* Ajuste o tamanho da imagem conforme necessário */
}
</style>
