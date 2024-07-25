<template>
  <header>
    <div class="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom">
      <span class="fs-4">Registro de Operações</span>
    </div>

    <div class="p-3 pb-md-4 mx-auto text-center">
      <div class="mb-3">
        <label for="id_ordem_servico" class="form-label">
          ORDEM DE SERVIÇO
        </label>
        <div class="input-group">
          <span class="input-group-text">
            <i class="bx bxs-barcode bx-sm"></i>
          </span>
          <input type="text" id="id_ordem_servico" class="form-control" ref="ordemServico"
            @keydown.enter="buscarOrdemServico" />
        </div>
      </div>
    </div>


    <div class="p-3 pb-md-4 mx-auto">
      <div class="mb-3">
        <label for="id_ordem_servico" class="form-label">
          EM ABERTO
        </label>
        
        <div v-for="(row, i) in listaOSAberto" :key="i" class="card my-2 p-3">          
          <div class="row">
            <div class="col-sm-2 col-2">
              <div><small class="text-muted">ordem de serviço</small></div>
              {{ row.id_ordem_servico }}
            </div>
            <div class="col-sm-4 col-4">
              <div><small class="text-muted">{{ row.codigo_produto }}</small></div>
              {{ row.produto }}
            </div>
            <div class="col-sm-2 col-2">
              <div><small class="text-muted">colaborador</small></div>
              {{ row.nome }}
            </div>
            <div class="col-sm-2 col-2">
              <div><small class="text-muted">cadastrado em</small></div>
              {{ formatData(row.data) }}
            </div>
            <div class="col-sm-2 col-2">
              <div class="d-grid gap-2">
                <a :href="'/registro-de-operacao?id='+row.id_ordem_servico" class="btn btn-primary btn-lg" type="button">Fechar OS</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import moment from 'moment';
axios.defaults.withCredentials = false;
export default defineComponent({
  data() {
    return {
      listaOSAberto: []
    }
  },
  setup() {
    const router = useRouter();

    const buscarOrdemServico = async (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        const idOrdemServico = (event.target as HTMLInputElement).value;
        router.push({ name: 'RegistroDeOperacao', query: { id: idOrdemServico } });
      }
    };
    return { buscarOrdemServico };
  },
  methods: {
    async listarOrdemServicoEmAberto() {
      
      const response = await axios.get('https://mhjr.hydradigital.com.br/api/v1/ordem_servico_ativa', {
          headers: {
            'Content-Type': 'application/json'
          },
        });
        if (response.status == 200) {
          this.listaOSAberto = response.data.data;
        }

    },
    formatData(valor: string) {
      return moment(valor, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm:ss');
    }
  },
  mounted() {
    (this.$refs.ordemServico as HTMLInputElement).focus();
    this.listarOrdemServicoEmAberto();
  },
});
</script>
