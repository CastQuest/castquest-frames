export default async function MintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-neutral-100 mb-4">Mint Details</h1>
      <p className="text-neutral-400">Mint ID: {id}</p>
    </div>
  );
}
