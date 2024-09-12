import { useContext } from "react";
import { UserProfileContext } from "../contexts/UserProfileContext";

export default function ProfilePicture(): React.ReactElement {
  const userData = useContext(UserProfileContext);

  return (
    <article className="size-14 rounded-xl overflow-hidden bg-slate-700">
      {userData?.profile_image_url && (
        <img className="object-fill" src={userData.profile_image_url} />
      )}
    </article>
  );
}
