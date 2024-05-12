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
                <label for="nombre" class="control-label">Nombre</label>
                <input type="text" class="form-control"
                    :class="{ 'is-invalid': infoErrors['nombre']}"
                    id="nombre" placeholder="Nombre de Bodega" v-model="formData.nombre" autocomplete="off">
                <span v-if="infoErrors['nombre']"
                    class="invalid-feedback">
                    {{ infoErrors['nombre'].join(', ') }}
                </span>
            </div>
        </div>

        <div class="col-md-6">
            <div class="form-group">
                <label for="ubicacion" class="control-label">Ubicación</label>
                <input type="text" class="form-control"
                    :class="{ 'is-invalid': infoErrors['ubicacion'] }"
                    id="ubicacion" placeholder="Ubicación" v-model="formData.ubicacion" autocomplete="off">
                <span v-if="(infoErrors['ubicacion'])"
                    class="invalid-feedback">
                    {{ infoErrors['ubicacion'].join(', ') }}
                </span>
            </div>
        </div>

    </div>
    <div class="row">
        <div class="col-md-12">
            <div class="form-group">
                <label for="descripcion" class="control-label">Descripción</label>
                <input type="text" class="form-control"
                    :class="{ 'is-invalid': infoErrors['descripcion']}"
                    id="descripcion" placeholder="Descripcion" v-model="formData.descripcion" autocomplete="off">
                <span v-if="infoErrors['descripcion']"
                    class="invalid-feedback">
                    {{ infoErrors['descripcion'].join(', ') }}
                </span>
            </div>
        </div>
    </div>
</template>