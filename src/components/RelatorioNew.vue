<template>
    <div class="container">
      <h2 class="title">Lista de Cirurgias</h2>
      <div class="container-tabela">
        <table class="table is-bordered is-fullwidth">
          <thead>
            <tr>
              <th>Data de Início</th>
              <th>Data Final</th>
              <th>Duração</th>
              <th>Paciente</th>
              <th>Procedimento</th>
              <th>Médico</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cirurgia in filteredCirurgias" :key="cirurgia.id">
              <td>{{ formatDateTime(cirurgia.RCI_DTHR_INI) }}</td>
              <td>{{ formatDateTime(cirurgia.RCI_DTHR_FIM) }}</td>
              <td>
                {{
                  calculateDuration(cirurgia.RCI_DTHR_INI, cirurgia.RCI_DTHR_FIM)
                }}
              </td>
              <td>{{ cirurgia.PAC_NOME }}</td>
              <td>{{ cirurgia.SMK_ROT }}</td>
              <td>{{ cirurgia.PSV_APEL_C }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <p>Quantidade de Cirurgias: {{ filteredCirurgias.length }}</p>
        <p>Médico Mais Recorrente no Período: {{ mostFrequentDoctor }}</p>
    </div>
      
      <div>Cirurgia Mais Recorrente no Período: {{ mostFrequentProcedure }}</div>
      <div>
        Média de Tempo entre Cirurgias (Geral):
        {{ averageTimeBetweenSurgeries }} minutos
      </div>
  
      <div class="filtro-data">
        <vue-datepicker v-model="startDate" format="dd/MM/yyyy"></vue-datepicker>
        <vue-datepicker v-model="endDate" format="dd/MM/yyyy"></vue-datepicker>
        <button @click="filterByDate">Filtrar</button>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from "vue";
  import VueDatepicker from "@vuepic/vue-datepicker";
  import "@vuepic/vue-datepicker/dist/main.css";
  
  export default defineComponent({
    name: "ListaCirurgiasNovo",
  
    components: {
      VueDatepicker,
    },
  
    data() {
      return {
        cirurgias: [] as any[],
        startDate: null as Date | null,
        endDate: null as Date | null,
        filteredCirurgias: [] as any[],
        mostFrequentDoctor: "" as string,
        mostFrequentProcedure: "" as string,
        averageTimeBetweenSurgeries: 0 as number,
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
        const surgeriesCount = this.filteredCirurgias.length;
  
        for (let i = 1; i < surgeriesCount; i++) {
          const startDate = new Date(this.filteredCirurgias[i - 1].RCI_DTHR_FIM);
          const endDate = new Date(this.filteredCirurgias[i].RCI_DTHR_INI);
          const differenceInMinutes =
            (endDate.getTime() - startDate.getTime()) / (1000 * 60); // Diferença em minutos
          totalTime += differenceInMinutes;
        }
  
        // Calcula a média de tempo entre as cirurgias e arredonda para baixo
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
  
        // Conta a frequência de cada procedimento na lista de cirurgias filtrada
        this.filteredCirurgias.forEach((cirurgia) => {
          const procedure = cirurgia.SMK_ROT;
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
  
        // Conta a frequência de cada médico na lista de cirurgias filtrada
        this.filteredCirurgias.forEach((cirurgia) => {
          const doctorName = cirurgia.PSV_APEL_C;
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
          this.filteredCirurgias = this.cirurgias;
          return;
        }
  
        // Filtra as cirurgias pelo intervalo de datas
        this.filteredCirurgias = this.cirurgias.filter((cirurgia) => {
          const cirurgiaDate = new Date(cirurgia.RCI_DTHR_INI);
          return cirurgiaDate >= startDate && cirurgiaDate <= endDate;
        });
        console.log(this.filteredCirurgias)
        this.sortCirurgiasByDateTime(); // Ordena os dados pela data e hora
        this.findMostFrequentDoctor();
        this.findMostFrequentProcedure();
        this.calculateAverageTimeBetweenSurgeries();
        
      },
  
      sortCirurgiasByDateTime() {
        console.log(this.filteredCirurgias)
        this.filteredCirurgias.sort((a, b) => {
          const dateA = new Date(a.RCI_DTHR_INI).getTime();
          const dateB = new Date(b.RCI_DTHR_INI).getTime();
          return dateA - dateB;
          
        });
      },
  
      fetchCirurgias() {
  fetch("http://10.1.1.136:3010/cirurgia")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((cirurgia: any, index: any) => {
        cirurgia.id = index + 1;
      });

      // Ordenar os dados pela data de início antes de atribuir
      data.sort((a: any, b: any) => {
        const dateA = new Date(a.RCI_DTHR_INI).getTime();
        const dateB = new Date(b.RCI_DTHR_INI).getTime();
        return dateA - dateB;
      });

      this.cirurgias = data;
      this.filteredCirurgias = data;
      this.findMostFrequentDoctor();
      this.findMostFrequentProcedure();
      this.calculateAverageTimeBetweenSurgeries();
    })
    .catch((error) => {
      console.error("Erro ao obter as cirurgias:", error);
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
    },
  
    mounted() {
      const authData = JSON.parse(localStorage.getItem('authData') || '{}');
    
    if (authData && (authData.category === 'ADM' || authData.category === 'USR')) {
      this.fetchCirurgias(); // Executa a função se for um ADM
    } else {
      // Emite um alerta na tela
      alert('Acesso permitido apenas para usuários do tipo "ADM"');

      // Redireciona para a rota /ticket
      this.$router.push('/tutorial'); // Substitua '/ticket' pela rota desejada
    }
    },
  });
  </script>
  
  <style scoped>
  .container {
    padding: 1rem;
    overflow-y: 800px;
  }
  
  .container-tabela {
    max-height: 600px;
    overflow-y: auto;
  }
  
  .title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .table {
    margin-top: 1rem;
  }
  
  th {
    cursor: pointer;
  }
  </style>
  