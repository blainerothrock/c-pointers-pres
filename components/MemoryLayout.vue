<template>
    <div class="memory-layout">
        <div class="address-label">
            <span>High Address<br />0xFFFFFFFF</span>
            <span>Low Address<br />0x00000000</span>
        </div>
        <div class="memory-diagram">
            <div
                class="segment stack"
                :class="{
                    dimmed: isDimmed('stack'),
                    highlighted: isHighlighted('stack'),
                }"
            >
                <h3>Stack</h3>
                <p>Local variables, function params</p>
                <div class="arrow">↓</div>
            </div>

            <div
                class="segment free"
                :class="{
                    dimmed: isDimmed('free'),
                    highlighted: isHighlighted('free'),
                }"
            >
                <h3>Free Memory</h3>
            </div>

            <div
                class="segment heap"
                :class="{
                    dimmed: isDimmed('heap'),
                    highlighted: isHighlighted('heap'),
                }"
            >
                <h3>Heap</h3>
                <p><code>malloc()</code> / <code>free()</code></p>
                <div class="arrow">↑</div>
            </div>

            <div
                class="segment bss"
                :class="{
                    dimmed: isDimmed('bss'),
                    highlighted: isHighlighted('bss'),
                }"
            >
                <h3>BSS</h3>
                <p>Uninitialized static/global</p>
            </div>

            <div
                class="segment data"
                :class="{
                    dimmed: isDimmed('data'),
                    highlighted: isHighlighted('data'),
                }"
            >
                <h3>Data</h3>
                <p>Initialized static/global</p>
            </div>

            <div
                class="segment text"
                :class="{
                    dimmed: isDimmed('text'),
                    highlighted: isHighlighted('text'),
                }"
            >
                <h3>Text</h3>
                <p>Program code (read-only)</p>
            </div>
        </div>
        <div class="annotations">
            <div
                class="annotation dynamic"
                :class="{
                    dimmed: isDimmed('dynamic'),
                    highlighted: isHighlighted('dynamic'),
                }"
            >
                <div class="bracket"></div>
                <span>Dynamic<br />Memory</span>
            </div>
            <div
                class="annotation static"
                :class="{
                    dimmed: isDimmed('static'),
                    highlighted: isHighlighted('static'),
                }"
            >
                <div class="bracket"></div>
                <span>Static<br />Memory</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    highlight: {
        type: String,
        default: null,
    },
});

const dynamicSections = ["stack", "free", "heap"];
const staticSections = ["bss", "data", "text"];

const highlightedSections = computed(() => {
    if (!props.highlight) return [];
    const h = props.highlight.toLowerCase();
    if (h === "dynamic") return [...dynamicSections, "dynamic"];
    if (h === "static") return [...staticSections, "static"];
    return [h];
});

const isHighlighted = (section) => {
    if (!props.highlight) return false;
    return highlightedSections.value.includes(section.toLowerCase());
};

const isDimmed = (section) => {
    if (!props.highlight) return false;
    return !highlightedSections.value.includes(section.toLowerCase());
};
</script>

<style scoped>
.memory-layout {
    display: flex;
    align-items: stretch;
    gap: 12px;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    height: 400px;
}

.address-label {
    color: #888;
    font-family: "Courier New", monospace;
    font-size: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 4px 0;
    text-align: right;
}

.memory-diagram {
    width: 260px;
    border: 2px solid #333;
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.segment {
    padding: 6px 10px;
    text-align: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 0;
    transition:
        opacity 0.3s ease,
        filter 0.3s ease,
        transform 0.3s ease;
}

.segment:last-child {
    border-bottom: none;
}

.segment h3 {
    font-size: 11px;
    margin: 0 0 2px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
}

.segment p {
    font-size: 9px;
    line-height: 1.2;
    opacity: 0.9;
    margin: 0;
}

.segment code {
    font-family: "Courier New", monospace;
    background: rgba(0, 0, 0, 0.12);
    padding: 0 3px;
    border-radius: 2px;
    font-size: 9px;
}

.segment .arrow {
    font-size: 12px;
    margin-top: 1px;
    font-weight: bold;
}

.segment.dimmed {
    opacity: 0.3;
    filter: grayscale(50%);
}

.segment.highlighted {
    z-index: 1;
}

.stack {
    background: linear-gradient(135deg, #ff6b6b, #ee5a5a);
    color: white;
}

.free {
    background: repeating-linear-gradient(
        45deg,
        #e8e8e8,
        #e8e8e8 6px,
        #f5f5f5 6px,
        #f5f5f5 12px
    );
    color: #666;
    border-top: 2px dashed #ccc;
    border-bottom: 2px dashed #ccc;
}

.heap {
    background: linear-gradient(135deg, #4ecdc4, #44a08d);
    color: white;
}

.bss {
    background: linear-gradient(135deg, #ffe66d, #f0d643);
    color: #333;
}

.data {
    background: linear-gradient(135deg, #95e1a3, #7bc88a);
    color: #333;
}

.text {
    background: linear-gradient(135deg, #a8d8ea, #8ec5d6);
    color: #333;
}

.annotations {
    display: flex;
    flex-direction: column;
    font-size: 11px;
    font-weight: 600;
    padding: 0;
    height: 100%;
}

.annotation {
    display: flex;
    align-items: center;
    gap: 8px;
    transition: opacity 0.3s ease;
}

.annotation.dimmed {
    opacity: 0.3;
}

.annotation.highlighted span {
    font-weight: 700;
}

.annotation .bracket {
    width: 10px;
    border: 2px solid currentColor;
    border-left: none;
    border-radius: 0 6px 6px 0;
}

.annotation span {
    line-height: 1.3;
}

.annotation.dynamic {
    color: #e74c3c;
    height: 50%;
}

.annotation.dynamic .bracket {
    height: 100%;
}

.annotation.static {
    color: #3498db;
    height: 50%;
}

.annotation.static .bracket {
    height: 100%;
}
</style>
