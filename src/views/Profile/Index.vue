<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { sendRequest, deleteItem } from '@/requestHandler';
import StartPage from '@/components/partials/StartPage.vue'
import Dashboard from '@/layouts/DashboardLayout.vue'
import Button from '@/components/Button.vue'
import * as tables from '@/data/TableData'
import { useAuthStore } from '@/auth';
const auth = useAuthStore();

const pageTitle = 'Editar Perfil'
const breadcrumbs: Array[] = [
    { label: 'Alernal', url: "/" },
    { label: 'Perfil' },
];

/* LISTAR DATOS */

const DataUpdate = ref({});
const updateErrors = ref([])
const id = useRouter().currentRoute.value.params.id;

const datalist = async () => {
    const response = await axios.get(`/users/${id}`)
    DataUpdate.value = { ...response.data.user }
}

const updateData = async () => {
    const { status, errors, data } = await sendRequest('PUT', `/users/${DataUpdate.value.id}`, DataUpdate.value, true);

    if (status === 422) {
        updateErrors.value = errors;
        return;
    }

    if (status === 200) {
        auth.user = data.user;
        await datalist();
    }
}

const changePassword = ref({});

const cambioContraseña = async () => {
    const { status, errors } = await sendRequest('POST', `/users/${DataUpdate.value.id}`, changePassword.value, true);

    if (status === 422) {
        updateErrors.value = errors;
        return;
    }

    await datalist();
}

onMounted(() => { datalist() });
</script>

<template>
    <Dashboard>
        <StartPage :breadcrumbs="breadcrumbs" :page-title="pageTitle"></StartPage>

        <div class="row">
            <div class="col-lg-4 col-xl-4">
                <div class="card-box text-center">
                    <h4 class="mb-0">{{ DataUpdate.nombre }} {{ DataUpdate.apellido }}</h4>
                    <p class="text-muted">Ultima Conexión: {{ DataUpdate.ultima_conexion }}</p>

                    <div class="text-left mt-3">
                        <p class="text-muted mb-2 font-13"><strong>Full Name :</strong> <span class="ml-2">{{
                            DataUpdate.nombre }}</span></p>

                        <p class="text-muted mb-2 font-13"><strong>Mobile :</strong><span class="ml-2">{{
                            DataUpdate.telefono }}</span></p>

                        <p class="text-muted mb-2 font-13"><strong>Email :</strong> <span class="ml-2 ">{{
                            DataUpdate.email }}</span></p>

                        <p class="text-muted mb-1 font-13"><strong>Location :</strong> <span class="ml-2">{{
                            DataUpdate.direccion }}</span></p>
                    </div>
                </div>
            </div>

            <div class="col-lg-8 col-xl-8">
                <div class="card-box">

                    <form>
                        <h5 class="mb-3 text-uppercase bg-light p-2"><i class="mdi mdi-account-circle mr-1"></i>
                            Personal Info</h5>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="firstname">First Name</label>
                                    <input type="text" class="form-control" id="firstname"
                                        :class="{ 'is-invalid': updateErrors['nombre'] }" placeholder="Enter first name"
                                        v-model="DataUpdate.nombre">
                                    <span v-if="updateErrors['nombre']" class="invalid-feedback">
                                        {{ updateErrors['nombre'].join(', ') }}
                                    </span>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="lastname">Last Name</label>
                                    <input type="text" class="form-control" id="lastname" placeholder="Enter last name"
                                        v-model="DataUpdate.apellido">
                                </div>
                            </div> <!-- end col -->
                        </div> <!-- end row -->

                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="telefono">Telefono</label>
                                    <input type="text" class="form-control" id="telefono" placeholder="Enter telefono"
                                        v-model="DataUpdate.telefono">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="direccion">Dirección</label>
                                    <input type="text" class="form-control" id="direccion" placeholder="Enter direccion"
                                        v-model="DataUpdate.direccion">
                                </div>
                            </div>

                            <div class="col-md-4">
                                <Button :style="'btn-info mr-1'" :title="'Actualizar'" :icon="'fa fa-save'"
                                    @click="updateData()"></Button>
                            </div>
                        </div>

                        <h5 class="mb-3 text-uppercase bg-light p-2"><i class="mdi mdi-office-building mr-1"></i>
                            Cambiar Contraseña</h5>
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="contraseña">Contraseña Actual</label>
                                    <input type="text" class="form-control" id="contraseña"
                                        :class="{ 'is-invalid': updateErrors['current_password'] }"
                                        placeholder="Contraseña Actual..." v-model="changePassword.current_password">
                                    <span v-if="updateErrors['current_password']" class="invalid-feedback">
                                        {{ updateErrors['current_password'].join(', ') }}
                                    </span>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="contraseñanueva">Contraseña Nueva</label>
                                    <input type="text" class="form-control" id="contraseñanueva"
                                        :class="{ 'is-invalid': updateErrors['new_password'] }"
                                        placeholder="Contraseña Nueva..." v-model="changePassword.new_password">
                                    <span v-if="updateErrors['new_password']" class="invalid-feedback">
                                        {{ updateErrors['new_password'].join(', ') }}
                                    </span>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="confirmarcontraseña">Confirmar Contraseña</label>
                                    <input type="text" class="form-control" id="confirmarcontraseña"
                                        :class="{ 'is-invalid': updateErrors['confirm_password'] }"
                                        placeholder="Confirmar Contraseña..." v-model="changePassword.confirm_password">
                                    <span v-if="updateErrors['confirm_password']" class="invalid-feedback">
                                        {{ updateErrors['confirm_password'].join(', ') }}
                                    </span>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <Button :style="'btn-danger mr-1'" :title="'Cambiar Contraseña'" :icon="'fa fa-save'"
                                    @click="cambioContraseña()"></Button>
                            </div>
                        </div>
                    </form>
                </div> <!-- end card-box-->

            </div> <!-- end col -->
        </div>
    </Dashboard>
</template>