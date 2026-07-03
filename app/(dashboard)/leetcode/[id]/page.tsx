export default async function LeetCodeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <div className="p-8">LeetCode Problem: {id}</div>;
}
