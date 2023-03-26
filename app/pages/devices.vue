<template>
    <div>
<!--TARJETA PARA AGREGAR UN DISPOSITIVO-->
        <div class="row">
            <card>
                <div slot="header">
                    <h4 class="card-title">Agregar dispositivo</h4>
                </div>
                <div class="row">
                    <div class="col-4">
                        <base-input v-model="newDevice.name" label="Nombre del dispositivo" type="text" placeholder="Ej.: Home, Oficce, ...">
                        </base-input>
                    </div>
                    <div class="col-4">
                        <base-input v-model="newDevice.dId" label="ID del dispositivo" type="text" placeholder="Ej.: 1234-5678">
                        </base-input>
                    </div>
                    <div class="col-4">
                        <slot name="label">
                            <label>Plantilla</label>
                        </slot>
                        <el-select v-model="selectedIndexTemplate" placeholder="Seleccione la plantilla" style="width:100%" class="select-primary">
                            <el-option v-for="(template, index) in templates" :key="index" class="text-white" :value="index" :label="template.name"></el-option>
                        </el-select>
                    </div>
                </div>

            <div class="row pull-right">
                <div class="col-12">
                    <base-button type="primary" class="mb-3" size="lg" @click="createNewDevice()">Agregar</base-button>
                </div>
            </div>
        </card>
        </div>

<!--TABLA PARA LISTAR LOS DISPOSITIVOS DEL USUARIO-->
        <div class="row">
            <card>
                <div slot="header">
                    <h4 class="card-title">Dispositivos</h4>
                </div>

                <el-table :data="$store.state.devices">
                    <el-table-column label="#" min-width="20" align="center">
                        <div slot-scope="{ $index }">
                            {{ $index + 1 }}
                        </div>
                    </el-table-column>
                    <el-table-column prop="name" label="Nombre"></el-table-column>
                    <el-table-column prop="dId" label="ID dispositivo"></el-table-column>
                    <el-table-column prop="templateName" label="Plantilla"></el-table-column>
                    <el-table-column label="Acciones">
                        <div slot-scope="{ row, $index }">
                            <el-tooltip content="Indicador de salvar en base de datos" style="margin-right:10px">
                                <i class="fas fa-database " :class="{'text-success' : row.saverRule.status, 'text-dark' : !row.saverRule.status}"></i>
                            </el-tooltip>
                            <el-tooltip content="Salvar en base de datos" effect="light" placement="top">
                                <base-switch @click="updateSaverRuleStatus(row.saverRule)" :value="row.saverRule.status" type="primary" on-text="ON" off-text="OFF">
                                </base-switch>
                            </el-tooltip>
                            <el-tooltip content="Eliminar dispositivo" effect="light" :open-delay="300" placement="top">
                                <base-button type="danger" icon size="sm" class="btn-link" @click="deleteDevice(row)">
                                    <i class="tim-icons icon-simple-remove"></i>
                                </base-button>
                            </el-tooltip>
                        </div>

                    </el-table-column>
                </el-table>
            </card>
        </div>

<!--VISUALIZACION DE DEVICES ARRARY USANDO JSON VIEWER-->
        <Json :value="$store.state.devices"></Json>
    </div>
</template>

