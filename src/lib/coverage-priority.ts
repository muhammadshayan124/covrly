/** Pure ordering logic, deliberately dependency-free (no Prisma import) so it's testable
 * without a database connection: given all staff sorted by priority and the set already
 * offered this request, who's next?
 */
export function nextEligibleStaffId(
  staffIdsByPriority: string[],
  alreadyOfferedStaffIds: Set<string>
): string | null {
  for (const id of staffIdsByPriority) {
    if (!alreadyOfferedStaffIds.has(id)) return id;
  }
  return null;
}
