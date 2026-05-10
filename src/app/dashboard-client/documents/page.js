import DocumentsTable from "@/components/dashboard-client/DocumentsTable";

export default function DocumentsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 mb-1">Documents</h1>
        <p className="text-zinc-500 font-medium text-sm">Manage and access all uploaded files within the secure registry.</p>
      </div>

      {/* Documents Table */}
      <DocumentsTable />
    </div>
  );
}
