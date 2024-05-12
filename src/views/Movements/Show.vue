<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { sendRequest } from '@/requestHandler';
import Dashboard from '@/layouts/DashboardLayout.vue'
import StartPage from '@/components/partials/StartPage.vue'
import Button from '@/components/Button.vue'
import Table from '@/components/Table.vue'
import { component as VueNumber } from '@coders-tm/vue-number-format'

const movementId = useRouter().currentRoute.value.params.id;

const pageTitle = `Vista de Movimiento - Nº ${movementId}`;
const breadcrumbs: Array[] = [
    { label: 'Alernal', url: "/" },
    { label: 'Movimientos', url: "/movements" },
    { label: 'Vista', },
];

/* PREPARACION Y LISTADO DE DATOS NECESARIOS */

//LISTADO DE BODEGAS y LOTES
const movement = ref([]);
const winery = ref({});
const items = ref([]);

const fetchData = async () => {
    const response = await axios.get(`/movements/${movementId}`);
    movement.value = response.data.movement;
    winery.value = response.data.movement.winery;
    items.value = response.data.movement.items;
}

onMounted(() => { fetchData() });
</script>

<template>
    <Dashboard>
        <StartPage :breadcrumbs="breadcrumbs" :page-title="pageTitle"></StartPage>
        <div class="row">

            <div class="col-md-3">
                <div class="form-group">
                    <label for="winery_id">Bodega</label>
                    <input type="text" class="form-control" id="fecha" placeholder="fecha" v-model="winery.nombre" disabled
                        autocomplete="off">
                </div>
            </div>


            <div class="col-md-3">
                <div class="form-group">
                    <label for="fecha" class="control-label">Fecha</label>
                    <input type="date" class="form-control" id="fecha" placeholder="fecha" v-model="movement.fecha" disabled
                        autocomplete="off">
                </div>
            </div>

            <div class="col-md-3">
                <div class="form-group">
                    <label for="tipo">Tipo de Movimiento</label>
                    <select class="form-control" id="tipo" disabled v-model="movement.tipo">
                        <option value="1">Carga de Inventario</option>
                        <option value="0">Descarga de Inventario</option>
                    </select>
                </div>
            </div>

            <div class="col-md-3">
                <div class="form-group">
                    <label for="detalles" class="control-label">Detalles</label>
                    <input type="text" class="form-control" id="detalles" placeholder="Detalles"
                        v-model="movement.detalles" autocomplete="off" disabled>
                </div>
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
            </template>
            <template v-slot:tbody>
                <tr v-for="(item, index) in items" :key="index">
                    <td>{{ item.codigo }}</td>
                    <td>{{ item.nombre }}</td>
                    <td>
                        <input type="text" class="form-control-sm" v-model="item.pivot.cantidad" style="width: 60px;" disabled
                            autocomplete="off">
                    </td>
                    <td>
                        <vue-number v-model="item.pivot.costo_unitario" style="width: 120px;"
                            v-bind="{ decimal: '.', separator: ',', prefix: '$ ', precision: 2 }" disabled></vue-number>
                    </td>
                    <td>
                        <vue-number v-model="item.pivot.costo_total" style="width: 120px;"
                            v-bind="{ decimal: '.', separator: ',', prefix: '$ ', precision: 2 }" disabled></vue-number>
                    </td>
                    <td>
                        <input v-if="item.lot" type="text" style="width: 120px;" v-model="item.lot.numero" autocomplete="off" disabled>
                        <input v-else type="text" style="width: 120px;" value="Sin Lote" autocomplete="off" disabled>
                    </td>
                </tr>
            </template>
            <template #tfooter>
                <tr>
                    <td colspan="4"></td>
                    <td><b>Total: $ </b>{{ movement.total }}</td>
                    <td colspan="2"></td>
                </tr>
            </template>
        </Table>

    </Dashboard>
</template>