export default function QuantityButton({text,onClick}:{text:string,onClick:()=>void}){
    return(
        <button onClick={onClick} className="px-4 py-2 bg-orange-300 text-white rounded-lg">
            {text}
        </button>
    )
}