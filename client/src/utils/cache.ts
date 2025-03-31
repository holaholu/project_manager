/**
 * Interface for items stored in the cache.
 * Uses generics to allow caching of any data type.
 */
interface CacheItem<T> {
  data: T;            // The actual data being cached
  timestamp: number;  // When the item was cached (Unix timestamp)
}

/**
 * Cache implementation using the Singleton pattern.
 * Provides in-memory storage with automatic expiration.
 */
class Cache {
  // Singleton instance
  private static instance: Cache;
  
  // Internal storage using Map for key-value pairs
  private storage: Map<string, CacheItem<any>>;
  
  // Time-To-Live: 30 minutes in milliseconds
  // Items older than this will be considered stale
  private readonly TTL: number = 1000 * 60 * 30;

  /**
   * Private constructor to prevent direct instantiation.
   * Use getInstance() instead.
   */
  private constructor() {
    this.storage = new Map();
  }

  /**
   * Gets the singleton instance of the cache.
   * Creates it if it doesn't exist.
   */
  public static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  /**
   * Stores a value in the cache with the current timestamp.
   * @param key - Unique identifier for the cached item
   * @param value - Data to be cached
   */
  public set<T>(key: string, value: T): void {
    this.storage.set(key, {
      data: value,
      timestamp: Date.now(),
    });
  }

  /**
   * Retrieves a value from the cache if it exists and isn't stale.
   * @param key - Unique identifier for the cached item
   * @returns The cached value, or null if not found or expired
   */
  public get<T>(key: string): T | null {
    const item = this.storage.get(key);
    if (!item) return null;

    // Check if the item has expired
    if (Date.now() - item.timestamp > this.TTL) {
      this.storage.delete(key);  // Remove stale item
      return null;
    }

    return item.data as T;
  }

  /**
   * Removes all items from the cache.
   * Useful for cleanup or resetting the cache state.
   */
  public clear(): void {
    this.storage.clear();
  }
}

// Export a singleton instance
export default Cache.getInstance();
