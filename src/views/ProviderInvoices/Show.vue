<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Dashboard from '@/layouts/DashboardLayout.vue'
import StartPage from '@/components/partials/StartPage.vue'
import Button from '@/components/Button.vue'
import Table from '@/components/Table.vue'
import Modal from '@/components/Modal.vue'
import ProviderSearch from '@/components/services/ProviderSearch.vue'
import { component as VueNumber } from '@coders-tm/vue-number-format'

const pageTitle = 'Factura de Proveedor'
const breadcrumbs: Array[] = [
    { label: 'Alernal', url: "/" },
    { label: 'Facturas de Proveedor', url: "/provider-invoices" },
    { label: 'Factura', },
];

const invoiceId = useRouter().currentRoute.value.params.id;

//LISTADO DE CAJAS
const DataCreate = ref({});
const items = ref([]);
const provider = ref({});

const fetchData = async () => {
    const response = await axios.get(`/provider-invoices/${invoiceId}`);
    DataCreate.value = response.data.provider_invoice;
    provider.value = response.data.provider_invoice.provider;
    items.value = response.data.provider_invoice.items;
}

onMounted(() => { fetchData() });
</script>

<template>
    <Dashboard>
        <StartPage :breadcrumbs="breadcrumbs" :page-title="pageTitle"></StartPage>
        <div class="row">
            <div class="col-md-3">
                <div class="form-group">
                    <label for="provider_id" class="control-label">Provedor</label>
                    <input type="text" class="form-control" id="provider_id" placeholder="provider_id"
                        v-model="provider.nombre_razonsocial" autocomplete="off">
                </div>
            </div>

            <div class="col-md-3">
                <div class="form-group">
                    <label for="codigo" class="control-label">Codigo</label>
                    <input type="text" class="form-control" id="codigo" placeholder="codigo" v-model="DataCreate.codigo"
                        autocomplete="off">
                </div>
            </div>

            <div class="col-md-3">
                <div class="form-group">
                    <label for="fecha" class="control-label">Fecha</label>
                    <input type="date" class="form-control" id="fecha" placeholder="fecha" v-model="DataCreate.fecha"
                        autocomplete="off">
                </div>
            </div>

            <div class="col-md-3">
                <div class="form-group">
                    <label for="formaPago" class="control-label">FORMA DE PAGO</label>
                    <input type="text" class="form-control" id="formaPago" placeholder="formaPago"
                        v-model="DataCreate.formaPago" autocomplete="off">
                </div>
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
            </template>
            <template v-slot:tbody>
                <tr v-for="(item, index) in items" :key="index">
                    <td>{{ item.nombre }}</td>
                    <td>
                        <input v-if="item.lot" type="text" style="width: 120px;" v-model="item.lot.numero"
                            autocomplete="off" disabled>
                        <input v-else type="text" style="width: 120px;" value="Sin Lote" autocomplete="off" disabled>
                    </td>
                    <td>
                        <input type="text" class="form-control-sm" v-model="item.pivot.cantidad" disabled
                            style="width: 60px;" autocomplete="off">
                    </td>
                    <td>
                        <vue-number v-model="item.pivot.precio_unitario" style="width: 120px;"
                            v-bind="{ decimal: '.', separator: ',', prefix: '$ ', precision: 2 }" disabled></vue-number>
                    </td>
                    <td>
                        <vue-number v-model="item.pivot.descuento" style="width: 100px;" v-bind="{ prefix: '% ', }"
                            disabled></vue-number>
                    </td>
                    <td>
                        <vue-number v-model="item.pivot.valor_descuento" style="width: 120px;"
                            v-bind="{ decimal: '.', separator: ',', prefix: '$ ', precision: 2 }" disabled></vue-number>
                    </td>
                    <td>
                        <vue-number v-model="item.pivot.impuestos" style="width: 100px;"
                            v-bind="{ decimal: '.', separator: ',', prefix: '$ ', precision: 2 }" disabled></vue-number>
                    </td>
                    <td>
                        <vue-number v-model="item.pivot.subtotal" style="width: 120px;"
                            v-bind="{ decimal: '.', separator: ',', prefix: '$ ', precision: 2 }" disabled></vue-number>
                    </td>
                    <td>
                        <vue-number v-model="item.pivot.precio_total" style="width: 120px;"
                            v-bind="{ decimal: '.', separator: ',', prefix: '$ ', precision: 2 }" disabled></vue-number>
                    </td>
                </tr>
            </template>
        </Table>

        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <textarea placeholder="Observaciones" id="detalles" cols="" rows="1"
                        class="form-control" v-model="DataCreate.observaciones" disabled></textarea>
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
                                <p class="mb-1">$ {{ DataCreate.descuento }}</p>
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

    </Dashboard>
</template>