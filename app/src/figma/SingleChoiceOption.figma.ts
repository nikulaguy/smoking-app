// url=https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=3-36
// source=app/src/components/SingleChoiceOption/SingleChoiceOption.tsx
// component=SingleChoiceOption
import figma from 'figma'
const instance = figma.selectedInstance
const state = instance.getEnum('State', { 'Unselected': 'unselected', 'Selected': 'selected', 'Pressed': 'pressed', 'Disabled': 'disabled' })
const label = instance.findText('Label', { traverseInstances: true })
const labelText = (label && label.type === 'TEXT') ? label.textContent : 'Option'

export default {
  example: figma.code`<SingleChoiceOption
  name="groupe"
  ${state === 'selected' ? 'checked' : ''}
  ${state === 'disabled' ? 'disabled' : ''}
  onChange={() => setAnswer(value)}
>
  ${labelText}
</SingleChoiceOption>`,
  imports: ['import { SingleChoiceOption } from "../components/SingleChoiceOption/SingleChoiceOption"'],
  id: 'single-choice-option',
  metadata: { nestable: true },
}
