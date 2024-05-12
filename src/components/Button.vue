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
    <a href="javascript:void(0)" :class="[style, 'btn']">
        <i :class="[icon]"></i> {{ title }}
    </a>
</template>