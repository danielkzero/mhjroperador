<!-- components/RegistroOperacao.vue -->
<template>
  <div>
    <nav class="nav text-bg-secondary m-0 p-2">
      <a class="nav-link text-white" href="/">
        <h2><i class='bx bx-chevron-left'></i></h2>
      </a>
      <a class="nav-link text-white disabled" href="#">
        <h2>Registro de Operações</h2>
      </a>
    </nav>

    <div v-if="operacaoData">
      <div class="card mb-3 border-0">
        <div class="card-body">
          <div class="row">
            <div class="col-6 col-sm-4">
              <div class="mb-3">
                <label for="ordem_producao">Nº OP</label>
                <input type="text" id="ordem_producao" v-model="operacaoData.data[0].ordem_producao" class="form-control"
                  disabled>
              </div>
            </div>
            <div class="col-6 col-sm-4">
              <div class="mb-3">
                <label for="pedido">Pedido</label>
                <input type="text" id="pedido" v-model="operacaoData.data[0].pedido" class="form-control" disabled>
              </div>
            </div>
            <div class="col-12 col-sm-4">
              <div class="mb-3">
                <label for="cliente">Cliente</label>
                <input type="text" id="cliente" v-model="operacaoData.data[0].cliente" class="form-control" disabled>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-sm-2 col-4">
              <div class="mb-3">
                <label for="codigo_produto">Código</label>
                <input type="text" id="codigo_produto" v-model="operacaoData.data[0].codigo_produto" class="form-control"
                  disabled>
              </div>
            </div>
            <div class="col-sm-6 col-8">
              <div class="mb-3">
                <label for="descricao">Descrição</label>
                <input type="text" id="descricao" v-model="operacaoData.data[0].descricao" class="form-control" disabled>
              </div>
            </div>
            <div class="col-sm-2 col-6">
              <div class="mb-3">
                <label for="quantidade_lote">Qtd. Lote</label>
                <input type="text" id="quantidade_lote" v-model="operacaoData.data[0].quantidade_lote"
                  class="form-control" disabled>
              </div>
            </div>
            <div class="col-sm-2 col-6">
              <div class="mb-3">
                <label for="quantidade_pronta">Pronto/Entregue</label>
                <input type="text" id="quantidade_pronta" v-model="operacaoData.data[0].quantidade_pronta"
                  class="form-control" disabled>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-sm-2">
              <div class="mb-3">
                <label for="operacao">Operação</label>
                <input type="text" id="operacao" v-model="operacaoData.data[0].operacao" class="form-control" disabled>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="mb-3">
                <label for="centro_trabalho">Equipamento</label>
                <select v-model="Tid_equipamento" class="form-select text-bg-warning" 
                  name="centro_trabalho" id="centro_trabalho" required>
                  <option v-if="Tid_equipamento === null" selected disabled value="null">Selecione um equipamento</option>
                  <option v-for="(item, index) in equipamentoData" :key="index" :value="item.id">{{ item.nome }}</option>
                </select>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="mb-3">
                <label for="observacao">Observação</label>
                <select v-model="Tid_observacao" class="form-select" :class="disabled == 1 ? 'text-bg-secondary' : 'text-bg-warning'"
                  name="observacao" id="observacao" :disabled="disabled == 1" :required="disabled == 1">
                  <option v-if="Tid_observacao === null" selected disabled value="null">Selecione uma observação</option>
                  <option v-for="(item, index) in observacaoData" :key="index" :value="item.id">{{ item.observacao }}
                  </option>
                </select>
              </div>
            </div>

            <div class="col-sm-2">
              <div class="mb-3">
                <label for="operacao">Qtd. Produzida</label>
                <input v-model="Tquantidade" type="number" id="operacao" class="form-control"
                  :class="disabled == 1 ? 'text-bg-secondary' : 'text-bg-warning'" :disabled="disabled == 1" :required="disabled == 1">
              </div>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col">
              <div class="d-grid gap-2">                
                <template v-if="!show">
                  <button type="button" name="salvar" id="salvar" @click="showModal" class="btn btn-primary">SALVAR</button>
                </template>
                <template v-else>
                  <div class="mb-3">
                    <label for="id_operador" class="form-label">IDENTIFICAÇÃO DO OPERADOR</label>
                    <div class="input-group">
                      <span class="input-group-text"><i class="bx bxs-barcode bx-sm"></i></span>
                      <input ref="idOperadorInput" v-model="Tid_usuario" type="text" id="id_operador" @keydown.enter="iniciarProcesso(operacaoData.data[0].id_historico_ordem_servico, operacaoData.data[0].id_ordem_servico)" class="form-control">
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    <div v-else>
      <p>Nenhum dado disponível.</p>
    </div>    
  </div>
