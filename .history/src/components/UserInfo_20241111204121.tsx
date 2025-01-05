import { UserContext, useUser } from "@/context/userContext";

const UserInfo = () => {
  const { currentUser } = useUser();

  console.log("Utilisateur dans UserInfo :", currentUser);

  return (
	<UserContext.Provider value={{ currentUser, setCurrentUser }}>
    <div>
      {currentUser ? (
        <p>Utilisateur connecté : {currentUser.name} (ID : {currentUser.id})</p>
      ) : (
        <p>Aucun utilisateur connecté.</p>
      )}
    </div>
  );
};

export default UserInfo;
