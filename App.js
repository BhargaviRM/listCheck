import React, { useState, useEffect } from "react";
import Loader from "./Loader";
import FailureView from "./FailureView";
import ListContainer from "./ListContainer";
import "./App.css";

const App = () => {
  const [lists, setLists] = useState([[], []]); // Lists should be an array of arrays
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [checkedLists, setCheckedLists] = useState([false, false]); // Track selected lists
  const [creatingList, setCreatingList] = useState(false); // Flag to indicate list creation
  const [newListItems, setNewListItems] = useState([]); // Items to move to the new list
  const [itemOriginList, setItemOriginList] = useState({}); // Track where the items came from

  // Fetch initial data from the API
  useEffect(() => {
    fetch("https://apis.ccbp.in/list-creation/lists")
      .then((response) => response.json())
      .then((data) => {
        const list1 = data.lists.filter((item) => item.list_number === 1);
        const list2 = data.lists.filter((item) => item.list_number === 2);
        setLists([list1, list2]); // Initialize with List 1 and List 2
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  // Handle checkbox change for selecting lists
  const handleCheckboxChange = (index) => {
    const newCheckedLists = [...checkedLists];
    newCheckedLists[index] = !newCheckedLists[index]; // Toggle the checkbox state
    setCheckedLists(newCheckedLists);
  };

  // Cancel the new list creation
  const handleCancel = () => {
    setCreatingList(false);
    setCheckedLists([false, false]);
    setNewListItems([]); // Clear the moved items for fresh creation
  };

  // Finalize the creation of the new list
  const handleUpdate = () => {
    const newListNumber = lists.length + 1; // Dynamically set the new list number
    const newList = newListItems; // New list will have the items from the selected lists

    console.log("newListItems:", newListItems); // Check the new list items
    console.log("lists before update:", lists); // Check lists before update

    // Add the new list to the lists array
    setLists((prevLists) => {
      const updatedLists = [...prevLists, newList];
      console.log("updatedLists:", updatedLists); // Check lists after update
      return updatedLists;
    });

    setCheckedLists([false, false]); // Reset selected lists
    setNewListItems([]); // Clear moved items for fresh creation
    setCreatingList(false); // Hide create list view and prepare for new list creation
  };

  // Move item from selected lists to the new list or back to the original list
  const handleItemMove = (item, fromIndex) => {
    setItemOriginList((prev) => ({ ...prev, [item.id]: fromIndex })); // Track where the item came from
    setNewListItems((prevItems) => [...prevItems, item]); // Add the item to the new list
    const updatedLists = [...lists];
    updatedLists[fromIndex] = updatedLists[fromIndex].filter(
      (i) => i.id !== item.id
    ); // Remove from the original list
    setLists(updatedLists);
  };

  // Move item back to the original list
  const handleItemMoveBack = (item, currentListIndex) => {
    const originalListIndex = itemOriginList[item.id]; // Get the original list where it came from
    const updatedNewListItems = newListItems.filter((i) => i.id !== item.id);
    setNewListItems(updatedNewListItems);

    const updatedLists = [...lists];
    updatedLists[originalListIndex] = [
      ...updatedLists[originalListIndex],
      item,
    ]; // Add item back to the original list
    setLists(updatedLists);
  };

  // Handle list creation when exactly two lists are selected
  const handleCreateList = () => {
    if (checkedLists.filter((checked) => checked).length === 2) {
      setCreatingList(true); // Show the new list creation view
    } else {
      alert("You must select exactly 2 lists to create a new list.");
    }
  };

  // Render the lists UI
  const renderLists = () => {
    if (loading) return <Loader />;
    if (error) return <FailureView onRetry={() => window.location.reload()} />;
    return (
      <div className="lists">
        {lists.map((list, index) => (
          <ListContainer
            key={index}
            index={index}
            list={list}
            checked={checkedLists[index] || false}
            onCheckboxChange={() => handleCheckboxChange(index)}
            onItemMove={(item) => handleItemMove(item, index)} // Move to new list (right arrow)
            onItemMoveBack={(item) => handleItemMoveBack(item, index)} // Move back to original list (left arrow)
            creatingList={creatingList} // Pass creatingList prop to control visibility of arrows
          />
        ))}
      </div>
    );
  };

  return (
    <div className="App">
      <h1>List Creation</h1>
      {creatingList ? (
        <div className="create-list-view">
          <button onClick={handleCancel}>Cancel</button>
          <div className="lists">
            {renderLists()}
            <div className="new-list-container">
              <h3>List {lists.length + 1}</h3>
              <ul>
                {newListItems.map((item) => (
                  <li key={item.id}>
                    <span>
                      {item.name} - {item.description}
                    </span>
                    <button onClick={() => handleItemMoveBack(item)}>
                      ← Back
                    </button>{" "}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <button onClick={handleUpdate}>Update</button>
        </div>
      ) : (
        <div className="all-lists-view">
          {renderLists()}
          <button onClick={handleCreateList}>Create a new list</button>
        </div>
      )}
    </div>
  );
};

export default App;
