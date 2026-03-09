import MetadataEditor from "@/components/metadata/metadata-editor";

export default function MetadataPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Metadata Editor</h1>
        <p className="text-sm text-[#999] mt-0.5">
          Connect to a Mimir region, fetch an item by ID, and edit its metadata
        </p>
      </div>

      <MetadataEditor />
    </div>
  );
}
