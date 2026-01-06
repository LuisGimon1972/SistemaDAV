<template>
  <div class="layout-principal">
    <!-- TOPO -->
    <div class="painel-superior">
      <img :src="logo" alt="Logo" class="logo" />
      <label class="textonome">Controle DAV System</label>
      <div class="perfil">
        <label class="texto">Dev. Luis Manuel Gimón</label>
        <img :src="usuario" alt="Usuario" class="usuariodev" />
      </div>
    </div>

    <!-- CONTEÚDO -->
    <div class="layout-conteudo" style="min-height: 80vh">
      <!-- MENU LATERAL -->
      <div class="painel-esquerdo" style="width: 305px; padding: 20px">
        <q-item
          clickable
          :class="{ 'menu-ativo': menuAtivo === 'cadastro' }"
          @click="
            () => {
              ocultar()
              mostrarCadastro = true
              menuAtivo = 'cadastro'
            }
          "
        >
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section> Cadastro de Cliente </q-item-section>
        </q-item>

        <q-item
          clickable
          :active="menuAtivo === 'listar'"
          active-class="item-ativo"
          @click="
            () => {
              ocultar()
              menuAtivo = 'listar'
              listarClientes = true
            }
          "
        >
          <q-item-section avatar>
            <q-icon name="format_list_bulleted" />
          </q-item-section>
          <q-item-section>Listagem de Clientes</q-item-section>
        </q-item>
        <q-item
          clickable
          :active="menuAtivo === 'cadastroitem'"
          active-class="item-ativo"
          @click="
            () => {
              ocultar()
              menuAtivo = 'cadastroitem'
              mostrarItens = true
            }
          "
        >
          <q-item-section avatar>
            <q-icon name="inventory_2" />
          </q-item-section>
          <q-item-section> Cadastro de Item </q-item-section>
        </q-item>

        <q-item
          clickable
          :active="menuAtivo === 'listaitem'"
          active-class="item-ativo"
          @click="
            () => {
              ocultar()
              menuAtivo = 'listaitem'
              listarItens = true
            }
          "
        >
          <q-item-section avatar>
            <q-icon name="format_list_bulleted" />
          </q-item-section>
          <q-item-section> Listagem de Itens </q-item-section>
        </q-item>

        <!-- ITEM PRINCIPAL -->
        <q-item-label header class="text-white text-weight-bold text-center q-pa-sm border-dav">
          Gestão de DAV
        </q-item-label>

        <q-item
          clickable
          :active="menuAtivo === 'listarelas'"
          active-class="item-ativo"
          @click="
            () => {
              davmenuOs = false
              davmenuOrcamento = !davmenuOrcamento
              menuAtivo = 'listarelas'
            }
          "
        >
          <q-item-section avatar>
            <q-icon name="description" />
          </q-item-section>
          <q-item-section>Orçamento</q-item-section>
          <q-item-section side>
            <q-icon :name="davmenuOrcamento ? 'expand_less' : 'expand_more'" />
          </q-item-section>
        </q-item>

        <!-- SUBMENU (ANIMADO) -->
        <q-slide-transition>
          <div v-if="davmenuOrcamento">
            <q-item
              clickable
              :active="menuAtivo === 'criaorca'"
              active-class="item-ativo"
              @click="
                () => {
                  ocultar()
                  limparOrcamento()
                  trocartitulo()
                  item.status = 'ABERTO'
                  entrarOrcamento = false
                  desabilitarTudo = false
                  idOrcamentoEdicao = false
                  menuAtivo = 'criaorca'
                  criarOrcamento = true
                }
              "
            >
              <q-item-section avatar>
                <q-icon name="note_add" />
              </q-item-section>
              <q-item-section> Cadastro de Orçamento </q-item-section>
            </q-item>

            <q-item
              clickable
              :active="menuAtivo === 'listaorca'"
              active-class="item-ativo"
              @click="
                () => {
                  ocultar()
                  entrarOrcamento = true
                  menuAtivo = 'listaorca'
                  listarOrcamento = true
                }
              "
            >
              <q-item-section avatar>
                <q-icon name="format_list_bulleted" />
              </q-item-section>
              <q-item-section> Listagem Orçamentos </q-item-section>
            </q-item>

            <q-item
              clickable
              :active="menuAtivo === 'listaorpa'"
              active-class="item-ativo"
              class="q-ml-lg"
              @click="
                () => {
                  ocultar()
                  abrirRelatorioPeriodo()
                  menuAtivo = 'listaorpa'
                }
              "
            >
              <q-item-section avatar>
                <q-icon name="event_note" />
              </q-item-section>
              <q-item-section>Relatório por Período</q-item-section>
            </q-item>

            <q-item
              clickable
              :active="menuAtivo === 'listastatus'"
              active-class="item-ativo"
              class="q-ml-lg"
              @click="
                () => {
                  ocultar()
                  abrirRelatorioStatus()
                  menuAtivo = 'listastatus'
                }
              "
            >
              <q-item-section avatar>
                <q-icon name="format_list_bulleted" />
              </q-item-section>
              <q-item-section>Relatório pelo Status</q-item-section>
            </q-item>

            <!-- Relatório geral -->
            <q-item
              clickable
              :active="menuAtivo === 'listageral'"
              active-class="item-ativo"
              class="q-ml-lg"
              @click="
                () => {
                  ocultar()
                  abrirRelatorioGeral()
                  menuAtivo = 'listageral'
                }
              "
            >
              <q-item-section avatar>
                <q-icon name="format_list_bulleted" />
              </q-item-section>
              <q-item-section>Relatório Total</q-item-section>
            </q-item>
          </div>
        </q-slide-transition>

        <!-- SUBMENU (ANIMADO OS) -->

        <q-item
          clickable
          :active="menuAtivo === 'submenuos'"
          active-class="item-ativo"
          @click="
            () => {
              davmenuOs = !davmenuOs
              davmenuOrcamento = false
              menuAtivo = 'submenuos'
            }
          "
        >
          <q-item-section avatar>
            <q-icon name="engineering" />
          </q-item-section>

          <q-item-section>Ordem de Serviço</q-item-section>
          <q-item-section side>
            <q-icon :name="davmenuOs ? 'expand_less' : 'expand_more'" />
          </q-item-section>
        </q-item>

        <q-slide-transition>
          <div v-if="davmenuOs">
            <q-item
              clickable
              :class="{ 'menu-ativo': menuAtivo === 'cadastroser' }"
              @click="
                () => {
                  ocultar()
                  mostrarCadastroser = true
                  menuAtivo = 'cadastroser'
                }
              "
            >
              <q-item-section avatar>
                <q-icon name="engineering" />
              </q-item-section>
              <q-item-section> Cadastro de Serviço </q-item-section>
            </q-item>

            <q-item
              clickable
              :class="{ 'menu-ativo': menuAtivo === 'listadoser' }"
              @click="
                () => {
                  ocultar()
                  mostrarservicos = true
                  menuAtivo = 'listadoser'
                }
              "
            >
              <q-item-section avatar>
                <q-icon name="engineering" />
              </q-item-section>
              <q-item-section> Listagem de Serviços </q-item-section>
            </q-item>

            <q-item
              clickable
              :class="{ 'menu-ativo': menuAtivo === 'cadastrooser' }"
              @click="
                () => {
                  ocultar()
                  limparOs()
                  trocartituloOs()
                  cadastraros = true
                  menuAtivo = 'cadastrooser'
                }
              "
            >
              <q-item-section avatar>
                <q-icon name="engineering" />
              </q-item-section>
              <q-item-section> Cadastro de O.S. </q-item-section>
            </q-item>
            <q-item
              clickable
              :class="{ 'menu-ativo': menuAtivo === 'listadoOs' }"
              @click="
                () => {
                  ocultar()
                  trocartituloOs()
                  listagemos = true
                  menuAtivo = 'listadoOs'
                }
              "
            >
              <q-item-section avatar>
                <q-icon name="engineering" />
              </q-item-section>
              <q-item-section> Listagem Os </q-item-section>
            </q-item>
          </div>
        </q-slide-transition>
      </div>
      <!-- CONTEÚDO PRINCIPAL -->
      <div class="conteudo" style="flex-grow: 1; padding: 20px">
        <!-- ===================== -->
        <!--     CRIAR ORÇAMENTO   -->
        <!-- ===================== -->

        <div
          v-if="criarOrcamento"
          class="q-pa-md"
          :class="{ 'disabled-container': desabilitarTudo }"
        >
          <!-- TÍTULO -->
          <div style="margin-bottom: 50px" class="text-h4 text-primary q-mb-md">{{ titulo }}</div>

          <!-- SELEÇÃO DO CLIENTE -->
          <div style="margin-bottom: 20px" class="row q-col-gutter-md">
            <!-- SELECT DO CLIENTE -->
            <div class="col-12 col-md-6">
              <q-select
                filled
                v-model="clienteSelecionado"
                :options="clientes"
                option-value="id"
                option-label="nome"
                label="Selecione o cliente"
                emit-value
                map-options
              />
            </div>

            <!-- CPF DO CLIENTE -->
            <div class="col-12 col-md-2">
              <q-input filled v-model="cpfCliente" label="CPF" readonly class="sem-linha" />
            </div>

            <!-- VALIDADE -->
            <div class="col-12 col-md-2">
              <q-input
                filled
                v-model="validade"
                label="Validade do Orçamento"
                readonly
                class="sem-linha"
                @click="abrirCalendario"
              >
                <template #append>
                  <q-icon name="event" class="cursor-pointer" @click="abrirCalendario" />
                </template>

                <q-popup-proxy ref="popupValidade" transition-show="scale" transition-hide="scale">
                  <q-date v-model="validade" mask="DD-MM-YYYY" />
                </q-popup-proxy>
              </q-input>
            </div>
            <div class="col-12 col-md-2">
              <q-select
                filled
                v-model="item.status"
                :options="[
                  { label: 'ABERTO', value: 'ABERTO' },
                  { label: 'EM NEGOCIAÇÃO', value: 'EM NEGOCIAÇÃO' },
                  { label: 'FINALIZADO', value: 'FINALIZADO' },
                ]"
                label="Status"
                emit-value
                map-options
                class="sem-linha"
              />
            </div>
          </div>

          <div style="margin-bottom: 20px" class="row q-col-gutter-md">
            <!-- SELECT DO CLIENTE -->
            <div class="col-12 col-md-1">
              <q-input filled v-model="endCep" label="CEP" readonly class="sem-linha" />
            </div>
            <div class="col-12 col-md-3">
              <q-input filled v-model="endCliente" label="Endereço" readonly class="sem-linha" />
            </div>
            <div class="col-12 col-md-2">
              <q-input filled v-model="endBairro" label="Bairro" readonly class="sem-linha" />
            </div>
            <!-- CPF DO CLIENTE -->
            <div class="col-12 col-md-2">
              <q-input filled v-model="telCliente" label="Telefone" readonly class="sem-linha" />
            </div>
            <div class="col-12 col-md-2">
              <q-input filled v-model="celCliente" label="Celular" readonly class="sem-linha" />
            </div>
            <div class="col-12 col-md-2">
              <q-input filled v-model="emailCliente" label="E-mail" readonly class="sem-linha" />
            </div>

            <!-- VALIDADE -->
          </div>

          <q-input
            v-model="buscaItem"
            label="Buscar item"
            @keyup="navegarLista"
            class="input-grande"
          >
            <template #append>
              <q-btn icon="search" @click="buscarItem" flat round />
            </template>
          </q-input>

          <q-list bordered separator v-if="resultadoBusca.length > 0">
            <q-item class="bg-grey-3 text-bold">
              <q-item-section> Nome </q-item-section>
              <q-item-section> Código </q-item-section>
              <q-item-section side> Preço </q-item-section>
            </q-item>

            <!-- LINHAS -->
            <q-item
              v-for="(item, index) in resultadoBusca"
              :key="item.controle ?? index"
              clickable
              @click="adicionarItem(item)"
              :class="{ 'bg-blue-2': index === itemSelecionado }"
            >
              <q-item-section>
                <q-item-label>{{ item.nome ?? '' }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ item.codbarras ?? '' }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-item-label class="text-positive">
                  R$ {{ Number(item.precovenda).toFixed(2) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <q-separator spaced />

          <!-- TABELA DO ORÇAMENTO -->
          <q-table
            title="Itens do Orçamento"
            :rows="itensOrcamento"
            :columns="colunasOrcamento"
            row-key="controle"
            flat
            bordered
          >
            <template #body-cell-quantidade="props">
              <q-td>
                <q-input
                  dense
                  type="number"
                  v-model.number="props.row.quantidade"
                  min="1"
                  style="width: 80px"
                  @update:model-value="atualizarTotais"
                />
              </q-td>
            </template>

            <template #body-cell-acoes="props">
              <q-td class="text-center">
                <q-btn
                  size="sm"
                  color="negative"
                  icon="delete"
                  dense
                  round
                  @click="excluirItemOrç(props.row.controle)"
                >
                  <q-tooltip>Excluir</q-tooltip>
                </q-btn>
              </q-td>
            </template>
            <template #no-data />
          </q-table>

          <q-input
            filled
            v-model="observacao"
            type="textarea"
            autogrow
            label="Observação"
            class="q-mt-md"
            :input-style="{ minHeight: '70px' }"
          />

          <q-input
            filled
            v-model="condicao"
            type="textarea"
            autogrow
            label="Condição de Pagamento"
            class="q-mt-md"
            :input-style="{ minHeight: '70px' }"
          />

          <q-separator spaced />

          <!-- DESCONTO / ACRÉSCIMO -->
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-input
                filled
                v-model.number="desconto"
                type="number"
                label="Desconto (R$)"
                class="label-grande"
                @blur="atualizarTotais"
              />
            </div>

            <div class="col-6">
              <q-input
                filled
                v-model.number="acrescimo"
                type="number"
                label="Acréscimo (R$)"
                class="label-grande"
                ref="acrescimoRef"
              />
            </div>
          </div>

          <q-separator spaced />

          <!-- TOTAL GERAL -->
          <div class="text-h5 text-right q-mb-md">
            Total: <span class="text-positive">R$ {{ totalGeral.toFixed(2) }}</span>
          </div>

          <!-- BOTÃO SALVAR -->
          <q-btn
            :label="modoEdicao ? 'Salvar Alterações' : 'Salvar'"
            color="primary"
            icon="save"
            size="md"
            @click="modoEdicao ? salvarEdicao() : salvarOrcamento()"
          />

          <q-btn
            label="Limpar"
            color="negative"
            icon="delete_sweep"
            size="md"
            @click="limparOrcamento"
            class="q-ml-md"
          />
        </div>

        <!-- =====================      -->
        <!--     CRIAR ORDEM DE SERVIÇO -->
        <!-- =====================      -->

        <div v-if="cadastraros" class="q-pa-md" :class="{ 'disabled-container': desabilitarTudo }">
          <!-- TÍTULO -->
          <div style="margin-bottom: 50px" class="text-h4 text-primary q-mb-md">{{ titulo }}</div>

          <!-- SELEÇÃO DO CLIENTE -->
          <div style="margin-bottom: 20px" class="row q-col-gutter-md">
            <!-- SELECT DO CLIENTE -->
            <div class="col-12 col-md-6">
              <q-select
                filled
                v-model="clienteSelecionado"
                :options="clientes"
                option-value="id"
                option-label="nome"
                label="Selecione o cliente"
                emit-value
                map-options
              />
            </div>

            <!-- CPF DO CLIENTE -->
            <div class="col-12 col-md-3">
              <q-input filled v-model="cpfCliente" label="CPF" readonly class="sem-linha" />
            </div>

            <!-- VALIDADE -->

            <div class="col-12 col-md-3">
              <q-select
                filled
                v-model="item.status"
                :options="[
                  { label: 'ABERTO', value: 'ABERTO' },
                  { label: 'ORÇAMENTO', value: 'ORÇAMENTO' },
                  { label: 'PENDENTE', value: 'PENDENTE' },
                  { label: 'EM ANDAMENTO', value: 'EM ANDAMENTO' },
                  { label: 'LIBERADA', value: 'LIBERADA' },
                  { label: 'PRONTA', value: 'PRONTA' },
                  { label: 'CANCELADA', value: 'CANCELADA' },
                  { label: 'FINALIZADA', value: 'FINALIZADA' },
                ]"
                label="Status"
                emit-value
                map-options
                class="sem-linha"
              />
            </div>
          </div>

          <div style="margin-bottom: 20px" class="row q-col-gutter-md">
            <!-- SELECT DO CLIENTE -->
            <div class="col-12 col-md-1">
              <q-input filled v-model="endCep" label="CEP" readonly class="sem-linha" />
            </div>
            <div class="col-12 col-md-3">
              <q-input filled v-model="endCliente" label="Endereço" readonly class="sem-linha" />
            </div>
            <div class="col-12 col-md-2">
              <q-input filled v-model="endBairro" label="Bairro" readonly class="sem-linha" />
            </div>
            <!-- CPF DO CLIENTE -->
            <div class="col-12 col-md-2">
              <q-input filled v-model="telCliente" label="Telefone" readonly class="sem-linha" />
            </div>
            <div class="col-12 col-md-2">
              <q-input filled v-model="celCliente" label="Celular" readonly class="sem-linha" />
            </div>
            <div class="col-12 col-md-2">
              <q-input filled v-model="emailCliente" label="E-mail" readonly class="sem-linha" />
            </div>

            <!-- VALIDADE -->
          </div>
          <!-- SELECT DO OBJETO / VEÍCULO -->
          <div class="col-12 col-md-4">
            <q-select
              filled
              v-model="objetoSelecionado"
              :options="objetosCliente"
              option-value="id"
              :option-label="
                (obj) =>
                  `${obj.tipo} - ${obj.marca ?? ''} ${obj.modelo ?? ''} (${obj.placaserie ?? obj.numeroserie ?? 'S/N'})`
              "
              label="Selecione o objeto / veículo"
              emit-value
              map-options
              :loading="carregandoObjetos"
              :disable="!clienteSelecionado || objetosCliente.length === 0"
            >
              <template #no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Nenhum objeto cadastrado para este cliente
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <q-input
            v-model="buscaItem"
            label="Buscar item"
            @keyup="navegarLista"
            class="input-grande"
          >
            <template #append>
              <q-btn icon="search" @click="buscarItem" flat round />
            </template>
          </q-input>

          <q-list bordered separator v-if="resultadoBusca.length > 0">
            <q-item class="bg-grey-3 text-bold">
              <q-item-section> Nome </q-item-section>
              <q-item-section> Código </q-item-section>
              <q-item-section side> Preço </q-item-section>
            </q-item>

            <!-- LINHAS -->
            <q-item
              v-for="(item, index) in resultadoBusca"
              :key="item.controle ?? index"
              clickable
              @click="adicionarItemOs(item)"
              :class="{ 'bg-blue-2': index === itemSelecionado }"
            >
              <q-item-section>
                <q-item-label>{{ item.nome ?? '' }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ item.codbarras ?? '' }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-item-label class="text-positive">
                  R$ {{ Number(item.precovenda).toFixed(2) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <q-separator spaced />

          <!-- TABELA ITENS DE SERVICO -->
          <q-table
            title="Itens da Ordem de Serviço"
            :rows="itensOrdemos"
            :columns="colunasOrdemos"
            row-key="controle"
            flat
            bordered
          >
            <template #body-cell-quantidade="props">
              <q-td>
                <q-input
                  dense
                  type="number"
                  v-model.number="props.row.quantidade"
                  min="1"
                  style="width: 80px"
                  @update:model-value="atualizarTotaisOs"
                />
              </q-td>
            </template>

            <template #body-cell-acoes="props">
              <q-td class="text-center">
                <q-btn
                  size="sm"
                  color="negative"
                  icon="delete"
                  dense
                  round
                  @click="excluirItemOrç(props.row.controle)"
                >
                  <q-tooltip>Excluir</q-tooltip>
                </q-btn>
              </q-td>
            </template>
            <template #no-data />
          </q-table>

          <q-input
            filled
            v-model="observacao"
            type="textarea"
            autogrow
            label="Observação"
            class="q-mt-md"
            :input-style="{ minHeight: '70px' }"
          />

          <q-input
            filled
            v-model="condicao"
            type="textarea"
            autogrow
            label="Laudo Técnico"
            class="q-mt-md"
            :input-style="{ minHeight: '70px' }"
          />

          <q-separator spaced />

          <!-- DESCONTO / ACRÉSCIMO -->
          <div class="row q-col-gutter-md">
            <div class="col-4">
              <q-input
                filled
                v-model.number="desconto"
                type="number"
                label="Desconto (R$)"
                class="label-grande"
                @blur="atualizarTotaisOs"
              />
            </div>
            <div class="col-4">
              <q-input
                filled
                v-model.number="acrescimo"
                type="number"
                label="Acréscimo (R$)"
                class="label-grande"
              />
            </div>

            <div class="col-4">
              <q-input
                filled
                v-model.number="adiantamento"
                type="number"
                label="Adiantamento (R$)"
                class="label-grande"
                @blur="atualizarTotaisOs"
              />
            </div>
          </div>

          <q-separator spaced />

          <!-- TOTAL GERAL -->
          <div class="text-h5 text-right q-mb-md">
            Total: <span class="text-positive">R$ {{ totalGeral.toFixed(2) }}</span>
          </div>

          <!-- BOTÃO SALVAR -->
          <q-btn
            :label="modoEdicao ? 'Salvar Alterações' : 'Salvar'"
            color="primary"
            icon="save"
            size="md"
            @click="modoEdicao ? salvarEdicao() : salvarOrdem()"
          />

          <q-btn
            label="Limpar"
            color="negative"
            icon="delete_sweep"
            size="md"
            @click="limparOs"
            class="q-ml-md"
          />
        </div>

        <div id="relatorio-impressao">
          <!-- TODO seu HTML para imprimir -->
        </div>

        <q-dialog v-model="dialogRelatorioPeriodo">
          <q-card class="q-pa-md">
            <div class="text-h6 q-mb-md">Relatório por Período</div>

            <q-input ref="DataInput" v-model="dataInicio" label="Data Inicial" type="date" filled />
            <q-input
              ref="DataInputFim"
              v-model="dataFim"
              label="Data Final"
              type="date"
              filled
              class="q-mt-md"
            />

            <q-btn
              class="q-mt-lg q-mr-md"
              color="primary"
              label="Fechar"
              @click="dialogRelatorioPeriodo = false"
            />

            <q-btn
              class="q-mt-lg"
              color="primary"
              label="Gerar Relatório"
              @click="gerarRelatorio"
            />
          </q-card>
        </q-dialog>

        <div v-show="mostrarFormObjetos" class="q-pa-md">
          <q-btn
            flat
            color="secondary"
            unelevated
            icon="arrow_back"
            label="Voltar ao cadastro do Cliente"
            class="q-mr-sm"
            @click="mostrarFormObjetos = false"
          />

          <h5 class="text-center q-mb-md">Cadastro de Objetos / Veículos</h5>
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-md-3">
              <q-select
                v-model="objetoForm.tipo"
                label="Tipo"
                :options="['VEÍCULO', 'EQUIPAMENTO', 'MÁQUINA', 'OUTRO']"
                dense
                outlined
              />
            </div>

            <div class="col-12 col-md-3">
              <q-input v-model="objetoForm.marca" label="Marca" dense outlined />
            </div>

            <div class="col-12 col-md-3">
              <q-input v-model="objetoForm.modelo" label="Modelo" dense outlined />
            </div>

            <div class="col-12 col-md-2">
              <q-input v-model="objetoForm.ano" label="Ano" type="number" dense outlined />
            </div>

            <div class="col-12 col-md-3">
              <q-input v-model="objetoForm.cor" label="Cor" dense outlined />
            </div>

            <div class="col-12 col-md-3">
              <q-input v-model="objetoForm.placaSerie" label="Placa / Série" dense outlined />
            </div>

            <div class="col-12">
              <q-input
                v-model="objetoForm.observacoes"
                label="Observações"
                type="textarea"
                dense
                outlined
              />
            </div>
          </div>

          <div class="q-mt-md text-center">
            <q-btn label="Adicionar Objeto" color="primary" icon="add" @click="adicionarObjeto" />
          </div>

          <q-separator class="q-my-md" />

          <!-- TABELA -->
          <q-table
            title="Objetos adicionados"
            :rows="objetos"
            :columns="columns"
            row-key="index"
            flat
            bordered
            dense
          >
            <template #body-cell-acao="props">
              <q-td align="center">
                <q-btn
                  icon="delete"
                  color="negative"
                  dense
                  flat
                  @click="removerObjeto(props.rowIndex)"
                />
              </q-td>
            </template>
          </q-table>
        </div>

        <!-- MODULO CADASTRO -->
        <div v-if="mostrarCadastro">
          <q-page padding>
            <q-card class="q-pa-md">
              <q-card-section>
                <div class="text-h4 text-blue-8 q-mb-lg">Cadastro de Clientes</div>
                <q-form @submit.prevent="salvarCliente">
                  <div class="flex gap-2">
                    <div class="col">
                      <q-input
                        ref="cpfInput"
                        outlined
                        color="black"
                        class="w-1/3 dark-border"
                        v-model="cliente.cpf"
                        label="CPF"
                        mask="###.###.###-##"
                      />
                    </div>
                    <div class="col">
                      <q-input
                        ref="nomeInput"
                        outlined
                        color="black"
                        class="w-1/3 dark-border"
                        v-model="cliente.nome"
                        @update:model-value="(val) => (cliente.nome = val.toUpperCase())"
                        label="Nome Completo"
                        maxlength="50"
                      />
                    </div>
                    <div class="col">
                      <q-input
                        outlined
                        color="black"
                        class="w-1/3 dark-border"
                        v-model="cliente.fantasia"
                        @update:model-value="(val) => (cliente.fantasia = val.toUpperCase())"
                        label="Nome Fantasia"
                        maxlength="50"
                      />
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <div style="width: 10%">
                      <q-input
                        ref="cepInput"
                        outlined
                        color="black"
                        class="dark-border"
                        v-model="cliente.cep"
                        label="CEP"
                        mask="#####-###"
                        @update:model-value="buscarCep"
                      />
                    </div>
                    <div style="width: 40%">
                      <q-input
                        outlined
                        color="black"
                        class="w-1/3 dark-border"
                        v-model="cliente.endereco"
                        label="Endereço"
                        @keydown.prevent
                      />
                    </div>
                    <div style="width: 25%">
                      <q-input
                        outlined
                        color="black"
                        class="w-1/3 dark-border"
                        v-model="cliente.bairro"
                        @update:model-value="(val) => (cliente.bairro = val.toUpperCase())"
                        label="Bairro"
                        @keydown.prevent
                      />
                    </div>
                    <div style="width: 25%">
                      <q-input
                        outlined
                        color="black"
                        class="w-1/3 dark-border"
                        v-model="cliente.email"
                        @update:model-value="(val) => (cliente.email = val.toUpperCase())"
                        label="Email"
                        maxlength="30"
                      />
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <div class="col">
                      <q-input
                        outlined
                        color="black"
                        class="w-1/3 dark-border"
                        v-model="cliente.telefone"
                        label="Telefone"
                        mask="(##)####.####"
                      />
                    </div>
                    <div class="col">
                      <q-input
                        outlined
                        color="black"
                        class="w-1/3 dark-border"
                        v-model="cliente.celular"
                        label="Celular"
                        mask="(##)#####.####"
                      />
                    </div>
                    <div class="col">
                      <q-input
                        ref="limiteInput"
                        outlined
                        color="black"
                        class="w-1/3 dark-border"
                        v-model.number="cliente.limite"
                        label="Limite de Crédito"
                        type="number"
                        @input="validarDecimal('limite')"
                      />
                    </div>
                  </div>
                  <div class="q-gutter-md q-mt-md text-center">
                    <q-btn label="Salvar" type="submit" color="primary" icon="save" />
                    <q-btn label="Limpar" flat icon="refresh" @click="limparFormulario" />
                    <q-btn
                      color="secondary"
                      icon="directions_car"
                      :label="`Objetos / Veículos (${objetos.length})`"
                      @click="mostrarFormObjetos = !mostrarFormObjetos"
                    />
                  </div>
                </q-form>
              </q-card-section>
            </q-card>
          </q-page>
        </div>

        <div v-if="listarOrcamento">
          <q-table
            title="Listagem de Orçamentos"
            :rows="orcamentos"
            :columns="colunasOrcamentosg"
            row-key="id"
            class="q-mt-md"
            dense
            title-class="text-h4 text-primary q-pa-md"
            :pagination="{ page: 1, rowsPerPage: 14 }"
          >
            <template v-slot:body-cell-acoes="props">
              <q-td align="center">
                <q-btn
                  size="sm"
                  color="warning"
                  icon="edit"
                  @click="((entrarOrcamento = true), editarOrcamento(props.row))"
                />
                <q-btn
                  size="sm"
                  color="negative"
                  icon="delete"
                  @click="excluirOrcamento(props.row.id)"
                />
                <q-btn
                  size="sm"
                  color="blue"
                  icon="visibility"
                  @click="((entrarOrcamento = true), verOrcamento(props.row))"
                />
                <q-btn
                  size="sm"
                  color="positive"
                  icon="print"
                  @click="imprimirOrcamento(props.row.id)"
                />
              </q-td>
            </template>
          </q-table>
        </div>

        <div v-if="listagemos">
          <q-table
            title="Listagem de Ordens de Serviço"
            :rows="ordensServico"
            :columns="colunasOs"
            row-key="id"
            class="q-mt-md"
            dense
            title-class="text-h4 text-primary q-pa-md"
            :pagination="{ page: 1, rowsPerPage: 14 }"
          >
            <template v-slot:body-cell-acoes="props">
              <q-td align="center">
                <q-btn size="sm" color="warning" icon="edit" @click="editarOs(props.row)" />

                <q-btn size="sm" color="negative" icon="delete" @click="excluirOs(props.row.id)" />

                <q-btn size="sm" color="blue" icon="visibility" @click="verOs(props.row)" />

                <q-btn size="sm" color="positive" icon="print" @click="imprimirOs(props.row.id)" />
              </q-td>
            </template>
          </q-table>
        </div>

        <!-- LISTAR CLIENTES -->
        <div v-if="listarClientes">
          <q-table
            title="Listagem de Clientes"
            :rows="clientes"
            :columns="colunas"
            row-key="id"
            class="q-mt-md"
            dense
            title-class="text-h4 text-primary q-pa-md"
            :pagination="{ page: 1, rowsPerPage: 14 }"
          >
            <template v-slot:body-cell-acoes="props">
              <q-td align="center">
                <q-btn
                  size="sm"
                  color="warning"
                  icon="edit"
                  @click="(editarCliente(props.row), (mostrarCadastro = true))"
                />
                <q-btn
                  size="sm"
                  color="negative"
                  icon="delete"
                  @click="excluirCliente(props.row.id)"
                />
              </q-td>
            </template>
          </q-table>
        </div>

        <div v-if="mostrarservicos">
          <q-table
            title="Listagem de Serviços"
            :rows="servicos"
            :columns="colunaser"
            row-key="id"
            class="q-mt-md"
            dense
            title-class="text-h4 text-primary q-pa-md"
            :pagination="{ page: 1, rowsPerPage: 14 }"
          >
            <template v-slot:body-cell-acoes="props">
              <q-td align="center">
                <q-btn
                  size="sm"
                  color="warning"
                  icon="edit"
                  @click="(editarServico(props.row), ocultar(), (mostrarCadastroser = true))"
                />
                <q-btn
                  size="sm"
                  color="negative"
                  icon="delete"
                  @click="excluirItem(props.row.controle)"
                />
              </q-td>
            </template>
          </q-table>
        </div>

        <!-- CADASTRO ITENS -->
        <div v-if="mostrarItens">
          <q-page padding>
            <q-card class="q-pa-md">
              <q-card-section>
                <div class="text-h4 text-blue-8 q-mb-lg">Cadastro de Itens</div>
                <q-form @submit.prevent="salvarItem">
                  <div class="flex gap-2">
                    <div class="col">
                      <q-input
                        ref="codInput"
                        outlined
                        color="black"
                        v-model="item.codbarras"
                        label="Código de barras"
                        type="text"
                        mask="#############"
                        class="w-1/3 dark-border"
                      />
                    </div>

                    <div class="col">
                      <q-input
                        ref="nomeiInput"
                        outlined
                        color="black"
                        :model-value="item.nome"
                        @update:model-value="(val) => (item.nome = val.toUpperCase())"
                        label="Nome do item"
                        maxlength="100"
                        class="w-1/3 thick-border"
                      />
                    </div>
                    <div class="col">
                      <q-input
                        outlined
                        color="black"
                        v-model="item.grupo"
                        @update:model-value="(val) => (item.grupo = val.toUpperCase())"
                        label="Grupo do item"
                        maxlength="100"
                        class="w-1/3 thick-border"
                      />
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <div class="col">
                      <q-input
                        outlined
                        color="black"
                        v-model="item.marca"
                        @update:model-value="(val) => (item.marca = val.toUpperCase())"
                        label="Marca do item"
                        maxlength="100"
                        class="w-1/3 thick-border"
                      />
                    </div>
                    <div class="col">
                      <q-input
                        ref="quanInput"
                        outlined
                        color="black"
                        v-model.number="item.quantidade"
                        label="Quantidade"
                        type="number"
                        @input="validarDecimal('quantidade')"
                        class="w-1/3 thick-border"
                      />
                    </div>
                    <div class="col">
                      <q-input
                        ref="custoInput"
                        outlined
                        color="black"
                        v-model.number="item.precocusto"
                        label="Preço de Custo"
                        type="number"
                        @input="validarDecimal('precocusto')"
                        class="w-1/3 thick-border"
                      />
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <div class="col">
                      <q-input
                        outlined
                        color="black"
                        v-model.number="item.perlucro"
                        label="% de lucro"
                        type="number"
                        @input="validarDecimal('perlucro')"
                        class="w-1/3 thick-border"
                      />
                    </div>
                    <div class="col">
                      <q-input
                        ref="vendaInput"
                        outlined
                        color="black"
                        v-model.number="item.precovenda"
                        label="Preço de Venda"
                        type="number"
                        @input="validarDecimal('precovenda')"
                        class="w-1/3 thick-border"
                      />
                    </div>
                    <div class="col">
                      <q-input
                        ref="vendaInput"
                        outlined
                        color="black"
                        v-model.number="item.revenda"
                        label="Preço de Revenda"
                        type="number"
                        @input="validarDecimal('revenda')"
                        class="w-1/3 thick-border"
                      />
                    </div>
                  </div>
                  <div class="q-gutter-md q-mt-md">
                    <q-btn label="Salvar" type="submit" color="primary" />
                    <q-btn label="Limpar" flat @click="limparFormularioI" />
                  </div>
                </q-form>
              </q-card-section>
            </q-card>
          </q-page>
        </div>

        <div v-if="mostrarCadastroser">
          <q-page padding>
            <q-card class="q-pa-md">
              <q-card-section>
                <div class="text-h4 text-blue-8 q-mb-lg">Cadastro de Serviços</div>
                <q-form @submit.prevent="salvarServico">
                  <div class="flex gap-2">
                    <div class="col">
                      <q-input
                        ref="nomeser"
                        outlined
                        color="black"
                        :model-value="item.nome"
                        @update:model-value="(val) => (item.nome = val.toUpperCase())"
                        label="Descriçao do serviço"
                        maxlength="100"
                        class="w-1/3 thick-border"
                      />
                    </div>
                    <div class="col">
                      <q-input
                        outlined
                        color="black"
                        v-model="item.tipo"
                        @update:model-value="(val) => (item.grupo = val.toUpperCase())"
                        label="Tipo de serviço"
                        maxlength="100"
                        class="w-1/3 thick-border"
                      />
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <div class="col">
                      <q-input
                        outlined
                        color="black"
                        v-model="item.categoria"
                        @update:model-value="(val) => (item.marca = val.toUpperCase())"
                        label="Categoria do serviço"
                        maxlength="100"
                        class="w-1/3 thick-border"
                      />
                    </div>
                    <div class="col">
                      <q-input
                        ref="vendaser"
                        outlined
                        color="black"
                        v-model.number="precovendaser"
                        label="Preço do Serviço"
                        type="number"
                        @input="validarDecimal('precovenda')"
                        class="w-1/3 thick-border"
                      />
                    </div>
                    <div class="col">
                      <q-input
                        ref="duracaoser"
                        outlined
                        color="black"
                        v-model="duracaoHhmm"
                        label="Duração do Serviço"
                        mask="##:##"
                        fill-mask
                        hint="HH:mm"
                        class="w-1/3 thick-border"
                      />
                    </div>
                  </div>
                  <div class="q-gutter-md q-mt-md">
                    <q-btn label="Salvar" type="submit" color="primary" />
                    <q-btn label="Limpar" flat @click="limparFormularioSer" />
                  </div>
                </q-form>
              </q-card-section>
            </q-card>
          </q-page>
        </div>
        <!-- LISTAR ITENS -->
        <div v-if="listarItens">
          <q-table
            title="Listagem de Produtos"
            :rows="itens"
            :columns="colunasi"
            row-key="controle"
            class="q-mt-md"
            dense
            title-class="text-h4 text-primary q-pa-md"
            :pagination="{ page: 1, rowsPerPage: 14 }"
          >
            <template v-slot:body-cell-acoes="props">
              <q-td :props="props" class="text-center">
                <q-btn
                  size="sm"
                  color="warning"
                  icon="edit"
                  @click="(editarItem(props.row), (mostrarItens = true))"
                />
                <q-btn
                  size="sm"
                  color="negative"
                  icon="delete"
                  @click="excluirItem(props.row.controle)"
                />
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
    </div>
  </div>
  <div id="toast" class="toast" style="display: none"></div>
  <div id="toastv" class="toastv" style="display: none"></div>
</template>
<script setup>
import logo from 'src/assets/logo.png'
import usuario from 'src/assets/usuario.png'
import { imprimirOrcamentoPorId } from 'src/utils/impressao.js'
import {
  gerarRelatorioPeriodo,
  gerarRelatorioGeral,
  gerarRelatorioStatus,
} from 'src/utils/relatorio.js'
import { ref, onMounted, watch } from 'vue'
import novoCliente from 'src/models/Cliente'
import novoItem from 'src/models/Item'
import axios from 'axios'
import { Dialog, Notify } from 'quasar'
import { useQuasar } from 'quasar'
const $q = useQuasar()
const carregaraClientes = async () => {
  try {
    const resp = await fetch('http://localhost:3000/clientes')
    const data = await resp.json()
    clientes.value = data
  } catch (err) {
    console.error('Erro ao carregar clientes:', err)
    $q.notify({ type: 'negative', message: 'Erro ao buscar clientes.' })
  }
}

axios.defaults.baseURL = 'http://localhost:3000'
const API_URL = 'http://localhost:3000'
const cliente = ref(novoCliente())
const clientes = ref([])
const item = ref(novoItem())
const itens = ref([])
const servicos = ref([])
const nomeInput = ref(null)
const nomeser = ref(null)
const vendaser = ref(null)
const duracaoser = ref(null)
const cpfInput = ref(null)
const DataInput = ref(null)
const DataInputFim = ref(null)
const cepInput = ref(null)
const nomeiInput = ref(null)
const limiteInput = ref(null)
const codInput = ref(null)
const quanInput = ref(null)
const custoInput = ref(null),
  vendaInput = ref(null)
const mostrarCadastro = ref(false)
const mostrarCadastroser = ref(false)
const mostrarservicos = ref(false)
const cadastraros = ref(false)
const listagemos = ref(false)
const mostrarItens = ref(false)
const listarItens = ref(false)
const listarClientes = ref(false)
const listarDividas = ref(false)
const resumoDividas = ref(false)
const resultadoBusca = ref([])
const buscaItem = ref('')
const observacao = ref(null)
const condicao = ref(null)
const validade = ref(null)
const menuAtivo = ref(null)
const titulo = ref(null)
const cepcerto = ref(null)

function ocultar() {
  listarDividas.value = false
  mostrarCadastro.value = false
  mostrarCadastroser.value = false
  mostrarservicos.value = false
  listagemos.value = false
  cadastraros.value = false
  listarClientes.value = false
  mostrarItens.value = false
  mostrarFormObjetos.value = false
  listarItens.value = false
  resumoDividas.value = false
  criarOrcamento.value = false
  listarOrcamento.value = false
  dataInicio.value = ''
  dataFim.value = ''
}

function trocartitulo() {
  titulo.value = 'NOVO ORÇAMENTO'
}

function trocartituloOs() {
  titulo.value = 'NOVA ORDEM DE SERVIÇO'
}

const colunas = [
  { name: 'cpf', label: 'CPF', field: 'cpf', align: 'left' },
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left' },
  { name: 'fantasia', label: 'Fantasia', field: 'fantasia', align: 'left' },
  { name: 'endereco', label: 'Endereço', field: 'endereco', align: 'left' },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'telefone', label: 'Telefone', field: 'telefone', align: 'left' },
  { name: 'celular', label: 'Celular', field: 'celular', align: 'left' },
  {
    name: 'limite',
    label: 'Limite de Crédito',
    field: 'limite',
    align: 'right',
    format: (val) => Number(val).toFixed(2),
  },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' },
]

const colunasi = [
  { name: 'codbarras', label: 'Barras', field: 'codbarras', align: 'left' },
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left' },
  { name: 'grupo', label: 'Grupo', field: 'grupo', align: 'left' },
  { name: 'marca', label: 'Marca', field: 'marca', align: 'left' },
  {
    name: 'quantidade',
    label: 'Quantidade',
    field: 'quantidade',
    align: 'right',
    format: (val) => Number(val).toFixed(0),
  },
  {
    name: 'precocusto',
    label: 'Preço de custo',
    field: 'precocusto',
    align: 'right',
    format: (val) => Number(val).toFixed(2),
  },
  {
    name: 'perlucro',
    label: '% de lucro',
    field: 'perlucro',
    align: 'right',
    format: (val) => Number(val).toFixed(2),
  },
  {
    name: 'precovenda',
    label: 'Preço de venda',
    field: 'precovenda',
    align: 'right',
    format: (val) => Number(val).toFixed(2),
  },
  {
    name: 'revenda',
    label: 'Preço de revenda',
    field: 'revenda',
    align: 'right',
    format: (val) => Number(val).toFixed(2),
  },

  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' },
]

const colunaser = [
  { name: 'controle', label: 'Código', field: 'controle', align: 'left' },
  { name: 'nome', label: 'Nome do serviço', field: 'nome', align: 'left' },
  { name: 'tipo', label: 'Tipo de Serviço', field: 'tipo', align: 'left' },
  { name: 'categoria', label: 'Categoria do serviço', field: 'categoria', align: 'left' },
  {
    name: 'precovenda',
    label: 'Preço do Serviço',
    field: 'precovenda',
    align: 'right',
    format: (val) => Number(val).toFixed(2),
  },
  {
    name: 'duracao',
    label: 'Duração',
    field: 'duracao',
    align: 'right',
    format: (val) => decimalParaHhmm(Number(val)),
  },

  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' },
]

const colunasOs = [
  {
    name: 'numeroos',
    label: 'OS',
    field: 'numeroos',
    align: 'left',
    sortable: true,
  },
  {
    name: 'cliente',
    label: 'Cliente',
    field: 'cliente',
    align: 'left',
    sortable: true,
  },
  {
    name: 'dataabertura',
    label: 'Abertura',
    field: 'dataabertura',
    align: 'center',
    sortable: true,
    format: (val) => (val ? new Date(val).toLocaleDateString('pt-BR') : ''),
  },
  {
    name: 'valortotalitem',
    label: 'Total Itens/Serv.',
    field: 'valortotalitem',
    align: 'right',
    format: (val) =>
      Number(val).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
  },
  {
    name: 'desconto',
    label: 'Desconto',
    field: 'desconto',
    align: 'right',
    format: (val) =>
      Number(val).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
  },
  {
    name: 'acrescimo',
    label: 'Acréscimo.',
    field: 'acrescimo',
    align: 'right',
    format: (val) =>
      Number(val).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
  },
  {
    name: 'valortotal',
    label: 'Total',
    field: 'valortotal',
    align: 'right',
    sortable: true,
    format: (val) =>
      Number(val).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'center',
    sortable: true,
  },
  {
    name: 'acoes',
    label: 'Ações',
    field: 'acoes',
    align: 'center',
  },
]

async function carregarClientes() {
  const res = await fetch(`${API_URL}/clientes`)
  clientes.value = await res.json()
}

function bemvinda() {
  const dlg = Dialog.create({
    message: `
    <div class="column items-center" style="padding: 0; margin: 0;">
      <i class="material-icons" style="font-size:28px; color:#1976d2;">waving_hand</i>
      </i>
      <div class="text-body2">Bem-vindo ao Sistema de SG DAV´s!</div>
    </div>
  `,
    html: true,
    class: 'q-pa-sm text-center',
    ok: false,
    cancel: false,
  })
  setTimeout(() => {
    dlg.hide()
  }, 1500)
}

const buscarCep = async (val) => {
  const cep = val.replace(/\D/g, '')

  if (cep.length !== 8) return

  try {
    const res = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)

    if (res.data.erro) {
      showToast('CEP não encontrado ou inválido!', 1000)
      cepcerto.value = false
      return
    }
    //cliente.value.endereco = res.data.logradouro || ''
    //cliente.value.cidade = res.data.localidade || ''
    //cliente.value.estado = res.data.uf || ''
    cliente.value.bairro = res.data.bairro.toUpperCase() || ''
    cliente.value.endereco = res.data.logradouro.toUpperCase() || ''
    cepcerto.value = true
  } catch (err) {
    console.error('Erro ao buscar CEP', err)
    showToast('Erro ao buscar CEP!', 1000)
  }
}

async function salvarCliente() {
  //debugger
  if (!cliente.value.nome || !cliente.value.cpf || !cliente.value.limite) {
    showToast('Preencha todos os campos obrigatórios!', 1000)
    if (!cliente.value.cpf) return cpfInput.value?.focus()
    if (!cliente.value.nome) return nomeInput.value?.focus()
    if (!cliente.value.limite) return limiteInput.value?.focus()
    return
  }
  if (cepcerto.value == false) {
    showToast('Preencha um CEP correito!', 1000)
    cliente.value.cep = ''
    return cepInput.value?.focus()
  }

  if (!cliente.value.id) {
    const clientesExistentes = await fetch(`${API_URL}/clientes`).then((res) => res.json())
    const cpfDuplicado = clientesExistentes.find((c) => c.cpf === cliente.value.cpf)
    if (cpfDuplicado) {
      showToast('Já existe um cliente com este CPF!', 1500)
      return cpfInput.value?.focus()
    }
    const res = await fetch(`${API_URL}/clientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...cliente.value,
        objetos: objetos.value, // ← AQUI
      }),
    })

    const data = await res.json()
    cliente.value.id = data.id

    showToastv('Cliente salvo com sucesso!', 1000)
    limparFormulario()
    carregarClientes()
  } else {
    await fetch(`${API_URL}/clientes/${cliente.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente.value),
    })
    showToastv('Cliente atualizado com sucesso!', 1000)
    limparFormulario()
    carregarClientes()
    ocultar()
    listarClientes.value = true
  }
}

