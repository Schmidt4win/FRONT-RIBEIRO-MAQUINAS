<template>
  <div class="container">
    <h2 class="title">Lista de Pacientes na fila:</h2>
    <div class="container-tabela">
      <table class="table is-bordered is-fullwidth">
        <thead class="thead-sticky">
          <tr>
            <th>Data de Início</th>
            <th>Data Final</th>
            <th>Duração</th>
            <th>Paciente</th>
            <th>Setor</th>
            <th>Status</th>
            <th>Aguardando/Ult. Processo:</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="fila in filteredfila" :key="fila.id" :class="getStatusClass(fila.fle_status)">
            <td>{{ formatDateTime(fila.fle_dthr_chegada) }}</td>
            <td>{{ formatDateTime(fila.fle_dthr_final) }}</td>
            <td>
              {{
                calculateDuration(fila.fle_dthr_chegada, fila.fle_dthr_final)
              }}
            </td>
            <td>{{ fila.pac_nome }}</td>
            <td>{{ fila.fle_str_cod }}</td>
            <td>{{ fila.fle_status }}</td>
            <td>{{ fila.psv_fila_nome }}</td>

          </tr>
        </tbody>
      </table>
    </div>
    <Box class="box">
      <p>Quantidade de Atendimentos Hoje: {{ filteredfila.length }}</p>
      <div v-for="(count, status) in statusCount" :key="status">
        <p>{{ status }}: {{ count }}</p>
      </div>
    </Box>
    <Box class="box">
      <div>Setor Mais Recorrente: {{ mostFrequentProcedure }}</div>
      <!-- <div>
      Média de Tempo Fila (Geral):
      {{ averageTimeBetweenSurgeries }} minutos
    </div> -->
      <div>
        Status do Atendimento:
        Esperando (A), Em Atendimento (E), Em Procedimento (P), Atendimento Concluído (X) e Cancelado (Z).
      </div>
    </Box>
    <!-- <div class="filtro-data">
      <vue-datepicker v-model="startDate" format="dd/MM/yyyy"></vue-datepicker>
      <vue-datepicker v-model="endDate" format="dd/MM/yyyy"></vue-datepicker>
      <button @click="filterByDate">Filtrar</button>
    </div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import VueDatepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import Box from "./Box.vue";




