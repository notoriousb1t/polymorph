<template> 
  <label class="drop-zone" :data-state="dragState"
    @drop="handleFileDrop" 
    @dragover="handleDragEnter"
    @dragenter="handleDragEnter"
    @dragleave="handleDragLeave">
    
    <input class="hidden-input" type="file" @change="handleFileSelected" />
    <p v-if="errorMessage">
        {{errorMessage}} 
    </p>
    <p v-else-if="dragState === 'drag-off'">
        Select or drop an Single Path SVG
    </p>
    <p v-else>
        Dropping file
    </p>
</label>
</template>

<script>

function readFileContents(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = e => resolve(e.target.result);
        fileReader.onerror = reject;
        fileReader.readAsText(file);
    });
}

export default {
    data() {
        return {
            dragState: "drag-off",
            errorMessage: "",
            errorTaskId: 0
        };
    },
    methods: {
        handleError(err) {
            this.errorMessage = err.toString();
            console.error(err);

            // clear previous error message clear timeout
            if (this.errorTaskId) {
                clearTimeout(this.errorTaskId);
            }
            // clear error message in a few seconds
            this.errorTaskId = setTimeout(() => {
                this.errorTaskId = 0;
                this.errorMessage = "";
            }, 5000);
        },
        handleDragLeave($event) {
            $event.preventDefault();
            this.dragState = "drag-off"; 
        },
        handleDragEnter($event) {
            $event.preventDefault();
            this.dragState = "drag-on";
        },
        handleFileSelected($event) {
            const target = $event.currentTarget;
            const fileObj = target.files[0];
            this.openFile(fileObj);
        },
        handleFileDrop($event) {
            $event.preventDefault();
            this.dragState = "drag-off";
            const fileObj = $event.dataTransfer.files[0];
            this.openFile(fileObj);
        },
        openFile(fileObj) {
            this.errorMessage = "";

            readFileContents(fileObj)
                .then(contents => {
                    this.$emit("select", { name: fileObj.name, contents });
                })
                .catch(err => {
                    this.handleError(err);
                });
        }
    }
};
</script>

<style lang="css">
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
    cursor: pointer;
}
.drag-zone[drag-state="drag-on"] {
    cursor: pointer;
}
.drag-zone[drag-state="drag-off"]  {
    cursor: dragging;
    background-color: lightgray;
    color: black;
}
.hidden-input {
    position: fixed;
    visibility: hidden;
    height: 0;
    width: 0;
}
</style>