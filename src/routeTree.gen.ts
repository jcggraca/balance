/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as TermsImport } from './routes/terms'

// Create Virtual Routes

const SettingsLazyImport = createFileRoute('/settings')()
const IncomeLazyImport = createFileRoute('/income')()
const ExpensesLazyImport = createFileRoute('/expenses')()
const DebtsLazyImport = createFileRoute('/debts')()
const CategoriesLazyImport = createFileRoute('/categories')()
const BudgetLazyImport = createFileRoute('/budget')()
const AccountsLazyImport = createFileRoute('/accounts')()
const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const SettingsLazyRoute = SettingsLazyImport.update({
  id: '/settings',
  path: '/settings',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/settings.lazy').then((d) => d.Route))

const IncomeLazyRoute = IncomeLazyImport.update({
  id: '/income',
  path: '/income',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/income.lazy').then((d) => d.Route))

const ExpensesLazyRoute = ExpensesLazyImport.update({
  id: '/expenses',
  path: '/expenses',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/expenses.lazy').then((d) => d.Route))

const DebtsLazyRoute = DebtsLazyImport.update({
  id: '/debts',
  path: '/debts',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/debts.lazy').then((d) => d.Route))

const CategoriesLazyRoute = CategoriesLazyImport.update({
  id: '/categories',
  path: '/categories',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/categories.lazy').then((d) => d.Route))

const BudgetLazyRoute = BudgetLazyImport.update({
  id: '/budget',
  path: '/budget',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/budget.lazy').then((d) => d.Route))

const AccountsLazyRoute = AccountsLazyImport.update({
  id: '/accounts',
  path: '/accounts',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/accounts.lazy').then((d) => d.Route))

const TermsRoute = TermsImport.update({
  id: '/terms',
  path: '/terms',
  getParentRoute: () => rootRoute,
} as any)

const IndexLazyRoute = IndexLazyImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/terms': {
      id: '/terms'
      path: '/terms'
      fullPath: '/terms'
      preLoaderRoute: typeof TermsImport
      parentRoute: typeof rootRoute
    }
    '/accounts': {
      id: '/accounts'
      path: '/accounts'
      fullPath: '/accounts'
      preLoaderRoute: typeof AccountsLazyImport
      parentRoute: typeof rootRoute
    }
    '/budget': {
      id: '/budget'
      path: '/budget'
      fullPath: '/budget'
      preLoaderRoute: typeof BudgetLazyImport
      parentRoute: typeof rootRoute
    }
    '/categories': {
      id: '/categories'
      path: '/categories'
      fullPath: '/categories'
      preLoaderRoute: typeof CategoriesLazyImport
      parentRoute: typeof rootRoute
    }
    '/debts': {
      id: '/debts'
      path: '/debts'
      fullPath: '/debts'
      preLoaderRoute: typeof DebtsLazyImport
      parentRoute: typeof rootRoute
    }
    '/expenses': {
      id: '/expenses'
      path: '/expenses'
      fullPath: '/expenses'
      preLoaderRoute: typeof ExpensesLazyImport
      parentRoute: typeof rootRoute
    }
    '/income': {
      id: '/income'
      path: '/income'
      fullPath: '/income'
      preLoaderRoute: typeof IncomeLazyImport
      parentRoute: typeof rootRoute
    }
    '/settings': {
      id: '/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof SettingsLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexLazyRoute
  '/terms': typeof TermsRoute
  '/accounts': typeof AccountsLazyRoute
  '/budget': typeof BudgetLazyRoute
  '/categories': typeof CategoriesLazyRoute
  '/debts': typeof DebtsLazyRoute
  '/expenses': typeof ExpensesLazyRoute
  '/income': typeof IncomeLazyRoute
  '/settings': typeof SettingsLazyRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexLazyRoute
  '/terms': typeof TermsRoute
  '/accounts': typeof AccountsLazyRoute
  '/budget': typeof BudgetLazyRoute
  '/categories': typeof CategoriesLazyRoute
  '/debts': typeof DebtsLazyRoute
  '/expenses': typeof ExpensesLazyRoute
  '/income': typeof IncomeLazyRoute
  '/settings': typeof SettingsLazyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexLazyRoute
  '/terms': typeof TermsRoute
  '/accounts': typeof AccountsLazyRoute
  '/budget': typeof BudgetLazyRoute
  '/categories': typeof CategoriesLazyRoute
  '/debts': typeof DebtsLazyRoute
  '/expenses': typeof ExpensesLazyRoute
  '/income': typeof IncomeLazyRoute
  '/settings': typeof SettingsLazyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/terms'
    | '/accounts'
    | '/budget'
    | '/categories'
    | '/debts'
    | '/expenses'
    | '/income'
    | '/settings'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/terms'
    | '/accounts'
    | '/budget'
    | '/categories'
    | '/debts'
    | '/expenses'
    | '/income'
    | '/settings'
  id:
    | '__root__'
    | '/'
    | '/terms'
    | '/accounts'
    | '/budget'
    | '/categories'
    | '/debts'
    | '/expenses'
    | '/income'
    | '/settings'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexLazyRoute: typeof IndexLazyRoute
  TermsRoute: typeof TermsRoute
  AccountsLazyRoute: typeof AccountsLazyRoute
  BudgetLazyRoute: typeof BudgetLazyRoute
  CategoriesLazyRoute: typeof CategoriesLazyRoute
  DebtsLazyRoute: typeof DebtsLazyRoute
  ExpensesLazyRoute: typeof ExpensesLazyRoute
  IncomeLazyRoute: typeof IncomeLazyRoute
  SettingsLazyRoute: typeof SettingsLazyRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexLazyRoute: IndexLazyRoute,
  TermsRoute: TermsRoute,
  AccountsLazyRoute: AccountsLazyRoute,
  BudgetLazyRoute: BudgetLazyRoute,
  CategoriesLazyRoute: CategoriesLazyRoute,
  DebtsLazyRoute: DebtsLazyRoute,
  ExpensesLazyRoute: ExpensesLazyRoute,
  IncomeLazyRoute: IncomeLazyRoute,
  SettingsLazyRoute: SettingsLazyRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/terms",
        "/accounts",
        "/budget",
        "/categories",
        "/debts",
        "/expenses",
        "/income",
        "/settings"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/terms": {
      "filePath": "terms.tsx"
    },
    "/accounts": {
      "filePath": "accounts.lazy.tsx"
    },
    "/budget": {
      "filePath": "budget.lazy.tsx"
    },
    "/categories": {
      "filePath": "categories.lazy.tsx"
    },
    "/debts": {
      "filePath": "debts.lazy.tsx"
    },
    "/expenses": {
      "filePath": "expenses.lazy.tsx"
    },
    "/income": {
      "filePath": "income.lazy.tsx"
    },
    "/settings": {
      "filePath": "settings.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
