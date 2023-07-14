import { createStore, Store, useStore as vuexUseStore } from "vuex";
import { InjectionKey } from "vue";
import { ADICIONA_PROJETO, ALTERA_PROJETO, EXCLUIR_PROJETO, NOTIFICAR } from "./tipo-mutacoes";
import { INotificação, } from "@/interfaces/INotificação";


interface Estado {
   
    notificacoes: INotificação[],
}

export const key: InjectionKey<Estado> = Symbol()

export const store = createStore<Estado>({
    state: {
        
        notificacoes: [
            
        ]
    },
    mutations:
    {
       
        [NOTIFICAR](state, novaNotificação: INotificação) {
            novaNotificação.id = new Date().getTime()
            state.notificacoes.push(novaNotificação)
            setTimeout(() => {
                state.notificacoes = state.notificacoes.filter(notificacao => notificacao.id != novaNotificação.id)
            }, 3000)
        }

    }
})

export function useStore(): Store<Estado> {
    return vuexUseStore(key);
  }