// url=https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=74-1209
// source=https://github.com/nikulaguy/smoking-app/blob/main/app/src/components/RecapList/RecapList.tsx
// component=RecapList
import figma from 'figma'
const instance = figma.selectedInstance
const label = instance.findText('label', { traverseInstances: true })
const value = instance.findText('value', { traverseInstances: true })
const labelText = (label && label.type === 'TEXT') ? label.textContent : 'Ta conso'
const valueText = (value && value.type === 'TEXT') ? value.textContent : '11 à 20 / jour'

export default {
  example: figma.code`<RecapItem label="${labelText}">${valueText}</RecapItem>`,
  imports: ['import { RecapItem } from "../components/RecapList/RecapList"'],
  id: 'recap-item',
  metadata: { nestable: true },
}
