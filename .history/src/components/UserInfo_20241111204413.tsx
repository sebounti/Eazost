import { UserContext, useUser } from "@/context/userContext";

const UserInfo:React.FC = () => {
  const { currentUser } = useUser();

  console.log("Utilisateur dans UserInfo :", currentUser);

  return (
	<UserContext.Provider value={{ currentUser }}>
    <div>
      {currentUser ? (
        <p>Utilisateur connecté : {currentUser.name} (ID : {currentUser.id})</p>
      ) : (
        <p>Aucun utilisateur connecté.</p>
      )}
    </div>
	</UserContext.Provider>
  );
};

export default UserInfo;
