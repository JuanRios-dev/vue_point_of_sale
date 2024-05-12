<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { confirmAction, sendRequest } from '@/requestHandler';
import Dashboard from '@/layouts/DashboardLayout.vue'
import StartPage from '@/components/partials/StartPage.vue'
import Button from '@/components/Button.vue'
import Table from '@/components/Table.vue'
import Modal from '@/components/Modal.vue'
import { closeModal, openModal } from '@/components/Modal.vue';
import * as tables from '@/data/TableData'
import { component as VueNumber } from '@coders-tm/vue-number-format'

const pageTitle = 'Registro de Movimiento'
const breadcrumbs: Array[] = [
    { label: 'Alernal', url: "/" },
    { label: 'Movimientos', url: "/movements" },
    { label: 'Registro', },
];

/* PREPARACION Y LISTADO DE DATOS NECESARIOS */

//LISTADO DE BODEGAS
const wineries = ref([]);

const fetchData = async () => {
    const wineriesResponse = await axios.get(`/wineries?pagination=${0}`);
    wineries.value = wineriesResponse.data.wineries;
    const defaultWinery = wineries.value.find(winery => winery.predeterminada === 1);
    defaultWinery ? DataCreate.value.winery_id = defaultWinery.id : defaultWinery;
}

onMounted(() => { fetchData() });



//DATA PRINCIPAL
const DataCreate = ref({
    fecha: new Date().toISOString().split('T')[0],
    tipo: 1,
    total: 0,
    items: []
});

const createErrors = ref([]);
const itemsQuery = ref('');
const itemsResults = ref([]);
const itemData = ref([]);

//BUSCADOR
const itemsSearch = async () => {
    const response = await axios.get(`/items/search?search=${itemsQuery.value}`);
    itemsResults.value = response.data.items;
}

const itemSelect = async (item) => {
    // Buscar si el elemento ya existe en DataCreate
    const existingItemIndex = DataCreate.value.items.findIndex(i => i.item_id === item.id && i.lot_id === item.lot_id);

    if (existingItemIndex !== -1) {
        // Si el elemento ya existe, incrementar la cantidad
        DataCreate.value.items[existingItemIndex].cantidad++;
    } else {
        // Si el elemento no existe, agregarlo a DataCreate
        DataCreate.value.items.push({
            item_id: item.id,
            cantidad: 1,
            costo_unitario: 0,
            costo_total: 0,
            lot_id: item.lot_id,
        });

        itemData.value.push({
            codigo: item.codigo,
            nombre: item.nombre,
            numero: item.numero
        });

        await calcularPrecioTotal(DataCreate.value.items[DataCreate.value.items.length - 1]);
    }

    // Limpiar la búsqueda y cerrar el modal
    itemsQuery.value = '';
    closeModal('modalSalesProductos');
}

//CALCULOS

const calcularPrecioTotal = async (item) => {
    const index = DataCreate.value.items.indexOf(item);
    item.costo_total = item.costo_unitario * item.cantidad;
    await calcularTotales();
}

const calcularTotales = async () => {
    DataCreate.value.total = DataCreate.value.items.reduce((total, item) => {
        return total + item.costo_total;
    }, 0);

}

//FUNCION PARA GUARDAR MOVIMIENTO
const DataSave = async () => {
    const confirmed = await confirmAction('¿Estás listo para guardar?', 'Guardar');

    if (confirmed) {
        const { status, error, errors } = await sendRequest('POST', '/movements', DataCreate.value, true, '/movements', null);

        if (status === 422) {
            createErrors.value = errors;
        }
    }
}
</script>

