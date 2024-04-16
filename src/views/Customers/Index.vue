<script setup lang="ts">
import Dashboard from '@/layouts/DashboardLayout.vue'
import StartPage from '@/components/partials/StartPage.vue'
import Table from '@/components/Table.vue'

const pageTitle = 'Listado de Clientes'
const breadcrumbs: Array[] = [
    { label: 'Alernal', url: "/" },
    { label: 'Clientes', },
];
</script>

<template>
    <Dashboard>
        <StartPage :breadcrumbs="breadcrumbs" :page-title="pageTitle"></StartPage>

        <Table>
            <template v-slot:thead>
                <th>ID</th>
                <th>DOCUMENTO</th>
                <th>NOMBRE</th>
                <th>TELEFONO</th>
                <th>CORREO</th>
                <th>DIRECCION</th>
                <th>MUNICIPIO</th>
                <th>ACCIÓN</th>
            </template>
            <template v-slot:tbody>
                <th>1</th>
                <th>1005663635</th>
                <th>Juan Pablo</th>
                <th>3013673743</th>
                <th>juanrbertel24@gmail.com</th>
                <th>Cra 10 # 17 - 50</th>
                <th>Sincelejo</th>
                <th>
                    <a href="#"><i class="fas fa-edit"></i></a>
                </th>
            </template>
        </Table>
    </Dashboard>
</template>