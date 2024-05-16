<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import ProviderForm from '@/components/forms/ProviderForm.vue'
import { sendRequest } from '@/requestHandler';
import Modal from '@/components/Modal.vue'
import Button from '@/components/Button.vue'
import * as tables from '@/data/TableData'
import { closeModal } from '@/components/Modal.vue';

const emit = defineEmits(['created']);

/* REGISTRO DE CLIENTE */

const DataCreate = ref({ tipo_documento: 'CC', responsable_iva: 1 });
const createErrors = ref([])
const createData = async () => {
    const { status, error, errors } = await sendRequest('POST', '/providers', DataCreate.value);

    if (status === 201) {
        closeModal('modalCreate');
        tables.clearFormData(DataCreate.value, { tipo_documento: 'CC', responsable_iva: 1  });

        createErrors.value = [];

        emit('created');
    } else if (status === 422) {
        createErrors.value = errors;
    }

}
</script>

<template>
    <Modal :modalId="'modalCreate'" :title="'Formulario de Proveedores'">
        <template v-slot:body>
            <ProviderForm :formData="DataCreate" :infoErrors="createErrors"></ProviderForm>
        </template>
        <template v-slot:footer>
            <Button :style="'btn-primary mr-1'" :title="'Guardar'" :icon="'fa fa-edit'" @click="createData()"></Button>
        </template>
    </Modal>
</template>