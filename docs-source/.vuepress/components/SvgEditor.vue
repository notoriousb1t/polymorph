<template> 
    <div class="container">
        <label class="flex-center drop-zone" 
            :item-state="itemState"
            :load-state="loadState"
            :drag-state="dragState"
            @drop="handleFileDrop" 
            @dragover="handleDragEnter"
            @dragenter="handleDragEnter"
            @dragleave="handleDragLeave">

            <div v-if="itemState === 'edit'" class="svg-viewer">
                <svg :viewBox="viewBox" xmlns="http://www.w3.org/2000/svg">
                    <path :d="paths.path" />
                </svg>
            </div>

            <div v-if="itemState !== 'edit'">
                <input class="hidden-input" type="file" @change="handleFileSelected" accept="image/svg+xml" /> 
                <div v-if="loadState === 'initial'">
                    Select a file or Drag an SVG here                
                </div>
                <div v-else-if="loadState === 'loading'">
                    Loading
                </div>
                <div v-else-if="loadState === 'error'">
                    {{errorMessage}} 
                </div> 
                <div v-else-if="loadState === 'empty'">
                    Select or drop an Single Path SVG
                </div>
                <div v-else-if="dragState === 'drag-on'">
                    Drop to optimize
                </div>
            </div>
            
        </label>
        <div class="overlay">
            <label class="image-label" :data-state="loadState">{{label}}</label>
            <label class="optimize-check" title="uncheck this to indicate that you have already run the image through SVGOMG">
                <input type="checkbox" :checked="isOptimized" @click="toggleOptimized()" />
                <span>optimize</span>
            </label>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        label: String,
        itemState: String,
        loadState: String,
        errorMessage: String,
        isOptimized: Boolean,
        paths: Object
    }, 
    data() {
        return { 
            dragState: 'drag-off'
        }
    },
    computed: {
        viewBox() {
            let x = 0;
            let y = 0;
            let w = 0;
            let h = 0;

            this.paths.data.forEach(path => {
                x = Math.min(path.x, x);
                y = Math.min(path.y, y);
                w = Math.max(path.w, w);
                h = Math.max(path.h, h);
            });

            return [
                x,
                y,
                (x + w),
                (y + h)
            ].join(' ');
        }
    },
    methods: {
        handleDragLeave($event) {
            $event.preventDefault();
            this.dragState = "drag-off";
        },
        handleDragEnter($event) {
            $event.preventDefault();
            this.dragState = "drag-on";
        },
        handleFileSelected($event) {
            $event.preventDefault();
            const target = $event.currentTarget;
            const fileObj = target.files[0];
            this.$emit('open', fileObj);
        },
        handleFileDrop($event) {
            $event.preventDefault();
            this.dragState = "drag-off";
            const fileObj = $event.dataTransfer.files[0];
            this.$emit('open', fileObj);
        },
        toggleOptimized() {
            this.$emit('changeSettings', { isOptimized: !this.isOptimized })
        }
    }
};
</script>

<style>
.drop-zone {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border: dashed 2px lightgray;
    box-sizing: border-box;
    text-transform: uppercase;
    font-weight: bold;
    color: gray;
    transition: color 250ms, background-color 250ms;
    padding: 0 1rem;
    position: relative;
}
.drag-zone[drag-state="drag-on"] {
    cursor: pointer;
}
.drag-zone[drag-state="drag-off"] {
    cursor: dragging;
    background-color: lightgray;
    color: black;
}
.drop-zone:not([item-state="edit"]) {
    cursor: pointer;
}
.hidden-input {
    position: fixed;
    visibility: hidden;
    height: 0;
    width: 0;
}
.svg-viewer {
    padding: 5%;
    width: 100%;
    height: 100%;
}
.svg-viewer > svg {
    width: 100%;
    height: 100%;
}
.flex-centered {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}
.flex-centered > * {
    margin: auto;
}
.image-label {
    position: absolute;
    top: 9px;
    left: 10px;
    background-color: #3eaf7c;
    color: white;
    font-weight: bold;
    padding: 3px 10px;
    border-radius: 4px;
    opacity: 0.75;
    filter: grayscale(1);
    transition: filter 350ms;
}
.image-label[data-state="edit"] {
    filter: grayscale(0);
}
.container {
    position: relative;
}
.overlay {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    visibility: hidden;
}
.overlay > * {
    visibility: visible;
}
.optimize-check {
    position: absolute;
    top: 5px;
    right: 14px;
}
</style>