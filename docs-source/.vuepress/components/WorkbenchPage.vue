<template>
    <div class="workbench-app">
        <div class="dropzones">
            <image-viewer v-if="image1" :image-contents="image1" />
            <drop-zone v-else class="flex-centered" @select="openFile('image1', $event)" />

            <image-viewer v-if="image2" :image-contents="image2" />
            <drop-zone v-else class="flex-centered" @select="openFile('image2', $event)" />
        </div>
        <div class="flex-centered">Preview</div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                image1: '',
                image1Name: '',
                image2: '',
                image2Name: ''
            }
        },
        methods: {
            openFile(dataName, $event) {
                this.$data[dataName] = $event.contents;
                this.$data[dataName + 'Name'] = $event.name;
            }
        }
    }
</script>

<style lang="css">
.workbench-app {
    width: 100vw;
    height: calc(100vh - 58px);
    background-color: teal;
    overflow: hidden;
    background-color: hsl(163, 8%, 92%);
    display: grid;
    grid-template-columns: 50vw 50vw;
    grid-template-rows: 100%;
}
.dropzone {
    border: dashed 2px lightgray;
}
.dropzones {
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 50% 50%;
    width: 100%;
    height: 100%;
}
.flex-centered {
    display: flex;
    justify-content: center;
    align-items: center;
}
.flex-centered > * {
    margin: auto;
}
</style>