<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import CustomerForm from '@/components/forms/CustomerForm.vue'
import { sendRequest } from '@/requestHandler';
import Modal from '@/components/Modal.vue'
import Button from '@/components/Button.vue'
import * as tables from '@/data/TableData'
import { closeModal } from '@/components/Modal.vue';
import { useAuthStore } from '@/auth';
const auth = useAuthStore();

const emit = defineEmits(['created']);

/* REGISTRO DE CLIENTE */

const DataCreate = ref<tables.Customer>({ });
const createErrors = ref([])
const createData = async () => {
    const { status, error, errors, data } = await sendRequest('POST', '/companies', DataCreate.value);

    if (status === 201) {
        closeModal('modalCreate');
        tables.clearFormData(DataCreate.value, {});

        createErrors.value = [];

        await auth.refreshCompanies(data.companies);
        emit('created');
    } else if (status === 422) {
        createErrors.value = errors;
    }

}
</script>

<template>
    <Modal :modalId="'modalCreate'" :title="'Formulario de Empresa'">
        <template v-slot:body>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="nit" class="control-label">Documento</label>
                        <input type="text" class="form-control" :class="{ 'is-invalid': createErrors['nit'] }"
                            id="nit" placeholder="Documento" v-model="DataCreate.nit"
                            autocomplete="off">
                        <span v-if="createErrors['nit']" class="invalid-feedback">
                            {{ createErrors['nit'].join(', ') }}
                        </span>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="nombre" class="control-label">Nombre ó Razon Social</label>
                        <input type="text" class="form-control"
                            :class="{ 'is-invalid': createErrors['nombre'] }" id="nombre"
                            placeholder="Nombre" v-model="DataCreate.nombre" autocomplete="off">
                        <span v-if="(createErrors['nombre'])" class="invalid-feedback">
                            {{ createErrors['nombre'].join(', ') }}
                        </span>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="telefono" class="control-label">Teléfono</label>
                        <input type="text" class="form-control" :class="{ 'is-invalid': createErrors['telefono'] }"
                            id="telefono" placeholder="Telefono" v-model="DataCreate.telefono" autocomplete="off">
                        <span v-if="createErrors['telefono']" class="invalid-feedback">
                            {{ createErrors['telefono'].join(', ') }}
                        </span>
                    </div>

                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="correo" class="control-label">Correo</label>
                        <input type="text" class="form-control" :class="{ 'is-invalid': createErrors['correo'] }"
                            id="correo" placeholder="Correo Electronico" v-model="DataCreate.correo" autocomplete="off">
                        <span v-if="createErrors['correo']" class="invalid-feedback">
                            {{ createErrors['correo'].join(', ') }}
                        </span>
                    </div>

                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="direccion" class="control-label">Dirección</label>
                        <input type="text" class="form-control" :class="{ 'is-invalid': createErrors['direccion'] }"
                            id="direccion" placeholder="Dirección" v-model="DataCreate.direccion" autocomplete="off">
                        <span v-if="createErrors['direccion']" class="invalid-feedback">
                            {{ createErrors['direccion'].join(', ') }}
                        </span>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="pais" class="control-label">Pais</label>
                        <input type="text" class="form-control" :class="{ 'is-invalid': createErrors['pais'] }"
                            id="pais" placeholder="pais" v-model="DataCreate.pais" autocomplete="off">
                        <span v-if="createErrors['pais']" class="invalid-feedback">
                            {{ createErrors['pais'].join(', ') }}
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