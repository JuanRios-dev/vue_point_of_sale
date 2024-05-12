<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import WineryForm from '@/components/forms/WineryForm.vue'
import { sendRequest } from '@/requestHandler';
import Modal from '@/components/Modal.vue'
import Button from '@/components/Button.vue'
import * as tables from '@/data/TableData'
import { closeModal } from '@/components/Modal.vue';

const props = defineProps({
    Data: Object
});

const emit = defineEmits(['updated']);

/* EDITAR CLIENTE */

const updateErrors = ref([])

const updateData = async () => {
    const { status, error, errors } = await sendRequest('PUT', `/wineries/${props.Data.id}`, props.Data);

    if (status === 200) {
        closeModal('modalUpdate');
        tables.clearFormData(props.Data, {});
        updateErrors.value = [];
        emit('updated');
    }
    if (status === 422) {
        updateErrors.value = errors;
    }
}
</script>

<template>
    <Modal :modalId="'modalUpdate'" :title="'Formulario de Bodegas'">
        <template v-slot:body>
            <WineryForm :formData="Data" :infoErrors="updateErrors"></WineryForm>
        </template>
        <template v-slot:footer>
            <Button :style="'btn-primary mr-1'" :title="'Guardar'" :icon="'fa fa-edit'" @click="updateData()"></Button>
        </template>
    </Modal>
</template>