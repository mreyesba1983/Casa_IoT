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
        <!--TABLA DE ALARMAS-->
        <div class="row" v-if="$store.state.devices.length > 0">
            <div class="col-sm-12">
                <card>
                    <div slot="header">
                        <h4 class="card-title">Reglas de alarmas</h4>
                    </div>
                    <el-table v-if="$store.state.selectedDevice.alarmRules.length > 0" :data="$store.state.selectedDevice.alarmRules">
                        <el-table-column min-width="20" label="#" align="center">
                            <div class="photo" slot-scope="{ $index }">
                                {{$index + 1}}
                            </div>
                        </el-table-column>
                        <el-table-column prop="variableFullName" label="Nombre de la variable"></el-table-column>
                        <el-table-column prop="variable" label="Variable"></el-table-column>
                        <el-table-column prop="condition" label="Condición"></el-table-column>
                        <el-table-column prop="value" label="Valor"></el-table-column>
                        <el-table-column prop="triggerTime" label="Tiempo de disparo"></el-table-column>
                        <el-table-column header-align="right" label="Acciones">
                            <div slot-scope="{ row }" class="text-right table-actions">
                                <el-tooltip content="Delete" effect="light" placement="top">
                                    <base-button @click="deleteAlarm(row)" type="danger" icon-size="sm" class="btn-link">
                                        <i class="tim-icons icon-simple-remove"></i>
                                    </base-button>
                                </el-tooltip>
                                <el-tooltip content="Estado de regla" style="margin-left: 20px;">
                                    <i class="fas fa-exclamation-triangle" :class="{'text-warning': row.status}"></i>
                                </el-tooltip>
                                <el-tooltip content="Cambiar estado regla" style="margin-left: 5px;">
                                    <base-switch @click="updateStatusRule(row)" :value="row.status" type="primary" on-text="ON" off-text="OFF" style="margin-top: 10px;"></base-switch>
                                </el-tooltip>
                            </div>
                        </el-table-column>
                    </el-table>
                    <h4 v-else class="card-title">No hay alarmas</h4>
                </card>
            </div>
        </div>
    </div>
</template>

<script>
import BaseButton from '../components/BaseButton.vue';
    export default{
  components: { BaseButton },
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
            updateStatusRule(rule) {
                const axiosHeaders = {
                    headers: {
                        token: this.$store.state.auth.token
                    }
                }
                var ruleCopy = JSON.parse(JSON.stringify(rule));
                ruleCopy.status = !ruleCopy.status;

                const toSend = {
                    rule: ruleCopy
                };

                this.$axios.put("/alarm-rule", toSend, axiosHeaders).then(res => {
                    if (res.data.status == "success") {
                        this.$notify({
                            type: 'success',
                            icon: 'tim-icons icon-check-2',
                            message: 'Exito, alarma actualizada'
                        });
                        this.$store.dispatch("getDevices");
                        return;
                    }
                }).catch(e => {
                    this.$notify({
                        type: 'danger',
                        icon: 'tim-icons icon-alert-circle-exc',
                        message: 'Error'
                    });
                    console.log(e);
                    return;
                });
            },
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
                        this.$store.dispatch("getDevices");
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
            },
            deleteAlarm(rule) {
                const axiosHeaders = {
                    headers: {
                        token: this.$store.state.auth.token
                    },
                    params: {
                        emqxRuleId: rule.emqxRuleId
                    }    
                };
                this.$axios.delete("/alarm-rule", axiosHeaders).then(res => {
                    if (res.data.status == "success") {
                        this.$notify({
                            type: "success",
                            icon: "tim-icons icon-check-2",
                            message: "Exito, alarma borrada"
                        });
                        this.$store.dispatch("getDevices");
                        return;
                    }
                }).catch(e => {
                    this.$notify({
                        type: "danger",
                        icon: " tim-icons icon-alert-circle-exc",
                        message: "Error"
                    });
                    console.log(e);
                    return;
                });
            }
        }
    }
</script>