</template>
<script lang="ts">
import { useRoute } from 'vue-router';
import { defineComponent } from 'vue';
import axios from 'axios';
axios.defaults.withCredentials = false;
export default defineComponent({
  data() {
    return {
      show: false,
      operacaoData: null as any | null,
      equipamentoData: null as any[] | null,
      observacaoData: null as any[] | null,
      loading: true,
      error: null as string | null,
      disabled: 1,
      Tid_equipamento: null,
      Tid_observacao: null,
      Tquantidade: 0,
      Tid_usuario: null
    };
  },
  methods: {
    showModal(this: any) {
      this.show = true;
        this.$nextTick(() => {
        this.$refs.idOperadorInput.focus();
      });
    },
    async fetchDetailsFromAPI(this: any, id: string) {
      try {
        const response = await fetch(`https://mhjr.hydradigital.com.br/api/v1/ordem_servico/${id}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar detalhes da operação');
        }
        const data: any = await response.json();
        this.operacaoData = data;
        if (data.data[0].id_historico_equipamento != null) {
          this.Tid_equipamento = data.data[0].id_historico_equipamento;
        }

        if (data.data[0].id_historico_ordem_servico != null) {
          this.disabled = 0;
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
        this.error = 'Erro ao buscar detalhes da operação.';
      }
    },

    async fetchEquipamentoFromAPI(this: any) {
      try {
        const response = await fetch(`https://mhjr.hydradigital.com.br/api/v1/cadastro_equipamento`);
        if (!response.ok) {
          throw new Error('Erro ao buscar equipamentos');
        }
        const data = await response.json();
        this.equipamentoData = { ...data.data };
      } catch (error) {
        console.error('Erro na requisição:', error);
        this.error = 'Erro ao buscar equipamentos.';
      }
    },

    async fetchObservacaoFromAPI(this: any) {
      try {
        const response = await fetch(`https://mhjr.hydradigital.com.br/api/v1/cadastro_observacao`);
        if (!response.ok) {
          throw new Error('Erro ao buscar Observações');
        }
        const data = await response.json();
        this.observacaoData = { ...data.data };
      } catch (error) {
        console.error('Erro na requisição:', error);
        this.error = 'Erro ao buscar Observações.';
      }
    },
    async iniciarProcesso(id: string, id_ordem_servico: string) {
      try {
        if (this.Tid_equipamento == null) {
          alert("Selecione um equipamento!");
          return true;
        }

        if (this.Tid_observacao == null && id != null) {
          alert("Selecione uma observação!");
          return true;
        }

        const requestData = {
          id_ordem_servico: id_ordem_servico,
          id_equipamento: this.Tid_equipamento,
          id_observacao: id == null ? 1 : this.Tid_observacao,
          id_usuario: this.Tid_usuario,
          quantidade: this.Tquantidade,
          data: new Date()
        };
        

        const response = await axios.post('https://mhjr.hydradigital.com.br/api/v1/cadastro_historico_servico', requestData, {
          headers: {
            'Content-Type': 'application/json'
          },
        });
        if (response.status == 200) {
          alert('Registro enviado com sucesso!');
          this.$router.push("/");
        }

      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    }
  },
  async created(this: any) {
    const route = useRoute();
    if (route.query.id) {
      try {
        await Promise.all([
          this.fetchDetailsFromAPI(route.query.id as string),
          this.fetchEquipamentoFromAPI(),
          this.fetchObservacaoFromAPI(),
        ]);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        this.error = 'Erro ao buscar dados.';
      } finally {
        this.loading = false;
      }
    }
  },
});

</script>
