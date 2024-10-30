import Link from "next/link"

export default function Header() {
    return(
        <div className="header">
            <Link href={'/login'}>Login</Link>
        </div>
    )
}