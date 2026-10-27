// List the parts of an Altium STEP export, to write a scripts/models/<module>.json config.
//
//   node .claude/skills/emya-product-page/scripts/list_step_parts.mjs <file.step>
//
// For each top-level part (designator, e.g. "U1", or "Board") prints its meshes with
// index, triangle count, STEP colour and bounding box (mm). Colour overrides in the
// config use "<part>" or "<part>.<meshIndex>"; boxes use the same mm coordinates.

import fs from 'node:fs'
import occtimportjs from 'occt-import-js'

const file = process.argv[2]
if (!file) {
  console.error('usage: node list_step_parts.mjs <file.step>')
  process.exit(1)
}

const occt = await occtimportjs()
const result = occt.ReadStepFile(new Uint8Array(fs.readFileSync(file)), { linearUnit: 'millimeter' })
if (!result.success) throw new Error('STEP import failed')

const assembly = result.root.children.length === 1 ? result.root.children[0] : result.root
const collect = (node, out = []) => {
  out.push(...node.meshes)
  node.children.forEach((c) => collect(c, out))
  return out
}

const fmt = (v) => v.map((n) => n.toFixed(2)).join(', ')
const hex = (c) => (c ? '#' + c.map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('') : '-')

for (const part of assembly.children) {
  console.log(part.name)
  collect(part).forEach((meshIdx, local) => {
    const m = result.meshes[meshIdx]
    const pos = m.attributes.position.array
    const min = [Infinity, Infinity, Infinity]
    const max = [-Infinity, -Infinity, -Infinity]
    for (let v = 0; v < pos.length; v += 3) {
      for (let k = 0; k < 3; k++) {
        min[k] = Math.min(min[k], pos[v + k])
        max[k] = Math.max(max[k], pos[v + k])
      }
    }
    const faceColors = [...new Set((m.brep_faces ?? []).map((f) => hex(f.color)))].join(' ')
    console.log(`  .${local}  ${m.index.array.length / 3} tris  colour ${hex(m.color)} ${faceColors}  min [${fmt(min)}] max [${fmt(max)}]`)
  })
}
