<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { deleteItem } from '@/requestHandler';
import StartPage from '@/components/partials/StartPage.vue'
import Dashboard from '@/layouts/DashboardLayout.vue'
import Table from '@/components/Table.vue'
import Button from '@/components/Button.vue'
import SearchData from '@/components/SearchData'

const pageTitle = 'Listado de Productos'
const breadcrumbs: Array[] = [
    { label: 'Alernal', url: "/" },
    { label: 'Productos', },
];

/* LISTAR DATOS */
const items = ref([]);
const currentPage = ref();
const lastPage = ref();
const perPage = ref();
const Search = ref('');

const getItems = async (page, search = '') => {
    const response = await axios.get(`/items?page=${page}&search=${Search.value}`);
    items.value = response.data.items.data;
    currentPage.value = response.data.items.current_page;
    lastPage.value = response.data.items.last_page;
    perPage.value = response.data.items.per_page;
}

onMounted(() => { getItems(1) });
</script>

<template>
    <Dashboard>
        <StartPage :breadcrumbs="breadcrumbs" :page-title="pageTitle"></StartPage>

        <Table @update:currentPage="(page) => { currentPage = page, getItems(page) }" :current-page="currentPage"
            :last-page="lastPage" :per-page="perPage">
            <template v-slot:t-header>
                <div>
                    <Button :style="'btn-primary mr-1'" :title="'Add create'" :icon="'fa fa-edit'"
                        href="/items/create"></Button>
                </div>

                <SearchData @search-input="(value) => { getItems(1); Search = value; }"></SearchData>
            </template>
            <template v-slot:thead>
                <th>ID</th>
                <th>IMAGEN</th>
                <th>CODIGO</th>
                <th>NOMBRE</th>
                <th>DESCRIPCION</th>
                <th>PRECIO</th>
                <th>CANTIDAD</th>
                <th>CATEGORIA</th>
                <th>ACCIÓN</th>
            </template>
            <template v-slot:tbody>
                <tr v-for="(item, index) in items" :key="index">
                    <td>{{ ++index }}</td>
                    <td>
                        <div class="thumbnail-preview">
                            <img v-if="item.imagen" :src="$apiBaseUrl + item.imagen" class="thumbnail-image" alt="Thumbnail">
                            <img v-else src="@/assets/images/product_default.png" class="thumbnail-image"
                                alt="Thumbnail">
                        </div>
                    </td>
                    <td>{{ item.codigo }}</td>
                    <td>{{ item.nombre }}</td>
                    <td>{{ item.descripcion }}</td>
                    <td>{{ item.precio }}</td>
                    <td>{{ item.cantidad_total }}</td>
                    <td>{{ item.categoria }}</td>
                    <td>
                        <a :href="`/items/edit/${item.id}`" class="mr-2"><i class="fas fa-edit"></i></a>
                        <a href="#" @click="deleteItem(item.nombre, `/items/${item.id}`, null, () => getItems(1))"
                            class="text-danger"><i class="fas fa-trash"></i></a>
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