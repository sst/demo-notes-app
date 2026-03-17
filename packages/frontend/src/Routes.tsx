import { Route, Routes } from "react-router";
import Home from "./containers/Home";
import Note from "./containers/Note";
import NewNote from "./containers/NewNote";
import Settings from "./containers/Settings";
import NotFound from "./containers/NotFound";
import AuthenticatedRoute from "./components/AuthenticatedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route
        path="/settings"
        element={
          <AuthenticatedRoute><Settings /></AuthenticatedRoute>
        }
      />
      <Route
        path="/notes/new"
        element={
          <AuthenticatedRoute><NewNote /></AuthenticatedRoute>
        }
      />
      <Route
        path="/notes/:id"
        element={
          <AuthenticatedRoute><Note /></AuthenticatedRoute>
        }
      />
      {/* Finally, catch all unmatched routes */}
      <Route path="*" element={<NotFound />} />;
    </Routes>
  );
}
