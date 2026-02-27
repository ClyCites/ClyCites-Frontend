import { globalSearch } from "@/lib/store";

export const searchService = {
  search(query: string) {
    return globalSearch(query);
  },
};
