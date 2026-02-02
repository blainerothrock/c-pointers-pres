<template>
    <div class="memory-table-wrapper">
        <div v-if="title" class="table-title">{{ title }}</div>
        <table class="memory-table">
            <thead>
                <tr class="group-header">
                    <th colspan="2" class="group-col">Memory</th>
                    <th :colspan="(showLabels ? 1 : 0) + (showValues ? 1 : 0)" v-if="showLabels || showValues" class="group-col">Code</th>
                </tr>
                <tr>
                    <th class="address-col">Address</th>
                    <th class="value-col">Byte</th>
                    <th v-if="showLabels" class="label-col">Variable</th>
                    <th v-if="showValues" class="decoded-col">Value</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="showTopEllipsis" class="ellipsis">
                    <td class="address-col">...</td>
                    <td class="value-col"></td>
                    <td v-if="showLabels" class="label-col"></td>
                    <td v-if="showValues" class="decoded-col"></td>
                </tr>
                <tr
                    v-for="(cell, index) in computedCells"
                    :key="index"
                    :class="{
                        highlighted: isHighlighted(cell),
                        dimmed: hasHighlight && !isHighlighted(cell),
                        free: cell.isFree,
                    }"
                    :style="
                        cell.varColor ? { '--var-color': cell.varColor } : {}
                    "
                >
                    <td class="address-col">
                        <code>{{ cell.address }}</code>
                    </td>
                    <td class="value-col">
                        <code>{{ cell.value }}</code>
                    </td>
                    <td v-if="showLabels" class="label-col">
                        <span v-if="cell.label" class="label">{{
                            cell.label
                        }}</span>
                    </td>
                    <td v-if="showValues" class="decoded-col">
                        <code v-if="cell.readableValue">{{ cell.readableValue }}</code>
                    </td>
                </tr>
                <tr v-if="showBottomEllipsis" class="ellipsis">
                    <td class="address-col">...</td>
                    <td class="value-col"></td>
                    <td v-if="showLabels" class="label-col"></td>
                    <td v-if="showValues" class="decoded-col"></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    baseAddress: {
        type: Number,
        default: 0x1000,
    },
    variables: {
        type: Array,
        required: true,
        // Each variable: { name: string, type: string, value: number|string|array, color?: string }
        // Types: 'char', 'int', 'short', 'long', 'pointer', 'float', 'double', 'byte', 'bytes'
    },
    highlight: {
        type: String,
        default: null, // Variable name to highlight
    },
    showTopEllipsis: {
        type: Boolean,
        default: true,
    },
    showBottomEllipsis: {
        type: Boolean,
        default: true,
    },
    showLabels: {
        type: Boolean,
        default: true,
    },
    endian: {
        type: String,
        default: "little", // 'little' or 'big'
    },
    bits: {
        type: Number,
        default: 32, // 32 or 64 bit architecture
    },
    showValues: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: null,
    },
});

const typeInfo = computed(() => ({
    char: { size: 1 },
    byte: { size: 1 },
    short: { size: 2 },
    int: { size: 4 },
    long: { size: props.bits === 64 ? 8 : 4 },
    pointer: { size: props.bits === 64 ? 8 : 4 },
    ptr: { size: props.bits === 64 ? 8 : 4 },
    float: { size: 4 },
    double: { size: 8 },
    bytes: { size: null }, // dynamic
    gap: { size: null, isFree: true }, // unallocated space
    free: { size: null, isFree: true }, // alias for gap
}));

const colorPalette = [
    "#4caf50",
    "#2196f3",
    "#ff9800",
    "#9c27b0",
    "#f44336",
    "#00bcd4",
    "#e91e63",
];

// Address formatting: 32-bit = 8 hex chars, 64-bit = 12 hex chars (48-bit addresses)
const addressPadding = computed(() => (props.bits === 64 ? 12 : 8));

function toHexBytes(value, size, endian) {
    const bytes = [];
    let num = typeof value === "string" ? value.charCodeAt(0) : Number(value);

    // Handle negative numbers (two's complement)
    if (num < 0) {
        num = (1 << (size * 8)) + num;
    }

    for (let i = 0; i < size; i++) {
        bytes.push((num >> (i * 8)) & 0xff);
    }

    if (endian === "big") {
        bytes.reverse();
    }

    return bytes.map(
        (b) => "0x" + b.toString(16).toUpperCase().padStart(2, "0"),
    );
}

function formatReadableValue(variable, type) {
    const info = typeInfo.value[type] || (type.endsWith("*") ? typeInfo.value["pointer"] : null);
    if (!info || info.isFree) return null;

    const val = variable.value;

    // Pointer types — show as hex address
    if (type === "pointer" || type === "ptr" || type.endsWith("*")) {
        return "0x" + Number(val).toString(16).toUpperCase().padStart(addressPadding.value, "0");
    }

    // Single char
    if (type === "char" && typeof val === "string" && val.length === 1) {
        return `'${val}'`;
    }

    // Char string
    if (type === "char" && typeof val === "string" && val.length > 1) {
        return `"${val}"`;
    }

    // Numeric types — show decimal
    if (typeof val === "number") {
        return val.toString();
    }

    return String(val);
}

