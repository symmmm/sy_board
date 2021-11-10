import {
  UPDATE_SEARCH_PAGE,
  DELETE_SEARCH_PAGE,
  UPDATE_PAGE,
  UPDATE_FINCDOE,
  BEST_LIST_UPDATE,
} from "../type";

export const PageSearch = (SelectMenu, searchValue) => ({
  type: UPDATE_SEARCH_PAGE,
  payload: { menu: SelectMenu, search: searchValue },
});

export const pageupdate = (page_value) => ({
  type: UPDATE_PAGE,
  payload: page_value,
});

export const DeleteSearch = () => ({
  type: DELETE_SEARCH_PAGE,
});

export const fincode_update = (fincode) => ({
  type: UPDATE_FINCDOE,
  payload: fincode,
});

export const update_best = (category) => ({
  type: BEST_LIST_UPDATE,
  payload: category,
});

const initialState = {
  Reduxpage: 1,
  fincode: "",
  SelectMenu: "제목",
  SearchList: false,
  searchValue: "",
  Best_List: false,
};

const PageSearchReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SEARCH_PAGE:
      return {
        ...state,
        SearchList: true,
        SelectMenu: action.payload.menu,
        searchValue: action.payload.search,
        Reduxpage: 1,
      };
    case DELETE_SEARCH_PAGE:
      return {
        ...state,
        Reduxpage: 1,
        fincode: "",
        SearchList: false,
        SelectMenu: "제목",
        searchValue: "",
        Best_List: false,
      };
    case UPDATE_PAGE:
      return {
        ...state,
        Reduxpage: action.payload,
      };
    case UPDATE_FINCDOE:
      return {
        ...state,
        fincode: action.payload,
      };
    case BEST_LIST_UPDATE:
      return {
        ...state,
        Best_List: action.payload,
      };
    default:
      return { ...state };
  }
};

export default PageSearchReducer;
