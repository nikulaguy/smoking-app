// url=https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=67-1094
// source=https://github.com/nikulaguy/smoking-app/blob/main/app/src/components/TabBar/TabBar.tsx
// component=TabBar
import figma from 'figma'
const instance = figma.selectedInstance
export default {
  example: figma.code`<TabBar>
  {TABS.map((t) => (
    <NavLink key={t.to} to={t.to} end={t.end} className={styles.tabItem}>
      {t.label}
    </NavLink>
  ))}
</TabBar>`,
  imports: ['import { TabBar } from "../components/TabBar/TabBar"'],
  id: 'tab-bar',
  metadata: { nestable: false },
}
