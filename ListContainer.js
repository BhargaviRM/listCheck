const ListContainer = ({
  index,
  list,
  checked,
  onCheckboxChange,
  onItemMove,
  creatingList, // Add creatingList prop to manage the condition
}) => {
  return (
    <div className="list-container">
      <div>
        <input type="checkbox" checked={checked} onChange={onCheckboxChange} />
        <h3>List {index + 1}</h3>
      </div>
      <ul>
        {list.map((item) => (
          <li key={item.id}>
            <span>
              {item.name} - {item.description}
            </span>
            {checked &&
              creatingList && ( // Show arrows only for selected lists and when creating a new list
                <button onClick={() => onItemMove(item)}>→</button>
              )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListContainer;
