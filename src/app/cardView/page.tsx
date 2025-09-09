"use client";

import { useState, useEffect, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { ScrollToTopButton, PokemonCardRow } from "@/components";

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

const fetchPokemons = async (props: {
  pageParam?: "https://pokeapi.co/api/v2/pokemon" | undefined;
}): Promise<PokemonList> => {
  const { pageParam = "https://pokeapi.co/api/v2/pokemon" } = props;
  const { data } = await axios.get<PokemonList>(pageParam);
  return data;
};

const TableSkeletonLoader: React.FC<{ rows: number }> = ({ rows }) => {
  return (
    <div className="col-3 grid min-w-full grid-cols-4 gap-3 overflow-x-auto">
      {Array.from({ length: rows }, (_, index) => (
        <Card key={index}>
          <CardHeader className="flex-row items-center">
            <div className="h-8 w-full animate-pulse rounded bg-gray-300"></div>
          </CardHeader>
          <CardContent>
            <div className="h-8 w-full animate-pulse rounded bg-gray-300"></div>
          </CardContent>
          <CardFooter>
            <div className="h-8 w-full animate-pulse rounded bg-gray-300"></div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

const PokemonTable: React.FC = () => {
  const [search, setSearch] = useState<string>("");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    isLoading,
  } = useInfiniteQuery<PokemonList, Error>({
    queryKey: ["pokemonList"],
    queryFn: fetchPokemons,
    getNextPageParam: (lastPage) => lastPage.next ?? null,
    initialPageParam: undefined,
  });

  const fetchMoreData = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
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

  const filteredResults = data.pages.flatMap((page) =>
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
            placeholder="Search by Pokémon name"
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
        {isLoading ? (
          <div className="flex justify-center py-10">
            <TableSkeletonLoader rows={5} />
          </div>
        ) : isError ? (
          <div className="py-10">
            <p className="text-center capitalize text-red-500">
              Failed to load Pokémon data.
            </p>
          </div>
        ) : filteredResults && filteredResults.length > 0 ? (
          <>
            <div className="col-3 grid grid-cols-4 gap-3 overflow-x-auto">
              {filteredResults.map((pokemon, index) => (
                <Card key={index}>
                  <CardHeader className="flex-row items-center">
                    <CardTitle>
                      <span className="font-normal">{index + 1}. </span>
                      <span className="capitalize">{pokemon.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <PokemonCardRow url={pokemon.url} />
                </Card>
              ))}
            </div>
            {isFetchingNextPage && (
              <div className="flex min-w-full justify-center py-4">
                <TableSkeletonLoader rows={5} />
              </div>
            )}
          </>
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
