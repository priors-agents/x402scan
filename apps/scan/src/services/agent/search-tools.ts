import z3 from 'zod3';

import { searchResources } from '../db/resources/resource';
import {
  coerceAcceptForV1Schema,
  outputSchemaV1,
  paymentRequirementsSchemaV1,
} from '@/lib/x402';

import { SUPPORTED_WALLET_CHAINS } from '@/types/chain';

import type { searchResourcesSchema } from '../db/resources/resource';
import type { z } from 'zod';
import type { SupportedWalletChain } from '@/types/chain';
import { convertTokenAmount } from '@/lib/token';
import { usdc } from '@/lib/tokens/usdc';

interface X402ToolResponse {
  id: string;
  favicon: string | null;
  resource: string;
  description: string;
  invocations: number;
  accepts: {
    maxAmountRequired: number;
    chain: SupportedWalletChain;
  }[];
}

export async function searchX402Tools(
  input: z.infer<typeof searchResourcesSchema>
) {
  const resources = await searchResources(input);

  const toolDefinitions: X402ToolResponse[] = [];
  for (const resource of resources) {
    if (resource.accepts) {
      // The composer can only pay on wallet chains; other supported networks
      // (e.g. robinhood) are dropped before the v1 parse, which rejects them.
      const payableAccepts = resource.accepts.filter(accept =>
        SUPPORTED_WALLET_CHAINS.includes(accept.network as SupportedWalletChain)
      );
      if (resource.accepts.length > 0 && payableAccepts.length === 0) {
        continue;
      }
      const parsedAccepts = z3
        .array(
          paymentRequirementsSchemaV1.extend({
            outputSchema: outputSchemaV1,
          })
        )
        .safeParse(
          payableAccepts.map(accept =>
            coerceAcceptForV1Schema({
              x402Version: resource.x402Version,
              accept,
            })
          )
        );
      if (!parsedAccepts.success) {
        continue;
      }
      const description =
        parsedAccepts.data.find(accept => accept.description)?.description ??
        '';
      toolDefinitions.push({
        id: resource.id,
        resource: resource.resource,
        description: description,
        favicon: resource.origin.favicon,
        invocations: resource._count.toolCalls,
        accepts: parsedAccepts.data.map(accept => ({
          maxAmountRequired: convertTokenAmount(
            BigInt(accept.maxAmountRequired),
            usdc(accept.network as SupportedWalletChain).decimals
          ),
          chain: accept.network as SupportedWalletChain,
        })),
      });
    }
  }

  return toolDefinitions;
}
