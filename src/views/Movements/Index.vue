<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { deleteItem } from '@/requestHandler';
import StartPage from '@/components/partials/StartPage.vue'
import Dashboard from '@/layouts/DashboardLayout.vue'
import Table from '@/components/Table.vue'
import Button from '@/components/Button.vue'
import SearchData from '@/components/SearchData'

const pageTitle = 'Listado de Movimientos'
const breadcrumbs: Array[] = [
    { label: 'Alernal', url: "/" },
    { label: 'Movimientos', },
];

/* LISTAR DATOS */
const movements = ref([]);
const currentPage = ref();
const lastPage = ref();
const perPage = ref();
const Search = ref('');

const getMovements = async (page, search = '') => {
    const response = await axios.get(`/movements?page=${page}&search=${Search.value}`);
    movements.value = response.data.movements.data;
    currentPage.value = response.data.movements.current_page;
    lastPage.value = response.data.movements.last_page;
    perPage.value = response.data.movements.per_page;
}

onMounted(() => { getMovements(1) });
</script>

<template>
    <Dashboard>
        <StartPage :breadcrumbs="breadcrumbs" :page-title="pageTitle"></StartPage>

        <Table @update:currentPage="(page) => { currentPage = page, getMovements(page) }" :current-page="currentPage"
            :last-page="lastPage" :per-page="perPage">
            <template v-slot:t-header>
                <div>
                    <Button :style="'btn-primary mr-1'" :title="'Add create'" :icon="'fa fa-edit'"
                        href="/movements/create"></Button>
                </div>

                <SearchData @search-input="(value) => { getMovements(1); Search = value; }"></SearchData>
            </template>
            <template v-slot:thead>
                <th>ID</th>
                <th>BODEGA</th>
                <th>FECHA</th>
                <th>TIPO</th>
                <th>DETALLES</th>
                <th>TOTAL</th>
                <th>ACCIÓN</th>
            </template>
            <template v-slot:tbody>
                <tr v-for="(movement, index) in movements" :key="index">
                    <td>{{ ++index }}</td>
                    <td>{{ movement.winery.nombre }}</td>
                    <td>{{ movement.fecha }}</td>
                    <td>
                        <span :class="{ 'badge badge-success': movement.tipo == 1, 'badge badge-danger': movement.tipo === 0,  }">{{ movement.tipo === 1 ? 'Carga Productos' : 'Descarga Productos' }}</span>
                    </td>
                    <td>{{ movement.detalles }}</td>
                    <td>{{ movement.total }}</td>
                    <td>
                        <a :href="`/movements/show/${movement.id}`" class="text-info"><i class="fas fa-eye"></i></a>
                    </td>
                </tr>
            </template>
        </Table>

    </Dashboard>
</template>

<style scoped>
.thumbnail-preview {
    width: 20px;
    height: 20px;
    overflow: hidden;
    border-radius: 5px;
}

.thumbnail-image {
    width: 100%;
    height: auto;
}
</style>