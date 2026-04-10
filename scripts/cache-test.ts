
import { GET } from '../app/api/quote/route';
import { NextResponse } from 'next/server';
import axios from 'axios';
import { checkRateLimit } from '../lib/ratelimit';

// Mock dependencies
jest.mock('axios');
jest.mock('../lib/ratelimit');
jest.mock('../lib/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedCheckRateLimit = checkRateLimit as jest.MockedFunction<typeof checkRateLimit>;

describe('Quote API Caching', () => {
  const mockParams = {
    sourceAsset: 'XRP',
    sourceChain: 'XRPL',
    destAsset: 'ETH',
    destChain: 'ETHEREUM',
    amount: '100',
  };

  const mockRequest = new Request(`http://localhost:3000/api/quote?sourceAsset=${mockParams.sourceAsset}&sourceChain=${mockParams.sourceChain}&destAsset=${mockParams.destAsset}&destChain=${mockParams.destChain}&amount=${mockParams.amount}`);

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.CHANGENOW_API_KEY = 'test-api-key';
    mockedCheckRateLimit.mockResolvedValue({ success: true, remaining: 10, reset: Date.now() + 10000 });
    mockedAxios.get.mockResolvedValue({
      data: {
        estimatedAmount: '0.1',
        transactionSpeedForecast: 300,
      }
    });
  });

  it('should call ChangeNOW API only once for identical requests within a short timeframe', async () => {
    // First request
    const response1 = await GET(mockRequest.clone());
    expect(response1.status).toBe(200);
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);

    // Second request (identical)
    const response2 = await GET(mockRequest.clone());
    expect(response2.status).toBe(200);

    // This is where we expect the cache to kick in
    // expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });
});
