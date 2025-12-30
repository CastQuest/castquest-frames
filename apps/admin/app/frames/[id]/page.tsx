export default function FrameDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-neutral-100 mb-4">Frame Details</h1>
      <p className="text-neutral-400">Frame ID: {params.id}</p>
    </div>
  );
}
