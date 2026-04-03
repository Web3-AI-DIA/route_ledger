import { describe, it, expect } from 'vitest';
import { QuoteRequestSchema } from '@/lib/validations';

describe('QuoteRequestSchema', () => {
  it('should validate valid quote requests', () => {
    const validRequest = {
      sourceAsset: 'XRP',
      sourceChain: 'XRPL',
      destAsset: 'ETH',
      destChain: 'ETHEREUM',
      amount: '100.50',
    };
    const result = QuoteRequestSchema.safeParse(validRequest);
    expect(result.success).toBe(true);
  });

  it('should fail on invalid amount', () => {
    const invalidRequest = {
      sourceAsset: 'XRP',
      sourceChain: 'XRPL',
      destAsset: 'ETH',
      destChain: 'ETHEREUM',
      amount: 'abc',
    };
    const result = QuoteRequestSchema.safeParse(invalidRequest);
    expect(result.success).toBe(false);
  });

  it('should fail on unsupported asset', () => {
    const invalidRequest = {
      sourceAsset: 'DOGE',
      sourceChain: 'XRPL',
      destAsset: 'ETH',
      destChain: 'ETHEREUM',
      amount: '100',
    };
    const result = QuoteRequestSchema.safeParse(invalidRequest);
    expect(result.success).toBe(false);
  });
});
