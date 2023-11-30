import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";


import HomeView from "../views/HomeView.vue"
import ServiceForm from "../views/ServiceForm.vue";
import Login from "../views/Login.vue";
import Cliente from "../components/Cliente.vue";
import FiltroVue from "../components/FiltroVue.vue";
import meuTicket from "../components/MeusTickets.vue"
import ListafilaNovo from "../components/FilaRelatorio.vue"
import ListaCirurgiasNovo from "../components/RelatorioNew.vue"
import TutorialInternacao from "../components/TutoInter.vue"





const rotas: RouteRecordRaw[] = [

  {
    path: "/",
    name: "Home",
    component: HomeView,
    redirect: '/tutorial',
    children:
      [        
      {
        path: "/tickets",
        name: "Cliente",
        component: Cliente,
      },
      {
        path: "/ticket",
        name: "Serviço",
        component: ServiceForm,
      },
      {
        path: "/filtro",
        name: "filtro",
        component: FiltroVue,
      },
      {
        path: "/meuticket",
        name: "meuticket",
        component: meuTicket,
      },
      {
        path: "/fila",
        name: "fila",
        component: ListafilaNovo,
      },
      {
        path: "/teste",
        name: "teste",
        component: ListaCirurgiasNovo,
      }, 
      {
        path: "/tutorial",
        name: "testetutorial",
        component: TutorialInternacao,
      },       
      ]
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },

];

const roteador = createRouter({
  history: createWebHashHistory(),
  routes: rotas,
});

// Add beforeEach navigation guard
roteador.beforeEach((to, from, next) => {
  const authData = localStorage.getItem('authData');
  if (to.name !== 'Login' && (!authData || isTokenExpired(authData))) {
    next('/login');
  } else {
    next();
  }
});

function isTokenExpired(authData: string | null): boolean {
  if (authData) {
    const { expiration } = JSON.parse(authData);
    return new Date().getTime() > expiration;
  }
  return true;
}

export default roteador;
