export default {
  async fetch(request) {
    // Define the cache key and cache duration
    const cacheKey = new Request(request.url, request);
    const cacheDuration = 3600; // Time in seconds (1 hour)

    // Try to fetch the response from the cache
    const cache = caches.default;
    let response = await cache.match(cacheKey);

    if (!response) {
      // If not in cache, fetch from the remote URL
      const remote = "https://v6.exchangerate-api.com/v6/xxx/latest/USD";
      response = await fetch(remote, request);

      // Cache the response
      const cacheResponse = new Response(response.body, response);
      cacheResponse.headers.append('Cache-Control', `max-age=${cacheDuration}`);
      response = cacheResponse;

      // Store the response in cache
      await cache.put(cacheKey, response.clone());
    }

    return response;
  },
};