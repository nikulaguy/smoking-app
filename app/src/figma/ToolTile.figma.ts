// url=https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=91-1420
// source=https://github.com/nikulaguy/smoking-app/blob/main/app/src/components/ToolTile/ToolTile.tsx
// component=ToolTile
import figma from 'figma'
const instance = figma.selectedInstance
const label = instance.findText('label', { traverseInstances: true })
const labelText = (label && label.type === 'TEXT') ? label.textContent : 'Respirer · 3 min'

export default {
  example: figma.code`<ToolTile icon={<img src={illustration} alt="" width={44} height={44} />} onClick={() => navigate(tool)}>
  ${labelText}
</ToolTile>`,
  imports: ['import { ToolTile } from "../components/ToolTile/ToolTile"'],
  id: 'tool-tile',
  metadata: { nestable: true },
}
