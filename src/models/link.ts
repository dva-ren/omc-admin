export enum LinkType {
  Friend,
  Collection,
}

export enum LinkState {
  Pass,
  Audit,
  Outdate,
  Banned,
  Reject,
}

export const LinkStateMap = {
  [LinkState.Pass]: '已通过',
  [LinkState.Audit]: '审核中',
  [LinkState.Outdate]: '已过期',
  [LinkState.Banned]: '已屏蔽',
  [LinkState.Reject]: '已拒绝',
}

export interface LinkModel {
  id: string
  name: string
  url: string
  avatar?: string
  type?: LinkType
  state: LinkState
  description?: string
  email?: string
  created: string
}

export type LinkModelDto = Omit<LinkModel, 'created'> & { id?: string }
