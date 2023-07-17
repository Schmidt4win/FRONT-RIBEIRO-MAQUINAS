<template>
  
    <div class="container form-container">
      <h1 class="title is-4 has-text-centered mb-5">Cadastro de Serviço</h1>
      <form @submit.prevent="submitForm" class="form-content">
        <div class="columns is-variable is-2">
          <div class="column">
            <div class="field">
              <label for="nomeCliente" class="label">Nome do cliente:</label>
              <div class="control">
                <input type="text" class="input is-flexible" v-model="nomeCliente" required>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="field">
              <label for="cidade" class="label">Cidade:</label>
              <div class="control">
                <input type="text" class="input is-flexible" v-model="cidade" required>
              </div>
            </div>
          </div>
        </div>

        <div class="columns is-variable is-2">
          <div class="column">
            <div class="field">
              <label for="telefone" class="label">Telefone:</label>
              <div class="control">
                <input type="text" class="input is-flexible" v-model="telefone" required>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="field">
              <label for="servico" class="label">Serviço:</label>
              <div class="control">
                <input type="text" class="input is-flexible" v-model="servico" required>
              </div>
            </div>
          </div>
        </div>

        <div class="columns is-variable is-2">
          <div class="column">
            <div class="field">
              <label for="data" class="label">Data:</label>
              <div class="control">
                <input type="date" class="input is-flexible" v-model="data" required>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="field">
              <label for="valor" class="label">Valor:</label>
              <div class="control">
                <input type="number" step="0.01" class="input is-flexible" v-model="valor" required>
              </div>
            </div>
          </div>
        </div>

        <div class="field is-grouped is-grouped-left">
          <div class="control">
            <button type="submit" class="button is-primary">Enviar</button>
          </div>
        </div>
      </form>
    </div>
  
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { TipoNotificacao } from "@/interfaces/INotificação";
import useNotificador from "@/hooks/notificador"
import { useStore } from "@/store";

export default defineComponent({
  data() {
    return {
      nomeCliente: '',
      cidade: '',
      telefone: '',
      servico: '',
      data: '',
      valor: ''
    };
  },
  methods: {
    submitForm(): void {
      const data = {
        nomeCliente: this.nomeCliente,
        cidade: this.cidade,
        telefone: this.telefone,
        servico: this.servico,
        valor: this.valor,
        data_hora: new Date().toLocaleString('pt-BR'),
        data: this.formatDate(this.data) // Format the date before sending
      };

      console.log(data);

      fetch('http://177.136.214.131:3010/cadastroclientespost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(data => {
          console.log('Dados enviados com sucesso:', data);
          // Perform any additional actions if necessary
          this.resetForm();
          this.notificar(TipoNotificacao.SUCESSO, "EXELENTE!", `O cliente foi salvo com sucesso!`)
        })
        .catch(error => {
          console.error('Erro ao enviar os dados:', error);
          // Handle the error appropriately
        });
    },
    formatDate(date: string): string {
      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
    },
    resetForm(): void {
      this.nomeCliente = '';
      this.cidade = '';
      this.telefone = '';
      this.servico = '';
      this.valor = '';
    }
  },
  setup() {
    const store = useStore();
    const { notificar } = useNotificador();
    return {
      store,
      notificar
    };
  },
});
</script>

<style scoped>

.label {
  color: #e96d13;
}

.title {
  color: #e96d13;
}


.button {
  border: 1px solid #e96d13;
  background-color: #496678;
  color: #e96d13;
  transition: background-color 0.3s, color 0.3s;
}

.button:hover {
  background-color: aliceblue;
  color: #496678;
}

.input:focus {
  box-shadow: 0 0 0 0.125em #496678;
}
.container {
  max-width: 400px;
  margin: 60px auto;
}

.form-container {
  padding: 40px;
  background-color: aliceblue;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.1);
}

.form-content {
  width: 100%;
}

.mb-5 {
  margin-bottom: 3rem;
}

.is-flexible {
  min-width: 0;
  flex-grow: 1;
}

.content-container {
  max-height: 100vh;
  overflow-y: auto;
  padding: 1.25rem;
}

.columns {
  margin-bottom: 1rem;
}

@media screen and (max-width: 768px) {
  .columns {
    flex-direction: column;
  }
}

.is-grouped-left {
  justify-content: flex-start;
}
</style>
