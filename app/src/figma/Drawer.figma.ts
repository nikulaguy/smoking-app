// url=https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=316-3584
// source=https://github.com/nikulaguy/smoking-app/blob/main/app/src/components/Drawer/Drawer.tsx
// component=Drawer
import figma from 'figma'
const instance = figma.selectedInstance
const title = instance.findText('title', { traverseInstances: true })
const titleText = (title && title.type === 'TEXT') ? title.textContent : 'Supprimer ces informations ?'

export default {
  example: figma.code`<Drawer
  ref={drawerRef}
  title="${titleText}"
  confirmLabel="Confirmer"
  cancelLabel="Annuler"
  onConfirm={handleConfirm}
>
  Message secondaire optionnel.
</Drawer>`,
  imports: ['import { Drawer } from "../components/Drawer/Drawer"'],
  id: 'drawer',
  metadata: { nestable: false },
}
