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
  updateDate: any
}


export interface User {
  id: string
  name: string
  avatar: string
}

export interface CommentWithParent extends CommentType {
  parentCommentId: string | null,
  replyCount: number,
  by:string,
  replies: string[]
}


export interface ChildrenResponse {
  comment: CommentType[],
  parentId: string[],
  by:User[],
  replyCount: number
}

export interface IDomain {
    key: string;
    address: string;
    status: "ACTIVE" | "INACTIVE";
    createDate: number;
    updateDate: number;
}

export interface DomainExtended extends IDomain {
    pageCount: number,
    commentCount:number
}

export interface Page {
    pageLocation: string,
    updateDate: number;
    pageTitle: string;
    createDare: number;
}

export interface PageExtended extends Page {
    childrenComments: Array<string>
}

export interface PageResponse  {
    page: Array<Page>;
    comment: Array<Comment>;
    commentedBy: Array<User>;
    replyCount: number;
}

export interface Thread {
  [commentId: string]: CommentWithParent
}

export interface UsersObjType {
  [id: string]: User
}

// export interface PageExtended extends Page {
//     parentComments: Array<string>,
//     thread: Thread,
//     user: UsersObjType
// }