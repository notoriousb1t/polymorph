<template>
    <div class="workbench-app">
        <svg-editor 
            v-for="item in items"
            :key="item.label"
            :label="item.label" 
            :itemState="item.itemState"
            :loadState='item.loadState'
            :errorMessage="item.errorMessage"
            :isOptimized="item.isOptimized"
            :paths="item.paths" 
            @open="openFile(item, $event)"
            @changeSettings="changeSettings(item, $event)" />

        <div class="flex-centered">
            <svg-previewer :pathData="pathData" :progress="progress" :duration="duration" />
            
            <div class="preview-scrubber">
                <label>Tween</label>
                <input type="range" v-model="progress" min="0" :max="duration" step="0" />
            </div>
        </div> 
        {{ /* disable content output, this is really a layout hack */ }}
        <Content v-if="false" />
    </div>
</template>

<script>
import { parsePath } from "../../../lib.es2015/operators/parsePath";
import { Svgo } from "../svgomg/svgo";

const svgo = new Svgo();

const settings = {
    floatPrecision: 2,
    plugins: {
        cleanupAttrs: true,
        removeXMLProcInst: true,
        removeComments: true,
        removeMetadata: true,
        removeTitle: true,
        removeDesc: true,
        removeUselessDefs: true,
        removeEditorsNSData: true,
        removeEmptyAttrs: true,
        removeHiddenElems: true,
        removeEmptyText: true,
        removeEmptyContainers: true,
        removeViewBox: false,
        cleanupEnableBackground: true,
        convertStyleToAttrs: true,
        convertColors: true,
        convertPathData: true,
        convertTransform: true,
        removeUnknownsAndDefaults: true,
        removeNonInheritableGroupAttrs: true,
        removeUselessStrokeAndFill: false,
        removeUnusedNS: true,
        cleanupIDs: false,
        cleanupNumericValues: true,
        moveElemsAttrsToGroup: true,
        moveGroupAttrsToElems: true,
        collapseGroups: true,
        removeRasterImages: false,
        mergePaths: true,
        convertShapeToPath: true,
        sortAttrs: true,
        removeDimensions: true
    }
};

export default {
    data() {
        return { 
            duration: 1000,
            progress: 500,
            items: [
                { label: "A", itemState: "initial", loadState: "initial", errorMessage: "", isOptimized: true, paths: null },
                { label: "B", itemState: "initial", loadState: "initial", errorMessage: "", isOptimized: true, paths: null }
            ]
        };
    },
    computed: {
      pathData() {
          return this.items.map(i => i.paths).filter(Boolean);
      }  
    },
    methods: {
        openFile(item, fileObj) {
            this.beginProcessing(item);
            this.readFileContents(fileObj)
                .then(contents => this.processSvg(item, contents))
                .catch(error => this.handleError(item, error));
        },
        changeSettings(item, settings) {
            if (settings.isOptimized !== undefined) {
                item.isOptimized = settings.isOptimized;
                if (item.originalFile) {
                    this.processSvg(item, item.originalFile.text);
                }
            }
        },
        beginProcessing(item) {
            item.errorMessage = "";
            item.loadState = "loading";
            item.paths = null;
        },
        endProcessing(item) {
            item.itemState = item.originalFile ? "edit" : "initial";
        },
        handleError(item, err) {
            item.errorMessage = err.toString();
            item.loadState = "error";
            console.error(err);
        },
        async readFileContents(blob) {
            return new Promise((resolve, reject) => {
                const fileReader = new FileReader();
                fileReader.onload = e => resolve(e.target.result);
                fileReader.onerror = reject;
                fileReader.readAsText(blob);
            });
        },
        async processSvg(item, contents) {
            // get a job id
            const thisJobId = (this._latestCompressJobId = Math.random());

            // cancel current request if applicable
            await svgo.abortCurrent();

            if (thisJobId != this._latestCompressJobId) {
                // while we've been waiting, there's been a newer call
                // to _compressSvg, we don't need to do anything
                return;
            }

            let file = await svgo.load(contents);
            item.originalFile = file;

            if (item.isOptimized) {
                file = await svgo.process(settings, () => {
                    // notify UI somehow
                });
            }

            item.optimizedFile = file;

            console.log(`finished processing file: ${item.originalFile.text.length} -> ${item.optimizedFile.text.length}`);

            // start parsing the svg into paths and points
            this.$nextTick(() => this.parseSVG(item));
        },
        parseSVG(item) {
            // read svg
            try {
                const div = document.createElement("div");
                div.innerHTML = item.optimizedFile.text;

                // get all paths in document except for ones used in clippath
                const pathEl = div.querySelector(":not(clipPath) > path");
                item.paths = parsePath(pathEl.getAttribute("d"));

                this.endProcessing(item);
            } catch (e) {
                this.handleError(item, e);
            }
        }
    },
    created() {
        if (typeof window !== "undefined") {
            if ("serviceWorker" in navigator) {
                if (!navigator.serviceWorker.controller) {
                    navigator.serviceWorker
                        .register("./svgo-worker.js", {
                            scope: "./"
                        })
                        .then(registration => {
                            registration.addEventListener("updatefound", () => this._onUpdateFound(registration));
                        });
                }
            }
        }
    }
};
</script>

<style>
.workbench-app {
    width: 100vw;
    height: calc(100vh - 58px);
    background-color: teal;
    overflow: hidden;
    background-color: hsl(163, 8%, 92%);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 100%;
}
.dropzone {
    border: dashed 2px lightgray;
}
.preview-scrubber {
    position: absolute;
    top: 0; 
    display: flex;
    justify-content: center;
    align-items: center;
    height: 36px;
}
</style>