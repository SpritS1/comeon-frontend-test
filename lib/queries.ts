import { useQuery } from "@tanstack/react-query";
import { getGames, getCategories } from "@/lib/api";

export function useGames() {
  return useQuery({ queryKey: ["games"], queryFn: getGames });
}

export function useCategories() {
  return useQuery({ queryKey: ["categories"], queryFn: getCategories });
}
