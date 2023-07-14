<template>
    <div class="container">
      <h1 class="title">Relatório de Pedidos</h1>
  
      <!-- Filtro por data -->
      <div class="columns">
      <div class="column is-three-fifths">
        <div class="box">
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">Filtrar por data:</label>
            </div>
            <div class="field-body">
              <div class="field is-grouped">
                <div class="control">
                  <input class="input" type="date" v-model="startDate">
                </div>
                <div class="control">
                  <input class="input" type="date" v-model="endDate">
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
        <div class="box">
          <p>Total de pedidos: {{ filteredData.length }}</p>
          <p>Total em dinheiro: R${{ getTotalValue() }}</p>
          <!-- <p>Clientes únicos: {{ getUniqueCustomers() }}</p>
          <p>Clientes que compraram duas vezes ou mais: {{ getRepeatCustomers() }}</p> -->
        </div>
      </div>
    </div>

      
  
      <!-- Tabela de dados -->
      <div class="table-container" v-if="filteredData.length > 0">
        <table class="table is-bordered is-four-fifths box">
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
import { ref, onMounted } from 'vue';
import ICliente from '@/interfaces/ICliente';


export default {
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
      fetch('http://localhost:3010/cadastroclientesget')
        .then(response => response.json())
        .then(data => {
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

    this.filteredData = this.data.filter(item => {
      const itemDateParts = item.data.split('/');
      const itemYear = parseInt(itemDateParts[2]);
      const itemMonth = parseInt(itemDateParts[1]);
      const itemDay = parseInt(itemDateParts[0]);

      return (
        itemYear >= startYear && itemYear <= endYear &&
        itemMonth >= startMonth && itemMonth <= endMonth &&
        itemDay >= startDay && itemDay <= endDay
      );
    });
  } else {
    this.filteredData = this.data;
  }
},


  
    getTotalValue(): number {
      return this.filteredData.reduce((total, item) => total + item.valor, 0);
    },
    getUniqueCustomers(): number {
      const uniqueCustomers = new Set<string>();
      this.filteredData.forEach(item => uniqueCustomers.add(item.nomeCliente));
      return uniqueCustomers.size;
    },
    getRepeatCustomers(): number {
      const customerCounts: Record<string, number> = {};
      this.filteredData.forEach(item => {
        if (customerCounts[item.nomeCliente]) {
          customerCounts[item.nomeCliente]++;
        } else {
          customerCounts[item.nomeCliente] = 1;
        }
      });
      
      return Object.values(customerCounts).filter(count => count >= 2).length;
    }
  },
  mounted() {
    this.fetchDados();
  }
};
</script>



<style scoped>
.container {
  padding: 1.25rem;
}

.box {
    background-color: aliceblue;
    padding: 1.25rem;
    max-width: 300x;
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

.table {
  margin-top: 1.5rem;
  overflow: auto;
}

.table td {
  padding: 0.5rem;
}

.table.is-bordered {
  border: 1px solid #e96d13;
}

.table.is-fullwidth {
  width: 100%;
}

.button.is-primary {
  background-color: #e96d13;
}

.button.is-primary:hover {
  background-color: #d24c0f;
}

p {
  margin-bottom: 0.5rem;
}


</style>