<template>
    <Dashboard>
        <StartPage :breadcrumbs="breadcrumbs" :page-title="pageTitle"></StartPage>
        <div class="row">

            <div class="col-md-3">
                <div class="form-group">
                    <label for="winery_id">Bodega</label>
                    <select class="form-control" :class="{ 'is-invalid': createErrors['winery_id'] }" id="winery_id"
                        v-model="DataCreate.winery_id">
                        <option v-for="winery in wineries" :key="winery.id" :value="winery.id">{{ winery.nombre }}
                        </option>
                    </select>
                    <span v-if="!wineries.length > 0">No hay bodegas</span>
                    <span v-if="createErrors['winery_id']" class="invalid-feedback">{{
                        createErrors['winery_id'].join(',') }}</span>
                </div>
            </div>


            <div class="col-md-3">
                <div class="form-group">
                    <label for="fecha" class="control-label">Fecha</label>
                    <input type="date" class="form-control" :class="{ 'is-invalid': createErrors['fecha'] }" id="fecha"
                        placeholder="fecha" v-model="DataCreate.fecha" autocomplete="off">
                    <span v-if="createErrors['fecha']" class="invalid-feedback">
                        {{ createErrors['fecha'].join(', ') }}
                    </span>
                </div>
            </div>

            <div class="col-md-3">
                <div class="form-group">
                    <label for="tipo">Tipo de Movimiento</label>
                    <select class="form-control" :class="{ 'is-invalid': createErrors['tipo'] }" id="tipo"
                        v-model="DataCreate.tipo">
                        <option value="1">Carga de Inventario</option>
                        <option value="0">Descarga de Inventario</option>
                    </select>
                    <span v-if="createErrors['tipo']" class="invalid-feedback">
                        {{ createErrors['tipo'].join(', ') }}
                    </span>
                </div>
            </div>

            <div class="col-md-3">
                <div class="form-group">
                    <label for="detalles" class="control-label">Detalles</label>
                    <input type="text" class="form-control" :class="{ 'is-invalid': createErrors['detalles'] }"
                        id="detalles" placeholder="Detalles" v-model="DataCreate.detalles" autocomplete="off">
                    <span v-if="createErrors['detalles']" class="invalid-feedback">
                        {{ createErrors['detalles'].join(', ') }}
                    </span>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-6">
                <Button :style="'btn-primary text-light mr-2'" :title="'Agregar Producto'" :icon="'fe-plus-square'"
                    @click="openModal('modalSalesProductos')"></Button>

                <Button :style="'btn-success text-light'" :title="'Guardar'" :icon="'fe-plus-square'"
                    @click="DataSave()"></Button>
            </div>
            <div class="col-md-3">
                <span v-if="createErrors['items']" class="text-danger">
                    {{ createErrors['items'][0] }}
                </span>
            </div>
        </div>

        <Table>
            <template v-slot:thead>
                <th>CODIGO</th>
                <th>PRODUCTO</th>
                <th>CANTIDAD</th>
                <th>COSTO UNITARIO</th>
                <th>COSTO TOTAL</th>
                <th>LOTES</th>
                <th>ACCIONES</th>
            </template>
            <template v-slot:tbody>
                <tr v-for="(item, index) in DataCreate.items" :key="index">
                    <td>{{ itemData[index].codigo }}</td>
                    <td>{{ itemData[index].nombre }}</td>
                    <td>
                        <input type="text" class="form-control-sm" v-model="item.cantidad" style="width: 60px;"
                            autocomplete="off" @input="calcularPrecioTotal(item)">
                    </td>
                    <td>
                        <vue-number v-model="item.costo_unitario" style="width: 120px;"
                            v-bind="{ decimal: '.', separator: ',', prefix: '$ ', precision: 2 }"
                            @change="calcularPrecioTotal(item)"></vue-number>
                    </td>
                    <td>
                        <vue-number v-model="item.costo_total" style="width: 120px;"
                            v-bind="{ decimal: '.', separator: ',', prefix: '$ ', precision: 2 }" disabled></vue-number>
                    </td>
                    <td>{{ itemData[index].numero ? itemData[index].numero : 'Sin lote' }}</td>
                    <td>
                        <a href="#" class="text-danger"
                            @click="() => { DataCreate.items.splice(index, 1), itemData.splice(index, 1); calcularTotales() }"><i
                                class="fas fa-trash"></i></a>
                    </td>
                </tr>
            </template>
            <template #tfooter>
                <tr>
                    <td colspan="4"></td>
                    <td><b>Total: $ </b>{{ DataCreate.total }}</td>
                    <td colspan="2"></td>
                </tr>
            </template>
        </Table>

        <Modal :modalId="'modalSalesProductos'" :title="'Buscar Productos'">
            <template v-slot:body>
                <div class="form-group">
                    <div class="input-group">
                        <input type="text" id="example-input-small" class="form-control" v-model="itemsQuery"
                            placeholder="Ej: Arroz 1kg" @input="itemsSearch()" autocomplete="off">
                    </div>
                </div>

                <ul v-if="itemsQuery.length > 0" class="list-group mt-2" style="max-height: 320px; overflow-y: auto;">
                    <a v-for="(item, index) in itemsResults.slice(0, 5)" :key="index" @click="itemSelect(item)"
                        style="cursor: pointer;"
                        class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                        <div>
                            <p class="mb-0">
                                <span class="fw-bold mr-1"><b># {{ item.codigo }}</b></span>
                                <span class="mr-1">{{ item.nombre }}</span>
                                <small class="text-info ms-2">{{ item.categoria }}</small>
                            </p>
                            <div class="row" v-if="item.lot_id !== null">
                                <small class="col">Número de lote: <span class="text-primary">{{ item.numero
                                        }}</span></small>
                                <small class="col">Fecha de vencimiento: <b>{{ item.fecha_vencimiento
                                        }}</b></small>
                            </div>
                            <div v-else>
                                <small class="text-danger">Sin lote</small>
                            </div>
                        </div>
                        <span class="badge bg-success rounded-pill align-self-start">{{ item.precio }}</span>
                    </a>
                </ul>

            </template>
            <template v-slot:footer>
            </template>
        </Modal>

    </Dashboard>
</template>