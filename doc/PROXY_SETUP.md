# Proxy Setup Guide for Copart Scraper

## Why You Need a Proxy

Copart uses sophisticated bot detection that blocks automated scrapers. Even with stealth mode, they can:

- **Hide HTML elements from scrapers** (most common issue)
- Show CAPTCHA challenges
- Block by IP address
- Detect browser fingerprints

**Using a residential proxy with IP rotation is essential for reliable scraping.**

## Recommended Proxy Services

### 1. Bright Data (formerly Luminati) ⭐ Best Choice

- **Cost**: $50-100/month
- **Type**: Residential proxies with automatic IP rotation
- **Coverage**: Global, millions of IPs
- **Setup**: Easy
- **Website**: <https://brightdata.com>

**Why recommended:** Industry standard, best success rate, automatic rotation

### 2. Oxylabs

- **Cost**: $50-150/month
- **Type**: Residential and datacenter proxies
- **Coverage**: Global
- **Website**: <https://oxylabs.io>

### 3. SmartProxy

- **Cost**: $40-100/month
- **Type**: Residential proxies
- **Coverage**: Good global coverage
- **Website**: <https://smartproxy.com>

### 4. ProxyMesh (Budget Option)

- **Cost**: $10-50/month
- **Type**: Rotating datacenter proxies
- **Coverage**: US-focused
- **Website**: <https://proxymesh.com>

**Note:** Residential proxies work better than datacenter proxies for Copart

## Setup Instructions

### Step 1: Sign Up for Proxy Service

1. Choose a service (Bright Data recommended)
2. Create an account
3. Purchase a residential proxy plan
4. Get your proxy credentials

### Step 2: Configure Proxy

1. Open `lib/scrapers/copart/proxy-config.ts`
2. Find your service's example (or create custom config)
3. Uncomment and fill in your credentials:

```typescript
export const proxyConfig: ProxyConfig = {
 enabled: true,
 server: 'http://YOUR-PROXY-SERVER:PORT',
 username: 'YOUR_USERNAME',
 password: 'YOUR_PASSWORD',
};
```

### Step 3: Service-Specific Configurations

#### Bright Data

```typescript
export const proxyConfig: ProxyConfig = {
 enabled: true,
 server: 'http://brd.superproxy.io:22225',
 username: 'brd-customer-XXX-zone-residential',
 password: 'YOUR_PASSWORD',
};
```

**Zone options:**

- `zone-residential` - Rotating residential IPs (best for Copart)
- `zone-datacenter` - Datacenter IPs (cheaper, may not work)
- Add `-country-us` for US-only IPs: `zone-residential-country-us`

#### Oxylabs

```typescript
export const proxyConfig: ProxyConfig = {
 enabled: true,
 server: 'http://pr.oxylabs.io:7777',
 username: 'customer-YOUR_USERNAME-cc-us',
 password: 'YOUR_PASSWORD',
};
```

**Username format:**

- `cc-us` - United States
- `cc-gb` - United Kingdom
- `cc-de` - Germany
- `sessionduration-10` - Keep same IP for 10 minutes

#### SmartProxy

```typescript
export const proxyConfig: ProxyConfig = {
 enabled: true,
 server: 'http://gate.smartproxy.com:7000',
 username: 'YOUR_USERNAME',
 password: 'YOUR_PASSWORD',
};
```

#### ProxyMesh

```typescript
export const proxyConfig: ProxyConfig = {
 enabled: true,
 server: 'http://us-wa.proxymesh.com:31280',
 username: 'YOUR_USERNAME',
 password: 'YOUR_PASSWORD',
};
```

**Servers:**

- `us-wa.proxymesh.com:31280` - Seattle
- `us-ca.proxymesh.com:31280` - San Jose
- `us-dc.proxymesh.com:31280` - Washington DC

### Step 4: Test Your Proxy

Run the diagnostic tool to verify proxy is working:

```bash
npx tsx lib/scrapers/test/diagnose-blocking.ts "https://www.copart.com/todaysAuction"
```

Look for:

- ✅ `Proxy: ENABLED - http://...`
- ✅ `SUCCESS - Page loaded with car elements visible`
- ✅ `tbody tr count: 20` (or more)

If you see `tbody tr count: 0`, the proxy may not be working or Copart is still detecting automation.

