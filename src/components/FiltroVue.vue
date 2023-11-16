<template>
  <div class="container max-w-screen-xl">
    <h1 class="title">Relatório de Pedidos</h1>

    <!-- Filtro por data -->
    <div class="columns filtro-data is-flex">
  <div class="column is-three-fifths">
    <div class="box justify-center">
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">Filtrar por data:</label>
            </div>
            <div class="field-body">
              <div class="field is-grouped">
                <div class="control">
                  <input class="input" type="date" v-model="startDate" />
                </div>
                <div class="control">
                  <input class="input" type="date" v-model="endDate" />
                </div>
                <div class="control">
                  <button class="button is-primary" @click="filterByDate">Filtrar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-one-fifth">
        <div class="box resultado">
          <p>Total de pedidos: {{ filteredData.length }}</p>
          <p>Total em valor: R${{ getTotalValue() }}</p>
          <!-- <p>Clientes únicos: {{ getUniqueCustomers() }}</p>
          <p>Clientes que compraram duas vezes ou mais: {{ getRepeatCustomers() }}</p> -->
        </div>
      </div>
    </div>

    <!-- Tabela de dados -->
    <div class="table-container" v-if="filteredData.length > 0">
      <table class="table is-bordered is-four-fifths box-table">
        <thead>
          <tr>
            <th>Nome do Cliente</th>
            <th>Serviço</th>
            <th>Valor</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredData" :key="item._id">
            <td>{{ item.nomeCliente }}</td>
            <td>{{ item.servico }}</td>
            <td>{{ item.valor }}</td>
            <td>{{ item.data }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mensagem quando não há dados filtrados -->
    <p v-if="filteredData.length === 0">Nenhum dado encontrado com os filtros selecionados.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import ICliente from '@/interfaces/ICliente';
function compareDates(date1: string, date2: string) {
  const parts1 = date1.split('/');
  const parts2 = date2.split('/');
  const year1 = parseInt(parts1[2]);
  const month1 = parseInt(parts1[1]);
  const day1 = parseInt(parts1[0]);
  const year2 = parseInt(parts2[2]);
  const month2 = parseInt(parts2[1]);
  const day2 = parseInt(parts2[0]);

  if (year1 !== year2) {
    return year1 - year2;
  }

  if (month1 !== month2) {
    return month1 - month2;
  }

  return day1 - day2;
}

export default defineComponent({
  name: "FiltroVue",
  data() {
    return {
      startDate: '',
      endDate: '',
      data: [] as ICliente[],
      filteredData: [] as ICliente[]
    };
  },
  methods: {
    
    fetchDados(): void {
      fetch('http://10.1.1.6:3010/cadastroticketget')
        .then(response => response.json())
        .then((data: ICliente[]) => {
          this.data = data.map(item => ({
            ...item,
            data: item.data.replace(/-/g, '/')
          }));
          this.filteredData = this.data;
        })
        .catch(error => {
          console.error('Erro ao obter os dados:', error);
        });
    },
    filterByDate(): void {
      if (this.startDate && this.endDate) {
        const startDateParts = this.startDate.split('-');
        const endDateParts = this.endDate.split('-');
        const startYear = parseInt(startDateParts[0]);
        const startMonth = parseInt(startDateParts[1]);
        const startDay = parseInt(startDateParts[2]);
        const endYear = parseInt(endDateParts[0]);
        const endMonth = parseInt(endDateParts[1]);
        const endDay = parseInt(endDateParts[2]);

        this.filteredData = this.data.filter((item: ICliente) => {
          const itemDateParts = item.data.split('/');
          const itemYear = parseInt(itemDateParts[2]);
          const itemMonth = parseInt(itemDateParts[1]);
          const itemDay = parseInt(itemDateParts[0]);

          return (
            itemYear >= startYear &&
            itemYear <= endYear &&
            itemMonth >= startMonth &&
            itemMonth <= endMonth &&
            itemDay >= startDay &&
            itemDay <= endDay
          );
        });

        // Sort the filtered data based on the 'data' field in ascending order
        this.filteredData.sort((item1, item2) => compareDates(item1.data, item2.data));
      } else {
        this.filteredData = this.data;
      }
    },
    getTotalValue(): number {
      return this.filteredData.reduce((total: number, item: ICliente) => total + item.valor, 0);
    },
    getUniqueCustomers(): number {
      const uniqueCustomers = new Set<string>();
      this.filteredData.forEach((item: ICliente) => uniqueCustomers.add(item.nomeCliente));
      return uniqueCustomers.size;
    },
    getRepeatCustomers(): number {
      const customerCounts: Record<string, number> = {};
      this.filteredData.forEach((item: ICliente) => {
        if (customerCounts[item.nomeCliente]) {
          customerCounts[item.nomeCliente]++;
        } else {
          customerCounts[item.nomeCliente] = 1;
        }
      });

      return Object.values(customerCounts).filter((count: number) => count >= 2).length;
    }
    
  },
  mounted() {
    this.fetchDados();
  }
});
</script>

<style scoped>
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

.container {
  padding: 1.25rem;
  
}

.columns {
  margin-bottom: 1.5rem;
}

.column {
  padding-right: 0.75rem;
}

.box {
  background-color: aliceblue;
  padding: 1.25rem;
  overflow: auto;
  border: 1px solid #e96d13;
}
.box-table {
  background-color: aliceblue;
  padding: 1.25rem;
  overflow: auto;
  border: 1px solid #e96d13;
}
.title {
  color: #e96d13;
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.field {
  margin-bottom: 1.5rem;
}

.label {
  color: #e96d13;
  font-weight: bold;
  font-size: 1rem;
}

.table-container {
  margin-top: 1.5rem;
  
  max-height: calc(100vh - 300px);
  overflow-y: auto
}

.table {
  width: 100%;
  table-layout: fixed;
}

.table td {
  padding: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.table.is-bordered {
  border: 1px solid #e96d13;
}

.table-header {
  background-color: #e96d13;
  color: #fff;
  
}

p {
  margin-bottom: 0.5rem;
}
</style>