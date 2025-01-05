import { useUser } from "@/context/userContext";

const UserInfo = () => {
  cconst { currentUser } = useUser();

  console.log("Utilisateur dans UserInfo :", currentUser);

  return (
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
