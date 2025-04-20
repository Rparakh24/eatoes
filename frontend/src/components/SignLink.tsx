export default function SignLink({text,link}:{text:string,link:string}){
    return(
        <div>
        <a href={link} className="text-[#FF5722] hover:text-[#FF7043]">
          {text}
        </a>
        </div>
    )
}