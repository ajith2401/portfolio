// src/services/api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Writing', 'Comment', 'TechBlog', 'Project', 'Book', 'PhotoService', 'Order'],
  endpoints: (builder) => ({
    // Get all writings with pagination, filtering, sorting and date ranges
    getWritings: builder.query({
      query: ({ 
        page = 1, 
        category = '', 
        search = '',
        sortBy = 'date',
        startDate = '',
        endDate = ''
      }) => {
        // Build query parameters
        const params = new URLSearchParams();
        
        // Add page parameter
        params.append('page', page);
        
        // Add category if specified
        if (category && category !== 'All Writings') {
          params.append('category', category);
        }
        
        // Add search query if specified
        if (search && search.trim() !== '') {
          params.append('search', search);
        }
        
        // Add sort option if specified
        if (sortBy) {
          params.append('sortBy', sortBy);
        }
        
        // Add date filters if specified
        if (startDate) {
          params.append('startDate', startDate);
        }
        
        if (endDate) {
          params.append('endDate', endDate);
        }
        
        return `writings?${params.toString()}`;
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
      query: ({ contentType, contentId }) => `comments/${contentType}/${contentId}`,
      // Provide a tag for this specific content's comments
      providesTags: (result, error, { contentType, contentId }) => [
        { type: 'Comment', id: `${contentType}-${contentId}` }
      ]
    }),
    
    // Add comment/rating endpoint
    addComment: builder.mutation({
      query: (data) => ({
        url: 'comments',
        method: 'POST',
        body: {
          name: data.name,
          email: data.email,
          comment: data.comment,
          rating: data.rating,
          parentId: data.contentId,
          parentModel: data.contentType === 'TechBlog' ? 'TechBlog' : 'Writing'
        }
      }),
      // Invalidate the cache for this content's comments to trigger a refresh
      invalidatesTags: (result, error, { contentType, contentId }) => [
        { type: 'Comment', id: `${contentType}-${contentId}` },
        // Also invalidate the parent item to refresh rating data
        { type: contentType, id: contentId }
      ]
    }),
    
    // New endpoints for tech blog
    getTechBlogs: builder.query({
      query: ({ 
        page = 1, 
        category = '', 
        search = '',
        sortBy = 'date',
        startDate = '',
        endDate = '' 
      }) => {
        const params = new URLSearchParams();
        
        if (page) {
          params.append('page', page);
        }
        
        if (category && category !== 'all') {
          params.append('category', category);
        }
        
        if (search) {
          params.append('search', search);
        }
        
        if (sortBy) {
          params.append('sortBy', sortBy);
        }
        
        if (startDate) {
          params.append('startDate', startDate);
        }
        
        if (endDate) {
          params.append('endDate', endDate);
        }
        
        return `tech-blog?${params.toString()}`;
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

    // Project endpoints with similar parameters
    getProjects: builder.query({
      query: ({ 
        page = 1, 
        category = '', 
        search = '',
        sortBy = 'date',
        startDate = '',
        endDate = ''
      }) => {
        const params = new URLSearchParams();
        
        if (page) {
          params.append('page', page);
        }
        
        if (category && category !== 'All Projects') {
          params.append('category', category);
        }
        
        if (search) {
          params.append('search', search);
        }
        
        if (sortBy) {
          params.append('sortBy', sortBy);
        }
        
        if (startDate) {
          params.append('startDate', startDate);
        }
        
        if (endDate) {
          params.append('endDate', endDate);
        }
        
        return `projects?${params.toString()}`;
      },
      providesTags: (result) => 
        result 
          ? [
              ...(result.projects || []).map(({ _id }) => ({ type: 'Project', id: _id })),
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

    // Book endpoints
    getBooks: builder.query({
      query: (arg = {}) => {
        const { page = 1, search = '', sortBy = 'publishYear' } = arg;
        const params = new URLSearchParams();
        
        params.append('page', page.toString());
        
        if (search) {
          params.append('search', search);
        }
        
        if (sortBy) {
          params.append('sortBy', sortBy);
        }
        
        return `books?${params.toString()}`;
      },
      transformResponse: (response) => {
        if (response && typeof response === 'object' && 'data' in response) {
          return response.data || [];
        }
        return [];
      },
      providesTags: (result) => {
        if (!result || !Array.isArray(result)) {
          return [{ type: 'Book', id: 'LIST' }];
        }
        
        return [
          ...result.map(book => ({ type: 'Book', id: book._id })),
          { type: 'Book', id: 'LIST' }
        ];
      }
    }),

    // Get a single book by ID
    getBookById: builder.query({
      query: (id) => `books/${id}`,
      transformResponse: (response) => {
        if (response && typeof response === 'object' && 'data' in response) {
          return response.data || null;
        }
        return null;
      },
      providesTags: (result, error, id) => [{ type: 'Book', id }]
    }),

    // Get related books
    getRelatedBooks: builder.query({
      query: (id) => `books/${id}/related`,
      transformResponse: (response) => {
        if (response && typeof response === 'object' && 'data' in response) {
          return response.data || [];
        }
        return [];
      },
      providesTags: (result) => {
        if (!result || !Array.isArray(result)) {
          return [{ type: 'Book', id: 'RELATED' }];
        }
        
        return [
          ...result.map(book => ({ type: 'Book', id: book._id })),
          { type: 'Book', id: 'RELATED' }
        ];
      }
    }),

    // Photography E-commerce Endpoints
    // ===============================

    // Get all photography services
    getPhotoServices: builder.query({
      query: ({ 
        page = 1, 
        category = '', 
        search = '',
        featured = '',
        sortBy = 'createdAt'
      }) => {
        const params = new URLSearchParams();
        
        params.append('page', page);
        
        if (category && category !== 'all') {
          params.append('category', category);
        }
        
        if (search && search.trim() !== '') {
          params.append('search', search);
        }
        
        if (featured === 'true') {
          params.append('featured', 'true');
        }
        
        if (sortBy) {
          params.append('sortBy', sortBy);
        }
        
        return `photography?${params.toString()}`;
      },
      providesTags: (result) => 
        result 
          ? [
              ...(result.services || []).map(({ _id }) => ({ type: 'PhotoService', id: _id })),
              { type: 'PhotoService', id: 'LIST' }
            ]
          : [{ type: 'PhotoService', id: 'LIST' }]
    }),

    // Get a single photography service by slug
    getPhotoServiceBySlug: builder.query({
      query: (slug) => `photography/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'PhotoService', id: slug }]
    }),

    // Get a single photography service by ID
    getPhotoServiceById: builder.query({
      query: (id) => `photography/id/${id}`,
      providesTags: (result, error, id) => [{ type: 'PhotoService', id }]
    }),

    // Create an order for a photography service
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: 'orders',
        method: 'POST',
        body: orderData
      }),
      invalidatesTags: [{ type: 'Order', id: 'LIST' }]
    }),

    // Get an order by ID
    getOrderById: builder.query({
      query: (id) => `orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }]
    }),

    // Get orders for a specific customer (by email)
    getCustomerOrders: builder.query({
      query: (email) => `orders?email=${encodeURIComponent(email)}`,
      providesTags: (result) => 
        result 
          ? [
              ...(result.orders || []).map(({ _id }) => ({ type: 'Order', id: _id })),
              { type: 'Order', id: 'LIST' }
            ]
          : [{ type: 'Order', id: 'LIST' }]
    }),

    // Update payment information for an order
    updateOrderPayment: builder.mutation({
      query: ({ orderId, paymentInfo }) => ({
        url: `orders/${orderId}/updatePayment`,
        method: 'POST',
        body: paymentInfo
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'Order', id: orderId }
      ]
    }),

    // Create Razorpay order
    createRazorpayOrder: builder.mutation({
      query: ({ orderId }) => ({
        url: 'razorpay',
        method: 'POST',
        body: { orderId }
      })
    }),

    // Verify Razorpay payment
    verifyRazorpayPayment: builder.mutation({
      query: (verificationData) => ({
        url: 'razorpay/verify',
        method: 'POST',
        body: verificationData
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'Order', id: orderId }
      ]
    })
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
  useGetBooksQuery,
  useGetBookByIdQuery,
  useGetRelatedBooksQuery,
  // Photography E-commerce hooks
  useGetPhotoServicesQuery,
  useGetPhotoServiceBySlugQuery,
  useGetPhotoServiceByIdQuery,
  useCreateOrderMutation,
  useGetOrderByIdQuery,
  useGetCustomerOrdersQuery,
  useUpdateOrderPaymentMutation,
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation,
  util: { getRunningQueriesThunk }
} = api;

// For SSR prefetching
export const {
  getWritings,
  getWriting,
  getRelatedWritings,
  getComments,
  getBooks,
  getBookById,
  getRelatedBooks,
  // Photography E-commerce SSR prefetching
  getPhotoServices,
  getPhotoServiceBySlug,
  getOrderById
} = api.endpoints;