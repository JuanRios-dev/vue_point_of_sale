<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { deleteItem } from '@/requestHandler';
import Dashboard from '@/layouts/DashboardLayout.vue'
import StartPage from '@/components/partials/StartPage.vue'
import Button from '@/components/Button.vue'
import Table from '@/components/Table.vue'
import { openModal } from '@/components/Modal.vue';
import CompanyCreate from '@/views/Companies/Create.vue'
import CompanyEdit from '@/views/Companies/Edit.vue'
import SearchData from '@/components/SearchData'
import * as tables from '@/data/TableData'
import { useAuthStore } from '@/auth';
const auth = useAuthStore();

const pageTitle = 'Listado de Empresas'
const breadcrumbs: Array[] = [
    { label: 'Alernal', url: "/" },
    { label: 'Empresas', },
];

//METODO PARA ABRIR MODAL DE EDITAR
const DataUpdate = ref({ tipo_documento: 'CC' });
const editData = async (id) => {
    const response = await axios.get(`/companies/${id}`);
    DataUpdate.value = { ...response.data.company };
    openModal('modalUpdate');
};

/* LISTAR DATOS */
const dataList = ref([]);
const currentPage = ref();
const lastPage = ref();
const perPage = ref();
const Search = ref(' ');

const getData = async (page) => {
    const response = await axios.get(`/companies?page=${page}&search=${Search.value}`);
    dataList.value = response.data.companies.data;
    currentPage.value = response.data.companies.current_page;
    lastPage.value = response.data.companies.last_page;
    perPage.value = response.data.companies.per_page;
}

onMounted(() => { getData(1) });
</script>

<template>
    <Dashboard>
        <StartPage :breadcrumbs="breadcrumbs" :page-title="pageTitle"></StartPage>

        <Table @update:currentPage="(page) => { currentPage = page, getData(page) }" :current-page="currentPage"
            :last-page="lastPage" :per-page="perPage">
            <template v-slot:t-header>
                <div>
                    <Button :style="'btn-primary mr-1'" :title="'Add create'" :icon="'fa fa-edit'"
                        @click="openModal('modalCreate')"></Button>
                </div>

                <SearchData @search-input="(value) => {
                    getData(1); Search = value;
                    if (!value.trim()) {
                        getData(1);
                    } else {
                        getData(currentPage);
                    }
                }"></SearchData>
            </template>
            <template v-slot:thead>
                <th>ID</th>
                <th>NIT</th>
                <th>NOMBRE</th>
                <th>DIRECCION</th>
                <th>TELEFONO</th>
                <th>CORREO</th>
                <th>PAIS</th>
                <th>MONEDA</th>
                <th>CODIGO POSTAL</th>
                <th>ACCIÓN</th>
            </template>
            <template v-slot:tbody>
                <tr v-for="(data, index) in dataList" :key="index">
                    <td>{{ ++index }}</td>
                    <td>{{ data.nit }}</td>
                    <td>{{ data.nombre }}</td>
                    <td>{{ data.direccion }}</td>
                    <td>{{ data.telefono }}</td>
                    <td>{{ data.correo }}</td>
                    <td>{{ data.pais }}</td>
                    <td>{{ data.moneda }}</td>
                    <td>{{ data.codigo_postal }}</td>
                    <td>
                        <a href="#" @click="editData(data.id)" class="mr-2"><i class="fas fa-edit"></i></a>
                        <a href="#" @click="deleteItem(data.nombre, `/companies/${data.id}`, null, async () => {
                            getData(1);
                        }, async (response) => {
                            if(response && response.data && response.data.companies){
                                await auth.refreshCompanies(response.data.companies);
                            }
                        })" class="text-danger"><i class="fas fa-trash"></i></a>
                    </td>
                </tr>
            </template>
        </Table>

        <CompanyCreate @created="getData(1)"></CompanyCreate>
        <CompanyEdit :Data="DataUpdate" @updated="getData(currentPage)"></CompanyEdit>
    </Dashboard>
</template>
