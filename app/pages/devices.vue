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
                        <base-input label="Nombre del dispositivo" type="text" placeholder="Ej.: Home, Oficce, ...">
                        </base-input>
                    </div>
                    <div class="col-4">
                        <base-input label="ID del dispositivo" type="text" placeholder="Ej.: 1234-5678">
                        </base-input>
                    </div>
                    <div class="col-4">
                        <slot name="label">
                            <label>Plantilla</label>
                        </slot>
                        <el-select value="1" placeholder="Seleccione la plantilla" style="width:100%" class="select-primary">
                            <el-option class="text-white" value="Template1" label="Plantilla 1"></el-option>
                            <el-option class="text-white" value="Template2" label="Plantilla 2"></el-option>
                            <el-option class="text-white" value="Template3" label="Plantilla 3"></el-option>
                        </el-select>
                    </div>
                </div>

            <div class="row pull-right">
                <div class="col-12">
                    <base-button type="primary" class="mb-3" size="lg">Agregar</base-button>
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

                <el-table :data="devices">
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
                            <el-tooltip content="Salvar en base de datos" effect="light" placement="top">
                                {{ row.saverRule }}
                                <base-switch @click="updateSaverRuleStatus($index)" :value="row.saverRule" type="primary" on-text="ON" off-text="OFF">
                                </base-switch>
                            </el-tooltip>
                            <el-tooltip content="Delete" effect="light" :open-delay="300" placement="top">
                                <base-button type="danger" icon size="sm" class="btn-link" @click="deleteDevice(row)">
                                    <i class="tim-icons icon-simple-remove"></i>
                                </base-button>
                            </el-tooltip>
                        </div>

                    </el-table-column>
                </el-table>
            </card>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                devices: [
                    {
                        name: "Home",
                        dId: "1234",
                        templateName: "Control HMI",
                        templateId: "1234567890abcdef",
                        saverRule:false
                    },
                    {
                        name: "Oficce",
                        dId: "5678",
                        templateName: "Control HMI",
                        templateId: "1234567890abcdef",
                        saverRule:true
                    },
                    {
                        name: "Room",
                        dId: "8901",
                        templateName: "Control HMI",
                        templateId: "1234567890abcdef",
                        saverRule:false
                    }
                ]
            }
        },
        methods: {
            deleteDevice(device) {
                alert("Borrando " + device.name);
            },
            updateSaverRuleStatus(index) {
                this.devices[index].saverRule = !this.devices[index].saverRule;
            }
        }
    };
</script>