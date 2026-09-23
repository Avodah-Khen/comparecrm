import LeadsListPage from "./LeadsListPage";

export default function DeveloperCrm() {
  return <LeadsListPage title="Developer CRM" leadTypes={["developer", "broker", "builder"]} showTypeFilter />;
}
