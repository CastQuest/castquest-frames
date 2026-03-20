export default async function MintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-neutral-100 mb-4">Mint Details</h1>
      const { id } = await params;
      <p className="text-neutral-400">Mint ID: {id}</p>
    </div>
  );
}
