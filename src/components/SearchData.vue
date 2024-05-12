<script>
export default {
    props: {
    },
    emits: ['search-input'],
    methods: {
        SearchValue(value) {
            this.$emit('search-input', value);
        },
    },
    data() {
        return {

        };
    }
}
</script>

<template>
    <div class="app-search-box">
        <div class="input-group">
            <input type="text" class="form-control" placeholder="Search..." @input="SearchValue($event.target.value)">
            <div class="input-group-append">
                <button class="btn btn-dark" type="submit">
                    <i class="fe-search"></i>
                </button>
            </div>
        </div>
    </div>
</template>