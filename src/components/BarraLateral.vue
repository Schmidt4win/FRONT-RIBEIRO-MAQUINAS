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
        <li>
          <RouterLink to="/serviço" class="link">
            <i class="fas fa-pen"></i> Cadastro de Ticket
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/cliente" class="link">
            <i class="fas fa-users"></i> Tickets
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/meuticket" class="link">
            <i class="fa fa-ticket" aria-hidden="true"></i> Meus Tickets
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/relcirur" class="link">
            <i class="fa fa-file-text" aria-hidden="true"></i> Rel. Cirurgia
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/teste" class="link">
            <i class="fa fa-file-text" aria-hidden="true"></i> teste
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
  color: #faf0ca;
}
</style>


 
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BarraLateral',
  emits: ['aoTemaAlterado'],
  data () {
    return {
      modoEscuroAtivo: true
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

