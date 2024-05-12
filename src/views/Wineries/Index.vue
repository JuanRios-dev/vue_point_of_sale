<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { deleteItem } from '@/requestHandler';
import { sendRequest } from '@/requestHandler';
import Dashboard from '@/layouts/DashboardLayout.vue'
import StartPage from '@/components/partials/StartPage.vue'
import Button from '@/components/Button.vue'
import Table from '@/components/Table.vue'
import { openModal } from '@/components/Modal.vue';
import WineryCreate from '@/views/Wineries/Create.vue'
import WineryEdit from '@/views/Wineries/Edit.vue'
import SearchData from '@/components/SearchData'
import * as tables from '@/data/TableData'

const pageTitle = 'Listado de Bodegas'
const breadcrumbs: Array[] = [
    { label: 'Alernal', url: "/" },
    { label: 'Bodegas', },
];

//METODO PARA ABRIR MODAL DE EDITAR
const DataUpdate = ref<tables.Winery>({});
const editData = async (id) => {
    const response = await axios.get(`/wineries/${id}`);
    DataUpdate.value = { ...response.data.winery };
    openModal('modalUpdate');
};

/* LISTAR DATOS */
const wineries = ref([]);
const currentPage = ref();
const lastPage = ref();
const perPage = ref();
const Search = ref('');

const getWineries = async (page) => {
    const response = await axios.get(`/wineries?page=${page}&search=${Search.value}`);
    wineries.value = response.data.wineries.data;
    currentPage.value = response.data.wineries.current_page;
    lastPage.value = response.data.wineries.last_page;
    perPage.value = response.data.wineries.per_page;
}

onMounted(() => { getWineries(1) });
</script>

<template>
    <Dashboard>
        <StartPage :breadcrumbs="breadcrumbs" :page-title="pageTitle"></StartPage>

        <Table @update:currentPage="(page) => { currentPage = page, getCustomers(page) }" :current-page="currentPage"
            :last-page="lastPage" :per-page="perPage">
            <template v-slot:t-header>
                <div>
                    <Button :style="'btn-primary mr-1'" :title="'Add create'" :icon="'fa fa-edit'"
                        @click="openModal('modalCreate')"></Button>
                </div>

                <SearchData @search-input="(value) => { getWineries(1); Search = value }"></SearchData>
            </template>
            <template v-slot:thead>
                <th>ID</th>
                <th>NOMBRE</th>
                <th>DESCRIPCIÓN</th>
                <th>UBICACIÓN</th>
                <th>PREDETERMINADA</th>
                <th>ACCIÓN</th>
            </template>
            <template v-slot:tbody>
                <tr v-for="(winery, index) in wineries" :key="index">
                    <td>{{ ++index }}</td>
                    <td>{{ winery.nombre }}</td>
                    <td>{{ winery.descripcion }}</td>
                    <td>{{ winery.ubicacion }}</td>
                    <td>
                        <input type="checkbox" :id="'predeterminado_' + winery.id" name="predeterminado"
                            :checked="winery.predeterminada" :disabled="winery.predeterminada"
                            @change="async () => { await sendRequest('POST', '/wineries/' + winery.id, null); getWineries(1) }"
                            >
                    </td>
                    <td>
                        <a href="#" @click="editData(winery.id)" class="mr-2"><i class="fas fa-edit"></i></a>
                        <a href="#"
                            @click="deleteItem(winery.nombre, `/wineries/${winery.id}`, null, () => getWineries(1))"
                            class="text-danger"><i class="fas fa-trash"></i></a>
                    </td>
                </tr>
            </template>
        </Table>

        <WineryCreate @created="getWineries(1)"></WineryCreate>
        <WineryEdit :Data="DataUpdate" @updated="getWineries(currentPage)"></WineryEdit>
    </Dashboard>
</template>
