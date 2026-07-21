// url=https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=67-1107
// source=https://github.com/nikulaguy/smoking-app/blob/main/app/src/components/SosCraving/SosCraving.tsx
// component=SosCraving
import figma from 'figma'
const instance = figma.selectedInstance
const label = instance.findText('Link Text', { traverseInstances: true })
const labelText = (label && label.type === 'TEXT') ? label.textContent : 'Une envie, là ?'

export default {
  example: figma.code`<SosCraving onClick={() => sosRef.current?.showModal()}>
  ${labelText}
</SosCraving>`,
  imports: ['import { SosCraving } from "../components/SosCraving/SosCraving"'],
  id: 'sos-craving',
  metadata: { nestable: true },
}
