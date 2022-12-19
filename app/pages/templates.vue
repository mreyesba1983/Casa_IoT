<template>
    <div>
        <!--WIDGET CONFIGURATOR-->
        <div class="row">
            <card>
                <div slot="header">
                    <h4 class="card-title">Widgets</h4>
                </div>
                <div class="row">
                    <!--WIDGETS SELECTOR AND FORMS-->
                    <div class="col-6">
                        <!--WIDGETS SELECTOR-->
                        <el-select v-model="widgetType" class="select-success" placeholder="Seleccione el tipo de widget" style="width: 100%">
                            <el-option class="select-success" value="numberchart" label="Graficador" style="background: #FFFFFF; color: #000000">
                                <span style="float: left">Graficador</span>
                                <span style="float: right; color: #BF1234; font-size: 13px; margin-right: 300px">
                                    <i class="fa fa-arrow-left"></i>
                                </span>
                            </el-option>
                            <el-option class="select-success" value="indicator" label="Indicador" style="color: #000000; background: #FFFFFF">
                                <span style="float: left">Indicador</span>
                                <span style="float: right; color: #BF1234; font-size: 13px; margin-right: 300px">
                                    <i class="fa fa-arrow-left"></i>
                                </span>
                            </el-option>
                            <el-option class="select-success" value="button" label="Pulsador" style="color: #000000; background: #FFFFFF">
                                <span style="float: left">Pulsador</span>
                                <span style="float: right; color: #12BF34; font-size: 13px; margin-right: 300px">
                                    <i class="fa fa-arrow-right"></i>
                                </span>
                            </el-option>
                            <el-option class="select-success" value="switch" label="Interruptor" style="color: #000000; background: #FFFFFF">
                                <span style="float: left">Interruptor</span>
                                <span style="float: right; color: #12BF34; font-size: 13px; margin-right: 300px">
                                    <i class="fa fa-arrow-right"></i>
                                </span>
                            </el-option>
                        </el-select>
                        <br /><br />

                        <!--FORM NUMBER CHART-->
                        <div v-if="widgetType == 'numberchart'">
                            <base-input v-model="configChart.variableFullName" label="Var Name" type="text"></base-input>
                            <base-input v-model="configChart.unit" label="Unit" type="text"></base-input>
                            <base-input v-model="configChart.decimalPlaces" label="Decimal Places" type="number"></base-input>
                            <base-input v-model="configChart.icon" label="Icon" type="text"></base-input>
                            <base-input v-model="configChart.chartTimeAgo" label="Chart Back Time (mins)"></base-input>
                            <br />
                            <el-select v-model="configChart.class" :class="[getColorClass(configChart.class)]" placeholder="Seleccione la clase" style="width: 100%">
                                <el-option class="text-success" value="success" label="Success" style="background: #FFFFFF"></el-option>
                                <el-option class="text-primary" value="primary" label="Primary" style="background: #FFFFFF"></el-option>
                                <el-option class="text-warning" value="warning" label="Warning" style="background: #FFFFFF"></el-option>
                                <el-option class="text-danger" value="danger" label="Danger" style="background: #FFFFFF"></el-option>
                            </el-select>
                            <br />
                            <el-select v-model="configChart.column" :class="[getColorClass(configChart.class)]" placeholder="Seleccione el ancho" style="width: 100%">
                                <el-option :class="[getColorOptions(configChart.class)]" value="col-3" label="col-3" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configChart.class)]" value="col-4" label="col-4" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configChart.class)]" value="col-5" label="col-5" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configChart.class)]" value="col-6" label="col-6" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configChart.class)]" value="col-7" label="col-7" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configChart.class)]" value="col-8" label="col-8" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configChart.class)]" value="col-9" label="col-9" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configChart.class)]" value="col-10" label="col-10" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configChart.class)]" value="col-11" label="col-11" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configChart.class)]" value="col-12" label="col-12" style="background: #FFFFFF"></el-option>
                            </el-select>
                        </div>
                        <!--FORM SWITCH-->
                        <div v-if="widgetType == 'switch'">
                            <base-input v-model="configSwitch.variableFullName" label="Var name" type="text"></base-input>
                            <base-input v-model="configSwitch.icon" label="Icon" type="text"></base-input>
                            <br />
                            <el-select v-model="configSwitch.class" :class="[getColorClass(configSwitch.class)]" placeholder="Seleccione la clase" style="width: 100%">
                                <el-option class="text-success" value="success" label="Success" style="background: #FFFFFF"></el-option>
                                <el-option class="text-primary" value="primary" label="Primary" style="background: #FFFFFF"></el-option>
                                <el-option class="text-warning" value="warning" label="Warning" style="background: #FFFFFF"></el-option>
                                <el-option class="text-danger" value="danger" label="Danger" style="background: #FFFFFF"></el-option>
                            </el-select>
                            <br />
                            <el-select v-model="configSwitch.column" :class="[getColorClass(configSwitch.class)]" placeholder="Seleccione el ancho" style="width: 100%">
                                <el-option :class="[getColorOptions(configSwitch.class)]" value="col-3" label="col-3" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configSwitch.class)]" value="col-4" label="col-4" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configSwitch.class)]" value="col-5" label="col-5" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configSwitch.class)]" value="col-6" label="col-6" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configSwitch.class)]" value="col-7" label="col-7" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configSwitch.class)]" value="col-8" label="col-8" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configSwitch.class)]" value="col-9" label="col-9" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configSwitch.class)]" value="col-10" label="col-10" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configSwitch.class)]" value="col-11" label="col-11" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configSwitch.class)]" value="col-12" label="col-12" style="background: #FFFFFF"></el-option>
                            </el-select>
                        </div>
                        <!--FORM BUTTON-->
                        <div v-if="widgetType == 'button'">
                            <base-input v-model="configButton.variableFullName" label="Var name" type="text"></base-input>
                            <base-input v-model="configButton.message" label="Mensaje a enviar" type="text"></base-input>
                            <base-input v-model="configButton.text" label="Texto del botón" type="text"></base-input>
                            <base-input v-model="configButton.icon" label="Icono" type="text"></base-input>
                            <br />
                            <el-select v-model="configButton.class" :class="[getColorClass(configButton.class)]" placeholder="Seleccione la clase" style="width: 100%">
                                <el-option class="text-success" value="success" label="Success" style="background: #FFFFFF"></el-option>
                                <el-option class="text-primary" value="primary" label="Primary" style="background: #FFFFFF"></el-option>
                                <el-option class="text-warning" value="warning" label="Warning" style="background: #FFFFFF"></el-option>
                                <el-option class="text-danger" value="danger" label="Danger" style="background: #FFFFFF"></el-option>
                            </el-select>
                            <br />
                            <el-select v-model="configButton.column" :class="[getColorClass(configButton.class)]" placeholder="Seleccione el ancho" style="width: 100%">
                                <el-option :class="[getColorOptions(configButton.class)]" value="col-3" label="col-3" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configButton.class)]" value="col-4" label="col-4" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configButton.class)]" value="col-5" label="col-5" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configButton.class)]" value="col-6" label="col-6" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configButton.class)]" value="col-7" label="col-7" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configButton.class)]" value="col-8" label="col-8" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configButton.class)]" value="col-9" label="col-9" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configButton.class)]" value="col-10" label="col-10" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configButton.class)]" value="col-11" label="col-11" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configButton.class)]" value="col-12" label="col-12" style="background: #FFFFFF"></el-option>
                            </el-select>
                        </div>
                        <!--FORM INDICATOR-->
                        <div v-if="widgetType == 'indicator'">
                            <base-input v-model="configIndicator.variableFullName" label="Var name" type="text"></base-input>
                            <base-input v-model="configIndicator.icon" label="Icono" type="text"></base-input>
                            <br />
                            <el-select v-model="configIndicator.class" :class="[getColorClass(configIndicator.class)]" placeholder="Seleccione la clase" style="width: 100%">
                                <el-option class="text-success" value="success" label="Success" style="background: #FFFFFF"></el-option>
                                <el-option class="text-primary" value="primary" label="Primary" style="background: #FFFFFF"></el-option>
                                <el-option class="text-warning" value="warning" label="Warning" style="background: #FFFFFF"></el-option>
                                <el-option class="text-danger" value="danger" label="Danger" style="background: #FFFFFF"></el-option>
                            </el-select>
                            <br />
                            <el-select v-model="configButton.column" :class="[getColorClass(configIndicator.class)]" placeholder="Seleccione el ancho" style="width: 100%">
                                <el-option :class="[getColorOptions(configIndicator.class)]" value="col-3" label="col-3" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configIndicator.class)]" value="col-4" label="col-4" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configIndicator.class)]" value="col-5" label="col-5" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configIndicator.class)]" value="col-6" label="col-6" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configIndicator.class)]" value="col-7" label="col-7" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configIndicator.class)]" value="col-8" label="col-8" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configIndicator.class)]" value="col-9" label="col-9" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configIndicator.class)]" value="col-10" label="col-10" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configIndicator.class)]" value="col-11" label="col-11" style="background: #FFFFFF"></el-option>
                                <el-option :class="[getColorOptions(configIndicator.class)]" value="col-12" label="col-12" style="background: #FFFFFF"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <!--WIDGET PREVIEW-->
                    <div class="col-6">
                        <RTchart v-if="widgetType == 'numberchart'" :config="configChart"></RTchart>
                        <Interruptor v-if="widgetType == 'switch'" :config="configSwitch"></Interruptor>
                        <Boton v-if="widgetType == 'button'" :config="configButton"></Boton>
                        <Indicador v-if="widgetType == 'indicator'" :config="configIndicator"></Indicador>
                    </div>
                </div>
                <div class="row pull-right">
                    <div class="col-12">
                        <base-button native-type="submit" type="primary" class="mb-3" size="lg" @click="addNewWidget()">Agregar Widget</base-button>
                    </div>
                </div>
            </card>
        </div>
        
        <!--DASHBOARD PREVIEW-->
        <div class="row">
            <div v-for="(widget, index) in widgets" :key="index" :class="[widget.column]">
                <i aria-hidden="true" class="fa fa-trash text-warning pull-right" @click="deleteWidget(index)" style="margin-bottom: 10px;"></i>
                <RTchart v-if="widget.widget == 'chart'" :config="widget"></RTchart>
                <Interruptor v-if="widget.widget == 'switch'" :config="widget"></Interruptor>
                <Boton v-if="widget.widget == 'button'" :config="widget"></Boton>
                <Indicador v-if="widget.widget == 'indicator'" :config="widget"></Indicador>
            </div>
        </div>

        <!--SAVE TEMPLATE-->
        <div class="row">
            <card>
                <div slot="header">
                    <h4 class="card-title">Guardar plantilla</h4>
                </div>

                <div class="row">
                    <base-input class="col-4" v-model="templateName" label="Nombre de la plantilla" type="text"></base-input>
                    <base-input class="col-8" v-model="templateDescription" label="Descripción" type="text"></base-input>
                </div>
                <br /><br />
                <div class="row">
                    <div class="col-12">
                        <base-button native-type="submit" type="primary" class="mb-3 pull-right" size="lg" @click="saveTemplate()">
                            Guardar
                        </base-button>
                    </div>
                </div>
            </card>
        </div>

        <!--TEMPLATES TABLE-->
        <div class="row">
            <card>
                <div slot="header">
                    <h4 class="card-title">Plantillas</h4>
                </div>
                <div class="row">
                    <el-table :data="templates">
                        <el-table-column min-width="50" label="#" align="center">
                            <div class="photo" slot-scope="{ $index }">
                                {{ $index + 1 }}
                            </div>
                        </el-table-column>
                        <el-table-column prop="name" label="Nombre"></el-table-column>
                        <el-table-column prop="desription" label="Descripción"></el-table-column>
                        <el-table-column prop="widgets.length" label="Widgets"></el-table-column>
                        <el-table-column header-align="right" align="right" label="Acciones">
                            <div slot-scope="{ row }" class="text-right table-actions">
                                <el-tooltip content="Delete" effect="light" :open-delay="300" placement="top">
                                    <base-button @click="deleteTemplate(row)" type="danger" icon size="sm" class="btn-link">
                                        <i class="tim-icons icon-simple-remove"></i>
                                    </base-button>
                                </el-tooltip>
                            </div>
                        </el-table-column>
                    </el-table>
                </div>
            </card>
        </div>

        <!--JSON-->
        <Json :value="widgets"></Json>
    </div>
