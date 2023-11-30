<template>
  <div class="login-container">
    <div class="card login-card">
      <div class="card-content">
        <div class="img-container has-text-centered">
          <img src="../assets/login-sem-fundo.png" alt="Logo" class="rounded-image" />
        </div>
        <div class="field">
          <label class="label">Username</label>
          <div class="control">
            <input class="input" type="text" v-model="name" @keydown.enter="login" />
          </div>
        </div>
        <div class="field">
          <label class="label">Password</label>
          <div class="control">
            <input class="input" type="password" v-model="password" @keydown.enter="login" />
          </div>
        </div>
        
        <div class="field">
          <div class="control">
            <button class="button is-primary" @click="login">Login</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="notification" :class="{ 'show-notification': errorMessage }">
    {{ errorMessage }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { TipoNotificacao } from "@/interfaces/INotificação";
import useNotificador from "@/hooks/notificador";
import { useStore } from "@/store";

export default defineComponent({
  name: "LoginVue",
  data() {
    return {
      name: '',
      password: '',
      category: '',
      errorMessage: '',
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post(
          'http://10.1.1.136:3010/login',
          {
            name: this.name,
            password: this.password,
          }
        );
        if (response.status === 201) {
          // Save token and username in local storage
          const token = response.data.token;
          const username = response.data.name;
          const category = response.data.category;
          const expiration = new Date().getTime() + 2 * 60 * 60 * 1000; // 2 hours from now
          const authData = {
            token: token,
            username: username,
            expiration: expiration,
            category: category,
          };
          localStorage.setItem('authData', JSON.stringify(authData));
          this.category = response.data.category;
          if (this.category === 'TUT') {
            this.$router.push('/tutorial')
          } else {
          // Redirect to the home route
          this.$router.push('/');
          }
        }
      } catch (error) {
        console.error(error);
        this.showErrorMessage('Usuario ou Senha invalidos, tente novamente');
      }
    },
    showErrorMessage(message: string) {
      this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000); // Hide the error message after 3 seconds
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

.notification {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  background-color: #e96d13;
  color: aliceblue;
  padding: 1rem 2rem;
  border-radius: 5px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
}

.show-notification {
  opacity: 1;
  visibility: visible;
}


.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #496678;
  padding: 1.50rem;
}

.login-card {
  width: 500px;
  padding: 1.25rem;
  background-color: aliceblue;
  border-radius: 10px;
}

.img-container {
  margin-bottom: 1.5rem;
  padding: 1.50rem;
  border-radius: 50%;
}

.rounded-image {
  border-radius: 10px;
}

.card-content {
  padding: 1.5rem;
  padding: 1.50rem;
  border-radius: 10px;
}

.button {
  border: 1px solid #e96d13;
  background-color: #496678;
  color: aliceblue;
  transition: background-color 0.3s, color 0.3s;
}

.button:hover {
  background-color: lightblue;
  color: #496678;
}

.input:focus {
  box-shadow: 0 0 0 0.125em #496678;
}
</style>
