import InPersonOrderView from "./InPersonOrderView";
import RONOrderView from "./RONOrderView";

export default async function AssignmentOrderDetailPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id || "";
  const normalized = id.toLowerCase();

  if (normalized.startsWith("ron-")) {
    return <RONOrderView id={id} />;
  }

  if (normalized.startsWith("ip-") || normalized.startsWith("in-person-")) {
    return <InPersonOrderView id={id} />;
  }

  return <InPersonOrderView id={id} />;
}
