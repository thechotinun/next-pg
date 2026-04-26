/**
 * Resolves the current user's ID for logging context.
 *
 * Replace the body of this function when auth is ready. Examples:
 *
 * next-auth:
 *   const session = await getServerSession(authOptions)
 *   return session?.user?.id ?? undefined
 *
 * jose / JWT:
 *   const token = cookies().get('token')?.value
 *   return token ? (await jwtVerify(token, secret)).payload.sub : undefined
 */
export async function resolveUserId(): Promise<string | undefined> {
  return undefined;
}
