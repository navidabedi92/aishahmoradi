import {
  AddOrganizationEventJudges,
  Base64,
  FetchJudges,
} from "@/utils/Common";
import { useEffect, useState } from "react";

import { IsCompressed } from "@/utils/Constants";

export default function AddJudgeToEvent({
  eventID,
  eventJudes,
  isOpen,
  onClose,
}) {
  const [judgeList, setJudgeList] = useState([]);
  const [addedJudges, setAddedJudges] = useState([...eventJudes]); // Initialize with existing judges
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJudge, setSelectedJudge] = useState(null); // State for selected judge

  useEffect(() => {
    if (isOpen) {
      FetchJudges()
        .then((response) => {
          if (response.data) {
            const availableJudges = response.data.filter(
              (judge) =>
                !eventJudes.some((eventJudge) => eventJudge.id === judge.id)
            );
            setJudgeList(availableJudges);
            console.log(availableJudges);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [isOpen, eventJudes]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedJudge) {
      alert("Please select a judge.");
      return;
    }

    AddOrganizationEventJudges(eventID, selectedJudge.id)
      .then((response) => {
        response = response?.data;

        if (IsCompressed.indexOf("true") > 0) {
          response = Base64.resolveResponse(response, false);
        }
        if (response.IsSuccessfull) {
          setAddedJudges((prev) => [...prev, selectedJudge]);
          setJudgeList((prev) =>
            prev.filter((judge) => judge.id !== selectedJudge.id)
          ); // Remove added judge from list
          setSearchTerm(""); // Clear search term
          setSelectedJudge(null); // Clear selected judge
        } else {
          alert(`This Email is used by another person`);
        }
      })
      .catch((error) => {
        alert(`Please call to Support Center. Error: ${error}`);
      });
  };

  const handleJudgeSelect = (judge) => {
    setSearchTerm(judge.name);
    setSelectedJudge(judge);
  };

  const filteredJudges = judgeList.filter((judge) =>
    judge.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Choose Judge you want to take part
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Search Judge
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedJudge(null); // Clear selected judge when typing
              }}
              className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type judge name"
              required
            />
            {searchTerm && !selectedJudge && filteredJudges.length > 0 && (
              <ul className="border rounded mt-2 max-h-40 overflow-y-auto">
                {filteredJudges.map((judge) => (
                  <li
                    key={judge.id}
                    onClick={() => handleJudgeSelect(judge)}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                  >
                    {judge.name} {judge.isHead ? "(Head)" : ""}
                  </li>
                ))}
              </ul>
            )}
            {searchTerm && !selectedJudge && filteredJudges.length === 0 && (
              <p className="text-red-500 mt-2">No judge found.</p>
            )}
          </div>
          {selectedJudge && (
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 w-full"
            >
              Add Judge
            </button>
          )}
        </form>
        {addedJudges.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-bold">Added Judges:</h3>
            <ul className="list-disc pl-5">
              {addedJudges.map((judge, index) => (
                <li key={index} className="text-green-500">
                  {judge.name} {judge.isHead ? "(Head)" : ""}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button onClick={onClose} className="mt-2 text-red-500 hover:underline">
          Close
        </button>
      </div>
    </div>
  );
}
