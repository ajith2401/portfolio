// src/services/api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Writing', 'Comment', 'TechBlog', 'Project'],
  endpoints: (builder) => ({
    // Get all writings with pagination and filtering
    getWritings: builder.query({
      query: ({ page = 1, category = '' }) => {
        const categoryParam = category && category !== 'All Writings' 
          ? `&category=${category.toLowerCase()}` 
          : '';
        return `writings?page=${page}${categoryParam}`;
      },
      providesTags: (result) => 
        result 
          ? [
              ...result.writings.map(({ _id }) => ({ type: 'Writing', id: _id })),
              { type: 'Writing', id: 'LIST' }
            ]
          : [{ type: 'Writing', id: 'LIST' }]
    }),
    
    // Get a single writing by ID
    getWriting: builder.query({
      query: (id) => `writings/${id}`,
      providesTags: (result, error, id) => [{ type: 'Writing', id }]
    }),
    
    // Get related writings
    getRelatedWritings: builder.query({
      query: (id) => `writings/${id}/related`,
      providesTags: (result) => 
        result 
          ? [
              ...result.map(({ _id }) => ({ type: 'Writing', id: _id })),
              { type: 'Writing', id: 'RELATED' }
            ]
          : [{ type: 'Writing', id: 'RELATED' }]
    }),
    
    // Get comments for a writing
    getComments: builder.query({
      query: (params) => `comments/${params.contentType}/${params.contentId}`,
      providesTags: (result) => 
        result 
          ? [
              ...result.map((comment, index) => ({ 
                type: 'Comment', 
                id: comment._id || `INDEX:${index}` 
              })),
              { type: 'Comment', id: 'LIST' }
            ]
          : [{ type: 'Comment', id: 'LIST' }]
    }),
    
    // Add a comment/rating
    addComment: builder.mutation({
      query: (data) => ({
        url: 'comments',
        method: 'POST',
        body: data
      }),
      invalidatesTags: (result, error, { contentId }) => [
        { type: 'Comment', id: 'LIST' },
        { type: 'Writing', id: contentId }
      ]
    }),

    // New endpoints for tech blog
    getTechBlogs: builder.query({
      query: ({ category = '', search = '' }) => {
        let queryString = '';
        if (category && category !== 'all') {
          queryString += `category=${category}`;
        }
        if (search) {
          queryString += queryString ? `&search=${encodeURIComponent(search)}` : `search=${encodeURIComponent(search)}`;
        }
        
        return `tech-blog${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: (result) => 
        result 
          ? [
              ...(result.techBlogs || []).map(({ _id }) => ({ type: 'TechBlog', id: _id })),
              { type: 'TechBlog', id: 'LIST' }
            ]
          : [{ type: 'TechBlog', id: 'LIST' }]
    }),
    
    // Get a single tech blog post
    getTechBlog: builder.query({
      query: (id) => `tech-blog/${id}`,
      providesTags: (result, error, id) => [{ type: 'TechBlog', id }]
    }),
    
    // Get related tech blog posts
    getRelatedTechBlogs: builder.query({
      query: (id) => `tech-blog/${id}/related`,
      providesTags: (result) => 
        result 
          ? [
              ...(result || []).map(({ _id }) => ({ type: 'TechBlog', id: _id })),
              { type: 'TechBlog', id: 'RELATED' }
            ]
          : [{ type: 'TechBlog', id: 'RELATED' }]
    }),

    // New endpoints for projects
    getProjects: builder.query({
      query: ({ category = '', search = '' }) => {
        let queryString = '';
        if (category && category !== 'All Projects') {
          queryString += `category=${category}`;
        }
        if (search) {
          queryString += queryString ? `&search=${encodeURIComponent(search)}` : `search=${encodeURIComponent(search)}`;
        }
        
        return `projects${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: (result) => 
        result 
          ? [
              ...(result || []).map(({ _id }) => ({ type: 'Project', id: _id })),
              { type: 'Project', id: 'LIST' }
            ]
          : [{ type: 'Project', id: 'LIST' }]
    }),
    
    // Get a single project
    getProject: builder.query({
      query: (id) => `projects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Project', id }]
    }),
    
    // Get related projects
    getRelatedProjects: builder.query({
      query: (id) => `projects/${id}/related`,
      providesTags: (result) => 
        result?.data?.projects 
          ? [
              ...(result.data.projects || []).map(({ _id }) => ({ type: 'Project', id: _id })),
              { type: 'Project', id: 'RELATED' }
            ]
          : [{ type: 'Project', id: 'RELATED' }]
    }),
  })
});

export const {
  useGetWritingsQuery,
  useGetWritingQuery,
  useGetRelatedWritingsQuery,
  useGetCommentsQuery,
  useAddCommentMutation,
  useGetTechBlogsQuery,
  useGetTechBlogQuery,
  useGetRelatedTechBlogsQuery,
  useGetProjectsQuery,
  useGetProjectQuery,
  useGetRelatedProjectsQuery,
  util: { getRunningQueriesThunk }
} = api;

// For SSR prefetching
export const {
    getWritings,
    getWriting,
    getRelatedWritings,
    getComments
  } = api.endpoints;