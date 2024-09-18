export default function UserName({
  displayName,
  login,
}: {
  displayName: string;
  login: string;
}): React.ReactElement {
  return (
    <p className="overflow-hidden text-ellipsis">
      <span className="font-bold">{displayName}</span>
      {displayName.toLowerCase() !== login && (
        <span className="font-normal">({login})</span>
      )}
    </p>
  );
}
