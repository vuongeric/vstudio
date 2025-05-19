// This ensures the root path (/) renders the portfolio content
export const prerender = true;

export function load({ url }) {
  // If we're at the root path, redirect to /portfolio
  if (url.pathname === '/') {
    return {
      status: 302,
      redirect: '/portfolio'
    };
  }
  
  return {};
}