### Step 5: Run the Scraper

```bash
npx tsx lib/scrapers/test/test-sale-list-scraper.ts "https://www.copart.com/saleListResult?yardNum=881" "test_sale"
```

You should see:

```
Proxy: ENABLED - http://...
✓ Proxy authentication configured
```

## Troubleshooting

### Proxy Connection Failed

**Symptoms:**

- `Error: net::ERR_PROXY_CONNECTION_FAILED`
- Browser can't load page

**Solutions:**

1. Check proxy server URL (hostname and port)
2. Verify username/password are correct
3. Check if your IP is whitelisted (some services require this)
4. Try a different proxy server endpoint

### Still Getting 0 Cars

**Symptoms:**

- Proxy connects successfully
- Page loads but `tbody tr count: 0`

**Possible causes:**

1. **IP already flagged:** Even with proxy, that IP might be blocked
   - Solution: Force IP rotation (add session parameter)

2. **Datacenter proxy detected:** Copart blocks datacenter IPs
   - Solution: Switch to residential proxy

3. **Browser fingerprint detected:** Automation still detected
   - Solution: Use browser with real user session

4. **CAPTCHA shown:** Visual CAPTCHA not detected by script
   - Solution: Watch browser window, solve manually

### Proxy Too Slow

**Symptoms:**

- Timeouts during navigation
- Very slow page loads

**Solutions:**

1. Increase timeout in scraper config:

   ```typescript
   const scraper = new CopartScraper({
       timeout: 120000, // 2 minutes
   });
   ```

2. Choose a faster proxy plan
3. Use geo-targeted proxies (US proxies for US Copart)

### Authentication Failed

**Symptoms:**

- `407 Proxy Authentication Required`

**Solutions:**

1. Double-check username and password
2. Make sure special characters are not causing issues
3. Some services use API key instead of password
4. Check if account is active and has credit

## Cost Optimization

### Development Phase

- Use **ProxyMesh** ($10-20/mo)
- Limit scraping to few auctions
- Manual CAPTCHA solving acceptable

### Production Phase

- Use **Bright Data** or **Oxylabs** ($50-100/mo)
- Automatic IP rotation
- Consider CAPTCHA solving service ($20-50/mo)
- Monitor usage to optimize costs

### Free Alternatives (Not Recommended)

- Free proxies are blocked instantly by Copart
- Poor reliability and speed
- Security risks
- **Don't waste time with free proxies**

## Advanced: IP Rotation Strategies

### Strategy 1: Session Stickiness (Recommended)

Keep same IP for 5-10 minutes, then rotate:

```typescript
// Bright Data with 10-minute session
username: 'brd-customer-XXX-zone-residential-session-random_session_123'

// Change session ID every 10 minutes to rotate IP
const sessionId = `session_${Date.now()}`;
```

### Strategy 2: Request-Level Rotation

New IP for every request (may look suspicious):

```typescript
// Bright Data - automatic rotation
username: 'brd-customer-XXX-zone-residential'
// No session parameter = new IP each request
```

### Strategy 3: Geographic Targeting

Use IPs from same region as Copart location:

```typescript
// For Texas Copart locations
username: 'brd-customer-XXX-zone-residential-country-us-state-texas'
```

## Security Notes

1. **Never commit proxy credentials to git**
   - `proxy-config.ts` is in `.gitignore`
   - Use environment variables for CI/CD

2. **Protect your proxy account**
   - Strong password
   - Whitelist your IPs if possible
   - Monitor usage for suspicious activity

3. **Rotate credentials periodically**
   - Change password every 3-6 months
   - Use different credentials for dev/prod

## Next Steps

After setting up proxy:

1. ✅ Test with diagnostic tool
2. ✅ Test with small scraping job (1-2 auctions)
3. ✅ Monitor success rate
4. ✅ Adjust delays if needed
5. ✅ Scale up to production

If still having issues after proxy setup, see [SCRAPER_ANTI_DETECTION.md](./SCRAPER_ANTI_DETECTION.md) for additional troubleshooting.

## Support

If you continue having blocking issues even with residential proxies, consider:

1. **Using Copart's official API** (if available for partners)
2. **Web scraping services** (ScrapingBee, Apify) that handle anti-bot for you
3. **Hiring a specialist** familiar with advanced anti-bot techniques
