// Convert a module's Altium STEP export into compact GLB files for the wiki's 3D viewer.
//
//   node scripts/step-to-glb.mjs scripts/models/<module>.json
//
// The JSON config names the STEP file, the board node, optional top/bottom board
// textures (images cropped exactly to the board outline), per-part colour
// overrides, and one or more outputs (each may exclude extra parts, e.g. headers).

import fs from 'node:fs'
import path from 'node:path'
import occtimportjs from 'occt-import-js'

const configPath = process.argv[2]
if (!configPath) {
  console.error('usage: node scripts/step-to-glb.mjs scripts/models/<module>.json')
  process.exit(1)
}
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))

const occt = await occtimportjs()
const result = occt.ReadStepFile(new Uint8Array(fs.readFileSync(config.step)), {
  linearUnit: 'millimeter',
  linearDeflectionType: 'absolute_value',
  linearDeflection: 0.02,
  angularDeflection: 0.35
})
if (!result.success) throw new Error('STEP import failed')

// Map every mesh to the top-level part (node) it belongs to, e.g. "U1", "Board"
const owner = new Map()
const assign = (node, part) => {
  node.meshes.forEach((m, i) => owner.set(m, { part, local: i }))
  node.children.forEach((c) => assign(c, part))
}
const assembly = result.root.children.length === 1 ? result.root.children[0] : result.root
assembly.children.forEach((c) => assign(c, c.name))

const srgbToLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)

// Colour of a mesh: "<part>.<meshIndex>" override, then "<part>" override, then STEP colour
const colorOf = (meshIdx, stepColor) => {
  const o = owner.get(meshIdx)
  const c = config.colors?.[`${o?.part}.${o?.local}`] ?? config.colors?.[o?.part]
  return c ?? stepColor
}

// Optional per-part box: triangles whose centroid falls inside get another colour
// (e.g. a pin header's plastic housing vs. its pins, which STEP stores as one mesh)
const inBox = (box, x, y, z) =>
  [x, y, z].every((v, k) => v >= (box.min[k] ?? -Infinity) - 1e-3 && v <= (box.max[k] ?? Infinity) + 1e-3)

