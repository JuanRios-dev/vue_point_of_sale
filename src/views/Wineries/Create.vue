<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import WineryForm from '@/components/forms/WineryForm.vue'
import { sendRequest } from '@/requestHandler';
import Modal from '@/components/Modal.vue'
import Button from '@/components/Button.vue'
import * as tables from '@/data/TableData'
import { closeModal } from '@/components/Modal.vue';

const emit = defineEmits(['created']);

/* REGISTRO DE CLIENTE */

const DataCreate = ref<tables.Winery>({});
const createErrors = ref([])
const createData = async () => {
    const { status, error, errors } = await sendRequest('POST', '/wineries', DataCreate.value);

    if (status === 201) {
        closeModal('modalCreate');
        tables.clearFormData(DataCreate.value, {});

        createErrors.value = [];

        emit('created');
    } else if (status === 422) {
        createErrors.value = errors;
    }

}
</script>

<template>
    <Modal :modalId="'modalCreate'" :title="'Formulario de Bodegas'">
        <template v-slot:body>
            <WineryForm :formData="DataCreate" :infoErrors="createErrors"></WineryForm>
        </template>
        <template v-slot:footer>
            <Button :style="'btn-primary mr-1'" :title="'Guardar'" :icon="'fa fa-edit'" @click="createData()"></Button>
        </template>
    </Modal>
</template>