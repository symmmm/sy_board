import { UPDATE_COMMENT_COUNT, UPDATE_POST_COUNT } from "../type";

export const nowCount = (CommentCount) => ({
  type: UPDATE_COMMENT_COUNT,
  payload: { count: CommentCount },
});
export const postCount = (postCount) => ({
  type: UPDATE_POST_COUNT,
  payload: { count: postCount },
});

const initialState = {
  CommentCount: "0",
  postCount: "0",
};

const BoardCountReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_COMMENT_COUNT:
      return {
        ...state,
        CommentCount: action.payload.count,
      };
    case UPDATE_POST_COUNT:
      return {
        ...state,
        postCount: action.payload.count,
      };
    default:
      return { ...state };
  }
};

export default BoardCountReducer;
