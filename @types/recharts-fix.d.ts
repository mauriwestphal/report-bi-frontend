// @types/recharts-fix.d.ts
// Fix: Recharts 3.x JSX component type incompatibility with React 18
// Recharts 3.x returns ReactNode which is not assignable to JSX.Element
import 'recharts'

declare module 'recharts' {
  interface ResponsiveContainer {
    (props: any): React.ReactElement | null
  }
}
