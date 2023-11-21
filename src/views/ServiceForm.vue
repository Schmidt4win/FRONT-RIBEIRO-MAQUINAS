<template>
  <div class="container form-container">
    <h1 class="title is-4 has-text-centered mb-5">Cadastro de Serviço</h1>
    <div class="field">
      <label for="status" class="label">Status:</label>
      <div class="control">
        <div class="select is-fullwidth">
          <select v-model="status" required>
            <option disabled value="">Selecione o status</option>
            <option>Em Validação</option>
            <option>Resolvido</option>
            <option>Em Andamento</option>
            <option>Aguardando Pixeon</option>
          </select>
        </div>
      </div>
    </div>
    <div class="field">
      <label for="status" class="label">Direcionar a:</label>
      <div class="control">
        <div class="select is-fullwidth">
          <select v-model="direcionado" required>
            <option v-for="user in fetchedUser" :key="user.id">{{ user.name }}</option>

          </select>
        </div>
      </div>
    </div>
    <form @submit.prevent="submitForm" class="form-content">
      <div class="columns is-variable is-2 is-mobile">
        <div class="column is-half">
          <div class="field">
            <label for="nomeCliente" class="label">Usuario:</label>
            <div class="control">
              <input type="text" class="input is-flexible" v-model="nomeUsuario" required />
            </div>
          </div>
        </div>
        <div class="column is-half">
          <div class="field">
            <label for="cidade" class="label">Setor:</label>
            <div class="control">
              <input type="text" class="input is-flexible" v-model="setor" required />
            </div>
          </div>
        </div>
      </div>

      <div class="columns is-variable is-2 is-mobile">
        <div class="column is-half">
          <div class="field">
            <label for="servico" class="label">Descrição:</label>
            <div class="control">
              <input type="text" class="input is-flexible" v-model="servico" required />
            </div>
          </div>
        </div>

        <div class="column is-half">
          <div class="field">
            <label for="servico" class="label">Solução:</label>
            <div class="control">
              <input type="text" class="input is-flexible" v-model="solucao" required />
            </div>

          </div>

        </div>
      </div>

      <div class="columns is-variable is-3 is-mobile">
        <div class="column">
          <div class="field">
            <label for="data" class="label">Data:</label>
            <div class="control">
              <input type="date" class="input is-flexible" v-model="data" required />
            </div>
          </div>
        </div>
        <div class="column">
          <div class="field">
            <label for="cidade" class="label">Conf da Maquina/Sistema:</label>
            <div class="control">
              <input type="text" class="input is-flexible" v-model="maquina" required />
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
import { defineComponent } from "vue";
import { TipoNotificacao } from "@/interfaces/INotificação";
import useNotificador from "@/hooks/notificador";
import { useStore } from "@/store";
import IUser from "@/interfaces/IUser"


export default defineComponent({
  data() {
    return {
      fetchedUser: [] as IUser[],
      nomeUsuario: "",
      setor: "",
      servico: "",
      data: "",
      maquina: "",
      solucao: "",
      status: "",
      direcionado: "",
      authData: {
        username: "",
      },
    };
  },
  methods: {
    async fetchticketUser() {
      try {
        const response = await fetch("http://10.1.1.136:3010/users");
        let data = await response.json();
        this.fetchedUser = data;
      } 
      catch (error) {
        console.error("Error fetching ticket data:", error);
      }
    },
    submitForm(): void {
      const authData = localStorage.getItem("authData");
      if (authData === null) {
        console.error("Authentication data is missing from localStorage.");
        return;
      }
      const { username } = JSON.parse(authData)

      const user = username ?? "Unknown User";
      console.log(user);
      const data = {
        nomeUsuario: this.nomeUsuario,
        setor: this.setor,
        servico: this.servico,
        data_hora: new Date().toLocaleString("pt-BR"),
        data: this.formatDate(this.data), // Format the date before sending
        maquina: this.maquina,
        solucao: this.solucao,
        status: this.status,
        user: user,
        direcionado: this.direcionado,

      };

      console.log(data);

      fetch("http://10.1.1.136:3010/cadastroticketpost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Dados enviados com sucesso:", data);
          // Perform any additional actions if necessary
          this.resetForm();
          this.notificar(
            TipoNotificacao.SUCESSO,
            "EXELENTE!",
            `O cliente foi salvo com sucesso!`
          );
        })
        .catch((error) => {
          console.error("Erro ao enviar os dados:", error);
          // Handle the error appropriately
        });
    },
    formatDate(date: string): string {
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    resetForm(): void {
      this.nomeUsuario = "";
      this.servico = "";
      this.maquina = "";
      this.solucao = "";
      this.setor = "";
      this.status = "";
      this.status = "";
    },
  },
  beforeMount() {
    this.fetchticketUser();
  },
  created() {
    this.fetchticketUser();
  },
  setup() {
    const store = useStore();
    const { notificar } = useNotificador();
    return {
      store,
      notificar,
    };
  },
});
</script>

<style scoped>
.label {
  color: #e96d13;
}

.label-status {
  color: #e96d13;
  max-width: 200px;
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
