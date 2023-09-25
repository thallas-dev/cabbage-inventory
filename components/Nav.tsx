import { Button } from "@/components/ui/button"
import Link from "next/link"

const Nav = () => {
    return (
        <div className='bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0'>

            <div className='container flex items-center justify-between'>
                <Link href="/">Logo</Link>


                <Button>
                    <Link href="/login">Login</Link>
                </Button>
            </div>
        </div>
    )
}

export default Nav