<script>
export default {
    mounted() {},
    beforeUnmount() {
    },
    props: {
        modalId: {
            type: String,
            required: true
        },
        title: {
            type: String,
            default: 'Modal Title'
        },
    },
    methods: {
        closeModal() {
            const modal = document.getElementById(this.modalId);
            if (modal) {
                modal.classList.remove('show');
                modal.style.display = 'none';
            }
        }
    },
};

export const closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
    }
};

export const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        modal.style.display = 'block';
        modal.style.backgroundColor = 'rgba(204, 204, 204, 0.4)';

        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal(modalId);
            }
        });
    }
};
</script>

<template>
    <div :id="modalId" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">{{ title }}</h4>
                    <button type="button" class="close" @click="closeModal">×</button>
                </div>
                <div class="modal-body p-4">
                    <slot name="body"></slot>
                </div>
                <div class="modal-footer">
                    <slot name="footer"></slot>
                </div>
            </div>
        </div>
    </div>
</template>