async function excluirCliente(id) {
  Dialog.create({
    title: 'Excluir Cliente',
    message:
      'Tem certeza que deseja excluir esse cliente? Essa ação <b>não poderá ser desfeita</b>.',
    html: true,
    icon: 'warning',
    ok: {
      label: 'Sim, excluir',
      color: 'negative',
      unelevated: true,
    },
    cancel: {
      label: 'Cancelar',
      flat: true,
      color: 'grey-8',
    },
    persistent: true,
  }).onOk(async () => {
    try {
      await fetch(`${API_URL}/clientes/${id}`, { method: 'DELETE' })
      Notify.create({ type: 'positive', message: 'Cliente excluído com sucesso.' })
      carregarClientes()
    } catch (err) {
      console.error('Erro ao excluir cliente:', err)
      Notify.create({ type: 'negative', message: 'Erro ao excluir conta. Verifique a conexão.' })
    }
  })
}

function editarCliente(c) {
  cliente.value = { ...c }
}

function editarServico(i) {
  item.value = {
    ...i,
  }
  precovendaser.value = i.precovenda.toFixed(2)
  duracaoHhmm.value = i.duracao != null ? decimalParaHhmm(Number(i.duracao)) : '00:00'
}

function decimalParaHhmm(valor) {
  const horas = Math.floor(valor)
  const minutos = Math.round((valor - horas) * 60)
  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`
}

function limparFormulario() {
  cliente.value = novoCliente()
  cpfInput.value.focus()
  objetos.value = [] // limpa os objetos
}

watch(
  () => [item.value.precocusto, (item.value.perlucro = 100)],
  ([custo, lucro]) => {
    const c = Number(custo) || 0
    const l = Number(lucro) || 0

    const venda = c + (c * l) / 100

    item.value.precovenda = Number(venda.toFixed(2))
  },
)

watch(
  () => [item.value.precocusto, item.value.precovenda],
  ([custo, venda]) => {
    if (!isNaN(custo) && !isNaN(venda) && custo !== 0) {
      item.value.perlucro = parseFloat((((venda - custo) / custo) * 100).toFixed(2))
    }
  },
)

async function carregarItens() {
  const res = await fetch(`${API_URL}/itens`)
  itens.value = await res.json()
}

async function carregarServicos() {
  const res = await fetch(`${API_URL}/servicos`)
  servicos.value = await res.json()
}

async function salvarItem() {
  if (
    !item.value.nome ||
    !item.value.codbarras ||
    !item.value.quantidade ||
    !item.value.precocusto ||
    !item.value.precovenda
  ) {
    showToast('Preencha todos os campos obrigatórios!', 1000)
    if (!item.value.codbarras) return codInput.value?.focus()
    if (!item.value.nome) return nomeiInput.value?.focus()
    if (!item.value.quantidade) return quanInput.value?.focus()
    if (!item.value.precocusto) return custoInput.value?.focus()
    if (!item.value.precovenda) return vendaInput.value?.focus()
    return
  }

  const resCheck = await fetch(`${API_URL}/itens/buscar-codigo/${item.value.codbarras}`)
  const itemExistente = await resCheck.json()

  if (!item.value.controle && itemExistente) {
    showToast('Código de barras já cadastrado!', 1500)
    return codInput.value?.focus()
  }

  if (item.value.controle && itemExistente && itemExistente.controle !== item.value.controle) {
    showToast('Código de barras já está sendo usado em outro item!', 1500)
    return codInput.value?.focus()
  }

  if (!item.value.controle) {
    const res = await fetch(`${API_URL}/itens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item.value),
    })

    const data = await res.json()
    item.value.controle = data.controle

    showToastv('Produto salvo com sucesso!', 1000)
    limparFormularioI()
    carregarItens()
  } else {
    await fetch(`${API_URL}/itens/${item.value.controle}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item.value),
    })

    showToastv('Produto atualizado com sucesso!', 1000)
    limparFormularioI()
    carregarItens()
    ocultar()
    listarItens.value = true
  }
}

async function salvarServico() {
  duracao.value = hhmmParaReal(duracaoHhmm.value)
  console.log('HH:mm:', duracaoHhmm.value)
  console.log('REAL:', duracao.value)
  if (duracao.value === null) {
    alert('Informe a duração do serviço')
    return
  }
  item.value.duracao = duracao.value
  item.value.precovenda = precovendaser.value
  if (!item.value.nome || !item.value.precovenda || !duracaoHhmm.value) {
    showToast('Preencha todos os campos obrigatórios!', 1000)
    if (!item.value.nome) return nomeser.value?.focus()
    if (!item.value.precovenda) return vendaser.value?.focus()
    if (!duracaoHhmm.value) return duracaoser.value?.focus()
    return
  }

  if (!item.value.controle) {
    const res = await fetch(`${API_URL}/servicos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item.value),
    })

    const data = await res.json()
    item.value.controle = data.controle

    showToastv('Serviço salvo com sucesso!', 1000)
    limparFormularioSer()
    carregarServicos()
  } else {
    await fetch(`${API_URL}/servicos/${item.value.controle}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item.value),
    })

    showToastv('Serviço atualizado com sucesso!', 1000)
    limparFormularioSer()
    carregarServicos()
    ocultar()
    mostrarservicos.value = true
  }
}

async function excluirItem(controle) {
  Dialog.create({
    title: 'Excluir Produto',
    message:
      'Tem certeza que deseja excluir esse produto? Essa ação <b>não poderá ser desfeita</b>.',
    html: true,
    icon: 'warning',
    ok: {
      label: 'Sim, excluir',
      color: 'negative',
      unelevated: true,
    },
    cancel: {
      label: 'Cancelar',
      flat: true,
      color: 'grey-8',
    },
    persistent: true,
  }).onOk(async () => {
    try {
      await fetch(`${API_URL}/itens/${controle}`, { method: 'DELETE' })
      showToastv('Item excluido com sucesso!', 1000)
      carregarItens()
      carregarServicos()
    } catch (err) {
      console.error('Erro ao excluir cliente:', err)
      Notify.create({ type: 'negative', message: 'Erro ao excluir item. Verifique a conexão.' })
    }
  })
}

function editarItem(i) {
  item.value = { ...i }
}

function limparFormularioI() {
  item.value.controle = null
  item.value.nome = ''
  item.value.codbarras = ''
  item.value.descricao = ''
  item.value.grupo = ''
  item.value.marca = ''
  item.value.quantidade = 0
  item.value.precocusto = 0
  item.value.perlucro = 0
  item.value.precovenda = 0
  item.value.revenda = 0
  codInput.value.focus()
}

function limparFormularioSer() {
  item.value.controle = null
  item.value.nome = ''
  item.value.tipo = ''
  item.value.categoria = ''
  item.value.precovenda = 0
  duracaoHhmm.value = ''
  duracao.value = null
  nomeser.value.focus()
}

//MODULO NOVO ORÇAMENTO
const criarOrcamento = ref(false)
const entrarOrcamento = ref(false)
const clienteSelecionado = ref(null)
const objetoSelecionado = ref(null)
const objetosCliente = ref([])
const carregandoObjetos = ref(false)
const desabilitarTudo = ref(false)
const cpfCliente = ref('')
const endCliente = ref('')
const endCep = ref('')
const endBairro = ref('')
const celCliente = ref('')
const telCliente = ref('')
const emailCliente = ref('')
const itensOrcamento = ref([])
const itensOrdemos = ref([])
const itemSelecionado = ref(-1)
const acrescimoRef = ref(null)
const dialogRelatorioPeriodo = ref(false)
const dataInicio = ref('')
const dataFim = ref('')
titulo.value = 'NOVO ORÇAMENTO'
const colunasOrcamento = [
  {
    name: 'nome',
    label: 'Item',
    field: 'nome',
    align: 'left',
    style: 'width: 40%',
    headerStyle: 'text-align: left',
  },
  {
    name: 'quantidade',
    label: 'Quantidade',
    field: 'quantidade',
    align: 'center',
    style: 'width: 50px; text-align: right',
    headerStyle: 'text-align: left',
  },
  {
    name: 'valorunit',
    label: 'Valor Unit.',
    field: 'valorunit',
    align: 'right',
    style: 'width: 120px; text-align: right',
    headerStyle: 'text-align: right',
  },
  {
    name: 'total',
    label: 'Total',
    field: 'total',
    align: 'right',
    style: 'width: 120px; text-align: right; font-weight: bold',
    headerStyle: 'text-align: right',
    format: (val) => Number(val).toFixed(2),
  },
  { name: 'acoes', label: 'Ações', field: 'controle', align: 'center' },
]

const colunasOrdemos = [
  {
    name: 'descricao',
    label: 'Item',
    field: 'descricao',
    align: 'left',
    style: 'width: 40%',
    headerStyle: 'text-align: left',
  },
  {
    name: 'quantidade',
    label: 'Quantidade',
    field: 'quantidade',
    align: 'center',
    style: 'width: 50px; text-align: right',
    headerStyle: 'text-align: left',
  },
  {
    name: 'valorunitario',
    label: 'Valor Unit.',
    field: 'valorunitario',
    align: 'right',
    style: 'width: 120px; text-align: right',
    headerStyle: 'text-align: right',
  },
  {
    name: 'total',
    label: 'Total',
    field: 'total',
    align: 'right',
    style: 'width: 120px; text-align: right; font-weight: bold',
    headerStyle: 'text-align: right',
    format: (val) => Number(val).toFixed(2),
  },
  { name: 'acoes', label: 'Ações', field: 'controle', align: 'center' },
]

const desconto = ref(0)
const acrescimo = ref(0)
const adiantamento = ref(0)

const totalGeral = ref(0)
//Pegar dados
watch(
  () => clienteSelecionado.value,
  (novoId) => {
    if (!novoId) {
      cpfCliente.value = ''
      endCliente.value = ''
      return
    }

    const cliente = clientes.value.find((c) => c.id === novoId)
    cpfCliente.value = cliente?.cpf || ''
    endCliente.value = cliente?.endereco || ''
    endCep.value = cliente?.cep || ''
    endBairro.value = cliente?.bairro || ''
    celCliente.value = cliente?.celular || ''
    telCliente.value = cliente?.telefone || ''
    emailCliente.value = cliente?.email || ''
  },
)

function navegarLista(event) {
  if (event.key === 'Enter') {
    if (itemSelecionado.value < 0) {
      buscarItem()
    } else {
      adicionarItem(resultadoBusca.value[itemSelecionado.value])
    }
    return
  }
  const total = resultadoBusca.value.length

  if (total === 0) return

  if (event.key === 'ArrowDown') {
    itemSelecionado.value = (itemSelecionado.value + 1) % total
  }

  if (event.key === 'ArrowUp') {
    itemSelecionado.value = (itemSelecionado.value - 1 + total) % total
  }

  if (event.key === 'Enter') {
    if (itemSelecionado.value >= 0) {
      adicionarItem(resultadoBusca.value[itemSelecionado.value])
    } else {
      buscarItem()
    }
  }
}

const buscarItem = async () => {
  try {
    // Evita enviar texto vazio
    if (!buscaItem.value || buscaItem.value.trim() === '') {
      resultadoBusca.value = []
      itemSelecionado.value = -1
      return
    }

    const res = await axios.get('http://localhost:3000/itens/busca/buscar', {
      params: { texto: buscaItem.value },
    })

    // Garante que resultado sempre seja array
    const dados = Array.isArray(res.data) ? res.data : []

    resultadoBusca.value = dados

    if (dados.length === 0) {
      showToast('Nenhum item encontrado!', 1500)
      itemSelecionado.value = -1
    } else {
      itemSelecionado.value = 0
    }

    console.log('Itens encontrados:', dados)
  } catch (err) {
    console.error('Erro ao buscar itens:', err)

    showToast('Erro ao buscar itens!', 3000)

    resultadoBusca.value = []
    itemSelecionado.value = -1
  }
}

function adicionarItem(item) {
  if (!item) return

  itensOrcamento.value.push({
    produtoid: item.controle,
    nome: item.nome,
    quantidade: 1,
    valorunit: item.precovenda,
    total: item.precovenda,
  })

  atualizarTotais()

  resultadoBusca.value = []
  buscaItem.value = ''
  itemSelecionado.value = -1
}

function adicionarItemOs(item) {
  if (!item) return
  itensOrdemos.value.push({
    produtoid: item.controle,
    descricao: item.nome,
    quantidade: 1,
    valorunitario: item.precovenda,
    total: item.precovenda,
  })
  atualizarTotaisOs()
  resultadoBusca.value = []
  buscaItem.value = ''
  itemSelecionado.value = -1
}

function excluirItemOrç(controle) {
  itensOrcamento.value = itensOrcamento.value.filter((i) => i.controle !== controle)
  atualizarTotais()
}

// Atualizar totais

function atualizarTotais() {
  // debugger
  let subtotal = itensOrcamento.value.reduce((acc, i) => {
    i.total = i.quantidade * i.valorunit
    return acc + i.total
  }, 0)

  const descontoMaximo = Math.max(0, subtotal - 0.01)
  if (entrarOrcamento.value == false) {
    if (desconto.value > descontoMaximo) {
      showToast('O desconto informado é maior que o permitido e foi reajustado!', 3000)
      desconto.value = descontoMaximo.toFixed(2)
      if (acrescimoRef.value) {
        setTimeout(() => {
          acrescimoRef.value.focus()
        }, 50)
      }
    }
  }
  let soma = subtotal - desconto.value + Number(acrescimo.value)
  totalGeral.value = Math.max(0, soma)
}

function atualizarTotaisOs() {
  const VALOR_MINIMO_FATURA = 0.01

  let subtotal = itensOrdemos.value.reduce((acc, i) => {
    i.total = Number(i.quantidade) * Number(i.valorunitario)
    return acc + i.total
  }, 0)

  let descontoNum = Number(desconto.value) || 0
  let acrescimoNum = Number(acrescimo.value) || 0
  let adiantamentoNum = Number(adiantamento.value) || 0

  if (!entrarOrcamento.value) {
    // 🔹 Limite máximo combinado
    const limiteTotal = subtotal - VALOR_MINIMO_FATURA

    // Proteção extrema
    if (limiteTotal < 0) return

    // 🔹 Adiantamento não pode zerar a fatura
    if (adiantamentoNum > limiteTotal) {
      showToast('O adiantamento não pode zerar a fatura.', 3000)
      adiantamentoNum = limiteTotal
      adiantamento.value = adiantamentoNum.toFixed(2)
    }

    // 🔹 Desconto não pode zerar a fatura
    if (descontoNum + adiantamentoNum > limiteTotal) {
      showToast('Desconto reajustado para manter valor mínimo da fatura.', 3000)
      descontoNum = limiteTotal - adiantamentoNum
      desconto.value = descontoNum.toFixed(2)
    }
  }

  let total = subtotal - adiantamentoNum - descontoNum + acrescimoNum

  totalGeral.value = Math.max(VALOR_MINIMO_FATURA, total)
}

watch(desconto, () => {
  if (criarOrcamento.value) {
    atualizarTotaisOs()
  } else {
    atualizarTotaisOs()
  }
})

watch(acrescimo, () => {
  if (criarOrcamento.value) {
    atualizarTotaisOs()
  } else {
    atualizarTotaisOs()
  }
})

async function salvarOrcamento() {
  if (!clienteSelecionado.value) {
    showToast('Selecione um cliente!', 3000)
    return
  }

  if (!itensOrcamento.value || itensOrcamento.value.length === 0) {
    showToast('Adicione pelo menos 1 item!', 3000)
    return
  }

  if (!validade.value || validade.value.trim() === '') {
    showToast('Selecione a validade do orçamento!', 3000)
    return
  }

  if (!validarValidade(validade.value, entrarOrcamento.value)) {
    return
  }

  if (!totalGeral.value || totalGeral.value <= 0) {
    showToast('Total do orçamento não pode ser zero!', 3000)
    return
  }

  // --- Calcular valor votal final ---
  const valorTotalFinal = totalGeral.value + desconto.value - acrescimo.value

  const payload = {
    clienteId: clienteSelecionado.value,
    itens: itensOrcamento.value,
    desconto: desconto.value,
    acrescimo: acrescimo.value,
    observacoes: observacao.value,
    condicao: condicao.value,
    valortotalitens: valorTotalFinal,
    validade: validade.value,
    valortotal: totalGeral.value,
    status: item.value.status,
  }

  try {
    let res
    if (idOrcamentoEdicao.value) {
      console.log('Atualizando orçamento ID:', idOrcamentoEdicao.value)
      res = await axios.put(`/orcamentos/${idOrcamentoEdicao.value}`, payload)
      showToastv('Orçamento atualizado com sucesso!', 1000)
      ocultar()
      carregarOrcamento()
      listarOrcamento.value = true
    } else {
      res = await axios.post('/orcamentos', payload)
      showToastv('Orçamento criado com sucesso!', 1000)
    }
    console.log('Retorno:', res.data)
    limparOrcamento()
    carregarOrcamento()
  } catch (error) {
    console.error('Erro ao salvar orçamento:', error)
    showToast('Erro ao salvar orçamento!', 3000)
  }
}

async function salvarOrdem() {
  if (!clienteSelecionado.value) {
    showToast('Selecione um cliente!', 3000)
    return
  }

  if (!objetoSelecionado.value) {
    showToast('Selecione o objeto da ordem!', 3000)
    return
  }

  if (!itensOrdemos.value?.length) {
    showToast('Adicione pelo menos 1 item!', 3000)
    return
  }

  if (!totalGeral.value || totalGeral.value <= 0) {
    showToast('Total da ordem não pode ser zero!', 3000)
    return
  }

  const payload = {
    clienteid: clienteSelecionado.value,
    objetoveiculoid: objetoSelecionado.value,

    laudo: condicao.value || null,

    dataabertura: new Date().toISOString().slice(0, 19),
    status: item.value?.status || 'ABERTA',

    descricao: null,
    observacoes: observacao.value || null,
    garantia: null,

    desconto: Number(desconto.value) || 0,
    acrescimo: Number(acrescimo.value) || 0,
    adiantamento: Number(adiantamento.value) || 0,
    valortotalitem: Number(totalGeral.value),
    valortotalserv: 0,
    valortotal:
      Number(totalGeral.value) + Number(acrescimo.value || 0) - Number(desconto.value || 0),

    formapagamento: condicao.value || null,

    itens: itensOrdemos.value.map((i) => ({
      produtoid: i.produtoid || null,
      descricao: i.descricao,
      tipoitem: i.tipoitem || 'PRODUTO',
      quantidade: Number(i.quantidade),
      valorunitario: Number(i.valorunitario),
      total: Number(i.valortotal),
      tecnico: i.tecnico || null,
    })),
  }

  try {
    const res = await axios.post('/ordens', payload)

    showToastv('Ordem criada com sucesso!', 1500)
    console.log('✔ OS criada:', res.data)
    limparOs()
    listarOrdensServico()
  } catch (error) {
    console.error('❌ Erro ao salvar ordem:', error.response?.data || error)
    showToast(error.response?.data?.error || 'Erro ao salvar ordem!', 3000)
  }
}

async function limparOrcamento() {
  clienteSelecionado.value = null
  itensOrcamento.value = []
  desconto.value = 0
  acrescimo.value = 0
  totalGeral.value = 0
  buscaItem.value = ''
  resultadoBusca.value = []
  observacao.value = ''
  condicao.value = ''
  validade.value = ''
  endCliente.value = ''
  endCep.value = ''
  endBairro.value = ''
  telCliente.value = ''
  celCliente.value = ''
  emailCliente.value = ''
  item.value.status = 'ABERTO'
}

async function limparOs() {
  clienteSelecionado.value = null
  objetoSelecionado.value = ''
  objetosCliente.value.length = 0

  itensOrdemos.value.length = 0
  itensOrcamento.value.length = 0

  desconto.value = 0
  acrescimo.value = 0
  totalGeral.value = 0

  buscaItem.value = ''
  resultadoBusca.value.length = 0

  observacao.value = ''
  condicao.value = ''
  validade.value = ''

  endCliente.value = ''
  endCep.value = ''
  endBairro.value = ''
  telCliente.value = ''
  celCliente.value = ''
  emailCliente.value = ''
  if (item.value) {
    item.value.status = 'ABERTO'
  }
}

watch(
  () => validade.value,
  (novaData) => {
    if (!novaData) return
    const [dia, mes, ano] = novaData.split('-')
    const dataFormatada = `${ano}-${mes}-${dia}`
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const dataEscolhida = new Date(dataFormatada + 'T00:00:00')
    if (dataEscolhida < hoje && entrarOrcamento.value == false) {
      showToast(`A validade não pode ser menor que a data atual!`, 3000)
      validade.value = null
    }
  },
)

function validarValidade(val, entrarOrcamento) {
  if (!val) return false

  const [dia, mes, ano] = val.split('-')
  const dataFormatada = `${ano}-${mes}-${dia}`

  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  const dataEscolhida = new Date(dataFormatada + 'T00:00:00')

  if (dataEscolhida < hoje && !entrarOrcamento) {
    showToast('A validade não pode ser menor que a data atual!', 3000)
    return false
  }
  return true
}

// MÓDULO LISTAGEM ORÇAMENTO

const listarOrcamento = ref(false)
const orcamentos = ref([])

const colunasOrcamentosg = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'numero', label: 'Número', field: 'numero', align: 'left' },
  { name: 'cliente', label: 'Cliente', field: 'clientenome', align: 'left' },
  {
    name: 'datacriacao',
    label: 'Data',
    field: 'datacriacao',
    align: 'left',
    format: (val) => {
      if (!val) return ''
      const d = new Date(val)
      return d.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },
  },
  {
    name: 'validade',
    label: 'Validade',
    field: 'validade',
    align: 'left',
    format: (val) => {
      if (!val) return ''

      // pega só a data se vier com hora
      const data = val.split('T')[0]

      const partes = data.split('-')

      // yyyy-mm-dd → dd/mm/yyyy
      if (partes[0].length === 4) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`
      }

      // dd-mm-yyyy → dd/mm/yyyy
      if (partes[0].length === 2) {
        return `${partes[0]}/${partes[1]}/${partes[2]}`
      }

      return val
    },
  },
  {
    name: 'valorTotalItens',
    label: 'Itens',
    field: 'valortotalitens',
    align: 'right',
    format: (val) => Number(val).toFixed(2),
  },
  {
    name: 'desconto',
    label: 'Desc.',
    field: 'desconto',
    align: 'right',
    format: (val) => Number(val).toFixed(2),
  },
  {
    name: 'acrescimo',
    label: 'Acrésc.',
    field: 'acrescimo',
    align: 'right',
    format: (val) => Number(val).toFixed(2),
  },
  {
    name: 'valorTotal',
    label: 'Total',
    field: 'valortotal',
    align: 'right',
    format: (val) => Number(val).toFixed(2),
  },

  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' },
]

