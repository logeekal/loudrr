import { useToast } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import {
  CommentWithParent,
  IDomain,
  Page,
  PageExtended,
  User,
} from "../../utils/types";
import APIService from "../../service/API";

export interface DataContextProps {
  comments: {
    add: (
      parentCommentId: string | null,
      mdText: string,
      commentStatus: string
    ) => Promise<void>;
    loadParents: () => Promise<void>;
    loadChildren: (parentCommentId: string) => Promise<void>;
    thread: Thread;
    parentComments: string[];
    page: PageObj;
  };
  user: {
    loggedinUser: User | undefined;
    setLoggedinUser: (user: User) => void;
    users: UsersObjType;
    checkAuth: () => Promise<void>;
    logout: ()=>Promise<void>
  };
  domain: {
    domain: IDomain;
    setDomain: (IDomain) => void;
  };
}

export interface DataProviderProps {}

export const DataContext = React.createContext<DataContextProps | null>(null);

interface Thread {
  [commentId: string]: CommentWithParent;
}

interface UsersObjType {
  [id: string]: User;
}

interface CommentData {
  thread: Thread;
  users: UsersObjType;
  parentComments: string[];
  page: PageObj;
}

interface PageObj {
  [pageLocation: string]: PageExtended;
}

const DataProvider: FC<DataProviderProps> = ({ children }) => {
  const [commentData, setCommentData] = useState<CommentData>({
    thread: {},
    parentComments: [],
    users: {},
    page: {},
  });

  const [loggedinUser, setLoggedinUser] = useState<User>();

  const [domain, setDomain] = useState<IDomain>();

  const toast = useToast();

  useEffect(() => {
    checkAuth().then();
  }, []);

  useEffect(() => {
    if (loggedinUser) {
      setCommentData({
        ...commentData,
        users: {
          ...commentData.users,
          [loggedinUser.id]: loggedinUser,
        },
      });
    }
  }, [loggedinUser]);

  useEffect(() => {
    // Load Parent comments.
    // Load Authenticated User.
    if (domain) {
      loadAllParentComments().then(() =>
        console.log("All Parent Commits loaded.")
      );
    }
  }, [domain]);

  const addNewComment = async (
    parentCommentId: string | null,
    mdText: string,
    commentStatus: string
  ) => {
    try {
      console.log(
        "Adding new comment with args ",
        parentCommentId,
        mdText,
        commentStatus
      );
      const createdCommentResponse = await APIService.createComment(
        parentCommentId,
        mdText as string,
        commentStatus,
        window.location.href,
        window.document.title,
        domain.key
      );

      console.log("Comment created.. Now toasting");

      toast({
        title: "Comment Posted",
        description: "You comment has been successfully posted",
        status: "success",
      });

      console.log("toasted", createdCommentResponse);

      const createdComment = createdCommentResponse.data;
      console.log(JSON.stringify(createdComment));
      const newParentCommentIds = !parentCommentId
        ? [createdComment.id].concat([...commentData.parentComments])
        : [...commentData.parentComments];
      const commentedBy = loggedinUser ? loggedinUser.id : "";

      let newParentComment: Thread = {};
      if (parentCommentId) {
        console.log({
          replies_orig: commentData.thread[parentCommentId].replies,
        });
        console.log([createdComment.id]);
        newParentComment[parentCommentId] = {
          ...commentData.thread[parentCommentId],
          replies: [createdComment.id].concat(
            commentData.thread[parentCommentId].replies || []
          ),
          replyCount: commentData.thread[parentCommentId].replyCount + 1,
        };
      }

      console.log("setting state", newParentComment);
      setCommentData({
        thread: {
          ...commentData.thread,
          [createdComment.id]: {
            ...createdComment,
            replyCount: 0,
            replies: [],
            by: commentedBy,
            parentCommentId: parentCommentId,
          },
          //update the replies of parent Comment.
          ...newParentComment,
        },
        users: { ...commentData.users },
        parentComments: [...newParentCommentIds],
        page: {
          ...commentData.page,
          [window.location.href]: {
            ...commentData.page[window.location.href],
            childrenComments: [
              ...commentData.page[window.location.href].childrenComments,
              ...newParentCommentIds,
            ],
          },
        },
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Some Error Occured",
        description: "Check console for details",
        status: "error",
      });
    }
  };

  const loadAllParentComments = async () => {
    try {
      const allPagesResp = await APIService.getDomainPages(domain.key, {});
      const allPages = allPagesResp.data;
      const { page, comment, commentedBy, replyCount } = allPages;
      console.log(page);
      const newThread: Thread = {};
      const newUsers: UsersObjType = {};
      const pages: PageObj = {};
      page.forEach((singlePage, index) => {
        console.log(
          `Adding ${comment[index].id} to ${singlePage.pageLocation}`
        );
        if (singlePage.pageLocation in pages) {
          pages[singlePage.pageLocation].childrenComments.push(
            comment[index].id
          );
        } else {
          pages[singlePage.pageLocation] = {
            ...singlePage,
            childrenComments: [],
          };
        }

        // pages[singlePage.pageLocation].childrenComments.push(comment[index].id);
        const selectedComment = comment[index];
        newThread[selectedComment.id] = {
          ...selectedComment,
          parentCommentId: null,
          markdownText: unescape(selectedComment.markdownText),
          by: commentedBy[index].id,
          replies: [],
          replyCount: replyCount[index],
        };
        const selectedUser = commentedBy[index];
        newUsers[selectedUser.id] = selectedUser;
      });
      setCommentData({
        thread: { ...commentData.thread, ...newThread },
        parentComments: comment.map((comment) => comment.id),
        users: { ...commentData.users, ...newUsers },
        page: { ...pages },
      });
    } catch (error) {
      throw error;
    }
  };

  const loadChildren = async (parentCommentId: string) => {
    try {
      const childrenResponse = await APIService.getCompleteThread(
        parentCommentId
      );

      const { comment, parentId, by, replyCount } = childrenResponse.data;

      const newThread: Thread = {};
      const newUsers: UsersObjType = {};

      let replyIds: string[] = comment
        .filter((currcomment) => !(currcomment.id in commentData.thread))
        .map((currentComment, index) => {
          //insert only if not already present
          newThread[currentComment.id] = {
            ...currentComment,
            parentCommentId: parentId[index],
            replyCount: replyCount[index],
            replies: [],
            by: by[index].id,
          };

          //insert all parents in the newThread as well.
          if (parentId[index] in commentData.thread) {
            //else the parentId is newly fetched and is already in newThread
            newThread[parentId[index]] = {
              ...commentData.thread[parentId[index]],
            };
          }

          newUsers[by[index].id] = by[index];
          return currentComment.id;
        });

      replyIds.forEach((replyId) => {
        //get parent of the reply

        console.log(`Finding parent id or reply Id ${replyId}`);

        const parentId = newThread[replyId].parentCommentId;
        if (parentId) {
          const newReplies = [...newThread[parentId].replies, replyId];
          newThread[parentId] = {
            ...newThread[parentId],
            replies: newReplies.sort(
              (a, b) => newThread[b].updateDate - newThread[a].updateDate
            ),
          };
        }
      });

      setCommentData({
        thread: {
          ...commentData.thread,
          ...newThread,
        },
        users: {
          ...commentData.users,
          ...newUsers,
        },
        parentComments: [...commentData.parentComments],
        page: { ...commentData.page },
      });
    } catch (err) {
      throw err;
    }
  };

  const checkAuth = async () => {
    console.log("checking auth");
    APIService.auth()
      .then((res) => {
        console.log(res.data);
        console.log(`setting login data`);

        setLoggedinUser(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const logout = async () => {
    try {
      await APIService.logout();
      window.location.href = "/";
    } catch (err) {
      toast({
        title: "Some Error Occured",
        description: "Please Contact us with your email Id.",
        status: "error",
      });
    }
  };

  return (
    <DataContext.Provider
      value={{
        comments: {
          add: addNewComment,
          loadParents: loadAllParentComments,
          loadChildren,
          thread: commentData.thread,
          parentComments: commentData.parentComments,
          page: commentData.page,
        },
        user: {
          loggedinUser,
          setLoggedinUser,
          users: commentData.users,
          checkAuth,
          logout          
        },
        domain: {
          domain,
          setDomain,
        },
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
