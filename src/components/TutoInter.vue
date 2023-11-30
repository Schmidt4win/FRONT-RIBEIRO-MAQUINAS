<template>
  <div class="container">
    <h2 class="title">Tutorial adição de serviço a conta do paciente:</h2>

    <div class="carousel">
      <div class="carousel-item" :key="currentIndex">
  <h3><b>{{ currentStep.title }}</b></h3>
  <div class="image-container">
    <img :src="currentStep.image" alt="Step Image" />
  </div>
  <div class="text-container">
    <h2>{{ currentStep.description }}</h2>
    <div class="controls">
      <button @click="prevStep" :disabled="currentIndex === 0" class="btn">Retroceder</button>
      <button @click="nextStep" :disabled="currentIndex === steps.length - 1" class="btn">Avançar</button>
    </div>
  </div>
</div>
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
          description: "Acessar o Sistema.",
        },
        {
          title: "Passo 2",
          image: require("../assets/tutorial/ACESSAR-MODULO-INTERNAMENTO.jpg"),
          description: "Acessar Modulo de Internamento",
        },
        {
          title: "Passo 3",
          image: require("../assets/tutorial/CLICAR-CONTA.jpg"),
          description: "Ao acessar o Modulo, clicar no botão *CONTA* na barra superior",
        },
        {
          title: "Passo 4",
          image: require("../assets/tutorial/NOME-PACIENTE-F4.jpg"),
          description: "Ira abrir uma tela como esta, clicar no campo paciente, digite o nome do paciente e aperte a tecla F4",
        },
        {
          title: "Passo 5",
          image: require("../assets/tutorial/PESQUISA-PACIENTE.jpg"),
          description: "Ao pressionar F4 ira aparecer uma lista com os nomes ou apenas o nome digitado caso tenha digitado o nome completo.",
        },
        {
          title: "Passo 6",
          image: require("../assets/tutorial/CLICAR-AVANCAR-2X.jpg"),
          description: "Selecione o paciente desejado (Certifique-se que tenha a seta laranja na linha do paciente) e clique em AVANÇAR 2 vezes",
        },
        {
          title: "Passo 7",
          image: require("../assets/tutorial/CLICAR-OPCAO-4.jpg"),
          description: "Ao avançar duas vezes ira aparecer esta tela, clique na opção 4 - Lançamentos Realizados",
        },
        {
          title: "Passo 8",
          image: require("../assets/tutorial/DIGITAR-COD-TAB.jpg"),
          description: "Clique no menu superior no botão NOVO, ira aparecer um campo novo para inserir o serviço, digite o codigo do item e aperte e tecla TAB, ira preencher os dados automaticamente.",
        },
        {
          title: "Passo 9",
          image: require("../assets/tutorial/CLICAR-GRAVAR.jpg"),
          description: "Alguns dados vão estar em branco, clique em gravar que ira precher automatico.",
        },
        {
          title: "Final",
          image: require("../assets/tutorial/DISCLAIMER.jpg"),
          description: "Resultado final.",
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

.image-container {
  width: 600px;
  height: 560px;
  display: flex;
  justify-content: center;
  align-items: center;
  
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.title{
  padding: 1.25rem;
  display: flex;
  justify-content: center;
  margin-left: 100px;
}
.carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  justify-content: center;
  margin-right: 300px;
}

.carousel-item {
  position: relative;
  width: 500px; /* Largura do container */
  height: auto; /* Ajuste a altura automaticamente conforme o conteúdo */
  scroll-snap-align: start;
  text-align: center;
  padding: 1.25rem;
  margin-left: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.carousel-item h3 {
  margin-bottom: 10px;
  padding: 1.25rem;
}

.carousel-item p {
  margin-bottom: 20px;
  padding: 1.25rem;
}

.carousel-item img {
  max-width: 100%;
  max-height: calc(100% - 50px); /* Altura da imagem, ajuste conforme necessário */
  object-fit: contain; /* Mantém a proporção da imagem */
}

.text-container {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}
.controls {
  padding: 1.25rem;
  display: flex;
  justify-content: center;
  margin-top: 20px; /* Ajuste a margem entre os botões e o texto */
}

.btn {
  margin: 0 10px; /* Ajuste a margem entre os botões */
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: aliceblue;
  color: black;
}
</style>


