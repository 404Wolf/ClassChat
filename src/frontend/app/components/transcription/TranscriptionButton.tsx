export interface TranscriptionButtonProps {
  name: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export const TranscriptionButton = ({ name, icon, onClick }: TranscriptionButtonProps) => {
  return (
    <button onClick={onClick} className="btn bg-gray-100 px-3 py-1">
      <div className="scale-90">{icon}</div>
      <span className="text-sm">{name}</span>
    </button>
  );
}
