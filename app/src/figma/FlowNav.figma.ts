// url=https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=274-2154
// source=app/src/components/FlowNav/FlowNav.tsx
// component=FlowNav
import figma from 'figma'
const instance = figma.selectedInstance
const showBack = instance.getBoolean('Show back')
const showQuit = instance.getBoolean('Show quit')

export default {
  example: figma.code`<FlowNav${showBack ? figma.code` onBack={prev}` : ''}${showQuit ? figma.code` onQuit={askQuit}` : ''} />`,
  imports: ['import { FlowNav } from "../components/FlowNav/FlowNav"'],
  id: 'flow-nav',
  metadata: { nestable: true },
}
