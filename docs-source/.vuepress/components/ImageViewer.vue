<template>
    <div class="image-viewer" v-html="imageContents"></div>
</template>

<script>
    export default {
        props: {
            imageContents: String
        }
    }
</script>

<style lang="css">
.image-viewer {
    border: solid thin gray;
}
.image-viewer > svg {
    width: 100%;
    height: 100%;
}
</style>