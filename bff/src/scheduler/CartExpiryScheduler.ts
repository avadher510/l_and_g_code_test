import { Injectable, Inject } from '@nestjs/common';
import { CartService } from '../modules/cart/application/CartService';
import type { ICartRepository } from '../modules/cart/domain/ICartRepository';
import { CART_REPOSITORY_TOKEN } from '../modules/cart/domain/ICartRepository';
import {
  CART_INACTIVITY_TIMEOUT_MS,
  SCHEDULER_POLLING_INTERVAL_MS,
} from '../shared/constants/businessRules';

/**
 * Scheduler responsible for detecting and expiring inactive shopping carts.
 * Runs on a fixed interval; releases all stock reservations for any cart
 * that has not been active within the configured inactivity timeout.
 */
@Injectable()
export class CartExpiryScheduler {
  private intervalId: NodeJS.Timeout | null = null;

  constructor(
    private readonly cartService: CartService,
    @Inject(CART_REPOSITORY_TOKEN)
    private readonly cartRepository: ICartRepository,
  ) {}

  /**
   * Starts the polling interval that scans for inactive carts.
   * Logs a confirmation message when the scheduler begins operation.
   */
  startCartExpiryCheckInterval(): void {
    console.log(
      'CartExpiryScheduler started; polling every 30 seconds for inactive carts.',
    );

    this.intervalId = setInterval(() => {
      this.scanAndExpireInactiveCartSessions();
    }, SCHEDULER_POLLING_INTERVAL_MS);
  }

  /**
   * Stops the polling interval; used during graceful shutdown and in tests.
   * Logs a confirmation message when the scheduler stops.
   */
  stopCartExpiryCheckInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log(
        'CartExpiryScheduler stopped; no further expiry checks will run.',
      );
    }
  }

  /**
   * Finds all active carts inactive beyond the timeout and expires them.
   * Releases stock reservations for each expired cart and logs the count
   * of carts processed in this cycle.
   */
  scanAndExpireInactiveCartSessions(): void {
    const cutoffDate = new Date(Date.now() - CART_INACTIVITY_TIMEOUT_MS);
    const inactiveCarts = this.cartRepository.findAllActiveCartsWithLastActivityBefore(
      cutoffDate,
    );

    for (const cart of inactiveCarts) {
      this.cartService.expireCartAndReleaseAllStockReservations(cart.id);
    }

    console.log(
      `CartExpiryScheduler: expired ${inactiveCarts.length} inactive cart(s) in this cycle.`,
    );
  }
}
