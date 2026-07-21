// url=https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=1-877
// source=https://github.com/nikulaguy/smoking-app/blob/main/app/src/components/ContainerField/ContainerField.tsx
// component=ContainerField
import figma from 'figma'
const instance = figma.selectedInstance
const state = instance.getEnum('state', { 'default': 'default', 'selected': 'selected', 'pressed': 'pressed', 'disabled': 'disabled', 'error': 'error' })
const size = instance.getEnum('size', { 'default': 'default', 'compact': 'compact', 'tile': 'tile' })

export default {
  example: figma.code`// coque visuelle commune des champs (les états dérivent du contenu natif)
<label className={containerFieldVariants({ size: "${size}" })}${state !== 'default' ? figma.code` data-state="${state}"` : ''}>
  {/* input natif + contenu */}
</label>`,
  imports: ['import { containerFieldVariants } from "../components/ContainerField/ContainerField"'],
  id: 'container-field',
  metadata: { nestable: true },
}
