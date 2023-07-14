<template>
  <header>
    <h1>
      <img src="../assets/logo.jpg" alt="">
    </h1>
    <button class="button" :class="{ 'is-dark': modoEscuroAtivo }" @click="alterarTema">
      {{ textoBotao }}
    </button>
    <nav class="panel mt-5">
      <ul>
        <li>
          <RouterLink to="/serviço" class="link">
            <i class="fas fa-pen"></i> Cadastro de Serviço
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/cliente" class="link">
            <i class="fas fa-users"></i> Cliente
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/filtro" class="link">
            <i class="fas fa-users"></i> Cliente
          </RouterLink>
        </li>
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
  background: #496678;
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
  padding: 0;
  margin: 0;
}

.panel li {
  margin: 8px 0;
}

.link {
  color: #fff;
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: color 0.3s ease;
}

.link i {
  margin-right: 0.5rem;
}

.link:hover {
  color: #faf0ca;
}

.logout-button {
  margin-top: 1rem;
  background-color: #ff261b;
  color: #fff;
}

.logout-button:hover {
  background-color: #e96d13;
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

