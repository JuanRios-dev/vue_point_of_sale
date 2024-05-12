<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { deleteItem } from '@/requestHandler';
import Dashboard from '@/layouts/DashboardLayout.vue'
import StartPage from '@/components/partials/StartPage.vue'
import Button from '@/components/Button.vue'
import Table from '@/components/Table.vue'
import { openModal } from '@/components/Modal.vue';
import ProviderCreate from '@/views/Providers/Create.vue'
import ProviderEdit from '@/views/Providers/Edit.vue'
import SearchData from '@/components/SearchData'
import * as tables from '@/data/TableData'

const pageTitle = 'Listado de Proveedores'
const breadcrumbs: Array[] = [
    { label: 'Alernal', url: "/" },
    { label: 'Proveedores', },
];

//METODO PARA ABRIR MODAL DE EDITAR
const DataUpdate = ref<tables.Provider>({ tipo_documento: 'CC' });
const editData = async (id) => {
    const response = await axios.get(`/providers/${id}`);
    DataUpdate.value = { ...response.data.provider };
    openModal('modalUpdate');
};

/* LISTAR DATOS */
const providers = ref([]);
const currentPage = ref();
const lastPage = ref();
const perPage = ref();
const Search = ref('');

const getProviders = async (page, search = '') => {
    const response = await axios.get(`/providers?page=${page}&search=${Search.value}`);
    providers.value = response.data.providers.data;
    currentPage.value = response.data.providers.current_page;
    lastPage.value = response.data.providers.last_page;
    perPage.value = response.data.providers.per_page;
}

onMounted(() => { getProviders(1) });
</script>

<template>
    <Dashboard>
        <StartPage :breadcrumbs="breadcrumbs" :page-title="pageTitle"></StartPage>

        <Table @update:currentPage="(page) => { currentPage = page, getProviders(page) }" :current-page="currentPage"
            :last-page="lastPage" :per-page="perPage">
            <template v-slot:t-header>
                <div>
                    <Button :style="'btn-primary mr-1'" :title="'Add create'" :icon="'fa fa-edit'"
                        @click="openModal('modalCreate')"></Button>
                </div>

                <SearchData @search-input="(value) => { getProviders(1); Search = value; }"></SearchData>
            </template>
            <template v-slot:thead>
                <th>ID</th>
                <th>TIPO</th>
                <th>DOCUMENTO</th>
                <th>NOMBRE</th>
                <th>TELEFONO</th>
                <th>CORREO</th>
                <th>DIRECCION</th>
                <th>MUNICIPIO</th>
                <th>ACCIÓN</th>
            </template>
            <template v-slot:tbody>
                <tr v-for="(provider, index) in providers" :key="index">
                    <td>{{ ++index }}</td>
                    <td>{{ provider.tipo_documento }}</td>
                    <td>{{ provider.numero_documento }}</td>
                    <td>{{ provider.nombre_razonsocial }}</td>
                    <td>{{ provider.telefono }}</td>
                    <td>{{ provider.correo }}</td>
                    <td>{{ provider.direccion }}</td>
                    <td>{{ provider.municipio }}</td>
                    <td>
                        <a href="#" @click="editData(provider.id)" class="mr-2"><i class="fas fa-edit"></i></a>
                        <a href="#"
                            @click="deleteItem(provider.nombre_razonsocial, `/providers/${provider.id}`, null, () => getProviders(1))"
                            class="text-danger"><i class="fas fa-trash"></i></a>
                    </td>
                </tr>
            </template>
        </Table>

        <ProviderCreate @created="getProviders(1)"></ProviderCreate>
        <ProviderEdit :Data="DataUpdate" @updated="getProviders(currentPage)" ></ProviderEdit>
    </Dashboard>
</template>
