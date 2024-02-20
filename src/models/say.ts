export interface SayModel {
  id: string
  text: string
  author?: string
  source?: string
  created: string
  updated: string
}

export type CreateSayModel = Omit<SayModel, 'id' | 'created' | 'updated'>
