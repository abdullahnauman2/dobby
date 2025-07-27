/**
 * Worker configuration for Dobby browser automation system
 * 
 * Each worker represents a Browserbase context with a pre-authenticated
 * Google account for parallel video generation.
 * 
 * Note: This is currently using in-memory storage. Will migrate to database later.
 */

export interface Worker {
  id: string;
  contextId: string | null;
  email: string;
  status: 'unauthenticated' | 'available' | 'busy' | 'unhealthy';
  lastUsed?: Date;
  createdAt: Date;
}

/**
 * Initial worker pool with one worker for testing
 * Status starts as 'unauthenticated' - will be updated after manual authentication
 */
export const WORKERS: Worker[] = [
  // {
  //   id: 'dobby.worker0',
  //   contextId: 'd38c3431-a2c0-407c-8e7d-125b5d5dabd6', // Browserbase context ID after authentication
  //   email: 'dobby.worker0@gmail.com',
  //   status: 'unauthenticated',
  //   createdAt: new Date()
  // },
  {
    id: 'abdullahbnauman',
    contextId: '513712f7-0860-45ed-bff2-5464138c1d11', // Browserbase context ID after authentication
    email: 'abdullahbnauman@gmail.com',
    status: 'available',
    createdAt: new Date()
  }
];