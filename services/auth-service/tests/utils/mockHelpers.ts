import { Request, Response } from 'express';

// Mock response object for testing
export const createMockResponse = () => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };
  return res as Response;
};

// Mock request object for testing
export const createMockRequest = (body: any): Partial<Request> => ({
  body
});