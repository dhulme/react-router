import {
  useLocation,
  useParams as useOriginalParams,
  useNavigate as useOriginalNavigate,
  matchRoutes,
  RouteMatch,
} from 'react-router';
import { stringify } from 'qs';

export enum Page {
  Home = '/',
  Groups = '/groups',
  About = '/about',
  Users = '/users',
  User = '/users/:userId',
  UserGroups = '/users/:userId/groups'
}

const routes = Object.values(Page).map((path) => ({ path, element: null, caseSensitive: true }));

export type Params = {
  userId?: number;
  details?: boolean;
};

function qs(obj: unknown): string {
  return stringify(obj, { addQueryPrefix: true });
}

const routesParams: Partial<Record<
  Page,
  {
    getUrl: (params: Params) => string;
    getParams: (params: Record<keyof Params, string>) => Params;
  }
>> = {
  [Page.User]: {
    getUrl: ({ userId, details }): string => 
      Page.User.replace(':userId', userId?.toString() || '') +
      qs({
        details,
      }),
    getParams: ({ userId, details }): Params => ({
      userId: Number(userId),
      details: details === 'true'
    }),
  },
  [Page.UserGroups]: {
    getUrl: ({ userId }): string =>
    Page.User.replace(':userId', userId?.toString() || ''),
    getParams: ({ userId }): Params => ({
      userId: Number(userId)
    }),
  },
};

function getMatchedRouteAndParams(pathname: string): RouteMatch | null {
  return matchRoutes(routes, pathname)?.[0] || null;
}

export function getUrl(page: Page, params: Params): string {
  return routesParams[page]?.getUrl(params) || page;
}

export function useNavigate(): (newPage: Page, params?: Params) => void {
  const navigate = useOriginalNavigate();
  return (newPage, params = {}): void => navigate(getUrl(newPage, params));
}

export function useLink(
): (newPage: Page, params?: Params) => string {
  return (newPage, params = {}): string =>
    getUrl(newPage, params);
}

function getParsedParams(
  page: Page | null,
  currentParams: Record<string, string>,
  location: ReturnType<typeof useLocation>,
): Params {
  const params = { ...currentParams };
  const search = new URLSearchParams(location.search);
  for (const [key, value] of search.entries()) {
    params[key] = value;
  }

  return (page && routesParams[page]?.getParams(params as Record<keyof Params, string>)) || {};
}

export function useParams(page: Page | null): Params {
  const location = useLocation();
  const originalParams = useOriginalParams();
  return getParsedParams(page, originalParams, location);
}

export function useParamsOutsideRoute(): Params | null {
  const location = useLocation();
  const routeAndParams = getMatchedRouteAndParams(location.pathname);
  if (!routeAndParams) return null;
  return getParsedParams(routeAndParams.route.path as Page, routeAndParams.params, location);
}

export function useCurrentPage(): Page | null {
  const location = useLocation();
  return getMatchedRouteAndParams(location.pathname)?.route.path as Page;
}


export function useUserId(page: Page): number | null {
  const { userId } = useParams(page);
  return userId || null;
}