// url=https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=36-572
// source=app/src/components/MultiChoiceOption/MultiChoiceOption.tsx
// component=MultiChoiceOption
import figma from 'figma'
const instance = figma.selectedInstance
const state = instance.getEnum('State', { 'Unselected': 'unselected', 'Selected': 'selected', 'Pressed': 'pressed', 'Disabled': 'disabled' })
const showDetail = instance.getBoolean('Show detail arrow')
const label = instance.findText('Label', { traverseInstances: true })
const description = instance.findText('Description', { traverseInstances: true })
const labelText = (label && label.type === 'TEXT') ? label.textContent : 'Option'
const descText = (description && description.type === 'TEXT') ? description.textContent : ''

export default {
  example: figma.code`<MultiChoiceOption
  name="groupe"
  ${state === 'selected' ? 'checked' : ''}
  ${state === 'disabled' ? 'disabled' : ''}
  ${descText ? figma.code`description="${descText}"` : ''}
  ${showDetail ? figma.code`onDetail={() => navigate('/prep/…')}
  detailLabel="Voir le détail : ${labelText}"` : ''}
>
  ${labelText}
</MultiChoiceOption>`,
  imports: ['import { MultiChoiceOption } from "../components/MultiChoiceOption/MultiChoiceOption"'],
  id: 'multi-choice-option',
  metadata: { nestable: true },
}
