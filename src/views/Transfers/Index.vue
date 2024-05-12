<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { deleteItem } from '@/requestHandler';
import StartPage from '@/components/partials/StartPage.vue'
import Dashboard from '@/layouts/DashboardLayout.vue'
import Table from '@/components/Table.vue'
import Button from '@/components/Button.vue'
import SearchData from '@/components/SearchData'

const pageTitle = 'Listado de traslados entre bodegas'
const breadcrumbs: Array[] = [
    { label: 'Alernal', url: "/" },
    { label: 'Traslados', },
];

/* LISTAR DATOS */
const transfers = ref([]);
const currentPage = ref();
const lastPage = ref();
const perPage = ref();
const Search = ref('');

const getTransfer = async (page, search = '') => {
    const response = await axios.get(`/transfers?page=${page}&search=${Search.value}`);
    transfers.value = response.data.tranferWineries.data;
    currentPage.value = response.data.tranferWineries.current_page;
    lastPage.value = response.data.tranferWineries.last_page;
    perPage.value = response.data.tranferWineries.per_page;
}

onMounted(() => { getTransfer(1) });
</script>

<template>
    <Dashboard>
        <StartPage :breadcrumbs="breadcrumbs" :page-title="pageTitle"></StartPage>

        <Table @update:currentPage="(page) => { currentPage = page, getTransfer(page) }" :current-page="currentPage"
            :last-page="lastPage" :per-page="perPage">
            <template v-slot:t-header>
                <div>
                    <Button :style="'btn-primary mr-1'" :title="'Add create'" :icon="'fa fa-edit'"
                        href="/transfers/create"></Button>
                </div>

                <SearchData @search-input="(value) => { getTransfer(1); Search = value; }"></SearchData>
            </template>
            <template v-slot:thead>
                <th>ID</th>
                <th>BODEGA ORIGEN</th>
                <th>BODEGA DESTINO</th>
                <th>FECHA</th>
                <th>DETALLES</th>
                <th>ACCIÓN</th>
            </template>
            <template v-slot:tbody>
                <tr v-for="(transfer, index) in transfers" :key="index">
                    <td>{{ ++index }}</td>
                    <td>{{ transfer.origen.nombre }}</td>
                    <td>{{ transfer.destino.nombre }}</td>
                    <td>{{ transfer.fecha }}</td>
                    <td>{{ transfer.detalles }}</td>
                    <td>
                        <a :href="`/transfers/show/${transfer.id}`" class="text-info"><i class="fas fa-eye"></i></a>
                    </td>
                </tr>
            </template>
        </Table>

    </Dashboard>
</template>