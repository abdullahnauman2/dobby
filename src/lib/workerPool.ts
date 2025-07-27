/**
 * Worker pool management for Dobby browser automation system
 * 
 * Manages the pool of Browserbase contexts and their availability states.
 * Handles worker assignment, status updates, and authentication tracking.
 * 
 * Note: This is currently using in-memory storage. Will migrate to database later.
 */

import { Worker, WORKERS } from '../config/workers';

/**
 * Get the first available worker from the pool
 * @returns Available worker or null if all are busy/unhealthy
 */
export function getAvailableWorker(): Worker | null {
  const availableWorker = WORKERS.find(worker => worker.status === 'available');
  return availableWorker || null;
}

/**
 * Mark a worker as busy (in use for video generation)
 * @param workerId - The ID of the worker to mark as busy
 * @returns true if worker was found and updated, false otherwise
 */
export function markWorkerBusy(workerId: string): boolean {
  const worker = WORKERS.find(w => w.id === workerId);
  if (!worker) {
    return false;
  }
  
  if (worker.status !== 'available') {
    console.warn(`Worker ${workerId} is not available (status: ${worker.status})`);
    return false;
  }
  
  worker.status = 'busy';
  worker.lastUsed = new Date();
  return true;
}

/**
 * Mark a worker as available (ready for new tasks)
 * @param workerId - The ID of the worker to mark as available
 * @returns true if worker was found and updated, false otherwise
 */
export function markWorkerAvailable(workerId: string): boolean {
  const worker = WORKERS.find(w => w.id === workerId);
  if (!worker) {
    return false;
  }
  
  if (worker.status === 'unhealthy') {
    console.warn(`Worker ${workerId} is unhealthy and cannot be marked as available`);
    return false;
  }
  
  worker.status = 'available';
  return true;
}

/**
 * Update worker authentication information after successful login
 * @param workerId - The ID of the worker to update
 * @param email - The authenticated email address
 * @returns true if worker was found and updated, false otherwise
 */
export function updateWorkerAuth(workerId: string, email: string): boolean {
  const worker = WORKERS.find(w => w.id === workerId);
  if (!worker) {
    return false;
  }
  
  worker.email = email;
  worker.status = 'available';
  worker.lastUsed = new Date();
  return true;
}

/**
 * Mark a worker as unhealthy (authentication failed, needs manual intervention)
 * @param workerId - The ID of the worker to mark as unhealthy
 * @returns true if worker was found and updated, false otherwise
 */
export function markWorkerUnhealthy(workerId: string): boolean {
  const worker = WORKERS.find(w => w.id === workerId);
  if (!worker) {
    return false;
  }
  
  worker.status = 'unhealthy';
  return true;
}

/**
 * Get a specific worker by ID
 * @param workerId - The ID of the worker to retrieve
 * @returns Worker object or null if not found
 */
export function getWorkerById(workerId: string): Worker | null {
  return WORKERS.find(w => w.id === workerId) || null;
}

/**
 * Get all workers and their current status
 * @returns Array of all workers
 */
export function getAllWorkers(): Worker[] {
  return [...WORKERS]; // Return a copy to prevent external modification
}

/**
 * Get worker pool statistics
 * @returns Object containing pool statistics
 */
export function getWorkerPoolStats() {
  const total = WORKERS.length;
  const available = WORKERS.filter(w => w.status === 'available').length;
  const busy = WORKERS.filter(w => w.status === 'busy').length;
  const unauthenticated = WORKERS.filter(w => w.status === 'unauthenticated').length;
  const unhealthy = WORKERS.filter(w => w.status === 'unhealthy').length;
  
  return {
    total,
    available,
    busy,
    unauthenticated,
    unhealthy,
    utilizationRate: total > 0 ? Math.round((busy / total) * 100) : 0
  };
}