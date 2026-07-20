// url=https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=27-309
// source=app/src/components/LikertScale/LikertScale.tsx
// component=LikertScale
import figma from 'figma'
const instance = figma.selectedInstance
const points = instance.getEnum('Points', { '7': '7', '5': '5' })
const min = instance.findText('anchor-min', { traverseInstances: true })
const max = instance.findText('anchor-max', { traverseInstances: true })
const minText = (min && min.type === 'TEXT') ? min.textContent : 'Pas du tout'
const maxText = (max && max.type === 'TEXT') ? max.textContent : 'Tout à fait'

export default {
  example: figma.code`<LikertScale
  legend={<span>« L'affirmation à évaluer. »</span>}
  points={${points}}
  name="question"
  anchorMin="${minText}"
  anchorMax="${maxText}"
  value={value}
  onChange={(v) => setAnswer(v)}
/>`,
  imports: ['import { LikertScale } from "../components/LikertScale/LikertScale"'],
  id: 'likert-scale',
  metadata: { nestable: true },
}
