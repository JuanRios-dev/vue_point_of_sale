<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { sendRequest, deleteItem } from '@/requestHandler';
import StartPage from '@/components/partials/StartPage.vue'
import Dashboard from '@/layouts/DashboardLayout.vue'
import ItemForm from '@/components/forms/ItemForm.vue'
import Button from '@/components/Button.vue'
import * as tables from '@/data/TableData'
import Table from '@/components/Table.vue'

const pageTitle = 'Edición de Producto'
const breadcrumbs: Array[] = [
    { label: 'Alernal', url: "/" },
    { label: 'Productos', url: "/items" },
    { label: 'Edición', },
];

/* LISTAR DATOS */

const DataUpdate = ref({});
const updateErrors = ref([])
const itemId = useRouter().currentRoute.value.params.id;

const ItemData = async () => {
    const response = await axios.get(`/items/${itemId}`)
    DataUpdate.value = { ...response.data.item }
}

const updateData = async () => {
    const dataToSend = { ...DataUpdate.value };
    delete dataToSend.imagen;

    const { status, errors } = await sendRequest('PUT', `/items/${DataUpdate.value.id}`, dataToSend, true, null, null);

    if (status === 422) {
        updateErrors.value = errors;
        return;
    }

    // Enviar el archivo
    if (DataUpdate.value.imagen instanceof File) {
        const formData = new FormData();
        formData.append('imagen', DataUpdate.value.imagen);

        const { status, errors } = await sendRequest('POST', `/items/${DataUpdate.value.id}/imagen`, formData, true, null, 'multipart/form-data');

        if (status === 422) {
            updateErrors.value = errors;
        }
    }

    await ItemData();

}

onMounted(() => { ItemData() });

/* LOTES */
const addLote = () => {
    DataUpdate.value.lots.push({
        numero: '',
        fecha_vencimiento: '',
    });
}
</script>

<template>
    <Dashboard>
        <StartPage :breadcrumbs="breadcrumbs" :page-title="pageTitle"></StartPage>

        <ItemForm :formData="DataUpdate" :infoErrors="updateErrors">
            <Button :style="'btn-primary mr-1'" :title="'Guardar'" :icon="'fa fa-edit'" @click="updateData()"></Button>
            <Button :style="'btn-purple mr-1'" :title="'Lote'" :icon="'fa fa-plus'" @click="addLote()"></Button>
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
                        <tr v-for="(lot, index) in DataUpdate.lots" :key="index">
                            <td>{{ i = index + 1 }}</td>
                            <td>
                                <input type="text" class="form-control-sm" v-model="lot.numero" style="width: 150px;"
                                    autocomplete="off"
                                    :class="{ 'is-invalid': updateErrors['lots.' + index + '.numero'] }">
                                <span v-if="updateErrors['lots.' + index + '.numero']" class="text-danger">
                                    *
                                </span>
                            </td>
                            <td>
                                <input type="date" class="form-control-sm" v-model="lot.fecha_vencimiento"
                                    style="width: 150px;" autocomplete="off">
                                <span v-if="updateErrors['lots.' + index + '.fecha_vencimiento']" class="text-danger">
                                    *
                                </span>
                            </td>
                            <td>
                                <a class="text-danger"  @click="lot.id ? deleteItem(lot.numero, `/lots/${lot.id}`, null, () => { DataUpdate.lots.splice(index, 1)}) : DataUpdate.lots.splice(index, 1)">
                                    <i class="fas fa-trash"></i></a>
                            </td>
                        </tr>
                    </template>
                </Table>
            </div>
        </div>
    </Dashboard>
</template>