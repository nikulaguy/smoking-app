// url=https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=67-1116
// source=https://github.com/nikulaguy/smoking-app/blob/main/app/src/components/StatMetric/StatMetric.tsx
// component=StatMetric
import figma from 'figma'
const instance = figma.selectedInstance
const size = instance.getEnum('Size', { 'hero': 'hero', 'compact': 'compact' })
const value = instance.findText('value', { traverseInstances: true })
const label = instance.findText('metric-label', { traverseInstances: true })
const valueText = (value && value.type === 'TEXT') ? value.textContent : '12,50 €'
const labelText = (label && label.type === 'TEXT') ? label.textContent : 'dans ta poche'

export default {
  example: figma.code`<StatMetric size="${size}" metricLabel="${labelText}">
  ${valueText}
</StatMetric>`,
  imports: ['import { StatMetric } from "../components/StatMetric/StatMetric"'],
  id: 'stat-metric',
  metadata: { nestable: true },
}
