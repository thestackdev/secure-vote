import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { getPolls, getUser, isWallectConnected } from "./Blockchain.services";
// import { checkAuthState } from "./Chat.services";
import CreatePoll from "./components/CreatePoll";
import DeletePoll from "./components/DeletePoll";
import Header from "./components/Header";
import Register from "./components/Register";
import UpdatePoll from "./components/UpdatePoll";
import Home from "./views/Home";
import Vote from "./views/Vote";

const App = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(async () => {
    await isWallectConnected();
    await getPolls();
    await getUser();
    // await checkAuthState();
    setLoaded(true);
    console.log("Blockchain loaded");
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      {loaded ? (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/polls/:id" element={<Vote />} />
        </Routes>
      ) : null}

      <Register />
      <DeletePoll />
      <CreatePoll />
      <UpdatePoll />
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default App;
