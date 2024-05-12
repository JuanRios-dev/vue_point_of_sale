<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { deleteItem } from '@/requestHandler';
import StartPage from '@/components/partials/StartPage.vue'
import Dashboard from '@/layouts/DashboardLayout.vue'
import Table from '@/components/Table.vue'
import Button from '@/components/Button.vue'
import SearchData from '@/components/SearchData'

const pageTitle = 'Listado de Facturas de Proveedor'
const breadcrumbs: Array[] = [
    { label: 'Alernal', url: "/" },
    { label: 'Factura de Proveedor', },
];

/* LISTAR DATOS */
const providerInvoices = ref([]);
const currentPage = ref();
const lastPage = ref();
const perPage = ref();
const Search = ref('');

const getProviderInvoice = async (page, search = '') => {
    const response = await axios.get(`/provider-invoices?page=${page}&search=${Search.value}`);
    providerInvoices.value = response.data.provider_invoices.data;
    currentPage.value = response.data.provider_invoices.current_page;
    lastPage.value = response.data.provider_invoices.last_page;
    perPage.value = response.data.provider_invoices.per_page;
}

onMounted(() => { getProviderInvoice(1) });
</script>

<template>
    <Dashboard>
        <StartPage :breadcrumbs="breadcrumbs" :page-title="pageTitle"></StartPage>

        <Table @update:currentPage="(page) => { currentPage = page, getProviderInvoice(page) }" :current-page="currentPage"
            :last-page="lastPage" :per-page="perPage">
            <template v-slot:t-header>
                <div>
                    <Button :style="'btn-primary mr-1'" :title="'Add create'" :icon="'fa fa-edit'"
                        href="/provider-invoices/create"></Button>
                </div>

                <SearchData @search-input="(value) => { getProviderInvoice(1); Search = value; }"></SearchData>
            </template>
            <template v-slot:thead>
                <th>ID</th>
                <th>PROVEEDOR</th>
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
                <tr v-for="(providerInvoice, index) in providerInvoices" :key="index">
                    <td>{{ ++index }}</td>
                    <td>{{ providerInvoice.provider.nombre_razonsocial }}</td>
                    <td>{{ providerInvoice.codigo }}</td>
                    <td>{{ providerInvoice.fecha }}</td>
                    <td>{{ providerInvoice.formaPago }}</td>
                    <td>{{ providerInvoice.valorDescuento }}</td>
                    <td>{{ providerInvoice.subTotal }}</td>
                    <td>{{ providerInvoice.totalImpuestos }}</td>
                    <td>{{ providerInvoice.total }}</td>
                    <td>
                        <a :href="`/provider-invoices/show/${providerInvoice.id}`" class="text-info"><i class="fas fa-eye"></i></a>
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