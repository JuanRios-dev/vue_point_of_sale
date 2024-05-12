<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { deleteItem } from '@/requestHandler';
import StartPage from '@/components/partials/StartPage.vue'
import Dashboard from '@/layouts/DashboardLayout.vue'
import Table from '@/components/Table.vue'
import Button from '@/components/Button.vue'
import SearchData from '@/components/SearchData'

const pageTitle = 'Listado de Ventas'
const breadcrumbs: Array[] = [
    { label: 'Alernal', url: "/" },
    { label: 'Listado de Ventas', },
];

/* LISTAR DATOS */
const sales = ref([]);
const currentPage = ref();
const lastPage = ref();
const perPage = ref();
const Search = ref('');

const getSales = async (page, search = '') => {
    const response = await axios.get(`/sales?page=${page}&search=${Search.value}`);
    sales.value = response.data.sales.data;
    currentPage.value = response.data.sales.current_page;
    lastPage.value = response.data.sales.last_page;
    perPage.value = response.data.sales.per_page;
}

onMounted(() => { getSales(1) });


</script>

<template>
    <Dashboard>
        <StartPage :breadcrumbs="breadcrumbs" :page-title="pageTitle"></StartPage>

        <Table @update:currentPage="(page) => { currentPage = page, getSales(page) }" :current-page="currentPage"
            :last-page="lastPage" :per-page="perPage">
            <template v-slot:t-header>
                <div>
                    <Button :style="'btn-primary mr-1'" :title="'Add create'" :icon="'fa fa-edit'"
                        href="/sales/create"></Button>
                </div>

                <SearchData @search-input="(value) => { getSales(1); Search = value; }"></SearchData>
            </template>
            <template v-slot:thead>
                <th>ID</th>
                <th>CLIENTE</th>
                <th>CODIGO</th>
                <th>FECHA</th>
                <th>METODO DE PAGO</th>
                <th>VALOR DESCUENTO</th>
                <th>SUBTOTAL</th>
                <th>IMPUESTOS</th>
                <th>TOTAL</th>
                <th>ACCIÓN</th>
            </template>
            <template v-slot:tbody>
                <tr v-for="(sale, index) in sales" :key="index">
                    <td>{{ ++index }}</td>
                    <td>{{ sale.customer.nombre_razonsocial }}</td>
                    <td>{{ sale.prefijo }} - {{ sale.numero }}</td>
                    <td>{{ sale.fecha }}</td>
                    <td>{{ sale.formaPago }}</td>
                    <td>{{ sale.valorDescuento }}</td>
                    <td>{{ sale.subTotal }}</td>
                    <td>{{ sale.totalImpuestos }}</td>
                    <td>{{ sale.total }}</td>
                    <td>
                        <a :href="`/sales/show/${sale.id}`" class="text-info mr-1"><i class="fas fa-eye"></i></a>
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