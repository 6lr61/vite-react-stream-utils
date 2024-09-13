import { useGetProfile } from "../hooks/useGetProfile";

export default function ProfilePicture({
  login,
}: {
  login: string;
}): React.ReactElement {
  const userData = useGetProfile(login);

  return (
    <article className="size-14 rounded-xl overflow-hidden">
      {userData.data?.profile_image_url ? (
        <img className="object-fill" src={userData.data.profile_image_url} />
      ) : (
        <div className="bg-slate-600 size-full"></div>
      )}
    </article>
  );
}
