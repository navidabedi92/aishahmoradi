import { useState } from "react";
import { useSelector } from "react-redux";
import AuthModal from "./AuthModal";
import AddJudgeToEvent from "./AddJudgeToEvent";

export default function ButtonEventDetails({ eventID, eventJudes, onRefresh }) {
  const stateStore = useSelector((state) => state);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showAddJudeForm, setShowAddJudgForm] = useState(false);
  const [showAddAthlete, setShowAddAthlete] = useState(false);

  const handleTakePartClick = () => {
    if (!stateStore.login) {
      setShowLoginForm(true);
    } else {
      setShowAddAthlete(true);
      console.log("to Do");
    }
  };

  const handleAddJudgeClick = () => {
    if (!stateStore.login) {
      setShowLoginForm(true);
    } else {
      setShowAddJudgForm(true);
      console.log(112234564);
    }
  };

  return (
    <>
      {(stateStore.userData?.Type === "Athlete" || !stateStore.login) && (
        <button
          className="bg-blue-700 text-white text-lg px-4 py-2 rounded-lg hover:bg-blue-800 transition duration-200 shadow"
          onClick={handleTakePartClick}
        >
          Take Part
        </button>
      )}
      {(stateStore.userData?.Type === "Organization" || !stateStore.login) && (
        <button
          className="bg-green-700 text-white text-lg px-4 py-2 rounded-lg hover:bg-green-800 transition duration-200 shadow"
          onClick={handleAddJudgeClick}
        >
          Add Judge
        </button>
      )}

      <AuthModal
        isOpen={showLoginForm}
        onClose={() => setShowLoginForm(false)}
      />

      <AddJudgeToEvent
        eventID={eventID}
        eventJudes={eventJudes}
        isOpen={showAddJudeForm}
        onClose={() => {
          setShowAddJudgForm(false);
          onRefresh(); // Call the refresh function
        }}
      />
    </>
  );
}
