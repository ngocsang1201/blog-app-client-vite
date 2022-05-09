import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import {
  IListParams,
  IListResponse,
  IPaginationParams,
  IPost,
  IPostStatistics,
  ISearchObj,
} from 'models';

export interface IBlogState {
  loading: boolean;
  list: IPost[];
  pagination: IPaginationParams | null;
  detail: IPost | null;

  searchResultList: IPost[];
  searchLoading: boolean;
}

const initialState: IBlogState = {
  loading: false,
  list: [],
  pagination: null,
  detail: null,

  searchResultList: [],
  searchLoading: false,
};

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    fetchPostList(state, action: PayloadAction<IListParams>) {
      state.loading = true;
      state.list = [];
    },
    fetchPostListSuccess(state, action: PayloadAction<IListResponse<IPost>>) {
      state.loading = false;
      state.list = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    fetchPostListFailure(state) {
      state.loading = false;
    },

    fetchMyPostList(state, action: PayloadAction<IListParams>) {
      state.loading = true;
      state.list = [];
    },
    fetchMyPostListSuccess(state, action: PayloadAction<IListResponse<IPost>>) {
      state.loading = false;
      state.list = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    fetchMyPostListFailure(state) {
      state.loading = false;
    },

    fetchSavedPostList(state, action: PayloadAction<IListParams>) {
      state.loading = true;
      state.list = [];
    },
    fetchSavedPostListSuccess(state, action: PayloadAction<IListResponse<IPost>>) {
      state.loading = false;
      state.list = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    fetchSavedPostListFailure(state) {
      state.loading = false;
    },

    fetchPostDetail(state, action: PayloadAction<string>) {
      state.loading = true;
      state.detail = null;
    },
    fetchPostDetailSuccess(state, action: PayloadAction<IPost>) {
      state.loading = false;
      state.detail = action.payload;
    },
    fetchPostDetailFailure(state) {
      state.loading = false;
    },

    likePost(state, action: PayloadAction<string>) {},
    likePostSuccess(state, action: PayloadAction<IPost>) {
      state.detail = action.payload;
    },

    updateCommentCount(state, action: PayloadAction<number>) {
      if (state.detail?.statistics) state.detail.statistics.commentCount = action.payload;
    },

    updateStatistics(state, action: PayloadAction<Partial<IPostStatistics>>) {
      if (state.detail?.statistics) {
        state.detail.statistics = {
          ...state.detail?.statistics,
          ...action.payload,
        };
      }
    },

    searchWithDebounce(state, action: PayloadAction<ISearchObj>) {
      state.searchLoading = true;
      state.searchResultList = [];
    },
    searchWithDebounceSuccess(state, action: PayloadAction<IPost[]>) {
      state.searchLoading = false;
      state.searchResultList = action.payload;
    },
    searchWithDebounceFailure(state) {
      state.searchLoading = false;
    },
  },
});

export const blogActions = blogSlice.actions;

export const selectPostLoading = (state: RootState) => state.blog.loading;
export const selectPostList = (state: RootState) => state.blog.list;
export const selectPostDetail = (state: RootState) => state.blog.detail;
export const selectPostPagination = (state: RootState) => state.blog.pagination;

export const selectSearchResultList = (state: RootState) => state.blog.searchResultList;
export const selectSearchLoading = (state: RootState) => state.blog.searchLoading;

export const selectTotalPages = createSelector(selectPostPagination, (pagination) =>
  pagination ? Math.ceil(pagination?.totalRows / pagination?.limit) : 1
);

const blogReducer = blogSlice.reducer;
export default blogReducer;
