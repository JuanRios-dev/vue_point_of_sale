<script>
export default {
    props: {
        btnColor: {
            type: String,
        },
        btnTitle: {
            type: String,
        },
        btnIcon: {
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
    <div class="row">
        <div class="col-12">

            <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="">
                    <slot name="btn"></slot>
                </div>

                <form class="app-search">
                    <div class="app-search-box">
                        <div class="input-group">
                            <input type="text" class="form-control" placeholder="Search...">
                            <div class="input-group-append">
                                <button class="btn btn-dark" type="submit">
                                    <i class="fe-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
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