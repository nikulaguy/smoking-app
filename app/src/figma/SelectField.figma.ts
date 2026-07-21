// url=https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=20-161
// source=https://github.com/nikulaguy/smoking-app/blob/main/app/src/components/SelectField/SelectField.tsx
// component=SelectField
import figma from 'figma'
const instance = figma.selectedInstance
const state = instance.getEnum('State', { 'Empty': 'empty', 'Filled': 'filled', 'Error': 'error', 'Disabled': 'disabled' })
const fieldLabel = instance.findText('field-label', { traverseInstances: true })
const value = instance.findText('value', { traverseInstances: true })
const labelText = (fieldLabel && fieldLabel.type === 'TEXT') ? fieldLabel.textContent : 'Libellé'
const valueText = (value && value.type === 'TEXT') ? value.textContent : ''

export default {
  example: figma.code`<SelectField
  label="${labelText}"
  selectorTitle="${labelText} ?"
  options={OPTIONS}
  ${state === 'filled' && valueText ? figma.code`value="${valueText}"` : ''}
  ${state === 'error' ? figma.code`error="Choisis une option pour continuer."` : ''}
  onChange={(v) => setAnswer(v)}
/>`,
  imports: ['import { SelectField } from "../components/SelectField/SelectField"'],
  id: 'select-field',
  metadata: { nestable: true },
}
