<template>
  <div class="mr-3 page-container">
    <div class="search-container">
      <input class="input filtro box" type="text" v-model="searchQuery"
        placeholder="Procure pelo nome do ticket, valor, setor, etc..." />
    </div>
    <div class="client-container">
      <Box class="box-container" v-for="ticket in filteredtickets" :key="ticket._id">
        <div class="columns">
          <div class="column">
            <strong class="label">Nome do Usuario:</strong>
            {{ ticket.nomeUsuario }}
          </div>
          <div class="column">
            <strong class="label">Modelo da Maquina:</strong>
            <p class="servico">{{ ticket.maquina }}</p>
          </div>
          
          <button class="detalhes-button ml-2 is-danger" @click="toggleDropdown(ticket._id)">
            <span class="icon is-small">
              <i class="fa-solid fa-circle-info"></i>
            </span>
          </button>
          <button class="editar-button ml-2 is-danger" @click="openEditModal(ticket)">
            <span class="icon is-small">
              <i class="fa-regular fa-pen-to-square"></i>
            </span>
          </button>
          <button class="deletar-button ml-2 is-danger" @click="openDeleteConfirmation(ticket._id)">
            <span class="icon is-small">
              <i class="fas fa-trash"></i>
            </span>
          </button>
        </div>
        <div v-if="activeDropdown === ticket._id" class="dropdown columns is-30">
          <!-- Dropdown content -->
          <div class="dropdown-content">
            <div class="tabela columns is-30">
              <div class="column">
                <strong class="label">ticket:</strong>
                <Box class="tabela-todos">{{ ticket.nomeUsuario }}</Box>
              </div>
              <div class="column">
                <strong class="label">Serviço:</strong>
                <Box class="tabela-servico"> {{ ticket.servico }} </Box>
              </div>
             
              <div class="column">
                <strong class="label">Data:</strong>
                <Box class="tabela-todos">{{ ticket.data }}</Box>
              </div>
              <div class="column">
                <strong class="label">setor:</strong>
                <Box class="tabela-todos">{{ ticket.setor }}</Box>
              </div>
             
            </div>
          </div>
        </div>
      </Box>
    </div>

    <!-- Delete confirmation modal -->
    <div class="modal" :class="{ 'is-active': isDeleteModalOpen }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Confirmação de exclusão</p>
          <button class="delete" aria-label="close" @click="closeDeleteConfirmation"></button>
        </header>
        <section class="modal-card-body">
          <p>Deseja excluir este ticket?</p>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-danger-modal" @click="deleteticketConfirmation">
            Sim
          </button>
          <button class="button" @click="closeDeleteConfirmation">Não</button>
        </footer>
      </div>
    </div>

    <!-- Edit modal -->
    <div class="modal" :class="{ 'is-active': isEditModalOpen }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Editar ticket:</p>
          <button class="delete" aria-label="close" @click="closeEditModal"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">Nome do ticket:</label>
            <div class="control">
              <input class="input" type="text" v-model="editedticket.nomeUsuario" />
            </div>
          </div>
          <div class="field">
            <label class="label">Modelo da Maquina:</label>
            <div class="control">
              <input class="input" type="text" v-model="editedticket.maquina" />
            </div>
          </div>
          <div class="field">
            <label class="label">Descrição do serviço:</label>
            <div class="control">
              <input class="input" type="text" v-model="editedticket.servico" />
            </div>
          </div>
                   
          <div class="field">
            <label class="label">Data:</label>
            <div class="control">
              <input class="input" type="text" v-model="editedticket.data" />
            </div>
          </div>
          <div class="field">
            <label class="label">setor:</label>
            <div class="control">
              <input class="input" type="text" v-model="editedticket.setor" />
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="confirmEditticket">
            Confirmar
          </button>
          <button class="button" @click="closeEditModal">Cancelar</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import ITicket from "@/interfaces/ITicket"
import Box from "./Box.vue";
import { TipoNotificacao } from "@/interfaces/INotificação";
import useNotificador from "@/hooks/notificador";
import { useStore } from "@/store";

