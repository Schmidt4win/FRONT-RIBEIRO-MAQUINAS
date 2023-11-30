<template>
  <header>
    <h1>
      <img src="../assets/logo-sem-fundo.png" alt="">
    </h1>
    <!-- <button class="button" :class="{ 'is-dark': modoEscuroAtivo }" @click="alterarTema">
      {{ textoBotao }}
    </button> -->
    <nav class="panel mt-5">
      <ul>
        <li v-if="categoria === 'ADM' ">
          <RouterLink to="/ticket" class="link">
            <i class="fas fa-pen"></i> Cadastro de Ticket
          </RouterLink>
        </li>
        <li v-if="categoria === 'ADM' " >
          
          <RouterLink to="/tickets" class="link">
             <i class="fa fa-ticket" aria-hidden="true"></i>Tickets
          </RouterLink>
        </li>
        <li v-if="categoria === 'ADM'">
          <RouterLink to="/meuticket" class="link">
            <i class="fa fa-ticket" aria-hidden="true"></i> Meus Tickets
          </RouterLink>
        </li>
        <li v-if="categoria === 'ADM' || categoria === 'USR'">
          <RouterLink to="/teste" class="link">
            <i class="fa fa-file-text" aria-hidden="true"></i> Rel. Cirurgia
          </RouterLink>
        </li>
        <li v-if="categoria === 'ADM' || categoria === 'USR'">
          <RouterLink to="/fila" class="link">
            <i class="fas fa-users"></i> Fila
          </RouterLink>
        </li>
        <li v-if="categoria === 'ADM' || categoria === 'TUT' || categoria === 'USR'">
          <RouterLink to="/tutorial" class="link">
            <i class="fa fa-file-text" aria-hidden="true"></i> Tutorial
          </RouterLink>
        </li>
        <!-- <li>
          <RouterLink to="/filtro" class="link">
            <i class="fa-sharp fa-solid fa-filter"></i> Filtro
          </RouterLink>
        </li> -->
      </ul>
    </nav>
    <button class="button logout-button" @click="logout">
      <i class="fas fa-sign-out-alt"></i> Logout
    </button>
  </header>
</template>

<style scoped>
header {
  padding: 1rem;
  background: aliceblue;
  width: 100%;
  height: 100vh;
  text-align: center;
}

@media only screen and (max-width: 768px) {
  header {
    padding: 2.5rem;
    height: auto;
  }
}

/* Estilos para dispositivos móveis */
@media only screen and (max-width: 480px) {
  header {
    padding: 1rem;
  }

  .button {
    font-size: 0.8rem;
    
  }

  .panel {
    margin-top: 0.5rem;
    padding: 1.25rem;
  }

  .link {
    font-size: 1rem;
    padding: 0.5rem;
  }

  .logout-button {
    margin-top: 0.5rem;
  }
}

.panel {
  margin-top: 1rem;
}

.panel ul {
  list-style: none;
  padding: 1.25rem;
  margin: 0;
}

.panel li {
  margin: 8px 0;
  padding: 0.50rem;
}

.link {
  color: black;
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: color 0.3s ease;
}

.link i {
  margin-right: 0.5rem;
}

.link:hover {
  color: red;
}

.logout-button {
  margin-top: 1rem;
  background-color: #ff261b;
  color: black;
}

.logout-button:hover {
  background-color: aliceblue;
  color: black;
}
</style>


 
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BarraLateral',
  emits: ['aoTemaAlterado'],
  data () {
    return {
      modoEscuroAtivo: true,
      categoria: '', // Propriedade para armazenar a categoria do usuário
    }
  },

  created() {
  // Access localStorage to obtain the user's category
  const authDataString = localStorage.getItem('authData');
  if (authDataString !== null) {
    const authData = JSON.parse(authDataString);
    this.categoria = authData.category; // Assuming category is present in the authentication data
  } else {
    // Handle the case when 'authData' is null (optional)
    // For instance, setting a default category or redirecting to login
    this.categoria = 'TUT' || 'USR';
    // Or redirecting to login
    // this.$router.push('/login');
  }
},
  computed: {
    textoBotao () {
      if (this.modoEscuroAtivo) {
        return "Desativar modo escuro"
      }
      return "Ativar Modo Escuro"
    }
  },

  methods: {
    alterarTema() {
      this.modoEscuroAtivo = !this.modoEscuroAtivo
      this.$emit('aoTemaAlterado', this.modoEscuroAtivo)
    },
    logout() {
      // Limpar os dados de autenticação do local storage
      localStorage.removeItem('authData');
      // Redirecionar para a tela de login ou outra rota desejada
      this.$router.push('/login');
    }
  }
});
</script>

