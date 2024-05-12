<template>
    <Dashboard>
        <StartPage :breadcrumbs="breadcrumbs" :page-title="pageTitle"></StartPage>

        <ItemForm :formData="DataCreate" :infoErrors="createErrors">
            <Button :style="'btn-info mr-1'" :title="'Guardar'" :icon="'fa fa-save'" @click="createData()"></Button>
            <Button :style="'btn-purple mr-1'" :title="'Lote'" :icon="'fa fa-plus'" @click="() => { DataCreate.lots.push({ numero: '', fecha_vencimiento: '' }) }"></Button>
        </ItemForm>
        <div class="row">
            <div class="col-md-4"></div>
            <div class="col-md-8">
                <Table :usePagination="false">
                    <template v-slot:thead>
                        <th>#</th>
                        <th>NUMERO DE LOTE</th>
                        <th>FECHA VENCIMIENTO</th>
                        <th>QUITAR</th>
                    </template>
                    <template v-slot:tbody>
                        <tr v-for="(lot, index) in DataCreate.lots" :key="index">
                            <td>{{ i = index + 1 }}</td>
                            <td>
                                <input type="text" class="form-control-sm" v-model="lot.numero" style="width: 150px;"
                                    autocomplete="off"
                                    :class="{ 'is-invalid': createErrors['lots.' + index + '.numero'] }">
                                <span v-if="createErrors['lots.' + index + '.numero']" class="text-danger">
                                    *
                                </span>
                            </td>
                            <td>
                                <input type="date" class="form-control-sm" v-model="lot.fecha_vencimiento"
                                    style="width: 150px;" autocomplete="off">
                                <span v-if="createErrors['lots.' + index + '.fecha_vencimiento']" class="text-danger">
                                    *
                                </span>
                            </td>
                            <td>
                                <a class="text-danger" @click="() => { DataCreate.lots.splice(index, 1) }">
                                    <i class="fas fa-trash"></i></a>
                            </td>
                        </tr>
                    </template>
                </Table>
            </div>
        </div>
    </Dashboard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { sendRequest, confirmAction } from '@/requestHandler';
import StartPage from '@/components/partials/StartPage.vue'
import Dashboard from '@/layouts/DashboardLayout.vue'
import ItemForm from '@/components/forms/ItemForm.vue'
import Button from '@/components/Button.vue'
import Table from '@/components/Table.vue'

const pageTitle = 'Creación de Producto'
const breadcrumbs: Array[] = [
    { label: 'Alernal', url: "/" },
    { label: 'Productos', url: "/items" },
    { label: 'Creación', },
];

/* - */

const DataCreate = ref({ tipo: 'Inventariable', iva_compra: '19.00', iva_venta: '19.00', lots: [] });
const createErrors = ref([]);
const createData = async () => {
    const confirmed = await confirmAction('¿Estás listo para guardar?', 'Guardar');

    if (confirmed) {
        const { status, error, errors } = await sendRequest('POST', '/items', DataCreate.value, true, '/items', 'multipart/form-data');

        if (status === 422) {
            createErrors.value = errors;
        }
    }
}
</script>