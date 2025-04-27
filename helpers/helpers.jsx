// export const api = "https://api.hotostash.com/api/";
export const api = "https://hotostash-backend.onrender.com/api/";
export function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  