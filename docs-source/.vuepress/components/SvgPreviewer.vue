<template>
    <div class="svg-previewer">
        <svg v-if="pathData && pathData.length === 2" xmlns="http://www.w3.org/2000/svg" :viewBox="viewBox">
            <path ref="target" />
        </svg>
    </div>
</template>

<script>
import { renderPath } from "../../../lib.es2015/operators/renderPath";
import { interpolate } from "../../../lib.es2015/interpolate";
import { timeline } from "just-animate";

export default {
    data() {
        return {
            t1: undefined
        };
    },
    computed: {
        viewBox() {
            let x = 0;
            let y = 0;
            let w = 0;
            let h = 0;

            this.pathData.forEach(p => {
                p.data.forEach(path => {
                    x = Math.min(path.x, x);
                    y = Math.min(path.y, y);
                    w = Math.max(path.w, w);
                    h = Math.max(path.h, h);
                });
            });

            return [x, y, x + w, y + h].join(" ");
        }
    },
    methods: { 
        morph(a, b) {
            return interpolate([a, b]);
        },
        updatePreview() {
            if (this.t1) {
                this.t1.destroy();
            }

            if (this.pathData && this.pathData.length === 2) {
                requestAnimationFrame(() => {
                    const path = this.pathData.map(s => renderPath(s.data.map(s2 => s2.d), Math.round));
                    const target = this.$refs.target;

                    this.t1 = timeline().add({
                        targets: target,
                        duration: this.duration,
                        props: {
                            d: path.map(s => ({
                                value: s,
                                interpolate: this.morph
                            }))
                        }
                    });

                    this.t1.pause();
                    this.t1.seek(this.progress);
                });
            }
        }
    },
    props: {
        pathData: Array,
        duration: Number,
        progress: Number
    },
    watch: {
        pathData(newVal) {
            this.updatePreview();
        },
        progress(newVal) {
            if (this.t1) {
                this.t1.seek(this.progress);
            }
        }
    }
};
</script>

<style> 
.svg-previewer > svg {
    width: 100%;
    height: 100%;
}
</style>