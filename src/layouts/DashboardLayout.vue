<script setup>
import Topbar from '@/components/partials/Topbar.vue'
import HorizontalNav from '@/components/partials/HorizontalNav.vue'
import Footer from '@/components/partials/Footer.vue'
import { ref } from 'vue'

const isMenuOpen = ref(false)

const handleMenuToggled = (isOpen) => {
    isMenuOpen.value = isOpen;
}
</script>

<template>
    <!-- Navigation Bar-->
    <header id="topnav">
        <Topbar @menuToggled="handleMenuToggled"></Topbar>
        <HorizontalNav :isMenuOpen="isMenuOpen"></HorizontalNav>
    </header>
    <!-- End Navigation Bar-->

    <!-- ============================================================== -->
    <!-- Start Page Content here -->
    <!-- ============================================================== -->

    <div class="wrapper">
        <div class="container-fluid">
            <slot></slot>
        </div>
    </div>

    <!-- ============================================================== -->
    <!-- End Page content -->
    <!-- ============================================================== -->

    <Footer></Footer>

</template>

<style></style>