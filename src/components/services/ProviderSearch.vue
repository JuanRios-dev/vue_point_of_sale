<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import { sendRequest } from '@/requestHandler';
import Modal from '@/components/Modal.vue'
import ProviderForm from '@/components/forms/ProviderForm.vue'
import { closeModal, openModal } from '@/components/Modal.vue';
import Button from '@/components/Button.vue'
import * as tables from '@/data/TableData'

const customerQuery = ref('');
const customerResults = ref([]);
const customerData = ref({});
const customerFormData = ref({ tipo_documento: 'CC', responsable_iva: 1 });
const customersFormErrors = ref([])
let searchTimeout = null;

const emit = defineEmits(['customerSelected']);

//BUSCADOR

const customerSearch = async () => {
    if (searchTimeout !== null) {
        clearTimeout(searchTimeout);
    }

    searchTimeout = setTimeout(async () => {
        const response = await axios.get(`/providers?search=${customerQuery.value}`);
        customerResults.value = response.data.providers.data;
    }, 300);
}

//SELECCIÓN
const customerSelect = (customer) => {
    customerData.value = customer;
    customerQuery.value = '';
    emit('customerSelected', { providerId: customer.id, responsableIva: customer.responsable_iva });
    closeModal('modalSearchCustomers');
}

//AGREGAR
const customerFormCreate = async () => {
    const { status, error, errors } = await sendRequest('POST', '/providers', customerFormData.value);

    if (status === 201) {
        closeModal('modalCreateCustomer');
        customerData.value.numero_documento = customerFormData.value.numero_documento;
        tables.clearFormData(customerFormData.value, { tipo_documento: 'CC', responsable_iva: 1 });
        customersFormErrors.value = [];
    }
    if (status === 422) {
        customersFormErrors.value = errors;
    }

}
</script>

<template>
    <div class="form-group">
        <label for="customer">Proveedor</label>
        <div class="input-group">
            <input type="text" id="customer" v-model="customerData.numero_documento" class="form-control"
                placeholder="Ej: 1004567378" disabled>
            <div class="input-group-append">
                <Button :style="'btn-dark text-light'" :title="''" :icon="'fe-search'"
                    @click="openModal('modalSearchCustomers')"></Button>
            </div>
        </div>
        <slot></slot>
    </div>

    <!-- Modal para buscar clientes -->
    <Modal :modalId="'modalSearchCustomers'" :title="'Buscar Cliente'">
        <template v-slot:body>
            <div class="form-group">
                <div class="input-group">
                    <input type="text" id="example-input-small" class="form-control" v-model="customerQuery"
                        placeholder="Ej: 1005636486 o Luis Martinez" @input="customerSearch()" autocomplete="off">
                </div>
            </div>

            <ul v-if="customerQuery.length > 0" class="list-group mt-2" style="max-height: 320px; overflow-y: auto;">
                <a v-for="(customer, index) in customerResults.slice(0, 5)" :key="index"
                    @click="customerSelect(customer)" style="cursor: pointer;"
                    class="list-group-item list-group-item-action">
                    <div class="d-flex w-100 justify-content-between align-items-center">
                        <div>
                            <h5 class="mb-1">{{ customer.nombre_razonsocial }}</h5>
                            <p class="mb-1">{{ customer.direccion }}</p>
                            <small class="text-muted">{{ customer.telefono }}</small>
                        </div>
                        <span class="badge bg-danger rounded-pill">{{ customer.numero_documento }}</span>
                    </div>
                </a>
            </ul>
        </template>
        <template v-slot:footer>
            <Button :style="'btn-purple text-light'" :title="'Agregar Cliente'" :icon="'fe-plus-square'"
                @click="() => { closeModal('modalSearchCustomers'); openModal('modalCreateCustomer'); }"></Button>
        </template>
    </Modal>

    <!-- Modal para agregar cliente -->
    <Modal :modalId="'modalCreateCustomer'" :title="'Formulario de Cliente'">
        <template v-slot:body>
            <ProviderForm :formData="customerFormData" :infoErrors="customersFormErrors"></ProviderForm>
        </template>
        <template v-slot:footer>
            <Button :style="'btn-primary mr-1'" :title="'Guardar'" :icon="'fa fa-edit'"
                @click="customerFormCreate()"></Button>
        </template>
    </Modal>
</template>