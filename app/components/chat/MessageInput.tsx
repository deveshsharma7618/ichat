interface MessageInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function MessageInput({ value, onChange, onSend }: MessageInputProps) {
  return (
    <form className="composer">
      <div className="composer-tools">
        <button type="button" aria-label="Attach">
          +
        </button>
        <button type="button" aria-label="Record voice">
          ▣
        </button>
      </div>
      <input
        type="text"
        placeholder="Write a message..."
        aria-label="Message"
        value={value}
        onChange={onChange}
      />
      <button type="submit" className="send" onClick={onSend}>
        Send
      </button>
    </form>
  );
}