<script>
    export default {
        middleware: 'authenticated',
        data() {
            return {
                templates: [],
                selectedIndexTemplate: null,
                newDevice: {
                    name: "",
                    dId: "",
                    templateId: "",
                    templateName: ""
                }
            };
        },
        mounted() {
            this.getTemplates();
            this.$store.dispatch("getDevices");
        },
        methods: {
            //Metodo para leer las plantillas almacenadas en la base de datos por el usuario
            async getTemplates() {
                const axiosHeaders = {
                    headers: {
                        token: this.$store.state.auth.token
                    }
                };
                try {
                    const res = await this.$axios.get("/template", axiosHeaders);
                    if(res.data.status == "success") {
                        this.templates = res.data.data;
                    }
                } catch (error) {
                    this.$notify({
                        type: "warning",
                        icon: "tim-icons icon-simple-remove",
                        message: "Error al leer las plantillas almacenadas en base de datos"
                    });
                    console.log(error);
                    return;
                }
            },
            //Metodo para crear un nuevo dispositivo
            createNewDevice() {
                //Verificamos que el usuario ingrese un nombre
                if (this.newDevice.name == "") {
                    this.$notify({
                        type: "warning",
                        icon: "tim-icons icon-simple-remove",
                        message: "Por favor ingrese el nombre del dispositivo!"
                    });
                    return;
                }
                //Verificamos que el usuario ingrese un identificador de dispositivo
                if (this.newDevice.dId == "") {
                    this.$notify({
                        type: "warning",
                        icon: "tim-icons icon-simple-remove",
                        message: "Por favor ingrese el identificador del dispositivo!"
                    });
                    return;
                }
                //Verificamos que el usuario haya seleccionado una plantilla
                if (this.selectedIndexTemplate == null) {
                    this.$notify({
                        type: "warning",
                        icon: "tim-icons icon-simple-remove",
                        message: "Por favor seleccione una plantilla!"
                    });
                    return;
                }
                //Creamos el encabezado para guardar en la base de datos
                const axiosHeaders = {
                    headers: {
                        token: this.$store.state.auth.token
                    }
                };
                //Almacenamos el valor del id de la plantilla del nuevo dispositivo
                this.newDevice.templateId = this.templates[this.selectedIndexTemplate]._id;
                //Almacenamos el valor del nombre de la plantilla del nuevo dispositivo
                this.newDevice.templateName = this.templates[this.selectedIndexTemplate].name;

                const toSend = {
                    newDevice: this.newDevice
                };

                this.$axios.post("/device", toSend, axiosHeaders).then(res => {
                    if (res.data.status == "success") {
                        this.$notify({
                            type: "success",
                            icon: "tim-icons icon-check-2",
                            message: "Dispositivo " + this.newDevice.name + " fue creado exitosamente"
                        });
                        this.newDevice.name = "";
                        this.newDevice.dId = "";
                        this.selectedIndexTemplate = null;
                        this.$store.dispatch("getDevices");
                        return;
                    }
                }).catch(e => {
                    //Si se presenta un error al crear el nuevo dispositivo, por que el identificador ya existe en la base de datos
                    if (e.response.data.status == "error" && e.response.data.error.errors.dId.kind == "unique") {
                        this.$notify({
                            type: "warning",
                            icon: "tim-icons icon-simple-remove",
                            message: "El identificador de dispositivo ya existe en la base de datos, trate con uno diferente"
                        });
                        return;
                    } else {
                        this.$notify({
                            type: "danger", 
                            icon: "tim-icons icon-simple-remove",
                            message: "Error"
                        });
                        return;
                    }
                })
            },
            //Metodo para borrar un dispositivo
            deleteDevice(device) {
                const axiosHeader = {
                    headers: {
                        token: this.$store.state.auth.token
                    },
                    params: {
                        dId: device.dId
                    }
                };
                this.$axios.delete("/device", axiosHeader).then(res => {
                    if (res.data.status == "success") {
                        this.$notify({
                            type: "success",
                            icon: "tim-icons icon-check-2",
                            message: device.name + " ha sido eliminado, exitosamente!!!"
                        });
                        this.$store.dispatch("getDevices");
                    }
                }).catch(e => {
                    console.log(e);
                    this.$notify({
                        type: "danger",
                        icon: "tim-icons icon-alert-circle-exc",
                        message: "Error al intentar eliminar a " + device.name
                    });
                });
            },
            //Metodo para actualizar el estado de las reglas asociadas a los dispositivos
            updateSaverRuleStatus(rule) {
                //Hacemos una copia desacoplada de la regla
                var ruleCopy = JSON.parse(JSON.stringify(rule));
                //Cambiamos el valor del estado de la regla
                ruleCopy.status = !ruleCopy.status;

                //Regla actualizada
                const toSend = {
                    rule: ruleCopy
                };
                //Para poder salvar debemos enviar el token de acceso
                const axiosHeaders = {
                    headers: {
                        token: this.$store.state.auth.token
                    }
                };

                //Enviamos la información actualizada y se verifica si se actualizo correctamente para realizar las respectivas notificaciones
                this.$axios.put("/saver-rule", toSend, axiosHeaders).then(res => {
                    this.$store.dispatch("getDevices");

                    if (res.data.status == "success") {
                        this.$notify({
                            type: "success",
                            icon: "tim-icons icon-check-2",
                            message: "Se ha guardado correctamente el estado de la regla"
                        });  
                    }
                    return;
                }).catch(e => {
                    console.log(e);
                    this.$notify({
                        type: "danger",
                        icon: "tim-icons icon-alert-circle-exc",
                        message: "Error al actualizar el estado de la regla"
                    });
                    return;
                });
            }
        }
    };
</script>