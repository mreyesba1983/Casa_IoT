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
    import Card from '../components/Cards/Card.vue';
    export default {
        components: { Card },
        middleware: 'authenticated',
        data() {
            return {
                alarmRules: [],
                selectedWidgetIndex: null,
                newRule: {
                    dId: null,
                    status: null,
                    variableFullName: null,
                    variable: null,
                    value: null,
                    condition: null,
                    triggerTime: null
                }
            };
        }
    }
</script>