async function carregarOrcamento() {
  const res = await fetch(`${API_URL}/orcamentos`)
  orcamentos.value = await res.json()
}

function excluirOrcamento(id) {
  Notify.create({
    message: 'Tem certeza que deseja excluir esse Orçamento?',
    caption: 'Essa ação não poderá ser desfeita.',
    color: 'blue-10',
    icon: 'warning',
    position: 'center',

    actions: [
      {
        label: 'Cancelar',
        color: 'white',
      },
      {
        label: 'Excluir',
        color: 'red-6',
        handler: async () => {
          try {
            await fetch(`${API_URL}/orcamentos/${id}`, {
              method: 'DELETE',
            })
            showToastv(`Orçamento excluído com sucesso!`, 1500)
            carregarOrcamento()
          } catch (err) {
            console.error('Erro ao excluir orçamento:', err)

            Notify.create({
              type: 'negative',
              message: 'Erro ao excluir orçamento. Verifique sua conexão.',
            })
          }
        },
      },
    ],
  })
}

// MÓDULO EDITAR ORÇAMENTO

const modoEdicao = ref(false)
const idOrcamentoEdicao = ref(null)
const idOsEdicao = ref(null)

const editarOrcamento = async (row) => {
  //debugger
  if (row.status?.toLowerCase() === 'finalizado') {
    showToast('Este orçamento está Finalizado e não pode ser editado!', 2000)
    return
  }
  console.log('DADOS ENVIADOS PARA EDITAR:', row)
  titulo.value = 'ATUALIZAR ORÇAMENTO' + '  -  ' + 'Nº:' + row.numero
  entrarOrcamento.value = true
  criarOrcamento.value = true
  listarOrcamento.value = false
  idOrcamentoEdicao.value = row.id
  clienteSelecionado.value = row.clienteid
  validade.value = formatarDataBR(row.validade)
  observacao.value = row.observacoes || ''
  condicao.value = row.condicao || ''
  desconto.value = row.desconto || 0
  acrescimo.value = row.acrescimo || 0
  item.value.status = row.status || 'ABERTO'
  await carregarItensDoOrcamento(row.id)
  atualizarTotais()
  entrarOrcamento.value = false
  desabilitarTudo.value = false
}

