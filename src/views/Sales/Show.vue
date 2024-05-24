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
import { show_alert } from '@/requestHandler'

const pageTitle = 'Factura de Venta'
const breadcrumbs: Array[] = [
    { label: 'Alernal', url: "/" },
    { label: 'Listado de Ventas', url: "/sales" },
    { label: 'Factura', },
];

const saleId = useRouter().currentRoute.value.params.id;

//LISTADO DE CAJAS
const DataCreate = ref({});
const items = ref([]);
const customer = ref({});

const fetchData = async () => {
    try {
        const response = await axios.get(`/sales/${saleId}`);

        if (response.status === 404) {
            throw new Error('Sale not found');
        }

        DataCreate.value = response.data.sale;
        customer.value = response.data.sale.customer;
        items.value = response.data.sale.items;
    } catch (error) {
        show_alert("Venta no encontrada. Por favor, inténtalo nuevamente.", "error", "/sales");
    }
}


onMounted(() => { fetchData() });


const imprimirPDF = async (saleId) => {

    try {
        const response = await axios.get(`/sales/pdf/${saleId}`, {
            responseType: 'arraybuffer' // Para recibir una respuesta binaria (el PDF)
        });

        // Crear una URL del objeto blob recibido
        const pdfData = new Uint8Array(response.data);
        const largoTotal = response.headers['content-type'];

        // Cargar el PDF usando PDF.js
        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

        // Obtener la primera página del PDF
        const pageNumber = 1;
        const page = await pdf.getPage(pageNumber);

        // Obtener la vista de la página
        const viewport = page.getViewport({ scale: 1.5 });

        // Crear un elemento canvas para el renderizado
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Renderizar la página en el canvas
        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;

        const style = document.createElement('style');
        style.innerHTML = `@media print { @page { size: 75mm ${largoTotal}mm; margin: 0; } }`;

        // Mostrar el cuadro de diálogo de impresión del navegador
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const printFrame = document.createElement('iframe');
            printFrame.src = url;
            printFrame.style.visibility = 'hidden';
            document.body.appendChild(printFrame);
            printFrame.onload = function () {
                printFrame.contentDocument.head.appendChild(style);
                printFrame.contentWindow.print();
            };
        });
    } catch (error) {
        show_alert('Ocurrió un error al obtener el PDF. Por favor, inténtalo nuevamente.', 'error', '/sales');
    }

}
</script>

<template>
    <Dashboard>
        <StartPage :breadcrumbs="breadcrumbs" :page-title="pageTitle"></StartPage>
        <div class="row">
            <div class="col-md-3">
                <div class="form-group">
                    <label for="customer_id" class="control-label">Cliente</label>
                    <input type="text" class="form-control" id="customer_id" placeholder="customer_id"
                        v-model="customer.nombre_razonsocial" autocomplete="off" disabled>
                </div>
            </div>

            <div class="col-md-2">
                <div class="form-group">
                    <label for="prefijo" class="control-label">Prefijo</label>
                    <input type="text" class="form-control" id="prefijo" placeholder="prefijo"
                        v-model="DataCreate.prefijo" autocomplete="off" disabled>
                </div>
            </div>

            <div class="col-md-1">
                <div class="form-group">
                    <label for="numero" class="control-label">Número</label>
                    <input type="text" class="form-control" id="numero" placeholder="numero" v-model="DataCreate.numero"
                        autocomplete="off" disabled>
                </div>
            </div>

            <div class="col-md-3">
                <div class="form-group">
                    <label for="fecha" class="control-label">Fecha</label>
                    <input type="date" class="form-control" id="fecha" placeholder="fecha" v-model="DataCreate.fecha"
                        autocomplete="off" disabled>
                </div>
            </div>

            <div class="col-md-3">
                <div class="form-group">
                    <label for="formaPago" class="control-label">FORMA DE PAGO</label>
                    <input type="text" class="form-control" id="formaPago" placeholder="formaPago"
                        v-model="DataCreate.formaPago" autocomplete="off" disabled>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-3">
                <Button :style="'btn-purple text-light'" :title="'Imprimir'" :icon="'fe-plus-square'"
                    @click.prevent="imprimirPDF(saleId)"></Button>
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
                    <textarea placeholder="Observaciones" id="detalles" cols="" rows="1" class="form-control"
                        v-model="DataCreate.observaciones" disabled></textarea>
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