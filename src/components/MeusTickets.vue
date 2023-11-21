<template>
  <div class="mr-3 page-container">
    <div class="search-container">

      <input class="input filtro box" type="text" v-model="searchQuery"
        placeholder="Procure pelo nome do ticket, setor, etc..." />
      <div class="ticket-total">
        <Box class="teste" :style="{ backgroundColor: 'aliceblue'}">Total de Tickets: {{ totalTickets }}</Box>
      </div>
      <div class="ticket-count">
        <Box class="teste" v-for="category in categories" :key="category.name"
          @click="toggleSelectedCategory(category.name)"
          :style="{ backgroundColor: selectedCategory === category.name ? 'lightblue' : 'aliceblue' }">
          {{ category.name }}: {{ categoryCount(category.name) }}
        </Box>
      </div>

      <div class="ticket-count-status">
  <Box class="teste" v-for="status in statuses" :key="status.name"
    @click="toggleSelectedStatus(status.name)"
    :style="{ backgroundColor: selectedStatus === status.name ? 'lightblue' : 'aliceblue' }">
    {{ status.name }}: {{ status.count }}
  </Box>
</div>
    </div>

    <div class="client-container">
      <Box class="box-container" v-for="ticket in filteredtickets" :key="ticket._id"
        :style="{ backgroundColor: getStatusColor(ticket.status) }">
        <div class="columns">
          <div class="column">
            <strong class="label">Nome do Usuario:</strong>
            {{ ticket.nomeUsuario }}
          </div>
          <div class="column">
            <strong class="label">Setor:</strong>
            <p class="servico">{{ ticket.setor }}</p>
          </div>
          <div class="column">
            <strong class="label">Status:</strong>
            <p class="servico">{{ ticket.status.toLocaleUpperCase() }}</p>
          </div>


          <div v-if="ticket.atualizado" class="column">
            <strong class="label">Descrição:</strong>
            <p class="servico">{{ ticket.atualizado_newtext }}</p>
          </div>
          <div v-else class="column">
            <strong class="label">Descrição:</strong>
            <p class="servico">{{ ticket.servico }}</p>
          </div>
          <div class="column">
            <strong class="label">Abertura:</strong>
            <p class="servico">{{ ticket.data_hora }}</p>
          </div>
          <div class="column">
            <strong class="label">Atualização:</strong>
            <p class="servico">{{ ticket.data_hora_att }}</p>
          </div>
          <div class="column">
            <strong class="label">Usuario Responsável:</strong>
            <p class="servico">{{ ticket.user.toLocaleUpperCase() }}</p>
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

          <div class="dropdown-content">
            <div class="tabela columns is-30">
              <div class="column">
                <strong class="label">Usuario:</strong>
                <Box class="tabela-todos">{{ ticket.nomeUsuario }}</Box>
              </div>
              <div class="column">
                <strong class="label">Descrição:</strong>
                <Box class="tabela-servico"> {{ ticket.servico }} </Box>
              </div>
              <div class="column">
                <strong class="label">Solução:</strong>
                <Box class="tabela-servico"> {{ ticket.solucao }} </Box>
              </div>


              <div class="column">
                <strong class="label">Data:</strong>
                <Box class="tabela-todos">{{ ticket.data }}</Box>
              </div>
              <div class="column">
                <strong class="label">Setor:</strong>
                <Box class="tabela-todos">{{ ticket.setor }}</Box>
              </div>

            </div>
          </div>
        </div>
      </Box>
    </div>


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
            <label class="label">Solucao:</label>
            <div class="control">
              <input class="input" type="text" v-model="editedticket.solucao" />
            </div>
          </div>
          <div class="field">
            <label class="label">Descrição do serviço:</label>
            <div class="control">
              <input class="input" type="text" v-model="editedticket.atualizado_newtext" />
            </div>
          </div>

          <div class="field">
            <label class="label">Data:</label>
            <div class="control">
              <input class="input" type="text" v-model="editedticket.data" />
            </div>
          </div>
          <div class="field">
            <label class="label">Setor:</label>
            <div class="control">
              <input class="input" type="text" v-model="editedticket.setor" />
            </div>
          </div>
          <div class="field">

            <div class="control">
              <div class="field">
                <label for="status" class="label">Status:</label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="editedticket.status" required>
                      <option disabled value="">Selecione o status</option>
                      <option>Em Validação</option>
                      <option>Resolvido</option>
                      <option>Em Andamento</option>
                      <option>Aguardando Pixeon</option>
                    </select>
                  </div>
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
import { defineComponent } from "vue";
import ITicket from "@/interfaces/ITicket"
import Box from "./Box.vue";
import { TipoNotificacao } from "@/interfaces/INotificação";
import useNotificador from "@/hooks/notificador";
import { useStore } from "@/store";
import IUser from "@/interfaces/IUser"

