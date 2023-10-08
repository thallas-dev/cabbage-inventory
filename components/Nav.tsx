import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const Nav = () => {
  const { data: session } = useSession();

  return (
    <div className="bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0">
      <div className="container flex items-center justify-between">
        <Link href="/">Logo</Link>

        {session?.user ? (
          <Button
            onClick={() =>
              signOut({
                redirect: true,
                callbackUrl: `${window.location.origin}/login`,
              })
            }
            variant="destructive"
          >
            Logout
          </Button>
        ) : (
          <Button>
            <Link href="/login">Login</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Nav;
