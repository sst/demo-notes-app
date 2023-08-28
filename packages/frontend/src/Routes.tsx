import { Route, Routes } from "react-router-dom";
import Home from "./containers/Home.tsx";
import Login from "./containers/Login.tsx";
import Notes from "./containers/Notes.tsx";
import Signup from "./containers/Signup.tsx";
import NewNote from "./containers/NewNote.tsx";
import NotFound from "./containers/NotFound.tsx";

export default function Links() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/notes/new" element={<NewNote />} />
      <Route path="/notes/:id" element={<Notes />} />
      {/* Finally, catch all unmatched routes */}
      <Route path="*" element={<NotFound />} />;
    </Routes>
  );
}
