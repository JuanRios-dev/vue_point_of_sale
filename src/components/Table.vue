<script>
import Button from './Button.vue'
export default {
    components: {
        Button
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
    <div class="row">
        <div class="col-12">

            <div class="d-flex justify-content-between align-items-center mb-2">
                <Button :color="'btn-primary'" :title="'Add cliente'" :icon="'mdi mdi-plus-circle'"></Button>
            </div>

            <div class="table-responsive">
                <table class="table table-sm table-hover bg-white">
                    <thead class="thead-dark">
                        <tr>
                            <slot name="thead"></slot>
                        </tr>
                    </thead>
                    <tbody>
                        <slot name="tbody"></slot>
                    </tbody>
                </table>
            </div>

        </div>
    </div>
</template>