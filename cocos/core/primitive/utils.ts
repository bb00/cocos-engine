/**
 * 几何图形模块
 * @packageDocumentation
 * @module 3d/primitive
 */

import { GFXPrimitiveMode } from '../gfx/define';
import { IGeometry } from './define';

/**
 * @deprecated
 */
export function wireframe (indices: number[]) {
    const offsets = [[0, 1], [1, 2], [2, 0]];
    const lines: number[] = [];
    const lineIDs = {};

    for (let i = 0; i < indices.length; i += 3) {
        for (let k = 0; k < 3; ++k) {
            const i1 = indices[i + offsets[k][0]];
            const i2 = indices[i + offsets[k][1]];

            // check if we already have the line in our lines
            const id = (i1 > i2) ? ((i2 << 16) | i1) : ((i1 << 16) | i2);
            if (lineIDs[id] === undefined) {
                lineIDs[id] = 0;
                lines.push(i1, i2);
            }
        }
    }

    return lines;
}

/**
 * @deprecated
 */
export function invWinding (indices: number[]) {
    const newIB: number[] = [];
    for (let i = 0; i < indices.length; i += 3) {
        newIB.push(indices[i], indices[i + 2], indices[i + 1]);
    }
    return newIB;
}

/**
 * @deprecated
 */
export function toWavefrontOBJ (primitive: IGeometry, scale = 1) {
    if (!primitive.indices ||
        !primitive.uvs ||
        !primitive.normals ||
        (primitive.primitiveMode !== undefined && primitive.primitiveMode !== GFXPrimitiveMode.TRIANGLE_LIST)) {
        return '';
    }
    const v = primitive.positions;
    const t = primitive.uvs;
    const n = primitive.normals;
    const IB = primitive.indices;
    const V = (i) => `${IB[i] + 1}/${IB[i] + 1}/${IB[i] + 1}`;
    let content = '';
    for (let i = 0; i < v.length; i += 3) {
        content += `v ${v[i] * scale} ${v[i + 1] * scale} ${v[i + 2] * scale}\n`;
    }
    for (let i = 0; i < t.length; i += 2) {
        content += `vt ${t[i]} ${t[i + 1]}\n`;
    }
    for (let i = 0; i < n.length; i += 3) {
        content += `vn ${n[i]} ${n[i + 1]} ${n[i + 2]}\n`;
    }
    for (let i = 0; i < IB.length; i += 3) {
        content += `f ${V(i)} ${V(i + 1)} ${V(i + 2)}\n`;
    }
    return content;
}

/**
 * @deprecated
 */
export function normals (positions: number[], nms: number[], length = 1) {
    const verts = new Array(2 * positions.length);

    for (let i = 0; i < positions.length / 3; ++i) {
        const i3 = 3 * i;
        const i6 = 6 * i;

        // line start
        verts[i6 + 0] = positions[i3 + 0];
        verts[i6 + 1] = positions[i3 + 1];
        verts[i6 + 2] = positions[i3 + 2];

        // line end
        verts[i6 + 3] = positions[i3 + 0] + nms[i3 + 0] * length;
        verts[i6 + 4] = positions[i3 + 1] + nms[i3 + 1] * length;
        verts[i6 + 5] = positions[i3 + 2] + nms[i3 + 2] * length;
    }

    return verts;
}
