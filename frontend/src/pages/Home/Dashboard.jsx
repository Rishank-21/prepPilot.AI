import { useCallback, useEffect, useState } from "react";
import { BookOpen, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import moment from "moment";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import SummaryCard from "../../components/cards/SummaryCard";
import Modal from "../../components/Modal";
import DeleteAlertContent from "../../components/DeleteAlertContent";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { CARD_BG } from "../../utils/data";
import CreateSessionForm from "./CreateSessionForm";

export default function Dashboard() {
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [status, setStatus] = useState("loading");

  const loadSessions = useCallback(async (signal) => {
    setStatus("loading");
    try {
      const { data } = await axiosInstance.get(API_PATHS.SESSION.GET_ALL, { signal });
      setSessions(data.sessions || data);
      setStatus("ready");
    } catch {
      if (!signal?.aborted) setStatus("error");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadSessions(controller.signal);
    return () => controller.abort();
  }, [loadSessions]);

  async function deleteSession() {
    setDeleting(true);
    try {
      await axiosInstance.delete(API_PATHS.SESSION.DELETE(sessionToDelete._id));
      setSessions((items) => items.filter((item) => item._id !== sessionToDelete._id));
      setSessionToDelete(null);
      toast.success("Session deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Couldn’t delete the session. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <DashboardLayout>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950">Practice sessions</h1>
          <p className="mt-2 text-slate-600">Pick up where you left off or prepare for a new role.</p>
        </div>
        <button className="action-button" onClick={() => setShowCreate(true)}>
          <Plus size={18} aria-hidden="true" /> New session
        </button>
      </header>
      {status === "loading" && <p className="page-status" role="status">Loading sessions…</p>}
      {status === "error" && (
        <div className="page-status">
          <p role="alert">We couldn’t load your sessions.</p>
          <button className="action-button mt-4" onClick={() => loadSessions()}>Retry</button>
        </div>
      )}
      {status === "ready" && (sessions.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sessions.map((session, index) => (
            <SummaryCard
              key={session._id}
              colors={CARD_BG[index % CARD_BG.length]}
              role={session.role}
              topicsToFocus={session.topicsToFocus}
              experience={session.experience ?? "–"}
              questions={session.questions?.length ?? 0}
              description={session.description}
              latestUpdated={session.updatedAt ? moment(session.updatedAt).format("DD MMM YYYY") : "–"}
              onSelect={() => navigate(`/interview-prep/${session._id}`)}
              onDelete={() => setSessionToDelete(session)}
            />
          ))}
        </div>
      ) : (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
          <BookOpen className="mx-auto text-emerald-800" aria-hidden="true" />
          <h2 className="mt-4 text-xl font-bold">No sessions yet</h2>
          <p className="mt-2 text-slate-600">Create a session to get practice questions for your target role.</p>
        </section>
      ))}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="New practice session">
        <CreateSessionForm />
      </Modal>
      <Modal isOpen={Boolean(sessionToDelete)} onClose={() => !deleting && setSessionToDelete(null)} title="Delete session">
        <DeleteAlertContent content="Delete this session and its questions?" onDelete={deleteSession} disabled={deleting} />
      </Modal>
    </DashboardLayout>
  );
}
