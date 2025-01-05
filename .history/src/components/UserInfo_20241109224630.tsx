import { useUser } from "@/context/userContext";

const UserInfo = () => {
  const { currentUser } = useUser();

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
