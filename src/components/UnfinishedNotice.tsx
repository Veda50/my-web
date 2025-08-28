type Props = {
  text?: string;
}

export default function UnfinishedNotice({text = "This page is unfinished yet."}: Props) {
    return (
      <div className="fixed left-5 bottom-5 z-50 bg-amber-100 text-amber-800 p-3 rounded-lg border border-amber-300 shadow-md flex items-center gap-2">
        <span>🚧</span>
        <span>{text}</span>
      </div>
    );
  }