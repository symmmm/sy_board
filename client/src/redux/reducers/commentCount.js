import { UPDATE_LIKE_COUNT  } from "../type";

  
export const nowLIKECount = (LikeCount) => ({
    type: UPDATE_LIKE_COUNT,
    payload: { likecount: LikeCount },
  });


  const initialState = {
    LikeCount:"0"
  };


  const LikeCountReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_LIKE_COUNT:
        return {
            ...state,
            LikeCount: action.payload.likecount,
          };

      default:
        return { ...state };
    }
  };
  
  export default LikeCountReducer;