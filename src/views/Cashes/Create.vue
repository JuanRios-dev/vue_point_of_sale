<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import { sendRequest } from '@/requestHandler';
import Modal from '@/components/Modal.vue'
import Button from '@/components/Button.vue'
import * as tables from '@/data/TableData'
import { closeModal } from '@/components/Modal.vue';

const emit = defineEmits(['created']);

/* REGISTRO DE CLIENTE */

const DataCreate = ref({ });
const createErrors = ref([])
const createData = async () => {
    const { status, error, errors } = await sendRequest('POST', '/cashes', DataCreate.value);

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
    <Modal :modalId="'modalCreate'" :title="'Formulario de Caja'">
        <template v-slot:body>
            <div class="row">
                <div class="col-md-12">
                    <div class="form-group">
                        <label for="nombre" class="control-label">Nombre de Caja</label>
                        <input type="text" class="form-control" :class="{ 'is-invalid': createErrors['nombre'] }"
                            id="nombre" placeholder="Documento" v-model="DataCreate.nombre"
                            autocomplete="off">
                        <span v-if="createErrors['nombre']" class="invalid-feedback">
                            {{ createErrors['nombre'].join(', ') }}
                        </span>
                    </div>
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <Button :style="'btn-primary mr-1'" :title="'Guardar'" :icon="'fa fa-edit'" @click="createData()"></Button>
        </template>
    </Modal>
</template>