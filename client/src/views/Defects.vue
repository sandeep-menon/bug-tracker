<template>
    <v-container>
        <v-alert :type="this.alertType" border="left" dismissible v-if="this.alertMessage">{{ this.alertMessage }}</v-alert>
        <v-card outlined>
            <v-overlay :opacity="0.6" :value="loading">
                <v-progress-circular indeterminate size="32" color="accent"></v-progress-circular>
                <span class="ml-6 text--accent">Loading...</span>
            </v-overlay>
            <v-card-title>Defects</v-card-title>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary"><v-icon class="mr-2">mdi-floppy</v-icon>Save</v-btn>
            </v-card-actions>
            <v-divider></v-divider>
            <v-card-text>
                <!-- <v-text-field append-icon="mdi-magnify" label="Search" single-line hide-details v-model="search"></v-text-field> -->
                <v-data-table :headers="headers" :items="defects">
                    <template v-slot:[`item.DefDate`]="{ item }">
                        <span>{{ new Date(item.DefDate).toLocaleString() }}</span>
                    </template>

                    <template v-slot:[`item.action`]="{ item }">
                        <span>
                            <v-icon @click="moreDetails(item)">mdi-dots-horizontal</v-icon>
                        </span>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
        <v-dialog v-model="dialog" max-width="960px" persistent>
            <v-card>
                <v-card-title>{{ moreDetailItem.DefSummary }}</v-card-title>
                <v-card-subtitle>{{ moreDetailItem._id }}</v-card-subtitle>
                <v-divider></v-divider>
                <v-card-text v-if="moreDetailIndex != -1">
                    <v-container class="pt-4 pa-0">
                        <v-row>
                            <v-col><v-text-field label="Date created" v-model="moreDetailItem.DefDate" disabled prepend-icon="mdi-calendar-month"></v-text-field></v-col>
                            <v-col><v-text-field label="Status" v-model="moreDetailItem.DefStatus" :prepend-icon="statusIcon"></v-text-field></v-col>
                        </v-row>
                        <v-row>
                            <v-col><v-text-field label="Created By" v-model="moreDetailItem.DefCreatedBy" disabled prepend-icon="mdi-folder-plus"></v-text-field></v-col>
                            <v-col><v-text-field label="Assigned To" v-model="moreDetailItem.DefAssigned.DefAssignedToName" prepend-icon="mdi-pencil"></v-text-field></v-col>
                        </v-row>
                        <v-row>
                            <v-col><v-textarea outlined label="Description" :value="moreDetailItem.DefDescription" prepend-icon="mdi-format-line-style"></v-textarea></v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-expansion-panels accordion class="elevation-0">
                                    <v-expansion-panel>
                                        <v-expansion-panel-header class="font-weight-bold">
                                            <v-row>
                                                <v-col>
                                                    <v-icon class="mr-2">mdi-comment-text-multiple</v-icon>Comments
                                                </v-col>
                                            </v-row>
                                        </v-expansion-panel-header>
                                        <v-expansion-panel-content>
                                            <v-divider></v-divider>
                                            <div class="font-italic mt-3" v-if="moreDetailItem.DefComments.length == 0">No comments yet</div>
                                            <div class="bt-defect-comment-container mt-3 rounded-lg pa-4" v-for="comment in moreDetailItem.DefComments" :key="comment.id">
                                                <v-row>
                                                    <v-col><div class="font-weight-bold">{{ comment.DefCommentName }}</div></v-col>
                                                    <v-col class="text--disabled text-right"><div class="">{{ new Date(comment.DefCommentDate).toLocaleString() }}</div></v-col>
                                                </v-row>
                                                <v-row class="pa-0">
                                                    <v-col>
                                                        <div class="">{{ comment.DefCommentContent }}</div>
                                                    </v-col>
                                                </v-row>
                                            </div>
                                            <v-row class="mt-3">
                                                <v-col>
                                                    <v-textarea outlined label="Add comment" v-model="commentToAdd" counter></v-textarea>
                                                    <v-spacer></v-spacer>
                                                    <v-btn v-if="commentToAdd != ''" color="secondary" class="float-right" @click="addCommentToDefectById()">Add</v-btn>
                                                </v-col>
                                            </v-row>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col>
                                <v-expansion-panels accordion class="elevation-0">
                                    <v-expansion-panel>
                                        <v-expansion-panel-header class="font-weight-bold">
                                            <v-row>
                                                <v-col>
                                                    <v-icon class="mr-2">mdi-history</v-icon>History
                                                </v-col>
                                            </v-row>
                                        </v-expansion-panel-header>
                                        <v-expansion-panel-content>
                                            <v-divider></v-divider>
                                            <div class="font-italic mt-3" v-if="moreDetailItem.DefHistory.length == 0">No history yet</div>
                                            <v-row v-for="history in moreDetailItem.DefHistory" :key="history.id" class="mt-3">
                                                <v-col><div class="font-weight-bold">{{ history.DefHistoryDetail }}</div></v-col>
                                                <v-col class="text--disabled text-right"><div class="">{{ new Date(history.DefHistoryDate).toLocaleString() }}</div></v-col>
                                            </v-row>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="secondary" @click="close()">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar" :timeout="timeout">
            {{ snackbarText }}
            <template v-slot:action="{ attrs }">
                <v-btn color="success" text v-bind="attrs" @click="snackbar = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </v-container>