const verOrcamento = async (row) => {
  console.log('DADOS ENVIADOS PARA EDITAR:', row)
  titulo.value = 'VISUALIZAR ORÇAMENTO' + '  -  ' + 'Nº:' + row.numero
  entrarOrcamento.value = true
  criarOrcamento.value = true
  listarOrcamento.value = false
  idOrcamentoEdicao.value = row.id
  clienteSelecionado.value = row.clienteid
  validade.value = formatarDataBR(row.validade)
  item.value.status = row.status || 'ABERTO'
  observacao.value = row.observacoes || ''
  condicao.value = row.condicao || ''
  desconto.value = row.desconto.toFixed(2) || 0
  acrescimo.value = row.acrescimo.toFixed(2) || 0
  await carregarItensDoOrcamento(row.id)
  atualizarTotais()
  desabilitarTudo.value = true
  entrarOrcamento.value = false
}

const editarOs = async (row) => {
  const status = (row.status || '').toUpperCase()
  if (status === 'FINALIZADA' || status === 'FINALIZADO') {
    showToast('Esta OS está finalizada e não pode ser editada!', 2000)
    return
  }
  titulo.value = 'ATUALIZAR ORDEM DE SERVIÇO' + '  -  ' + 'Nº:' + row.numeroos

  modoEdicao.value = true
  cadastraros.value = true
  listagemos.value = false
  idOsEdicao.value = row.id

  clienteSelecionado.value = row.clienteid

  observacao.value = row.observacoes ?? ''
  condicao.value = row.laudo ?? ''

  desconto.value = Number(row.desconto) || 0
  acrescimo.value = Number(row.acrescimo) || 0
  adiantamento.value = Number(row.adiantamento) || 0
  totalGeral.value = Number(row.valortotal) || 0
  item.value.status = row.status || 'ABERTO'
  // 🚀 carregar itens (quando ativar)
  await carregarItensDaOs(row.id)
  atualizarTotaisOs()
  //desabilitarTudo.value = false
}

