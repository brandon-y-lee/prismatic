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
    "Funds",
    "Projects"
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

    /* FILE UPLOAD */
    uploadFile: build.mutation({
      query: (formData) => ({
        url: "projects/upload",
        method: "POST",
        body: formData,
      }),
    }),

    /* PROJECTS - CRUD */
    getProjects: build.query({
      query: ({ page, pageSize, sort, search, userId }) => ({
        url: "projects/get",
        method: "GET",
        params: { page, pageSize, sort, search, userId },
      }),
      providesTags: ["Projects"],
    }),
    createProject: build.mutation({
      query: ({ owner, title, summary }) => ({
        url: "projects/create",
        method: "POST",
        body: { owner, title, summary },
      }),
      invalidatesTags: ['Projects'],
    }),
    viewProject: build.query({
      query: (id) => `projects/view/${id}`,
      providesTags: ['Projects'],
    }),
    deleteProject: build.mutation({
      query: ({ id }) => ({
        url: `projects/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Projects'],
    }),

    /* CONTRACTORS - CRUD */
    getContractors: build.query({
      query: () => 'projects/get-contractors',
      providesTags: ['Contractors'],
    }),

    /* CREWS - CRUD */
    createCrew: build.mutation({
      query: (crewData) => ({
        url: 'projects/create-crew',
        method: 'POST',
        body: crewData,
      }),
      invalidatesTags: ['Projects', 'Crews'],
    }),
    getCrews: build.query({
      query: ({ projectId }) => ({
        url: 'projects/get-crews',
        method: 'GET',
        params: { projectId },
      }),
      providesTags: ['Crews'],
    }),
    deleteCrew: build.mutation({
      query: ({ id }) => ({
        url: `projects/delete-crew/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Crews'],
    }),

    /* TRANSACTION - CRUD */
    getTransactions: build.query({
      query: ({ userId, page, pageSize, sort, search, statusFilter }) => ({
        url: "client/transactions",
        method: "GET",
        params: { userId, page, pageSize, sort, search, statusFilter },
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
    getFunds: build.mutation({
      query: ({ accountIds }) => ({
        url: 'funds/get-funds',
        method: "POST",
        body: { accountIds },
      }),
      providesTags: ['Funds', 'Accounts'],
    }),
    createFund: build.mutation({
      query: ({ userId, accountId, invoiceId, invoiceAmount, merchant, repaymentPlan }) => ({
        url: 'funds/create-fund',
        method: "POST",
        body: { userId, accountId, invoiceId, invoiceAmount, merchant, repaymentPlan },
      }),
      invalidatesTags: ['Funds', 'Accounts'],
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
    getAccountRepaymentDetails: build.query({
      query: ({ selectedAccount }) => ({
        url: 'funds/get-account-repayment-details',
        method: 'GET',
        params: { selectedAccount },
      }),
      providesTags: ['Funds', 'Accounts'],
    }),
    updateAccountRepaymentDetails: build.mutation({
      query: ({ userId, selectedAccount, fundId, nextPaymentAmount }) => ({
        url: 'funds/update-account-repayment-details',
        method: 'POST',
        body: { userId, selectedAccount, fundId, nextPaymentAmount },
      }),
      invalidatesTags: ['Funds', 'Accounts'],
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

    /* PLAID */
    getLinkToken: build.mutation({
      query: ({ authId }) => ({
        url: 'plaid/get-link-token',
        method: 'POST',
        body: { authId },
      }),
    }),
    exchangePublicToken: build.mutation({
      query: ({ public_token, authId }) => ({
        url: 'plaid/exchange-public-token',
        method: 'POST',
        body: { public_token, authId },
      }),
    }),
    getPlaidAccounts: build.mutation({
      query: ({ authId, userId }) => ({
        url: 'plaid/get-accounts',
        method: 'POST',
        body: { authId, userId },
      }),
    }),
    getPlaidTransactions: build.mutation({
      query: ({ authId }) => ({
        url: 'plaid/get-transactions',
        method: 'POST',
        body: { authId },
      }),
    }),

    /* OPENAI ASSISTANT */
    interactWithAssistant: build.mutation({
      query: ({ userMessage }) => ({
        url: 'assistant/message',
        method: 'POST',
        body: { userMessage }, 
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

  useUploadFileMutation,

  useGetProjectsQuery,
  useCreateProjectMutation,
  useViewProjectQuery,
  useDeleteProjectMutation,

  useGetContractorsQuery,
  useCreateCrewMutation,
  useGetCrewsQuery,
  useDeleteCrewMutation,

  useGetTransactionsQuery,
  useCreateTransactionMutation,
  useViewTransactionQuery,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,

  useCreateInvoiceMutation,
  useViewInvoiceQuery,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,

  useGetFundsMutation,
  useCreateFundMutation,
  useViewFundQuery,
  useUpdateFundMutation,
  useDeleteFundMutation,
  useGetAccountRepaymentDetailsQuery,
  useUpdateAccountRepaymentDetailsMutation,

  useGenerateTokenQuery,
  useGetInstitutionsQuery,
  useCreateRequisitionMutation,
  useListAccountsQuery,
  useListAccountTransactionsQuery,

  useGetLinkTokenMutation,
  useExchangePublicTokenMutation,
  useGetPlaidAccountsMutation,
  useGetPlaidTransactionsMutation,

  useInteractWithAssistantMutation,
} = api;