export default defineComponent({
  name: "ListafilaNovo",

  // components: {
  //   VueDatepicker,
  // },

  components: {
    Box,
  },

  data() {
    return {
      fila: [] as any[],
      startDate: null as Date | null,
      endDate: null as Date | null,
      filteredfila: [] as any[],
      mostFrequentDoctor: "" as string,
      mostFrequentProcedure: "" as string,
      averageTimeBetweenSurgeries: 0 as number,
      statusCount: {
        Esperando: 0,
        'Em Atendimento': 0,
        'Em Procedimento': 0,
        'Atendimento Concluído': 0,
        Cancelado: 0,
      } as Record<string, number>,
      statusLegend: {
        A: "Esperando",
        Z: "Cancelado",
        X: "Atendimento Concluído",
        E: "Em Atendimento",
        P: "Em Procedimento"
      },
      intervalId: 0,


    };
  },

  methods: {
    calculateDuration(startTime: string, endTime: string): string {
      const startDate = new Date(startTime);
      const endDate = new Date(endTime);
      const differenceInMinutes =
        (endDate.getTime() - startDate.getTime()) / (1000 * 60); // Diferença em minutos
      return `${Math.floor(differenceInMinutes / 60)}h ${Math.floor(
        differenceInMinutes % 60
      )}min`;
    },
    calculateAverageTimeBetweenSurgeries() {
      let totalTime = 0;
      const surgeriesCount = this.filteredfila.length;

      for (let i = 1; i < surgeriesCount; i++) {
        const startDate = new Date(this.filteredfila[i - 1].fle_dthr_final);
        const endDate = new Date(this.filteredfila[i].fle_dthr_chegada);
        const differenceInMinutes =
          (endDate.getTime() - startDate.getTime()) / (1000 * 60); // Diferença em minutos
        totalTime += differenceInMinutes;
      }

      // Calcula a média de tempo entre as filas e arredonda para baixo
      if (surgeriesCount > 1) {
        this.averageTimeBetweenSurgeries = Math.floor(
          totalTime / (surgeriesCount - 1)
        );
      } else {
        this.averageTimeBetweenSurgeries = 0;
      }
    },


    findMostFrequentProcedure() {
      const proceduresFrequency: { [key: string]: number } = {};

      // Conta a frequência de cada procedimento na lista de fila filtrada
      this.filteredfila.forEach((fila) => {
        const procedure = fila.fle_str_cod;
        if (proceduresFrequency[procedure]) {
          proceduresFrequency[procedure]++;
        } else {
          proceduresFrequency[procedure] = 1;
        }
      });

      // Encontra o procedimento com a frequência mais alta
      let maxFrequency = 0;
      let mostFrequent = "";
      for (const procedure in proceduresFrequency) {
        if (proceduresFrequency[procedure] > maxFrequency) {
          maxFrequency = proceduresFrequency[procedure];
          mostFrequent = procedure;
        }
      }

      this.mostFrequentProcedure = mostFrequent;
    },

    findMostFrequentDoctor() {
      const doctorsFrequency: { [key: string]: number } = {};

      // Conta a frequência de cada médico na lista de fila filtrada
      this.filteredfila.forEach((fila) => {
        const doctorName = fila.usr_nome;
        if (doctorsFrequency[doctorName]) {
          doctorsFrequency[doctorName]++;
        } else {
          doctorsFrequency[doctorName] = 1;
        }
      });

      // Encontra o médico com a frequência mais alta
      let maxFrequency = 0;
      let mostFrequent = "";
      for (const doctor in doctorsFrequency) {
        if (doctorsFrequency[doctor] > maxFrequency) {
          maxFrequency = doctorsFrequency[doctor];
          mostFrequent = doctor;
        }
      }

      this.mostFrequentDoctor = mostFrequent;
    },
    filterByDate() {
      const startDate = this.startDate;
      const endDate = this.endDate;

      if (!startDate || !endDate) {
        this.filteredfila = this.fila;
        return;
      }
      for (const status in this.statusCount) {
        this.statusCount[status] = 0;
      }

      this.filteredfila = this.fila.filter((fila) => {

        const filaDate = new Date(fila.fle_dthr_chegada);
        const statusKey = fila.fle_status as keyof typeof this.statusLegend;
        const statusDescription = this.statusLegend[statusKey];
        if (statusDescription) {
          this.statusCount[statusDescription]++; // Incrementa o contador do status
        }
        return filaDate >= startDate && filaDate <= endDate;
      });
      console.log(this.filteredfila)
      this.sortfilaByDateTime(); // Ordena os dados pela data e hora
      this.findMostFrequentDoctor();
      this.findMostFrequentProcedure();
      this.calculateAverageTimeBetweenSurgeries();

    },

    sortfilaByDateTime() {
      console.log(this.filteredfila)
      this.filteredfila.sort((a, b) => {
        const dateA = new Date(a.fle_dthr_chegada).getTime();
        const dateB = new Date(b.fle_dthr_chegada).getTime();
        return dateA - dateB;

      });
    },

    fetchfila() {
      fetch("http://10.1.1.136:3010/fila")
        .then((response) => response.json())
        .then((data) => {
          data.forEach((fila: any, index: any) => {
            fila.id = index + 1;

            // Verifica e substitui os valores nulos por "data inválida"
            if (!fila.fle_dthr_final) {
              fila.fle_dthr_final = new Date();
            }
          });
          console.log("fetchfila")

          // Ordenar os dados pela data de início antes de atribuir
          data.sort((a: any, b: any) => {
            const dateA = new Date(a.fle_dthr_chegada).getTime();
            const dateB = new Date(b.fle_dthr_chegada).getTime();
            return dateA - dateB;
          });

          this.fila = data;
          this.filteredfila = data;
          this.calculateStatusCount(); // Chama a função para contar os status
          this.findMostFrequentDoctor();
          this.findMostFrequentProcedure();
          this.calculateAverageTimeBetweenSurgeries();
        })
        .catch((error) => {
          console.error("Erro ao obter as filas:", error);
        });
    },


    calculateStatusCount() {
      // Reinicializa a contagem para todos os status
      for (const status in this.statusCount) {
        this.statusCount[status] = 0;
      }

      // Faz a contagem dos status nos dados filtrados
      this.filteredfila.forEach((fila) => {
        const statusKey = fila.fle_status as keyof typeof this.statusLegend;
        const statusDescription = this.statusLegend[statusKey];
        if (statusDescription) {
          this.statusCount[statusDescription]++; // Incrementa o contador do status
        }
      });
    },


    formatDateTime(dateString: string): string {
      const date = new Date(dateString);
      const formattedDate = `${this.padZero(date.getDate())}/${this.padZero(
        date.getMonth() + 1
      )}/${date.getFullYear()}`;
      const formattedTime = `${this.padZero(date.getHours())}:${this.padZero(
        date.getMinutes()
      )}`;
      return `${formattedDate} ${formattedTime}`;
    },

    padZero(num: number): string {
      return num.toString().padStart(2, "0");
    },

    getStatusClass(status: string): Record<string, boolean> {
      return {
        'esperando': status.toUpperCase() === 'A', // Verifica se o status é 'A' para 'Esperando'
        'em-atendimento': status.toUpperCase() === 'E', // Verifica se o status é 'E' para 'Em Atendimento'
        'em-procedimento': status.toUpperCase() === 'P',
        'atendimento-concluido': status.toUpperCase() === 'X',
        'cancelado': status.toUpperCase() === 'Z',
      };
    },
  },

  mounted() {
    const authData = JSON.parse(localStorage.getItem('authData') || '{}');

    if (authData && (authData.category === 'ADM' || authData.category === 'USR')) {
      this.fetchfila();
      this.intervalId = setInterval(() => {
        this.fetchfila();

      }, 60000); // Executa a função se for um ADM
    } else {
      // Emite um alerta na tela
      alert('Acesso permitido apenas para usuários do tipo "ADM"');

      // Redireciona para a rota /ticket
      this.$router.push('/tutorial'); // Substitua '/ticket' pela rota desejada
    }
  },

  beforeUnmount() {
    // Limpa o intervalo antes de desmontar o componente
    clearInterval(this.intervalId);
  },
});
</script>

<style scoped>
.esperando {
  background-color: lightsalmon;
}

.em-atendimento {
  background-color: lightgreen;
}

.em-procedimento {
  background-color: lightyellow;
}

.atendimento-concluido {
  background-color: lightblue;
}

.cancelado {
  background-color: lightcoral;
}

.container {
  padding: 1rem;
  overflow-y: 800px;
}

.container-tabela {
  max-height: 500px;
  overflow-y: auto;
  padding: 1rem;
}

.box {
  padding: 1rem;
  margin-top: 20px;
}

.title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.table {
  margin-top: 1rem;
  border-collapse: collapse;
  width: 100%;
}

th {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
}

td {

  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}
</style>
