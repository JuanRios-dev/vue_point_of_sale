<script>
export default {
    props: {
        color: {
            type: String,
        },
        title: {
            type: String,
        },
        icon: {
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
    <button type="button" :class="[color, 'btn', 'btn-sm']">
        <i :class="[icon]"></i> {{ title }}
    </button>
</template>