function formatarDataBR(data) {
  if (!data) return ''

  // formato DD-MM-YYYY
  if (/^\d{2}-\d{2}-\d{4}$/.test(data)) {
    const [dia, mes, ano] = data.split('-')
    return `${dia}/${mes}/${ano}`
  }

  return ''
}

async function carregarItensDoOrcamento(id) {
  const res = await fetch(`${API_URL}/orcamentos/${id}`)
  const dados = await res.json()

  itensOrcamento.value = dados.itens.map((item) => ({
    controle: item.id,
    produtoid: item.produtoid,
    nome: item.descricao,
    quantidade: item.quantidade,
    valorunit: item.valorunit,
    total: item.total,
  }))
}

async function carregarItensDaOs(id) {
  const res = await fetch(`${API_URL}/ordens/${id}/itens`)
  const itens = await res.json()

  itensOrdemos.value = itens.map((item) => ({
    controle: item.id,
    produtoid: item.produtoid,
    descricao: item.descricao ?? item.nome ?? '',
    quantidade: Number(item.quantidade) || 1,
    valorunitario: Number(item.valorunitario) || 0,
    total: Number(item.total) || 0,
  }))
}

async function salvarEdicao() {
  const dados = {
    clienteId: clienteSelecionado.value,
    validade: validade.value,
    observacoes: observacao.value,
    condicao: condicao.value,
    desconto: desconto.value,
    acrescimo: acrescimo.value.toFixed(2),
    itens: itensOrcamento.value,
  }

  const res = await fetch(`${API_URL}/orcamentos/${idOrcamentoEdicao.value}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados),
  })

  const resultado = await res.json()

  if (resultado.success) {
    ocultar()
    listarOrcamento.value = true
    carregarOrcamento()
  } else {
    showToast('Erro ao atualizar orçamento!')
  }
}

function abrirCalendario() {
  console.log('Abrindo calendário...')
}

//import { useRouter } from 'vue-router'

function imprimirOrcamento(id) {
  imprimirOrcamentoPorId(id)
}

function abrirRelatorioPeriodo() {
  dialogRelatorioPeriodo.value = true
}

async function gerarRelatorio() {
  if (!dataInicio.value || !dataFim.value) {
    $q.notify({
      type: 'warning',
      message: 'É necessário selecionar as datas do período!',
    })
    if (!dataInicio.value) DataInput.value?.focus()
    else DataInputFim.value?.focus()
    return
  }
  if (dataInicio.value > dataFim.value) {
    $q.notify({
      type: 'warning',
      message: 'A data inicial é maior que a data final!',
    })
    dataFim.value = ''
    dataInicio.value = ''
    DataInput.value?.focus()
    return
  }

  const ok = await gerarRelatorioPeriodo(dataInicio.value, dataFim.value)
  if (!ok) {
    $q.notify({
      type: 'warning',
      message: 'Nenhum orçamento encontrado no período!',
    })
    dataInicio.value = ''
    dataFim.value = ''
    DataInput.value?.focus()
    return
  }
  dataInicio.value = ''
  dataFim.value = ''
  dialogRelatorioPeriodo.value = false
  return
}
const davmenuOrcamento = ref(false)
const davmenuOs = ref(false)

const ordensServico = ref([])
const carregandoOs = ref(false)

async function listarOrdensServico() {
  try {
    carregandoOs.value = true

    const res = await fetch('http://localhost:3000/ordens')
    if (!res.ok) throw new Error('Erro ao buscar ordens')

    ordensServico.value = await res.json()
  } catch (err) {
    console.error(err)
  } finally {
    carregandoOs.value = false
  }
}

function abrirRelatorioGeral() {
  console.log('Abrir relatório geral')
  gerarRelatorioGeral()
}

const abrirRelatorioStatus = () => {
  $q.dialog({
    title: 'Relatório por Status',
    message: 'Selecione o status:',
    cancel: true,
    persistent: false,
    options: {
      type: 'radio',
      model: 'ABERTO',
      items: [
        { label: 'Aberto', value: 'ABERTO' },
        { label: 'Em negociação', value: 'EM NEGOCIAÇÃO' },
        { label: 'Finalizado', value: 'FINALIZADO' },
      ],
    },
  })
    .onOk(async (status) => {
      const ok = await gerarRelatorioStatus(status)
      if (!ok) {
        $q.notify({
          type: 'warning',
          message: `Nenhum orçamento encontrado para o status "${status}"!`,
        })
        return
      }
    })
    .onCancel(() => {
      console.log('Fechado')
    })
}

const duracaoHhmm = ref('') // ligado ao q-input
const precovendaser = ref('')
const duracao = ref(null) // REAL → enviado ao backend

function hhmmParaReal(valor) {
  if (!valor || valor.includes('_')) return null

  const partes = valor.split(':')
  if (partes.length !== 2) return null

  const h = parseInt(partes[0], 10)
  const m = parseInt(partes[1], 10)

  if (isNaN(h) || isNaN(m) || m < 0 || m > 59) return null

  return Number((h + m / 60).toFixed(2))
}

//OBJETOS CLIENTES

const columns = [
  { name: 'tipo', label: 'Tipo', field: 'tipo' },
  { name: 'marca', label: 'Marca', field: 'marca' },
  { name: 'modelo', label: 'Modelo', field: 'modelo' },
  { name: 'ano', label: 'Ano', field: 'ano' },
  { name: 'cor', label: 'Cor', field: 'cor' },
  { name: 'placaSerie', label: 'Placa / Série', field: 'placaSerie' },
  { name: 'observacoes', label: 'Observações', field: 'observacoes' },
  { name: 'acao', label: 'Ação', field: 'acao' },
]

const mostrarFormObjetos = ref(false)

// objeto em edição
const objetoForm = ref({
  tipo: 'VEÍCULO',
  marca: '',
  modelo: '',
  ano: '',
  cor: '',
  placaSerie: '',
  observacoes: '',
})

// lista de objetos do cliente
const objetos = ref([])

// 🔹 adicionar objeto à lista
function adicionarObjeto() {
  objetos.value.push({ ...objetoForm.value })

  // limpa formulário
  objetoForm.value = {
    tipo: 'VEÍCULO',
    marca: '',
    modelo: '',
    ano: '',
    cor: '',
    placaSerie: '',
    observacoes: '',
  }

  Notify.create({ type: 'positive', message: 'Objeto adicionado' })
}

// 🔹 remover objeto
function removerObjeto(index) {
  objetos.value.splice(index, 1)
}

watch(clienteSelecionado, async (novoCliente) => {
  objetoSelecionado.value = null
  objetosCliente.value = []

  if (!novoCliente) return

  try {
    carregandoObjetos.value = true

    const res = await axios.get(`/clientes/${novoCliente}/objetos`)
    objetosCliente.value = res.data
  } catch (err) {
    console.error('Erro ao carregar objetos:', err)
    showToast('Erro ao carregar objetos do cliente', 3000)
  } finally {
    carregandoObjetos.value = false
  }
})

function showToast(message, tempo = 3000) {
  const toast = document.getElementById('toast')
  if (toast) {
    toast.textContent = message
    toast.classList.add('show')
    toast.style.display = 'block'
    setTimeout(() => {
      toast.classList.remove('show')
      toast.style.display = 'none'
    }, tempo)
  }
}

function showToastv(message, tempo = 3000) {
  const toast = document.getElementById('toastv')
  if (toast) {
    toast.textContent = message
    toast.classList.add('show')
    toast.style.display = 'block'
    setTimeout(() => {
      toast.classList.remove('show')
      toast.style.display = 'none'
    }, tempo)
  }
}

function validarDecimal(campo) {
  let valor = item.value[campo]
  if (typeof valor === 'string') {
    valor = valor.replace(',', '.')
  }
  const num = parseFloat(valor)
  item.value[campo] = isNaN(num) ? 0 : num
}

onMounted(() => {
  bemvinda()
  carregarClientes()
  carregarItens()
  carregarServicos()
  carregarOrcamento()
  carregaraClientes()
  listarOrdensServico()
})

onMounted(async () => {
  try {
    const res = await axios.get(`${API_URL}/clientes`)
    clientes.value = res.data
  } catch (err) {
    console.error('Erro ao carregar clientes:', err)
  }
})
</script>
<style scoped></style>
