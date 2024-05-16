<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import CustomerForm from '@/components/forms/CustomerForm.vue'
import { sendRequest } from '@/requestHandler';
import Modal from '@/components/Modal.vue'
import Button from '@/components/Button.vue'
import * as tables from '@/data/TableData'
import { closeModal } from '@/components/Modal.vue';
import { useAuthStore } from '@/auth';
const auth = useAuthStore();

const props = defineProps({
    Data: Object
});

const emit = defineEmits(['updated']);

/* EDITAR CLIENTE */

const updateErrors = ref([])

const updateData = async () => {
    const { status, error, errors, data } = await sendRequest('PUT', `/companies/${props.Data.id}`, props.Data);

    if (status === 200) {
        closeModal('modalUpdate');
        tables.clearFormData(props.Data, {});
        updateErrors.value = [];
        await auth.refreshCompanies(data.companies);
        emit('updated');
    }
    if (status === 422) {
        updateErrors.value = errors;
    }
}
</script>

<template>
    <Modal :modalId="'modalUpdate'" :title="'Formulario de Empresa'">
        <template v-slot:body>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="nit" class="control-label">Documento</label>
                        <input type="text" class="form-control" :class="{ 'is-invalid': updateErrors['nit'] }" id="nit"
                            placeholder="Documento" v-model="props.Data.nit" autocomplete="off">
                        <span v-if="updateErrors['nit']" class="invalid-feedback">
                            {{ updateErrors['nit'].join(', ') }}
                        </span>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="nombre" class="control-label">Nombre ó Razon Social</label>
                        <input type="text" class="form-control" :class="{ 'is-invalid': updateErrors['nombre'] }"
                            id="nombre" placeholder="Nombre" v-model="props.Data.nombre" autocomplete="off">
                        <span v-if="(updateErrors['nombre'])" class="invalid-feedback">
                            {{ updateErrors['nombre'].join(', ') }}
                        </span>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="telefono" class="control-label">Teléfono</label>
                        <input type="text" class="form-control" :class="{ 'is-invalid': updateErrors['telefono'] }"
                            id="telefono" placeholder="Telefono" v-model="props.Data.telefono" autocomplete="off">
                        <span v-if="updateErrors['telefono']" class="invalid-feedback">
                            {{ updateErrors['telefono'].join(', ') }}
                        </span>
                    </div>

                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="correo" class="control-label">Correo</label>
                        <input type="text" class="form-control" :class="{ 'is-invalid': updateErrors['correo'] }"
                            id="correo" placeholder="Correo Electronico" v-model="props.Data.correo" autocomplete="off">
                        <span v-if="updateErrors['correo']" class="invalid-feedback">
                            {{ updateErrors['correo'].join(', ') }}
                        </span>
                    </div>

                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="direccion" class="control-label">Dirección</label>
                        <input type="text" class="form-control" :class="{ 'is-invalid': updateErrors['direccion'] }"
                            id="direccion" placeholder="Dirección" v-model="props.Data.direccion" autocomplete="off">
                        <span v-if="updateErrors['direccion']" class="invalid-feedback">
                            {{ updateErrors['direccion'].join(', ') }}
                        </span>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="pais" class="control-label">Pais</label>
                        <input type="text" class="form-control" :class="{ 'is-invalid': updateErrors['pais'] }"
                            id="pais" placeholder="pais" v-model="props.Data.pais" autocomplete="off">
                        <span v-if="updateErrors['pais']" class="invalid-feedback">
                            {{ updateErrors['pais'].join(', ') }}
                        </span>
                    </div>
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <Button :style="'btn-primary mr-1'" :title="'Guardar'" :icon="'fa fa-edit'" @click="updateData()"></Button>
        </template>
    </Modal>
</template>