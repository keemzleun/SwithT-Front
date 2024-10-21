<template>
    <v-dialog v-model="noticeCreateModal" max-width="500px">
        <v-card>
            <v-card-title class="text-h5 text-center">
                <v-icon color="red" large>mdi-alert-circle-outline</v-icon>
                <br>
                {{title}}
            </v-card-title>
            <v-card-text class="text-center">
                {{contents}}
                <br><br>

                <v-row class="d-flex justify-center">
                    <v-col cols="6" class="text-right">
                        <v-btn @click="closeModal" outlined color="grey">닫기</v-btn>
                    </v-col>
                    <v-col cols="6" class="text-left">
                        <v-btn @click="clickYes" color="success">{{ yesBtnName }}</v-btn>
                    </v-col>
                </v-row>

            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props:['title', 'contents', 'yesBtnName', 'dialog'],
    data() {
        return {
            noticeCreateModal: this.dialog
        }
    },
    watch: {
        dialog(val) {
            this.noticeCreateModal = val;
        }
    },
    methods: {
        clickYes() {
            this.$emit('confirmed');
        },
        closeModal() {
            this.$emit('update:dialog', false)
        }
    }
}
</script>

<style scoped>
.small-text {
    color: grey;
    font-size: 12px;
}
</style>
