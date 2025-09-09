"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SkeletonLoader from "./SkeletonLoader";

type PokemonDetails = {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
  };
  types: {
    slot: number;
    type: {
      name: string;
    };
  }[];
};

interface PokemonRowProps {
  url: string;
}

const usePokemonDetails = (url: string) => {
  return useQuery<PokemonDetails, Error>({
    queryKey: ["pokemonDetails", url],
    queryFn: async () => {
      const { data } = await axios.get<PokemonDetails>(url);
      return data;
    },
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
  });
};

const PokemonRow: React.FC<PokemonRowProps> = ({ url }) => {
  const { data, isLoading, isError } = usePokemonDetails(url);

  if (isLoading) {
    return (
      <>
        <CardContent>
          <SkeletonLoader rows={1} />
        </CardContent>
        <CardContent>
          <SkeletonLoader rows={1} />
        </CardContent>
      </>
    );
  }

  if (isError) {
    return (
      <CardContent>
        <p>Error loading Pokémon details.</p>
      </CardContent>
    );
  }

  if (!data) return null;

  return (
    <>
      <CardContent>
        {data.sprites.front_default ? (
          <Image
            src={data.sprites.front_default}
            alt={data.name || "Pokemon"}
            width={64}
            height={64}
            className="object-contain"
          />
        ) : (
          "No Image"
        )}
      </CardContent>
      <CardFooter>
        {data.types.map((type) => type.type.name).join(", ")}
      </CardFooter>
    </>
  );
};

export default PokemonRow;
