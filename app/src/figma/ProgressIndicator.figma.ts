// url=https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=4-9
// source=https://github.com/nikulaguy/smoking-app/blob/main/app/src/components/ProgressIndicator/ProgressIndicator.tsx
// component=ProgressIndicator
import figma from 'figma'
const instance = figma.selectedInstance
const label = instance.findText('step-label', { traverseInstances: true })
const labelText = (label && label.type === 'TEXT') ? label.textContent : 'Étape 1 sur 3'

export default {
  example: figma.code`<ProgressIndicator progress={1 / 3}>
  ${labelText}
</ProgressIndicator>`,
  imports: ['import { ProgressIndicator } from "../components/ProgressIndicator/ProgressIndicator"'],
  id: 'progress-indicator',
  metadata: { nestable: true },
}
