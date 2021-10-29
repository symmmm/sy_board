import { UPDATE_COMMENT_COUNT  } from "../type";

export const nowCount = (CommentCount) => ({
    type: UPDATE_COMMENT_COUNT,
    payload: { count: CommentCount },
  });
  
  // export const nowLIKECount = (LikeCount) => ({
  //   type: UPDATE_LIKE_COUNT,
  //   payload: { likecount: LikeCount },
  // });

const initialState = {
    CommentCount: "0",
  };

const BoardCountReducer = (state = initialState, action) => {
    switch (action.type) {
      case UPDATE_COMMENT_COUNT:
        return {
          ...state,
          CommentCount: action.payload.count,
        };

      default:
        return { ...state };
    }
  };
  
  export default BoardCountReducer;