
/**
 * Utility functions for the traffic simulator
 */

/**
 * Validates if a string is a properly formatted URL
 */
export const isValidUrl = (urlString: string): boolean => {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (e) {
    return false;
  }
};

/**
 * Generates a random IP address string
 */
export const generateRandomIP = (): string => {
  const octet = () => Math.floor(Math.random() * 256);
  return `${octet()}.${octet()}.${octet()}.${octet()}`;
};

/**
 * Generates a random User Agent string
 */
export const generateRandomUserAgent = (): string => {
  const browsers = [
    'Chrome',
    'Firefox',
    'Safari',
    'Edge',
    'Opera'
  ];
  
  const os = [
    'Windows NT 10.0',
    'Windows NT 11.0',
    'Macintosh; Intel Mac OS X 10_15_7',
    'X11; Linux x86_64',
    'iPhone; CPU iPhone OS 16_0 like Mac OS X',
    'Android 13; Mobile'
  ];
  
  const versions = {
    Chrome: ['104.0.0.0', '105.0.0.0', '106.0.0.0', '107.0.0.0'],
    Firefox: ['104.0', '105.0', '106.0', '107.0'],
    Safari: ['15.6.1', '16.0', '16.1', '16.2'],
    Edge: ['104.0.1293.47', '105.0.1343.27', '106.0.1370.37'],
    Opera: ['90', '91', '92', '93']
  };
  
  const browser = browsers[Math.floor(Math.random() * browsers.length)];
  const version = versions[browser as keyof typeof versions][
    Math.floor(Math.random() * versions[browser as keyof typeof versions].length)
  ];
  const selectedOS = os[Math.floor(Math.random() * os.length)];
  
  switch (browser) {
    case 'Chrome':
      return `Mozilla/5.0 (${selectedOS}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Safari/537.36`;
    case 'Firefox':
      return `Mozilla/5.0 (${selectedOS}; rv:${version}) Gecko/20100101 Firefox/${version}`;
    case 'Safari':
      return `Mozilla/5.0 (${selectedOS}) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${version} Safari/605.1.15`;
    case 'Edge':
      return `Mozilla/5.0 (${selectedOS}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Safari/537.36 Edg/${version}`;
    default:
      return `Mozilla/5.0 (${selectedOS}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Safari/537.36 OPR/${version}`;
  }
};

/**
 * Formats a number with comma separators
 */
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
