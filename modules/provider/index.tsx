import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactNode, useState } from "react";

type QueryProviderProps = {
  children: ReactNode;
};

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: 0 } },
        mutationCache: new MutationCache({
          onMutate: () => {},
          onSuccess: (_data, _variables, _context, mutation) => {
            console.log(
              "query provider success",
              _data,
              _variables,
              _context,
              mutation
            );

            const successMessage = mutation?.meta?.successMessage as {
              title?: string;
              description: string;
            };
          },
          onError: (error, _variables, _context, mutation) => {
            console.log("query provider error: ", error);

            const errorMessage = mutation?.meta?.errorMessage as {
              title?: string;
              description: string;
            };

            console.log({ errorMessage, error });
          },
        }),
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
