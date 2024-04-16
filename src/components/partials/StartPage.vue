<template>
    <div class="row">
        <div class="col-12">
            <div class="page-title-box">
                <div class="page-title-right">
                    <ol class="breadcrumb m-0">
                        <template v-for="(breadcrumb, index) in breadcrumbs" :key="index">
                            <li class="breadcrumb-item" :class="{ 'active': index === breadcrumbs.length - 1 }">
                                <a v-if="index !== breadcrumbs.length - 1" :href="breadcrumb.url">{{ breadcrumb.label
                                    }}</a>
                                <span v-else>{{ breadcrumb.label }}</span>
                            </li>
                        </template>
                    </ol>
                </div>
                <h4 class="page-title">{{ pageTitle }}</h4>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        breadcrumbs: {
            type: Array,
            default: () => []
        },
        pageTitle: {
            type: String,
            default: 'Dashboard'
        }
    }
};
</script>