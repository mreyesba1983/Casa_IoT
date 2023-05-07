<template>
    <div>
        <!--FORM PARA UNA NUEVA ALARMA-->
        <div class="row">
            <div slot="col-sm-12">
                <!--Se muestra la tarjeta si ya se han creado dispositivos-->
                <card v-if="$store.state.devices.length > 0">
                    <div slot="header">
                        <h4 class="card-title">Crear una nueva Alarma</h4>
                    </div>
                    <div class="row">
                        <div class="col-3">
                            <div class="form-group has-primary">
                                <select required class="form-control" placeholder="Variable" v-model="selectedWidgetIndex" style="margin-top: 25px">
                                    <option v-for="widget, index in $store.state.selectedDevice.template.widgets" :key="index" class="text-success" :value="index" :label="widget.variableFullName" style="margin-top: 5px;"></option>
                                </select>
                            </div>
                        </div>
                        <div class="col-3">
                            <div class="form-group has-primary">
                                <select required class="form-control" placeholder="Condición" v-model="newRule.condition" style="margin-top: 25px;">
                                    <option value="=" label="igual que"></option>
                                    <option value=">" label="mayor que"></option>
                                    <option value=">=" label="mayor o igual que"></option>
                                    <option value="<" label="menor que"></option>
                                    <option value="<=" label="menor o igual que"></option>
                                    <option value="!=" label="diferente que"></option>
                                </select>
                            </div>
                        </div>
                        <div class="col-3">
                            <base-input label="Valor" v-model="newRule.value" type="number"></base-input>
                        </div>
                        <div class="col-3">
                            <base-input label="Trigger time" v-model="newRule.triggerTime" type="number"></base-input>
                        </div>
                    </div>
                    <br><br>
                    <div class="row pull-right">
                        <div class="col-12">
                            <base-button @click="createNewRule()" native-type="submit" type="primary" class="mb-3" size="lg" :disabled="$store.state.devices.length == 0">
                                Crear
                            </base-button>
                        </div>
                        
                    </div>
                </card>
                <card v-else>
                    Debe seleccionar un dispositivo para crear una alarma
                </card>
            </div>
        </div>
    </div>
</template>

<script>
    export default{
        middleware: 'authenticated',
        data() {
            return {
                alarmRules: [],
                selectedWidgetIndex: null,
                newRule: {
                    dId: null,
                    status: true,
                    variableFullName: null,
                    variable: null,
                    value: null,
                    condition: null,
                    triggerTime: null
                }
            };
        },
        methods: {
            createNewRule() {
                if (this.selectedWidgetIndex == null) {
                    this.$notify({
                        type: "warning",
                        icon: "tim-icons icon-alert-circle-exc",
                        message: "La variable no ha sido seleccionada"
                    });
                    return;
                };
                if (this.newRule.condition == null) {
                    this.$notify({
                        type: "warning",
                        icon: "tim-icons icon-alert-circle-exc",
                        message: "No ha seleccionado una condición"
                    });
                    return;
                };
                if (this.newRule.value == null) {
                    this.$notify({
                        type: "warning",
                        icon: "tim-icons icon-alert-circle-exc",
                        message: "No ha ingresado un valor"
                    });
                    return;
                };
                if (this.newRule.triggerTime == null) {
                    this.$notify({
                        type: "warning",
                        icon: "tim-icons icon-alert-circle-exc",
                        message: "No ha ingresado un valor de tiempo"
                    });
                    return;
                };
                this.newRule.dId = this.$store.state.selectedDevice.dId;
                this.newRule.variableFullName = this.$store.state.selectedDevice.template.widgets[this.selectedWidgetIndex].variableFullName;
                this.newRule.variable = this.$store.state.selectedDevice.template.widgets[this.selectedWidgetIndex].variable;

                const axiosHeaders = {
                    headers: {
                        token: this.$store.state.auth.token
                    }
                };

                var toSend = {
                    newRule: this.newRule
                };

                this.$axios.post("/alarm-rule", toSend, axiosHeaders).then(res => {
                    if (res.data.status == "success") {
                        
                        this.newRule.variable = null;
                        this.newRule.condition = null;
                        this.newRule.value = null;
                        this.newRule.triggerTime = null;

                        this.$notify({
                            type: "success",
                            icon: "tim-icons icon-check-2",
                            message: "La regla de alarma fue agregada exitosamente."
                        });
                        return;
                    }
                }).catch(e => {
                    this.$notify({
                        type: "danger",
                        icon: "tim-icons icon-alert-circle-exc",
                        message: "Error"
                    });
                    console.log(e);
                    return;
                });
            }
        }
    }
</script>