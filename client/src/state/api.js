import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  reducerPath: "adminApi",
  tagTypes: [
    "User",
    "Products",
    "Transactions",
    "Dashboard",
    "Invoices",
    "Funds"
  ],
  endpoints: (build) => ({
    login: build.mutation({
      query: ({ email, password }) => ({
        url: 'auth/login',
        method: 'POST',
        body: { email, password },
      }),
    }),
    logout: build.mutation({
      query: () => ({
        url: 'auth/logout',
        method: 'POST'
      }),
    }),
    register: build.mutation({
      query: ({ name, email, password }) => ({
        url: 'auth/register',
        method: 'POST',
        body: { name, email, password },
      }),
    }),

    /* TRANSACTION - CRUD */
    getTransactions: build.query({
      query: ({ userId, page, pageSize, sort, search }) => ({
        url: "client/transactions",
        method: "GET",
        params: { userId, page, pageSize, sort, search },
      }),
      providesTags: ['Transactions', 'Products'],
    }),
    createTransaction: build.mutation({
      query: ({ buyerId, sellerId, products, cost, initialDate, expiryDate }) => ({
        url: "client/createTransaction",
        method: "POST",
        body: { buyerId, sellerId, products, cost, initialDate, expiryDate },
      }),
      invalidatesTags: ['Transactions', 'Products'],
    }),
    viewTransaction: build.query({
      query: (id) => `client/transactions/${id}`,
      providesTags: ['Transactions', 'Products'],
    }),
    updateTransaction: build.mutation({
      query: ({ id, ...updateData }) => ({
        url: `client/updateTransaction/${id}`,
        method: "PUT",
        body: updateData
      }),
      invalidatesTags: ['Transactions', 'Products'],
    }),
    deleteTransaction: build.mutation({
      query: ({ id }) => ({
        url: `client/deleteTransaction/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Transactions', 'Products'],
    }),


    /* INVOICE - CRUD */
    createInvoice: build.mutation({
      query: ({ userId, clientId, invoiceDate, invoiceTotal }) => ({
        url: "funds/invoice",
        method: "POST",
        body: { userId, clientId, invoiceDate, invoiceTotal },
      }),
      invalidatesTags: ['Invoices', 'Funds'],
    }),
    viewInvoice: build.query({
      query: (id) => `funds/invoice/${id}`,
      providesTags: ['Invoices', 'Funds'],
    }),
    updateInvoice: build.mutation({
      query: ({ id, ...updateData }) => ({
        url: `funds/updateInvoice/${id}`,
        method: "PUT",
        body: updateData
      }),
      invalidatesTags: ['Invoices', 'Funds'],
    }),
    deleteInvoice: build.mutation({
      query: ({ id }) => ({
        url: `funds/invoice/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Invoices', 'Funds'],
    }),

    /* FUND - CRUD */
    createFund: build.mutation({
      query: ({ userId, clientId, invoiceDate, invoiceTotal }) => ({
        url: "funds/fund",
        method: "POST",
        body: { userId, clientId, invoiceDate, invoiceTotal },
      }),
      invalidatesTags: ['Invoices', 'Funds'],
    }),
    viewFund: build.query({
      query: (id) => `funds/fund/${id}`,
      providesTags: ['Invoices', 'Funds'],
    }),
    updateFund: build.mutation({
      query: ({ id, ...updateData }) => ({
        url: `funds/updateFund/${id}`,
        method: "PUT",
        body: updateData
      }),
      invalidatesTags: ['Invoices', 'Funds'],
    }),
    deleteFund: build.mutation({
      query: ({ id }) => ({
        url: `funds/fund/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Invoices', 'Funds'],
    }),

    /* NORDIGEN - GET */
    generateToken: build.query({
      query: () => ({
        url: 'nordigen/token',
        method: 'GET',
      }),
    }),
    getInstitutions: build.query({
      query: ({ accessToken }) => ({
        url: 'nordigen/institutions',
        method: 'GET',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      }),
    }),
    createRequisition: build.mutation({
      query: ({ accessToken, institution_id }) => ({
        url: 'nordigen/create-requisition',
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` },
        body: { institution_id },
      }),
    }),
    listAccounts: build.query({
      query: ({ requisitionId, accessToken }) => ({
        url: `nordigen/list-accounts`,
        params: { requisitionId },
        method: 'GET',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      }),
    }),
    listAccountTransactions: build.query({
      query: ({ accessToken, accountId }) => ({
        url: `nordigen/accounts/${accountId}/transactions`,
        method: 'GET',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      }),
    }),
    
    /* DASHBOARD - GET */
    getDashboard: build.query({
      query: ({ userId }) => ({
        url: "general/dashboard",
        method: "GET",
        params: { userId },
      }),
    }),
    getUser: build.query({
      query: ({ id }) => ({
        url: "general/user",
        method: "GET",
        params: { id },
      }),
      providesTags: ["User"],
    }),
    getSupplier: build.query({
      query: (userId) => `client/getSupplier/${userId}`,
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useGetDashboardQuery,
  useGetUserQuery,
  useGetSupplierQuery,

  useGetTransactionsQuery,
  useCreateTransactionMutation,
  useViewTransactionQuery,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,

  useCreateInvoiceMutation,
  useViewInvoiceQuery,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,

  useCreateFundMutation,
  useViewFundQuery,
  useUpdateFundMutation,
  useDeleteFundMutation,

  useGenerateTokenQuery,
  useGetInstitutionsQuery,
  useCreateRequisitionMutation,
  useListAccountsQuery,
  useListAccountTransactionsQuery,

} = api;
