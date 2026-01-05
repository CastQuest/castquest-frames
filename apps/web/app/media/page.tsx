import { ComingSoon } from "../../components/EmptyState";

export default function MediaPage() {
  return (
    <div className="min-h-screen py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <ComingSoon
          feature="Media Valet"
          description="Upload, share, and discover images, videos, and interactive media content. Our media platform is launching soon."
          icon="🎬"
        />
      </div>
    </div>
  );
}
