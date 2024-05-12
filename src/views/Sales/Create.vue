<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { confirmAction, sendRequest } from '@/requestHandler';
import Dashboard from '@/layouts/DashboardLayout.vue'
import StartPage from '@/components/partials/StartPage.vue'
import Button from '@/components/Button.vue'
import Table from '@/components/Table.vue'
import Modal from '@/components/Modal.vue'
import { closeModal, openModal } from '@/components/Modal.vue';
import { component as VueNumber } from '@coders-tm/vue-number-format'
import CustomerSearch from '@/components/services/CustomerSearch.vue';

const pageTitle = 'Venta'
const breadcrumbs: Array[] = [
    { label: 'Alernal', url: "/" },
    { label: 'Listado de Ventas', url: "/sales" },
    { label: 'Venta', },
];

//Formulario de guardado
const DataCreate = ref({
    fecha: new Date().toISOString().split('T')[0],
    formaPago: '',
    descuento: 0.00,
    valorDescuento: 0.00,
    subTotal: 0,
    total: 0,
    totalImpuestos: 0,
    items: []
});

const createErrors = ref([]);
const itemsQuery = ref('');
const itemsResults = ref([]);
const itemData = ref([]);

//BUSCADOR
const itemsSearch = async () => {
    const response = await axios.get(`/items/search?search=${itemsQuery.value}`);
    itemsResults.value = response.data.items;
}

const itemSelect = async (item) => {
    // Buscar si el elemento ya existe en DataCreate
    const existingItemIndex = DataCreate.value.items.findIndex(i => i.item_id === item.id && i.lot_id === item.lot_id);

    if (existingItemIndex !== -1) {
        DataCreate.value.items[existingItemIndex].cantidad++;
    } else {
        // Si el elemento no existe, agregarlo a DataCreate
        DataCreate.value.items.push({
            item_id: item.id,
            cantidad: 1,
            precio_unitario: item.precio,
            descuento: 0,
            valor_descuento: 0,
            subtotal: 0,
            impuestos: 0,
            precio_total: 0,
            lot_id: item.lot_id,
        });

        itemData.value.push({
            codigo: item.codigo,
            nombre: item.nombre,
            numero: item.numero,
            iva_venta: item.iva_venta,
        });

        await calcularPrecioTotal(DataCreate.value.items[DataCreate.value.items.length - 1]);
    }

    // Limpiar la búsqueda y cerrar el modal
    itemsQuery.value = '';
    closeModal('modalSalesProductos');
}

//CALCULOS

const calcularPrecioTotal = async (item) => {
    const index = DataCreate.value.items.indexOf(item);
    item.impuestos = ((item.cantidad * item.precio_unitario) * itemData.value[index].iva_venta) / 100;
    item.valor_descuento = (((item.cantidad * item.precio_unitario) - item.impuestos) * item.descuento) / 100;
    item.subtotal = ((item.cantidad * item.precio_unitario) - item.impuestos) - item.valor_descuento;
    item.precio_total = item.subtotal + item.impuestos;

    await calcularTotales();
}

const calcularTotales = async () => {
    DataCreate.value.totalImpuestos = DataCreate.value.items.reduce((total, item) => {
        return total + item.impuestos;
    }, 0);

    const subtotal = DataCreate.value.items.reduce((total, item) => {
        return total + item.subtotal
    }, 0);

    const descuentoFactura = DataCreate.value.descuento;
    const ValorDescuento = subtotal * (descuentoFactura / 100);

    DataCreate.value.valorDescuento = ValorDescuento;

    DataCreate.value.subTotal = subtotal - ValorDescuento;

    DataCreate.value.total = DataCreate.value.subTotal + DataCreate.value.totalImpuestos;
}

//FUNCION PARA GUARDAR
const DataSave = async () => {
    const confirmed = await confirmAction('¿Estás listo para guardar?', 'Guardar');

    if (confirmed) {
        const { status, data, error, errors } = await sendRequest('POST', '/sales', DataCreate.value, true, null, null);

        if (status === 422) {
            createErrors.value = errors;
        }else if (status === 201) {
            const saleId = data.sale.id;
            window.location.href = `/sales/show/${saleId}`;
        }
    }
}
</script>

