<script>
export default {
    props: {
        style: {
            type: String,
        },
        title: {
            type: String,
        },
        icon: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    data() {
        return {

        };
    },
    methods: {

    }
}
</script>

<template>
    <a :href="url" :class="[style, 'btn']">
        <i :class="[icon]"></i> {{ title }}
    </a>
</template>