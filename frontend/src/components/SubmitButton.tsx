interface SubmitButtonProps {
  onClick?: () => void;
  text: string;
}

const SubmitButton = ({ onClick, text }: SubmitButtonProps) => {
  return (
    <button
      onClick={onClick}
      type="submit"
      className="w-full bg-[#FF5722] text-white py-3 rounded-lg hover:bg-[#FF7043] focus:outline-none focus:ring-4 focus:ring-[#FF5722] transition duration-200"
    >
      {text}
    </button>
  );
};

export default SubmitButton;