const computedCells = computed(() => {
    const cells = [];
    let currentAddress = props.baseAddress;
    let colorIndex = 0;

    // First pass: calculate all variables and their bytes
    const varBlocks = [];

    for (const variable of props.variables) {
        const type = variable.type.toLowerCase();
        const info = typeInfo.value[type]
            || (type.endsWith('*') ? typeInfo.value['pointer'] : null);

        if (!info) {
            console.warn(`Unknown type: ${type}`);
            continue;
        }

        let bytes = [];
        let size = info.size;

        if (info.isFree) {
            // Gap/free space - value is the size in bytes
            size = typeof variable.value === "number" ? variable.value : 1;
            bytes = Array(size).fill("??");
        } else if (type === "bytes" && Array.isArray(variable.value)) {
            // Raw bytes array
            bytes = variable.value.map(
                (b) => "0x" + b.toString(16).toUpperCase().padStart(2, "0"),
            );
            size = bytes.length;
        } else if (
            type === "char" &&
            typeof variable.value === "string" &&
            variable.value.length > 1
        ) {
            // String (array of chars)
            bytes = variable.value
                .split("")
                .map(
                    (c) =>
                        "0x" +
                        c
                            .charCodeAt(0)
                            .toString(16)
                            .toUpperCase()
                            .padStart(2, "0"),
                );
            // Add null terminator
            bytes.push("0x00");
            size = bytes.length;
        } else {
            bytes = toHexBytes(variable.value, size, props.endian);
        }

        const isFree = info.isFree || false;
        const varColor = isFree
            ? "#999"
            : variable.color || colorPalette[colorIndex % colorPalette.length];
        if (!isFree) colorIndex++;

        varBlocks.push({
            variable,
            type,
            bytes,
            size,
            startAddress: currentAddress,
            varColor,
            isFree,
        });

        currentAddress += size;
    }

    // Second pass: build cells from high address to low address
    // Iterate variables in reverse (last variable = highest address)
    for (let i = varBlocks.length - 1; i >= 0; i--) {
        const block = varBlocks[i];
        const { variable, type, bytes, size, startAddress, varColor, isFree } = block;

        // Add bytes from high to low address within this variable
        for (let j = size - 1; j >= 0; j--) {
            const addr = startAddress + j;
            let label = "";
            if (j === 0 && !isFree) {
                label = `${variable.type} ${variable.name}`;
            } else if (j === 0 && isFree && variable.name) {
                label = variable.name;
            }
            const readable = formatReadableValue(variable, type);
            cells.push({
                address:
                    "0x" +
                    addr
                        .toString(16)
                        .toUpperCase()
                        .padStart(addressPadding.value, "0"),
                value: bytes[j],
                varName: variable.name,
                varColor: varColor,
                isFree: isFree,
                label: label,
                readableValue: j === 0 ? readable : null,
            });
        }
    }

    return cells;
});

const hasHighlight = computed(() => props.highlight !== null);

const isHighlighted = (cell) => {
    if (!props.highlight) return false;
    return cell.varName === props.highlight;
};
</script>

<style scoped>
.memory-table-wrapper {
    display: inline-block;
    border: 2px solid rgba(128, 128, 128, 0.5);
    border-radius: 4px;
    overflow: hidden;
}

.table-title {
    font-size: 8px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    opacity: 0.5;
    text-align: center;
    padding: 4px 10px 2px;
    background: rgba(128, 128, 128, 0.15);
    border-bottom: 1px solid rgba(128, 128, 128, 0.2);
}

.memory-table {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    border-collapse: collapse;
    opacity: 0.9;
}

thead tr {
    background: rgba(128, 128, 128, 0.15);
}

thead tr:last-child {
    border-bottom: 2px solid rgba(128, 128, 128, 0.3);
}

tr.group-header {
    border-bottom: 1px solid rgba(128, 128, 128, 0.2);
}

.group-col {
    font-weight: 600;
    font-size: 8px;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 4px 10px 2px;
    text-align: center;
    opacity: 0.5;
}

.group-col + .group-col {
    border-left: 2px solid rgba(128, 128, 128, 0.5);
}

th {
    font-weight: 600;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 6px 10px;
    text-align: left;
    opacity: 0.7;
}

tbody tr {
    transition:
        opacity 0.3s ease,
        background 0.3s ease;
}

tbody tr:not(:last-child) {
    border-bottom: 1px solid rgba(128, 128, 128, 0.2);
}

tr.ellipsis {
    opacity: 0.5;
}

tr.free {
    background: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 4px,
        rgba(128, 128, 128, 0.2) 4px,
        rgba(128, 128, 128, 0.2) 8px
    );
    opacity: 0.5;
}

tr.highlighted {
    background: color-mix(in srgb, var(--var-color) 20%, transparent);
}

tr.dimmed {
    opacity: 0.35;
}

.address-col {
    padding: 5px 10px;
    font-size: 11px;
}

tbody .address-col {
    background: color-mix(in srgb, var(--var-color, gray) 20%, transparent);
}

thead .address-col {
    background: rgba(128, 128, 128, 0.1);
}

.value-col {
    padding: 5px 10px;
    font-size: 11px;
    border-left: 1px solid rgba(128, 128, 128, 0.2);
}

tbody .value-col {
    background: color-mix(in srgb, var(--var-color, gray) 20%, transparent);
}

.label-col {
    padding: 5px 10px;
    font-size: 10px;
    opacity: 0.8;
    border-left: 2px solid rgba(128, 128, 128, 0.5);
}

.label {
    font-family: "Courier New", monospace;
    font-size: 10px;
    color: var(--var-color);
    font-weight: 600;
}

code {
    font-family: "Courier New", monospace;
    font-size: 11px;
}

.decoded-col {
    padding: 5px 10px;
    font-size: 11px;
    vertical-align: middle;
    border-left: 1px solid rgba(128, 128, 128, 0.2);
}
</style>
