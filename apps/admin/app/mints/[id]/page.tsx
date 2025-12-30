export default function MintDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-neutral-100 mb-4">Mint Details</h1>
      <p className="text-neutral-400">Mint ID: {params.id}</p>
    </div>
  );
}