</template>

<script>
    export default {
        middleware: 'authenticated',
        data() {
            return {
                widgets: [],
                templates: [],
                widgetType: "",
                templateName: "",
                templateDescription: "",
                configIndicator: {
                    userId: "userid",
                    selectedDevice: {
                        name: "Home",
                        dId: "1234",
                        templateName: "Sensores",
                        templateId: "1234567890abcdef",
                        saverRule: "false"
                    },
                    variableFullName: "Temperatura",
                    variable:"Var1",
                    icon: "fa-circle",
                    column: 'col-6',
                    widget: 'indicator',
                    class: 'danger'
                },
                configButton: {
                    userId: "userid",
                    selectedDevice: {
                        name: "Home",
                        dId: "1234",
                        templateName: "Sensores",
                        templateId: "1234567890abcdef",
                        saverRule: "false"
                    },
                    variableFullName: "Temperatura",
                    variable:"Var1",
                    icon: "fa-paper-plane",
                    column: 'col-6',
                    widget: 'button',
                    class: 'danger',
                    message: "ON",
                    text: "Send"
                },
                configSwitch: {
                    userId: "userid",
                    selectedDevice: {
                        name: "Home",
                        dId: "1234",
                        templateName:"Sensores",
                        templateId: "1234567890abcdef",
                        saverRule: "false"
                    },
                    variableFullName: "Temperatura",
                    variable: "Var1",
                    icon: "fa-check-square",
                    column: "col-6",
                    widget: "switch",
                    class: 'danger'
                },
                configChart: {
                    userId: "userid",
                    selectedDevice: {
                        name: "Home",
                        dId: "1234",
                        templateName:"Sensores",
                        templateId: "1234567890abcdef",
                        saverRule: "false"
                    },
                    variableFullName: "Temperatura",
                    variable: "Var1",
                    icon: "fa-line-chart",
                    column: "col-12",
                    widget: "chart",
                    class: 'danger',
                    unit: "C",
                    decimalPlaces: "2",
                    chartTimeAgo: 1566,
                    demo: true
                }
            }
        },
        methods:{
//ESTA FUNCION PERMITE ADICIONAR UN WIDGET CONFIGURADO A LA PREVISUALIZACIÓN
            addNewWidget() {
                console.log(this.widgets);
                if (this.widgetType == "numberchart") {
                    this.configChart.variable = this.makeid(10);
                    this.widgets.push(JSON.parse(JSON.stringify(this.configChart)));
                }
                if (this.widgetType == "indicator") {
                    this.configIndicator.variable = this.makeid(10);
                    this.widgets.push(JSON.parse(JSON.stringify(this.configIndicator)));
                }
                if (this.widgetType == "button") {
                    this.configButton.variable = this.makeid(10);
                    this.widgets.push(JSON.parse(JSON.stringify(this.configButton)));
                }
                if (this.widgetType == "switch") {
                    this.configSwitch.variable = this.makeid(10);
                    this.widgets.push(JSON.parse(JSON.stringify(this.configSwitch)));
                }
            },
//ESTA FUNCION GENERA UN CODIGO ALEATORIO PARA CADA VARIABLE CREADA
            makeid(length) {
               var result = "";
                var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                var charactersLength = characters.length;
                for (var i = 0; i < length; i++) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));  
                }
                return result;
            },
//ESTA FUNCION ELIMINA UN WIDGET DE LA PRECISUALIZACIÓN
            deleteWidget(index) {
                this.widgets.splice(index, 1);
            },
//ESTA FUNCION ALMACENA LAS PLANTILLAS EN LA BASE DE DATOS
            async saveTemplate() {

            },
            getColorClass(config) {
                if (config == "danger") {
                    return "select-danger";
                }
                if (config == "warning") {
                    return "select-warning";
                }
                if (config == "primary") {
                    return "select-primary";
                }
                if (config == "success") {
                    return "select-success";
                }
            },
            getColorOptions(color) {
                if (color == "danger") {
                    return "text-danger";
                }
                if (color == "warning") {
                    return "text-warning";
                }
                if (color == "primary") {
                    return "text-primary";
                }
                if (color == "success") {
                    return "text-success";
                }
            }
        }
    }
</script>
