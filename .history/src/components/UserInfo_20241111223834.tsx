import { UserContext, useUser } from "@/context/userContext";

const UserInfo = () => {
  const { currentUser, setCurrentUser } = useUser();

  console.log("Utilisateur dans UserInfo :", currentUser);

  return (
	<UserContext.Provider value={{ currentUser, setCurrentUser }}>
    <div>
      {currentUser ? (
        <p>Utilisateur connecté :  (ID : {currentUser.users_id})</p>
      ) : (
        <p>Aucun utilisateur connecté.</p>
      )}
    </div>
	</UserContext.Provider>
  );
};

export default UserInfo;
