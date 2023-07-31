import React, { useState } from "react";
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [activeFriend, setActiveFriend] = useState(null);

  const activeFriendID = activeFriend?.id;

  const handleAddFriend = function () {
    setShowAddFriend((show) => !show);
  };

  const handleAddNewFriend = function (friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  };

  const handleActive = function (id) {
    const activeFriend = friends.find((friend) => friend.id === id);
    setActiveFriend((friend) => (friend?.id === id ? null : activeFriend));
  };

  const handleSplitBill = function (value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === activeFriendID ? { ...friend, balance: value } : friend
      )
    );

    setActiveFriend(null);
  };

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onActive={handleActive}
          activeFriendID={activeFriendID}
        />

        {showAddFriend && <FormAddField onAddNewFriend={handleAddNewFriend} />}

        <Button onClick={handleAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>

      {activeFriendID && (
        <FormSplitBill
          key={crypto.randomUUID()}
          activeFriend={activeFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendList({ friends, onActive, activeFriendID }) {
  return (
    <ul>
      {friends?.map(({ id, name, image, balance }) => (
        <Friend
          key={id}
          id={id}
          name={name}
          image={image}
          balance={balance}
          onActive={onActive}
          activeFriendID={activeFriendID}
        />
      ))}
    </ul>
  );
}

function Friend({ id, name, image, balance, onActive, activeFriendID }) {
  return (
    <li className={id === activeFriendID ? "selected" : null}>
      <img src={image} alt={name} />
      <h3>{name}</h3>
      {balance < 0 && (
        <p className="red">
          You Owe {name} {Math.abs(balance)}$
        </p>
      )}
      {balance > 0 && (
        <p className="green">
          {name} Owes You {Math.abs(balance)}$
        </p>
      )}
      {balance === 0 && <p>You And {name} are even</p>}
      <Button onClick={() => onActive(id)}>
        {activeFriendID === id ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddField({ onAddNewFriend }) {
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  const [name, setName] = useState("");

  const handleSubmit = (eve) => {
    eve.preventDefault();

    const id = crypto.randomUUID();

    if (image === "" || name === "") return;
    const addFriend = {
      image: `${image}?u=${id}`,
      name,
      id,
      balance: 0,
    };

    onAddNewFriend(addFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  };

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👫 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(eve) => setName(eve.target.value)}
      />

      <label>🌄 Image URL</label>

      <input
        type="text"
        value={image}
        onChange={(eve) => setImage(eve.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ activeFriend, onSplitBill }) {
  const { name } = activeFriend;
  const [bill, setBill] = useState("");
  const [userBill, setUserBill] = useState("");
  const friendExpense = bill ? bill - userBill : "";
  const [whoPaidTheBill, setWhoPaidTheBill] = useState("user");

  const handleSplitBill = function (eve) {
    eve.preventDefault();

    if (!bill || !userBill) return;

    onSplitBill(whoPaidTheBill === "user" ? friendExpense : -userBill);

    setBill("");
    setUserBill("");
    setWhoPaidTheBill("user");
  };

  return (
    <form className="form-split-bill" onSubmit={handleSplitBill}>
      <h2>SPLIT A BILL WITH {name}</h2>

      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(eve) => setBill(+eve.target.value)}
      />

      <label>🧍‍♀️ Your expense</label>
      <input
        type="text"
        value={userBill}
        onChange={(eve) =>
          setUserBill(+eve.target.value > bill ? userBill : +eve.target.value)
        }
      />

      <label>👫 {name}'s expense</label>
      <input type="text" value={friendExpense} disabled />

      <label>🤑 Who is paying the bill</label>
      <select
        value={whoPaidTheBill}
        onChange={(eve) => setWhoPaidTheBill(eve.target.value)}
      >
        <option value="user">You</option>
        <option value={name}>{name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}

export default App;