</template>

<script>
import API from "../api";
export default {
    name: "Defects",
    data: () => ({
        snackbar: false,
        snackbarText: "",
        timeout: 2000,
        defects : [],
        alertType: "",
        alertMessage: "",
        loading: true,
        dialog: false,
        headers: [
            { text: "Date", sortable: false, value: "DefDate" },
            { text: "Summary", sortable: false, value: "DefSummary" },
            { text: "Status", sortable: false, value: "DefStatus" },
            { text: "Assigned To", sortable: false, value: "DefAssigned.DefAssignedToName" },
            { text: "Action", sortable: false, value: "action" },
        ],
        moreDetailIndex: -1,
        moreDetailItem: {

        },
        commentToAdd: "",
    }),

    computed: {
        statusIcon: function() {
            if(this.moreDetailItem.DefStatus == "Open") {
                return "mdi-progress-alert"
            } else {
                return "mdi-progress-clock"
            }
        }
    },

    watch: {
        dialog(val) {
            val || this.close()
        },
    },

    async created() {
        let token = this.$store.state.token || sessionStorage.token;
        let loginData = {
            token: token,
        }
        let response = await API.getAllDefects(loginData);
        
        if(response.type == "success") {
            this.defects = response.defects;
            this.loading = false;
        } else if(response.type == "error") {
            this.$router.push({ name: "Login", params: {type: response.type, message: response.message} });
        }
    },

    methods: {
        moreDetails(item) {
            this.moreDetailIndex = this.defects.indexOf(item);
            this.moreDetailItem = Object.assign({}, item);
            this.dialog = true;
        },

        close() {
            this.dialog = false;
        },

        async addCommentToDefectById() {
            let token = this.$store.state.token || sessionStorage.token;
            let loginData = {
                token: token,
                defectId: this.moreDetailItem._id,
                comment: this.commentToAdd,
            }
            let response = await API.addCommentToDefectById(loginData);

            if(response.type == "success") {
                this.defects[this.moreDetailIndex].DefComments = response.defect.DefComments;
                this.defects[this.moreDetailIndex].DefHistory = response.defect.DefHistory;
                this.moreDetailItem = response.defect;
                this.commentToAdd = "";
                this.snackbarText = response.message;
                this.snackbar = true;
            }
        }
    }
}
</script>

<style scoped>
    .bt-defect-comment-container {
        border: 1px solid gray;
    }
</style>