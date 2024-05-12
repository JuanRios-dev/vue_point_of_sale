<script>
export default {
    props: {
        currentPage: Number,
        lastPage: Number,
        perPage: Number,
        usePagination: {
            type: Boolean,
            default: true
        }
    },
    mounted() {
        this.generatePageList();
    },
    methods: {
        prevPage() {
            if (this.currentPage > 1) {
                this.$emit('update:currentPage', this.currentPage - 1);
            }
        },
        nextPage() {
            if (this.currentPage < this.lastPage) {
                this.$emit('update:currentPage', this.currentPage + 1);
            }
        },
        changePage(page) {
            this.$emit('update:currentPage', page);
        },
        generatePageList() {
            this.pages = [];
            for (let i = 1; i <= this.lastPage; i++) {
                this.pages.push(i);
            }
        }
    },
    watch: {
        lastPage() {
            this.generatePageList();
        }
    },
    data() {
        return {
            pages: []
        };
    }
}
</script>

<template>
    <div class="row">
        <div class="col-12">

            <div class="d-flex justify-content-between align-items-center mb-2">
                <slot name="t-header"></slot>
            </div>

            <div class="table-responsive">
                <table class="table table-hover bg-white">
                    <thead class="thead-dark">
                        <tr>
                            <slot name="thead"></slot>
                        </tr>
                    </thead>
                    <tbody>
                        <slot name="tbody"></slot>
                    </tbody>
                    <tfoot>
                        <slot name="tfooter"></slot>
                    </tfoot>
                </table>
                <nav v-if="usePagination" aria-label="Page navigation example">
                    <ul class="pagination justify-content-end">
                        <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
                            <a class="page-link" @click="prevPage" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>
                        <li v-for="page in lastPage" :key="page" class="page-item"
                            :class="{ 'active': page === currentPage }">
                            <a class="page-link" @click="changePage(page)">{{ page }}</a>
                        </li>
                        <li class="page-item" :class="{ 'disabled': currentPage === lastPage }">
                            <a class="page-link" @click="nextPage" aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </div>
</template>