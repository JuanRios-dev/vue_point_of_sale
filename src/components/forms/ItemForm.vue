<template>
    <div class="row">
        <div class="col-md-4">
            <div class="form-group">
                <label for="imagen" class="form-label">Imagen del Producto</label>
                <div class="image-preview">
                    <img v-if="typeof formData.imagen === 'string'" :src="$apiBaseUrl + formData.imagen"
                        class="thumbnail-image" alt="Previsualización de la imagen">
                    <img v-else :src="previewImage || defaultImage" class="thumbnail-image"
                        alt="Previsualización de la imagen">
                </div>
                <input type="file" class="form-control-file smaller-file-input"
                    :class="{ 'is-invalid': infoErrors['imagen'] }" id="imagen" placeholder="Documento"
                    @change="onFileChange">
                <span v-if="infoErrors['imagen']" class="invalid-feedback">
                    {{ infoErrors['imagen'].join(', ') }}
                </span>
            </div>
        </div>
        <div class="col-md-8">
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="codigo" class="control-label">Codigo</label>
                        <input type="text" class="form-control" :class="{ 'is-invalid': infoErrors['codigo'] }"
                            id="codigo" placeholder="Codigo" v-model="formData.codigo" autocomplete="off">
                        <span v-if="infoErrors['codigo']" class="invalid-feedback">
                            {{ infoErrors['codigo'].join(', ') }}
                        </span>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="nombre" class="control-label">Nombre</label>
                        <input type="text" class="form-control" :class="{ 'is-invalid': infoErrors['nombre'] }"
                            id="nombre" placeholder="Nombre" v-model="formData.nombre" autocomplete="off">
                        <span v-if="infoErrors['nombre']" class="invalid-feedback">
                            {{ infoErrors['nombre'].join(', ') }}
                        </span>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="descripcion" class="control-label">Descripción</label>
                        <input type="text" class="form-control" :class="{ 'is-invalid': infoErrors['descripcion'] }"
                            id="descripcion" placeholder="Descripcion" v-model="formData.descripcion"
                            autocomplete="off">
                        <span v-if="infoErrors['descripcion']" class="invalid-feedback">
                            {{ infoErrors['descripcion'].join(', ') }}
                        </span>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="tipo">Tipo de Producto <span v-if="infoErrors['tipo']"
                                class="text-danger">*</span></label>
                        <select class="form-control" :class="{ 'is-invalid': infoErrors['tipo'] }" id="tipo"
                            v-model="formData.tipo">
                            <option value="Inventariable">Inventariable</option>
                            <option value="No inventariable">No Inventariable</option>
                            <option value="Servicio">Servicio</option>
                        </select>
                        <span v-if="infoErrors['tipo']" class="invalid-feedback">
                            {{ infoErrors['tipo'].join(', ') }}
                        </span>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="iva_compra">Iva Compra <span v-if="infoErrors['iva_compra']"
                                class="text-danger">*</span></label>
                        <select class="form-control" :class="{ 'is-invalid': infoErrors['iva_compra'] }" id="iva_compra"
                            v-model="formData.iva_compra">
                            <option value="19.00">% 19.00</option>
                            <option value="5.00">% 5.00</option>
                            <option value="0.00">EXCLUIDO</option>
                            <option value="0.00">EXCENTO</option>
                        </select>
                        <span v-if="infoErrors['iva_compra']" class="invalid-feedback">
                            {{ infoErrors['iva_compra'].join(', ') }}
                        </span>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="iva_venta">Iva Venta <span v-if="infoErrors['iva_venta']"
                                class="text-danger">*</span></label>
                        <select class="form-control" :class="{ 'is-invalid': infoErrors['iva_venta'] }" id="iva_venta"
                            v-model="formData.iva_venta">
                            <option value="19.00">% 19.00</option>
                            <option value="5.00">% 5.00</option>
                            <option value="0.00">EXCLUIDO</option>
                            <option value="0.00">EXCENTO</option>
                        </select>
                        <span v-if="infoErrors['iva_venta']" class="invalid-feedback">
                            {{ infoErrors['iva_venta'].join(', ') }}
                        </span>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="precio" class="control-label">Precio</label>
                        <input type="text" class="form-control" :class="{ 'is-invalid': infoErrors['precio'] }"
                            id="precio" placeholder="Precio" v-model="formData.precio" autocomplete="off">
                        <span v-if="infoErrors['precio']" class="invalid-feedback">
                            {{ infoErrors['precio'].join(', ') }}
                        </span>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="categoria" class="control-label">Categoria</label>
                        <input type="text" class="form-control" :class="{ 'is-invalid': infoErrors['categoria'] }"
                            id="categoria" placeholder="Categoria" v-model="formData.categoria" autocomplete="off">
                        <span v-if="infoErrors['categoria']" class="invalid-feedback">
                            {{ infoErrors['categoria'].join(', ') }}
                        </span>
                    </div>
                </div>
            </div>
            <slot></slot>
        </div>
    </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

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
        const previewImage = ref(null);

        const onFileChange = (event) => {
            const file = event.target.files[0];
            if (file) {
                props.formData.imagen = file;
                previewImage.value = URL.createObjectURL(file);
            }
        };

        return {
            previewImage,
            onFileChange,
            defaultImage: require('@/assets/images/product_default.png')
        };
    }
});
</script>

<style scoped>
.image-preview img {
    width: 230px;
    height: 230px;
    margin-bottom: 10px;
}
</style>
