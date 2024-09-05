"use client";

import { useState, useEffect, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollToTopButton, SkeletonLoader, PokemonRow } from "@/components";

type Pokemon = {
  name: string;
  url: string;
};

type PokemonList = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
};

const PokemonTable: React.FC = () => {
  const [search, setSearch] = useState<string>("");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isError } =
    useInfiniteQuery<PokemonList, Error>({
      queryKey: ["pokemonList"],
      queryFn: async ({ pageParam = "https://pokeapi.co/api/v2/pokemon" }) => {
        const { data } = await axios.get<PokemonList>(pageParam);
        return data;
      },
      getNextPageParam: (lastPage) => lastPage.next || null,
      staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    });

  const fetchMoreData = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 200 // Trigger slightly before the bottom
      ) {
        fetchMoreData();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchMoreData]);

  const filteredResults = data?.pages.flatMap((page) =>
    page.results.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(search.toLowerCase()),
    ),
  );

  const handleClearSearch = () => {
    setSearch("");
  };

  return (
    <div className="container relative mx-auto p-4 font-sans">
      <div className="fixed left-0 right-0 top-0 z-10 bg-white p-4 shadow-md">
        <div className="flex items-center">
          <Input
            placeholder="Search Pokémon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mr-2 flex-grow"
          />
          {search && (
            <Button onClick={handleClearSearch} className="ml-2">
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="pt-16">
        {isFetchingNextPage && !filteredResults?.length ? (
          <div className="flex flex-col items-center">
            <SkeletonLoader rows={3} />
          </div>
        ) : isError ? (
          <div className="py-10">
            <p className="text-center capitalize text-red-500">
              Failed to load Pokémon data.
            </p>
          </div>
        ) : filteredResults && filteredResults.length > 0 ? (
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Types</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((pokemon, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}.</TableCell>
                    <TableCell className="capitalize">{pokemon.name}</TableCell>
                    <PokemonRow url={pokemon.url} />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {isFetchingNextPage && (
              <div className="flex justify-center py-4">
                <SkeletonLoader rows={1} />
              </div>
            )}
          </div>
        ) : (
          <div className="mt-4 py-40 text-center">
            <p className="text-lg capitalize text-gray-500">
              No Pokémon found.
            </p>
            <Button
              onClick={handleClearSearch}
              className="mt-2"
              variant="outline"
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>

      <ScrollToTopButton />
    </div>
  );
};

export default PokemonTable;
