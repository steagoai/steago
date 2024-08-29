/**
 * Joins multiple URL path parts into a single URL path.
 *
 * @param {...string} args - The URL path parts to join.
 * @return {string} The joined URL path.
 */
export function joinUrlPaths(...args: string[]): string {
  // Remove leading and trailing slashes from each path part and join them
  // with a forward slash.
  return (
    '/' + args.map((pathPart) => pathPart.replace(/(^\/|\/$)/g, '')).join('/')
  );
}
