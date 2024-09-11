import { useContext } from "react";
import { UserProfileContext } from "../contexts/UserProfileContext";

export default function ProfilePicture({
  size = 70,
}: {
  size?: number;
}): React.ReactElement {
  const userData = useContext(UserProfileContext);

  if (!userData) {
    return <div style={{ width: `${size.toString()}px` }} />;
  }

  return (
    <article className="profile-picture">
      <img
        src={userData.profile_image_url}
        style={{ width: `${size.toString()}px` }}
      />
    </article>
  );
}
