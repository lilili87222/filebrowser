// emit
export type TEmit<T> = (event: T, ...args: any[]) => void

export const BasePropsDefine = {
  onClick: Function
} as const
