<template>
    <Dashboard>
        <StartPage :breadcrumbs="breadcrumbs" :page-title="pageTitle" />
    </Dashboard>
</template>

<script setup lang="ts">
import Dashboard from '@/layouts/DashboardLayout.vue'
import StartPage from '@/components/partials/StartPage.vue'

const pageTitle = 'Dashboard'
const breadcrumbs: Array[] = [
    { label: 'Alernal', },
    { label: 'Dashboard', },
];

</script>