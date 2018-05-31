<template>
    <div class="workbench-app">
        <div class="dropzones">
            <div class="dropzone flex-centered">Dropzone</div>
            <div class="dropzone flex-centered">Dropzone</div>
        </div>
        <div class="flex-centered">Preview</div>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="stylus">
.workbench-app
    width: 100vw;
    height: calc(100vh - 58px);
    background-color: teal;
    overflow: hidden;
    background-color: hsl(163, 8%, 92%);
    display: grid;
    grid-template-columns: 50vw 50vw;
    grid-template-rows: 100%;
.dropzone
    border: dashed 2px lightgray
.dropzones
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 50% 50%;
.flex-centered
    display: flex;
    justify-content: center;
    align-items: center;
    > *
        margin: auto;
</style>