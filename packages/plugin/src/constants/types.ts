export interface DateColumnTypes {
    createDate: number,
    updateDate: number,
}

export interface PageType extends DateColumnTypes {
    pageLocation: string,
    pageTitle: string,
}


export interface CommentType {
  id: string
  markdownText: string
  status: string
  url: string
  createDate: any
  updatedate: any
}


export interface User {
  email: string
  name: string
  avatar: string
}

export interface CommentWithParent extends CommentType {
  parentCommentId: string | null,
  replyCount?: number,
  by:string,
  replies?: string[]
}
