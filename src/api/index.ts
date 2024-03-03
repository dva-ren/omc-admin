export * from './post'
export * from './user'
export * from './category'
export * from './note'
export * from './say'
export * from './comment'
export * from './link'
export * from './config'
export * from './image'
export * from './system'

export const queryIpInfo = (ip: string) => {
  return (`https://api.vore.top/api/IPdata?ip=${ip}`)
}
