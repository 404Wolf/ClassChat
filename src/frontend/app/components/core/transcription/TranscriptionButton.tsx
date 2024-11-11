export interface TranscriptionButtonProps {
  name: string;
  icon: React.ReactNode;
  onClick: () => void;
  backgroundColor?: string;
}

export const TranscriptionButton = ({ name, icon, onClick, backgroundColor }: TranscriptionButtonProps) => {
  return (
    <button onClick={onClick} className={`btn ${backgroundColor ?? "bg-gray-100"} px-3 py-1`} >
      <div className="scale-90">{icon}</div>
      <span className="text-sm">{name}</span>
    </button >
  );
}
