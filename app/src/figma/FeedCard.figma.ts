// url=https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=191-1777
// source=https://github.com/nikulaguy/smoking-app/blob/main/app/src/components/Card/Card.tsx
// component=Card
import figma from 'figma'
const instance = figma.selectedInstance
const badge = instance.getString('Badge')
const title = instance.getString('Title')
const body = instance.getString('Body')

export default {
  example: figma.code`<Card variant="panel" badge="${badge}" title="${title}">
  ${body}
</Card>`,
  imports: ['import { Card } from "../components/Card/Card"'],
  id: 'feed-card',
  metadata: { nestable: true },
}