export default defineComponent({
  name: "ticketTeste",
  components: {
    Box,
  },
  data() {
    return {
      fetchedtickets: [] as ITicket[],
      activeDropdown: null as string | null,
      searchQuery: "",
      isDeleteModalOpen: false,
      ticketToDelete: null as string | null,
      isEditModalOpen: false,
      editedticket: {
        _id: "",
        nomeUsuario: "",
        setor: "",
        servico: "",
        data_hora: "",
        data: "",
        maquina: ""
      },
    };
  },
  beforeMount() {
    this.fetchticketData();
  },
  created() {
    this.fetchticketData();
  },
  computed: {
    filteredtickets(): ITicket[] {
      if (!this.searchQuery) {
        return this.fetchedtickets;
      } else {
        const query = this.searchQuery.toLowerCase();
        return this.fetchedtickets.filter((ticket: ITicket) => {
          const { nomeUsuario, setor, servico, data, maquina } = ticket;
          return (
            nomeUsuario.toLowerCase().includes(query) ||
            setor.toLowerCase().includes(query) ||
            servico.toLowerCase().includes(query) ||
            maquina.toString().includes(query) ||
            data.toLowerCase().includes(query)
          );
        });
      }
    },
  },
  methods: {
    async fetchticketData() {
      try {
        const response = await fetch("http://10.1.1.136:3010/cadastroticketget");
        const data = await response.json();
        console.log(data);
        this.fetchedtickets = data;
      } catch (error) {
        console.error("Error fetching ticket data:", error);
      }
    },
    toggleDropdown(ticketId: string) {
      if (this.activeDropdown === ticketId) {
        this.activeDropdown = null;
      } else {
        this.activeDropdown = ticketId;
      }
    },
    openDeleteConfirmation(ticketId: string) {
      this.ticketToDelete = ticketId;
      this.isDeleteModalOpen = true;
    },
    closeDeleteConfirmation() {
      this.ticketToDelete = null;
      this.isDeleteModalOpen = false;
    },
    async deleteticket(ticketId: string) {
      try {
        const response = await fetch(`http://177.136.214.131:3010/cadastroticketsdelete/${ticketId}`, {
          method: "DELETE"
        });
        const data = await response.json();
        if (response.ok) {
          console.log(data.message);
          this.fetchticketData();
          this.notificar(
            TipoNotificacao.SUCESSO,
            "EXELENTE!",
            `o ticket foi excluido com sucesso!`
          );
        } else {
          console.error("Erro ao excluir ticket:", data.error);
        }
      } catch (error) {
        console.error("Erro ao excluir ticket:", error);
      }
    },
    deleteticketConfirmation() {
      if (this.ticketToDelete) {
        this.deleteticket(this.ticketToDelete);
        this.closeDeleteConfirmation();
      }
    },
    openEditModal(ticket: ITicket) {
      this.editedticket = { ...ticket };
      this.isEditModalOpen = true;
    },
    closeEditModal() {
      this.isEditModalOpen = false;
      this.editedticket = {
        _id: "",
        nomeUsuario: "",
        setor: "",
        
        servico: "",
        
        data_hora: "",
        data: "",
        maquina: ""
      };
    },
    async confirmEditticket() {
      try {
        const response = await fetch(
          `http://177.136.214.131:3010/cadastroticketsput/${this.editedticket._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.editedticket),
          }
        );
        const data = await response.json();
        if (response.ok) {
          console.log(data.message);
          this.fetchticketData();
          this.notificar(
            TipoNotificacao.SUCESSO,
            "EXELENTE!",
            `o ticket ${this.editedticket.nomeUsuario.toLocaleLowerCase()} foi editado com sucesso!`
          );
        } else {
          console.error("Erro ao editar ticket:", data.error);
        }
      } catch (error) {
        console.error("Erro ao editar ticket:", error);
      }
      this.closeEditModal();
    },
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
.search-container {
  padding: 1.5rem 0;
  margin-left: 20px;
}

.dropdown-content{
  border: 1px solid #e96d13;
  padding: 1.25rem;
}

.filtro {
  background-color: aliceblue;
  max-width: 600px;
  border: 1px solid #e96d13;
}

.tabela-todos {
  overflow-y: auto;
  max-width: 400px;
  max-height: 80px;
}

.tabela-servico {
  overflow-y: auto;
  overflow-x: auto;
  max-width: 500px;
  max-height: 200px;
  word-break: normal;  
}

.servico {
  overflow-y: auto;
  overflow-x: auto;
  max-width: 400px;
  max-height: 200px;
  word-break: keep-all;
}

.client-container {
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  padding: 1.25rem;
}

.box-container {
  border: 1px solid #e96d13;
}

.label {
  color: #e96d13;
  font-weight: bold;
}

.detalhes-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.detalhes-button .icon {
  color: #e96d13;
}

.editar-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.editar-button .icon {
  color: #e96d13;
}

.deletar-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.deletar-button .icon {
  color: #e96d13;
}

/* Modal styles */
.modal-card-foot {
  justify-content: flex-end;
  background-color: aliceblue;
}

.modal-card-head {
  background-color: aliceblue;
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

.modal-card-foot .button {
  margin-left: 0.5rem;
}

.tabela {
  background-color: aliceblue;
  padding: 1.25rem;
}

.modal-card-title {
  color: #e96d13;
  font-weight: bold;
}

.dropdown-content {
  padding: 1.25rem;
  background-color: aliceblue;
}

.is-danger-modal {
  background-color: #e96d13;
  color: #fff;
}

.modal-card-body {
  background-color: aliceblue;
}
</style>
