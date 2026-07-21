// url=https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=326-2411
// source=https://github.com/nikulaguy/smoking-app/blob/main/app/src/components/Switch/Switch.tsx
// component=Switch
import figma from 'figma'
const instance = figma.selectedInstance
const label = instance.findText('label', { traverseInstances: true })
const labelText = (label && label.type === 'TEXT') ? label.textContent : 'Toutes les notifications'
const checked = String(instance.getPropertyValue('State') ?? '').toLowerCase().includes('on')

export default {
  example: figma.code`<Switch checked={${checked}} onChange={(e) => setEnabled(e.target.checked)}>
  ${labelText}
</Switch>`,
  imports: ['import { Switch } from "../components/Switch/Switch"'],
  id: 'switch',
  metadata: { nestable: true },
}
