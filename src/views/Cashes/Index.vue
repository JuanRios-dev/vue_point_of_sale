<script setup lang="ts">
import { ref, onMounted } from 'vue'
import StartPage from '@/components/partials/StartPage.vue'
import Dashboard from '@/layouts/DashboardLayout.vue'
import Table from '@/components/Table.vue'
import Button from '@/components/Button.vue'
import { openModal } from '@/components/Modal.vue';
import CashCreate from '@/views/Cashes/Create.vue'
import Modal from '@/components/Modal.vue'
import { closeModal } from '@/components/Modal.vue'
import { sendRequest } from '@/requestHandler'
import * as tables from '@/data/TableData'
import SearchData from '@/components/SearchData'

const pageTitle = 'Listado de Cajas Registradoras'
const breadcrumbs: Array[] = [
    { label: 'Alernal', url: "/" },
    { label: 'Cajas', },
];

/* LISTAR DATOS */
const cashes = ref([]);
const currentPage = ref();
const lastPage = ref();
const perPage = ref();
const Search = ref('');

const getCashes = async (page, search = '') => {
    const response = await axios.get(`/cashes?page=${page}&search=${Search.value}`);
    cashes.value = response.data.cashes.data;
    currentPage.value = response.data.cashes.current_page;
    lastPage.value = response.data.cashes.last_page;
    perPage.value = response.data.cashes.per_page;
}

onMounted(() => { getCashes(1) });

const cashMovements = ref({ tipo: 'deposito' })
const dataErrors = ref({})

const createData = (cashId) => {
    cashMovements.value.id = cashId
    openModal('modalCashMovements')
}

const createCashMovements = async () => {
    const { status, error, errors } = await sendRequest('POST', '/cashes/' + cashMovements.value.id + '/movements', cashMovements.value);

    if (status === 200) {
        getCashes(1)
        closeModal('modalCashMovements');
        tables.clearFormData(cashMovements.value, {});
        dataErrors.value = [];
    } else if (status === 422) {
        dataErrors.value = errors;
    }
}
</script>

<template>
    <Dashboard>
        <StartPage :breadcrumbs="breadcrumbs" :page-title="pageTitle"></StartPage>

        <Table @update:currentPage="(page) => { currentPage = page, getCashes(page) }" :current-page="currentPage"
            :last-page="lastPage" :per-page="perPage">
            <template v-slot:t-header>
                <div>
                    <Button :style="'btn-primary mr-1'" :title="'Add create'" :icon="'fa fa-edit'"
                        @click="openModal('modalCreate')"></Button>
                </div>

                <SearchData @search-input="(value) => { getCashes(1); Search = value; }"></SearchData>
            </template>
            <template v-slot:thead>
                <th>ID</th>
                <th>NOMBRE</th>
                <th>ESTADO</th>
                <th>MONTO ACTUAL</th>
                <th>USUARIO ACTUAL</th>
                <th>ACCIÓN</th>
            </template>
            <template v-slot:tbody>
                <tr v-for="(cash, index) in cashes" :key="index">
                    <td>{{ ++index }}</td>
                    <td>{{ cash.nombre }}</td>
                    <td>
                        <span
                            :class="{ 'badge badge-success': cash.estado == 1, 'badge badge-danger': cash.estado === 0, }">{{
                                cash.estado === 1 ? 'ABIERTO' : 'CERRADO' }}</span>
                    </td>
                    <td>{{ cash.monto }}</td>
                    <td>{{ cash.user.nombre }}</td>
                    <td>
                        <a href="#"
                            @click="async () => { await sendRequest('POST', '/cashes/' + cash.id + '/open', null); getCashes(1) }"
                            class="text-success mr-2"><i class="icon-lock-open"></i> Abrir</a>
                        <a href="#"
                            @click="async () => { await sendRequest('POST', '/cashes/' + cash.id + '/close', null); getCashes(1) }"
                            class="text-danger mr-2"><i class="icon-lock"></i> Cerrar</a>
                        <a href="#" @click="createData(cash.id)" class="text-info">Consignación</a>
                    </td>
                </tr>
            </template>
        </Table>

        <CashCreate @created="getCashes(1)"></CashCreate>

        <Modal :modalId="'modalCashMovements'" :title="'Movimiento en Caja'">
            <template v-slot:body>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="tipo">Tipo de Movimiento en Caja <span v-if="dataErrors['tipo']"
                                    class="text-danger">*</span></label>
                            <select class="form-control" :class="{ 'is-invalid': dataErrors['tipo'] }" id="tipo"
                                v-model="cashMovements.tipo">
                                <option value="deposito">Deposito</option>
                                <option value="retiro">Retiro</option>
                            </select>
                            <span v-if="dataErrors['tipo']" class="invalid-feedback">
                                {{ dataErrors['tipo'].join(', ') }}
                            </span>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="monto" class="control-label">Monto</label>
                            <input type="text" class="form-control" :class="{ 'is-invalid': dataErrors['monto'] }"
                                id="monto" placeholder="Monto" v-model="cashMovements.monto" autocomplete="off">
                            <span v-if="dataErrors['monto']" class="invalid-feedback">
                                {{ dataErrors['monto'].join(', ') }}
                            </span>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="detalles" class="control-label">Detalles</label>
                            <input type="text" class="form-control" :class="{ 'is-invalid': dataErrors['detalles'] }"
                                id="detalles" placeholder="Detalles" v-model="cashMovements.detalles"
                                autocomplete="off">
                            <span v-if="dataErrors['detalles']" class="invalid-feedback">
                                {{ dataErrors['detalles'].join(', ') }}
                            </span>
                        </div>
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <Button :style="'btn-primary mr-1'" :title="'Guardar'" :icon="'fa fa-edit'"
                    @click="createCashMovements()"></Button>
            </template>
        </Modal>
    </Dashboard>
</template>