export default defineComponent({
  name: "ticketTeste",
  components: {
    Box,
  },
  data() {
    return {
      fetchedUser: [] as IUser[],
      fetchedtickets: [] as ITicket[],
      activeDropdown: null as string | null,
      searchQuery: "",
      isDeleteModalOpen: false,
      ticketToDelete: null as string | null,
      isEditModalOpen: false,
      selectedCategory: null as string | null,
      selectedStatus: null as string | null,
      direcionado: "",
      editedticket: {
        _id: "",
        nomeUsuario: "",
        setor: "",
        servico: "",
        data_hora: "",
        data: "",
        maquina: "",
        solucao: "",
        status: "",
        data_hora_att: "",
        atualizado_newtext: "",
        atualizado: false,
        direcionado: "",
      },
    };
  },
  beforeMount() {
    this.fetchticketData();
    this.fetchticketUser();
  },
  created() {
    this.fetchticketData();
    this.fetchticketUser();
  },
  computed: {
    filteredtickets(): ITicket[] {
      if (!this.searchQuery && !this.selectedCategory && !this.selectedStatus) {
        return this.fetchedtickets;
      } else {
        const query = this.searchQuery.toLowerCase();
        return this.fetchedtickets.filter((ticket: ITicket) => {
          const { nomeUsuario, setor, servico, data, maquina } = ticket;
          const matchesSearchQuery = (
            nomeUsuario.toLowerCase().includes(query) ||
            setor.toLowerCase().includes(query) ||
            servico.toLowerCase().includes(query) ||
            maquina.toString().includes(query) ||
            data.toLowerCase().includes(query)
          );
          const matchesCategory = !this.selectedCategory || ticket.setor === this.selectedCategory;
          const matchesStatus = !this.selectedStatus || ticket.status === this.selectedStatus;

          return matchesSearchQuery && matchesCategory && matchesStatus;
        });
      }
    },
    statuses(): { name: string; count: number }[] {
      const uniqueStatuses: Set<string> = new Set();
      this.fetchedtickets.forEach((ticket: ITicket) => {
        uniqueStatuses.add(ticket.status);
      });

      const statusesWithCount = Array.from(uniqueStatuses).map((status: string) => ({
        name: status,
        count: this.statusCount(status),
      }));

      return statusesWithCount;
    },

    totalTickets(): number {
      return this.fetchedtickets.length;
    },

    categories(): { name: string }[] {
      const uniqueCategories: Set<string> = new Set();
      this.fetchedtickets.forEach((ticket: ITicket) => {
        uniqueCategories.add(ticket.setor);
      });
      return Array.from(uniqueCategories).map((category: string) => ({ name: category }));
    },
  },
  methods: {
    toggleSelectedCategory(categoryName: string) {
      this.selectedCategory = this.selectedCategory === categoryName ? null : categoryName;
    },
    statusCount(statusName: string): number {
      return this.fetchedtickets.filter((ticket: ITicket) => ticket.status === statusName).length;
    },

    toggleSelectedStatus(statusName: string) {
    this.selectedStatus = this.selectedStatus === statusName ? null : statusName;
  },
  statusFilter(ticket: ITicket): boolean {
    return !this.selectedStatus || ticket.status === this.selectedStatus;
  },

    categoryCount(categoryName: string): number {
      return this.fetchedtickets.filter((ticket: ITicket) => ticket.setor === categoryName).length;

    },
    async fetchticketData() {
      try {
        const authDataString: string | null = localStorage.getItem('authData');
        if (authDataString) {
          const authData: any = JSON.parse(authDataString);
          const username = authData.username; // Access the username property
          const response = await fetch("http://10.1.1.136:3010/ticketget");
          let data = await response.json();
          // Filter tickets based on the authenticated user
          data = data.filter((ticket: ITicket) => {
        return ticket.user === username || ticket.direcionado === username;
      });

          this.fetchedtickets = data;
        }
      } catch (error) {
        console.error("Error fetching ticket data:", error);
      }
    },
    getStatusColor(status: string): string {

      switch (status) {
        case 'Resolvido':
          return 'lightgreen';
        case 'Em Validação':
          return 'lightyellow';
        case 'Em Andamento':
          return 'yellow';
        case 'Aguardando Pixeon':
          return 'lightblue';
        default:
          return 'red';
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
    closeDeleteConfirmation() {
      this.ticketToDelete = null;
      this.isDeleteModalOpen = false;
    },
    async deleteticket(ticketId: string) {
      try {
        const response = await fetch(`http://10.1.1.136:3010/cadastroticketdelete/${ticketId}`, {
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
        status: "",
        servico: "",
        solucao: "",
        data_hora: "",
        data: "",
        maquina: "",
        data_hora_att: "",
        atualizado_newtext: "",
        atualizado: false,
        direcionado: "",
      };
    },
    async confirmEditticket() {
      this.editedticket.data_hora_att = new Date().toLocaleString("pt-BR");
      this.editedticket.atualizado = true;

      try {
        const response = await fetch(
          `http://10.1.1.136:3010/cadastroticketput/${this.editedticket._id}`,
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
.teste {
  padding: 1rem;
  margin: 10px;
  border: solid 1px #1b53f8;
}

@media only screen and (max-width: 768px) {
  header {
    padding: 2.5rem;
    height: auto;
    height: 100hv;
  }

  .search-container {
    padding: 1.5rem 0;
    margin-left: 20px;
    height: 100hv;
  }

  .client-container {
    max-height: calc(100vh - 100px);
    overflow-y: auto;
    padding: 1.25rem;
  }
}


@media only screen and (max-width: 480px) {
  header {
    padding: 1rem;
    height: 100hv;
  }

  .search-container {
    padding: 1.5rem 0;
    margin-left: 20px;
    height: 100hv;
  }

  .client-container {
    max-height: calc(100vh - 100px);
    overflow-y: auto;
    padding: 1.25rem;
  }

}

.search-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  max-height: 100px;
}

.dropdown-content {
  border: 1px solid #e96d13;
  padding: 1.25rem;
  width: 100%;
}

.filtro {
  background-color: aliceblue;
  max-width: 600px;
  border: 1px solid #1b53f8;
  margin-top: 70px;
  margin-left: 20px;
}

.tabela-todos {
  overflow-y: auto;
  max-width: 400px;
  max-height: 80px;
}

.tabela-servico {
  overflow-y: auto;
  overflow-x: auto;
  max-width: 100%;
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
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  padding: 1.25rem;
  margin-top: 50px;
}

.box-container {
  border: 1px solid #1b53f8;
}

.label {
  color: #1b53f8;
  font-weight: bold;
}

.ticket-count {
  max-height: 150px;
  overflow-y: auto;
  width: 550px;
  display: flex;
  flex-wrap: wrap;
  margin-top: 50px;

}

.ticket-total {
  max-height: 150px;
  overflow-y: auto;
  width: 200px;
  display: flex;
  flex-wrap: wrap;
  margin-top: 50px;

}

.ticket-count-status {
  max-height: 150px;
  overflow-y: auto;
  width: 380px;
  display: flex;
  flex-wrap: wrap;
  margin-top: 50px;
}

.detalhes-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.detalhes-button .icon {
  color: #1b53f8;
}

.editar-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.editar-button .icon {
  color: #1b53f8;
}

.deletar-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.deletar-button .icon {
  color: #1b53f8;
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
  border: 1px solid #1b53f8;
  background-color: aliceblue;
  color: #1b53f8;
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
  color: #1b53f8;
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
