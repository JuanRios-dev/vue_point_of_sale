<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        formData: {
            type: Object,
            required: true
        },
        infoErrors: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        return {
        };
    }
});
</script>

<template>
    <div class="row">
        <div class="col-md-6">
            <div class="form-group">
                <label for="tipo_documento">Tipo de Documento <span v-if="infoErrors['tipo_documento']"
                        class="text-danger">*</span></label>
                <select class="form-control"
                    :class="{ 'is-invalid': infoErrors['tipo_documento'] }"
                    id="tipo_documento" v-model="formData.tipo_documento">
                    <option value="CC">Cedula Ciudadana</option>
                    <option value="CE">Cedula Extranjera</option>
                    <option value="TI">Tarjeta Identidad</option>
                    <option value="PB">Pasaporte</option>
                    <option value="NIT">NIT</option>
                </select>
                <span v-if="infoErrors['tipo_documento']"
                    class="invalid-feedback">
                    {{ infoErrors['tipo_documento'].join(', ') }}
                </span>
            </div>
        </div>

        <div class="col-md-6">
            <div class="form-group">
                <label for="numero_documento" class="control-label">Documento</label>
                <input type="text" class="form-control"
                    :class="{ 'is-invalid': infoErrors['numero_documento']}"
                    id="numero_documento" placeholder="Documento" v-model="formData.numero_documento" autocomplete="off">
                <span v-if="infoErrors['numero_documento']"
                    class="invalid-feedback">
                    {{ infoErrors['numero_documento'].join(', ') }}
                </span>
            </div>
        </div>

    </div>
    <div class="row">
        <div class="col-md-12">
            <div class="form-group">
                <label for="nombre_razonsocial" class="control-label">Nombre ó Razon Social</label>
                <input type="text" class="form-control"
                    :class="{ 'is-invalid': infoErrors['nombre_razonsocial'] }"
                    id="nombre_razonsocial" placeholder="Nombre" v-model="formData.nombre_razonsocial" autocomplete="off">
                <span v-if="(infoErrors['nombre_razonsocial'])"
                    class="invalid-feedback">
                    {{ infoErrors['nombre_razonsocial'].join(', ') }}
                </span>
            </div>

        </div>
    </div>
    <div class="row">
        <div class="col-md-4">
            <div class="form-group">
                <label for="telefono" class="control-label">Teléfono</label>
                <input type="text" class="form-control"
                    :class="{ 'is-invalid': infoErrors['telefono'] }"
                    id="telefono" placeholder="Telefono" v-model="formData.telefono" autocomplete="off">
                <span v-if="infoErrors['telefono']" class="invalid-feedback">
                    {{ infoErrors['telefono'].join(', ') }}
                </span>
            </div>

        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label for="correo" class="control-label">Correo</label>
                <input type="text" class="form-control"
                    :class="{ 'is-invalid': infoErrors['correo'] }"
                    id="correo" placeholder="Correo Electronico" v-model="formData.correo" autocomplete="off">
                <span v-if="infoErrors['correo']" class="invalid-feedback">
                    {{ infoErrors['correo'].join(', ') }}
                </span>
            </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label for="municipio" class="control-label">Municipio</label>
                <input type="text" class="form-control"
                    :class="{ 'is-invalid': infoErrors['municipio'] }"
                    id="municipio" placeholder="Municipio" v-model="formData.municipio" autocomplete="off">
                <span v-if="infoErrors['municipio']" class="invalid-feedback">
                    {{ infoErrors['municipio'].join(', ') }}
                </span>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6">
            <div class="form-group">
                <label for="direccion" class="control-label">Dirección</label>
                <input type="text" class="form-control"
                    :class="{ 'is-invalid': infoErrors['direccion']}"
                    id="direccion" placeholder="Dirección" v-model="formData.direccion" autocomplete="off">
                <span v-if="infoErrors['direccion']" class="invalid-feedback">
                    {{ infoErrors['direccion'].join(', ') }}
                </span>
            </div>
        </div>
        <div class="col-md-6">
            <div class="form-group">
                <label for="responsable_iva">Responsable IVA <span v-if="infoErrors['responsable_iva']"
                        class="text-danger">*</span></label>
                <select class="form-control"
                    :class="{ 'is-invalid': infoErrors['responsable_iva'] }"
                    id="responsable_iva" v-model="formData.responsable_iva">
                    <option value="1">SI</option>
                    <option value="0">NO</option>
                </select>
                <span v-if="infoErrors['responsable_iva']"
                    class="invalid-feedback">
                    {{ infoErrors['responsable_iva'].join(', ') }}
                </span>
            </div>
        </div>
    </div>
</template>