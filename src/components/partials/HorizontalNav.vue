<template>
    <div class="topbar-menu">
        <div class="container-fluid">
            <div id="navigation" :class="{ 'open': isMenuOpen }">
                <!-- Navigation Menu-->
                <ul class="navigation-menu">
                    <template v-for="(item, index) in navItems" :key="index">
                        <NavDetails :title="item.title" :link="item.link" :icon="item.icon" :items="item.items"></NavDetails>
                    </template>
                </ul>
                <!-- End navigation menu -->
                <div class="clearfix"></div>
            </div>
            <!-- end #navigation -->
        </div>
        <!-- end container -->
    </div>
    <!-- end navbar-custom -->
</template>

<script setup>
import { navItems } from '@/data/NavItems.ts'
import NavDetails from './NavDetails.vue'
import { defineProps } from 'vue'

defineProps(['isMenuOpen']);
</script>