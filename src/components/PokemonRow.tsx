"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { TableCell, TableRow } from "@/components/ui/table";
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
        <TableCell>
          <SkeletonLoader rows={1} />
        </TableCell>
        <TableCell>
          <SkeletonLoader rows={1} />
        </TableCell>
      </>
    );
  }

  if (isError) {
    return (
      <TableRow>
        <TableCell colSpan={4} className="capitalize text-red-500">
          Error loading Pokémon details.
        </TableCell>
      </TableRow>
    );
  }

  if (!data) return null;

  return (
    <>
      <TableCell>
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
      </TableCell>
      <TableCell>
        {data.types.map((type) => type.type.name).join(", ")}
      </TableCell>
    </>
  );
};

export default PokemonRow;
