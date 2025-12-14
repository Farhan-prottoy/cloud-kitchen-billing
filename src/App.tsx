import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/ui/Layout";
import Dashboard from "./pages/Dashboard";
import CorporateList from "./features/billing/CorporateList";
import CorporateForm from "./features/billing/CorporateForm";
import EventList from "./features/billing/EventList";
import EventForm from "./features/billing/EventForm";
import InvoiceView from "./features/billing/InvoiceView";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/corporate" element={<CorporateList />} />
        <Route path="/corporate/new" element={<CorporateForm />} />
        <Route path="/corporate/edit/:id" element={<CorporateForm />} />

        <Route path="/events" element={<EventList />} />
        <Route path="/events/new" element={<EventForm />} />
        <Route path="/events/edit/:id" element={<EventForm />} />

        <Route path="/invoice/:id" element={<InvoiceView />} />
      </Routes>
    </Layout>
  );
}

export default App;