<template>
    <Dashboard>
        <StartPage :breadcrumbs="breadcrumbs" :page-title="pageTitle"></StartPage>
        <div class="row">
            <div class="col-md-3">
                <CustomerSearch @customer-selected="(customerId) => { DataCreate.customer_id = customerId }">
                    <span v-if="createErrors['customer_id']" class="invalid-feedback" style="display: block">
                        {{ createErrors['customer_id'].join(', ') }}
                    </span>
                </CustomerSearch>
            </div>

            <div class="col-md-3">
                <div class="form-group">
                    <label for="prefijo" class="control-label">Prefijo</label>
                    <input type="text" class="form-control" :class="{ 'is-invalid': createErrors['prefijo'] }"
                        id="prefijo" placeholder="Ej: FACVNT" v-model="DataCreate.prefijo" autocomplete="off">
                    <span v-if="createErrors['prefijo']" class="invalid-feedback">
                        {{ createErrors['prefijo'].join(', ') }}
                    </span>
                </div>
            </div>

            <div class="col-md-3">
                <div class="form-group">
                    <label for="fecha" class="control-label">Fecha</label>
                    <input type="date" class="form-control" :class="{ 'is-invalid': createErrors['fecha'] }" id="fecha"
                        placeholder="fecha" v-model="DataCreate.fecha" autocomplete="off" disabled>
                    <span v-if="createErrors['fecha']" class="invalid-feedback">
                        {{ createErrors['fecha'].join(', ') }}
                    </span>
                </div>
            </div>

            <div class="col-md-3">
                <div class="form-group">
                    <label for="formaPago">Forma de Pago</label>
                    <select class="form-control" :class="{ 'is-invalid': createErrors['formaPago'] }" id="formaPago"
                        v-model="DataCreate.formaPago">
                        <option value="" disabled>Selecciona</option>
                        <optgroup label="Otras Formas de Pago">
                            <option value="Efectivo">Efectivo</option>
                            <option value="Nequi">Nequi</option>
                        </optgroup>
                    </select>
                    <span v-if="createErrors['formaPago']" class="invalid-feedback">
                        {{ createErrors['formaPago'].join(', ') }}
                    </span>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-3">
                <Button :style="'btn-primary text-light mr-1'" :title="'Agregar Producto'" :icon="'fe-plus-square'"
                    @click="openModal('modalSalesProductos')"></Button>
                <Button :style="'btn-success text-light'" :title="'Guardar'" :icon="'fe-plus-square'"
                    @click="DataSave()"></Button>
            </div>
        </div>

        <Table :usePagination="false">
            <template v-slot:thead>
                <th>PRODUCTO</th>
                <th>LOTE Nº</th>
                <th>CANTIDAD</th>
                <th>PRECIO UNITARIO</th>
                <th>DESCUENTO</th>
                <th>VALOR DESCUENTO</th>
                <th>IMPUESTOS</th>
                <th>SUBTOTAL</th>
                <th>PRECIO TOTAL</th>
                <th>ACCIONES</th>
            </template>
            <template v-slot:tbody>
                <tr v-for="(item, index) in DataCreate.items" :key="index">
                    <td>{{ itemData[index].nombre }}</td>
                    <td>{{ itemData[index].numero }}</td>
                    <td>
                        <input type="text" class="form-control-sm" v-model="item.cantidad" style="width: 60px;"
                            autocomplete="off" @input="calcularPrecioTotal(item)">
                    </td>
                    <td>
                        <vue-number v-model="item.precio_unitario" style="width: 120px;"
                            v-bind="{ decimal: '.', separator: ',', prefix: '$ ', precision: 2 }"
                            @change="calcularPrecioTotal(item)"></vue-number>
                    </td>
                    <td>
                        <vue-number v-model="item.descuento" style="width: 100px;" v-bind="{ prefix: '% ', }"
                            @change="calcularPrecioTotal(item)"></vue-number>
                    </td>
                    <td>
                        <vue-number v-model="item.valor_descuento" style="width: 120px;"
                            v-bind="{ decimal: '.', separator: ',', prefix: '$ ', precision: 2 }" disabled></vue-number>
                    </td>
                    <td>
                        <vue-number v-model="item.impuestos" style="width: 100px;"
                            v-bind="{ decimal: '.', separator: ',', prefix: '$ ', precision: 2 }" disabled></vue-number>
                    </td>
                    <td>
                        <vue-number v-model="item.subtotal" style="width: 120px;"
                            v-bind="{ decimal: '.', separator: ',', prefix: '$ ', precision: 2 }" disabled></vue-number>
                    </td>
                    <td>
                        <vue-number v-model="item.precio_total" style="width: 120px;"
                            v-bind="{ decimal: '.', separator: ',', prefix: '$ ', precision: 2 }" disabled></vue-number>
                    </td>
                    <td>
                        <a href="#" class="text-danger"
                            @click="() => { DataCreate.items.splice(index, 1), itemData.splice(index, 1); calcularTotales() }"><i
                                class="fas fa-trash"></i></a>
                    </td>
                </tr>
            </template>
        </Table>

        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <textarea placeholder="Observaciones" id="detalles" cols="" rows="1"
                        class="form-control" v-model="DataCreate.observaciones"></textarea>
                </div>
            </div>

            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Resumen de la Venta</h5>
                        <div class="row">
                            <div class="col-6">
                                <p class="font-weight-bold mb-1">Descuento:</p>
                            </div>
                            <div class="col-6 text-right">
                                <vue-number v-model="DataCreate.descuento" style="width: 120px;"
                                    v-bind="{ prefix: '% ', }" @change="calcularTotales()"
                                    placeholder="Descuento"></vue-number>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-6">
                                <p class="font-weight-bold mb-1">Valor Descuento:</p>
                            </div>
                            <div class="col-6 text-right">
                                <p class="mb-1">$ {{ DataCreate.valorDescuento }}</p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-6">
                                <p class="font-weight-bold mb-1">Subtotal:</p>
                            </div>
                            <div class="col-6 text-right">
                                <p class="mb-1">$ {{ DataCreate.subTotal }}</p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-6">
                                <p class="font-weight-bold mb-1">Impuestos:</p>
                            </div>
                            <div class="col-6 text-right">
                                <p class="mb-1">$ {{ DataCreate.totalImpuestos }}</p>
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-6">
                                <h5 class="font-weight-bold mb-0">Total:</h5>
                            </div>
                            <div class="col-6 text-right">
                                <h5 class="mb-0">$ {{ DataCreate.total }}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <Modal :modalId="'modalSalesProductos'" :title="'Buscar Productos'">
            <template v-slot:body>
                <div class="form-group">
                    <div class="input-group">
                        <input type="text" id="example-input-small" class="form-control" v-model="itemsQuery"
                            placeholder="Ej: Arroz 1kg" @input="itemsSearch()" autocomplete="off">
                    </div>
                </div>

                <ul v-if="itemsQuery.length > 0" class="list-group mt-2" style="max-height: 320px; overflow-y: auto;">
                    <a v-for="(item, index) in itemsResults.slice(0, 5)" :key="index" @click="itemSelect(item)"
                        style="cursor: pointer;"
                        class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                        <div>
                            <p class="mb-0">
                                <span class="fw-bold mr-1"><b># {{ item.codigo }}</b></span>
                                <span class="mr-1">{{ item.nombre }}</span>
                                <small class="text-info ms-2">{{ item.categoria }}</small>
                            </p>
                            <div class="row" v-if="item.lot_id !== null">
                                <small class="col">Número de lote: <span class="text-primary">{{ item.numero
                                        }}</span></small>
                                <small class="col">Fecha de vencimiento: <b>{{ item.fecha_vencimiento
                                        }}</b></small>
                            </div>
                            <div v-else>
                                <small class="text-danger">Sin lote</small>
                            </div>
                        </div>
                        <span class="badge bg-success rounded-pill align-self-start">{{ item.precio }}</span>
                    </a>
                </ul>

            </template>
            <template v-slot:footer>
            </template>
        </Modal>

    </Dashboard>
</template>