function build(exclude) {
  const chunks = []
  let byteLength = 0
  const bufferViews = []
  const accessors = []
  const addView = (data, target) => {
    const pad = (4 - (byteLength % 4)) % 4
    if (pad) { chunks.push(Buffer.alloc(pad)); byteLength += pad }
    const buf = Buffer.isBuffer(data) ? data : Buffer.from(data.buffer, data.byteOffset, data.byteLength)
    chunks.push(buf)
    bufferViews.push({ buffer: 0, byteOffset: byteLength, byteLength: buf.length, ...(target && { target }) })
    byteLength += buf.length
    return bufferViews.length - 1
  }

  const materials = []
  const materialIndex = new Map()
  const getMaterial = (color) => {
    const spec = Array.isArray(color) ? { rgb: color } : color
    const key = JSON.stringify(spec)
    if (!materialIndex.has(key)) {
      materials.push({
        pbrMetallicRoughness: {
          baseColorFactor: [...spec.rgb.map(srgbToLinear), 1],
          metallicFactor: spec.metal ?? 0.05,
          roughnessFactor: spec.rough ?? 0.6
        }
      })
      materialIndex.set(key, materials.length - 1)
    }
    return materialIndex.get(key)
  }

  // Board textures become their own materials, sampling TEXCOORD_0 (top) / TEXCOORD_1 (bottom)
  const images = []
  const textures = []
  const texMaterial = {}
  for (const [side, texCoord] of [['top', 0], ['bottom', 1]]) {
    const file = config.textures?.[side]
    if (!file) continue
    const mimeType = path.extname(file).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg'
    images.push({ bufferView: addView(fs.readFileSync(file)), mimeType })
    textures.push({ source: images.length - 1, sampler: 0 })
    materials.push({
      pbrMetallicRoughness: {
        baseColorTexture: { index: textures.length - 1, texCoord },
        metallicFactor: 0.05,
        roughnessFactor: 0.55
      }
    })
    texMaterial[side] = materials.length - 1
  }

  const meshes = []
  const nodes = []
  result.meshes.forEach((m, i) => {
    const part = owner.get(i)?.part
    if (exclude.has(part)) return

    const pos = new Float32Array(m.attributes.position.array)
    const nrm = m.attributes.normal ? new Float32Array(m.attributes.normal.array) : null
    const idx = m.index.array
    const min = [Infinity, Infinity, Infinity]
    const max = [-Infinity, -Infinity, -Infinity]
    for (let v = 0; v < pos.length; v += 3) {
      for (let k = 0; k < 3; k++) {
        min[k] = Math.min(min[k], pos[v + k])
        max[k] = Math.max(max[k], pos[v + k])
      }
    }
    const attributes = {
      POSITION: accessors.push({
        bufferView: addView(pos, 34962), componentType: 5126, count: pos.length / 3, type: 'VEC3', min, max
      }) - 1
    }
    if (nrm) {
      attributes.NORMAL = accessors.push({
        bufferView: addView(nrm, 34962), componentType: 5126, count: nrm.length / 3, type: 'VEC3'
      }) - 1
    }

    const isBoard = part === config.board && images.length > 0
    if (isBoard) {
      // Planar UVs over the board outline; the bottom view is mirrored left-right
      const w = max[0] - min[0]
      const h = max[1] - min[1]
      const uvTop = new Float32Array((pos.length / 3) * 2)
      const uvBottom = new Float32Array((pos.length / 3) * 2)
      for (let v = 0, t = 0; v < pos.length; v += 3, t += 2) {
        const u = (pos[v] - min[0]) / w
        const vv = (max[1] - pos[v + 1]) / h
        uvTop[t] = u
        uvTop[t + 1] = vv
        uvBottom[t] = 1 - u
        uvBottom[t + 1] = vv
      }
      attributes.TEXCOORD_0 = accessors.push({
        bufferView: addView(uvTop, 34962), componentType: 5126, count: uvTop.length / 2, type: 'VEC2'
      }) - 1
      attributes.TEXCOORD_1 = accessors.push({
        bufferView: addView(uvBottom, 34962), componentType: 5126, count: uvBottom.length / 2, type: 'VEC2'
      }) - 1
    }

    // Group triangles by material: board top/bottom faces get the textures,
    // everything else keeps its B-rep face colour (or the part's override)
    const groups = new Map()
    const push = (mat, a, b, c) => {
      if (!groups.has(mat)) groups.set(mat, [])
      groups.get(mat).push(a, b, c)
    }
    const faces = m.brep_faces?.length ? m.brep_faces : [{ first: 0, last: idx.length / 3 - 1, color: null }]
    const box = config.boxes?.[part]
    const boxMat = box && getMaterial(box.color)
    for (const f of faces) {
      const faceMat = getMaterial(colorOf(i, f.color || m.color || [0.6, 0.6, 0.6]))
      for (let t = f.first; t <= f.last; t++) {
        const a = idx[t * 3]
        const b = idx[t * 3 + 1]
        const c = idx[t * 3 + 2]
        let mat = faceMat
        if (box) {
          const cen = [0, 1, 2].map((k) => (pos[a * 3 + k] + pos[b * 3 + k] + pos[c * 3 + k]) / 3)
          if (inBox(box, ...cen)) mat = boxMat
        }
        if (isBoard && nrm) {
          const nz = (nrm[a * 3 + 2] + nrm[b * 3 + 2] + nrm[c * 3 + 2]) / 3
          if (nz > 0.9 && texMaterial.top !== undefined) mat = texMaterial.top
          else if (nz < -0.9 && texMaterial.bottom !== undefined) mat = texMaterial.bottom
        }
        push(mat, a, b, c)
      }
    }

    const primitives = [...groups.entries()].map(([material, tris]) => {
      const indices = new Uint32Array(tris)
      const idxAcc = accessors.push({
        bufferView: addView(indices, 34963), componentType: 5125, count: indices.length, type: 'SCALAR'
      }) - 1
      return { attributes, indices: idxAcc, material }
    })

    meshes.push({ name: `${part}:${m.name}`, primitives })
    nodes.push({ name: `${part}:${m.name}`, mesh: meshes.length - 1 })
  })

  // Root: mm -> m, and STEP Z-up -> glTF Y-up
  nodes.push({
    name: 'root',
    children: nodes.map((_, i) => i),
    scale: [0.001, 0.001, 0.001],
    rotation: [-Math.SQRT1_2, 0, 0, Math.SQRT1_2]
  })

  const gltf = {
    asset: { version: '2.0', generator: 'emya-wiki step-to-glb' },
    scene: 0,
    scenes: [{ nodes: [nodes.length - 1] }],
    nodes,
    meshes,
    materials,
    accessors,
    bufferViews,
    buffers: [{ byteLength }]
  }
  if (images.length) {
    gltf.images = images
    gltf.textures = textures
    gltf.samplers = [{ magFilter: 9729, minFilter: 9987, wrapS: 33071, wrapT: 33071 }]
  }

  const bin = Buffer.concat(chunks)
  const binPad = Buffer.alloc((4 - (bin.length % 4)) % 4)
  const json = Buffer.from(JSON.stringify(gltf))
  const jsonPad = Buffer.alloc((4 - (json.length % 4)) % 4, 0x20)
  const total = 12 + 8 + json.length + jsonPad.length + 8 + bin.length + binPad.length

  const header = Buffer.alloc(12)
  header.writeUInt32LE(0x46546c67, 0) // 'glTF'
  header.writeUInt32LE(2, 4)
  header.writeUInt32LE(total, 8)
  const jsonHead = Buffer.alloc(8)
  jsonHead.writeUInt32LE(json.length + jsonPad.length, 0)
  jsonHead.writeUInt32LE(0x4e4f534a, 4) // 'JSON'
  const binHead = Buffer.alloc(8)
  binHead.writeUInt32LE(bin.length + binPad.length, 0)
  binHead.writeUInt32LE(0x004e4942, 4) // 'BIN'

  return Buffer.concat([header, jsonHead, json, jsonPad, binHead, bin, binPad])
}

for (const out of config.outputs) {
  const exclude = new Set([...(config.exclude ?? []), ...(out.exclude ?? [])])
  const glb = build(exclude)
  fs.writeFileSync(out.file, glb)
  console.log(`${out.file}: ${(glb.length / 1024).toFixed(0)} KB`)
}
