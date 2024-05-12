<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Dashboard from '@/layouts/DashboardLayout.vue'
import StartPage from '@/components/partials/StartPage.vue'
import Button from '@/components/Button.vue'
import Table from '@/components/Table.vue'
import { component as VueNumber } from '@coders-tm/vue-number-format'

const transferId = useRouter().currentRoute.value.params.id;

const pageTitle = `Vista de Traslado - Nº ${transferId}`;
const breadcrumbs: Array[] = [
    { label: 'Alernal', url: "/" },
    { label: 'Traslados', url: "/transfers" },
    { label: 'Vista', },
];

/* PREPARACION Y LISTADO DE DATOS NECESARIOS */

//LISTADO DE BODEGAS y LOTES
const transfer = ref({});
const origen = ref({});
const destino = ref({});
const items = ref([]);

const fetchData = async () => {
    const response = await axios.get(`/transfers/${transferId}`);
    transfer.value = response.data.tranferWinery;

    //
    origen.value = response.data.tranferWinery.origen
    destino.value = response.data.tranferWinery.destino

    //
    items.value = response.data.tranferWinery.transfer_items;
}

onMounted(() => { fetchData() });
</script>

<template>
    <Dashboard>
        <StartPage :breadcrumbs="breadcrumbs" :page-title="pageTitle"></StartPage>
        <div class="row">

            <div class="col-md-3">
                <div class="form-group">
                    <label for="winery_id">Bodega de Origen</label>
                    <input type="text" class="form-control" id="fecha" placeholder="fecha" v-model="origen.nombre" disabled
                        autocomplete="off">
                </div>
            </div>

            <div class="col-md-3">
                <div class="form-group">
                    <label for="winery_id">Bodega de Destino</label>
                    <input type="text" class="form-control" id="fecha" placeholder="fecha" v-model="destino.nombre" disabled
                        autocomplete="off">
                </div>
            </div>


            <div class="col-md-3">
                <div class="form-group">
                    <label for="fecha" class="control-label">Fecha</label>
                    <input type="date" class="form-control" id="fecha" placeholder="fecha" v-model="transfer.fecha" disabled
                        autocomplete="off">
                </div>
            </div>

            <div class="col-md-3">
                <div class="form-group">
                    <label for="detalles" class="control-label">Detalles</label>
                    <input type="text" class="form-control" id="detalles" placeholder="Detalles"
                        v-model="transfer.detalles" autocomplete="off" disabled>
                </div>
            </div>
        </div>

        <Table>
            <template v-slot:thead>
                <th>CODIGO</th>
                <th>PRODUCTO</th>
                <th>CANTIDAD</th>
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
                        <input v-if="item.lot" type="text" style="width: 150px;" v-model="item.lot.numero" autocomplete="off" disabled>
                        <input v-else type="text" style="width: 150px;" value="Sin Lote" autocomplete="off" disabled>
                    </td>
                </tr>
            </template>
            <template #tfooter>
            </template>
        </Table>

    </Dashboard>
</template>