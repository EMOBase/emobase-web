import { signOut } from "auth-astro/client";

import { Icon } from "@/components/ui/icon";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/hooks/session/useSession";

function getAvatarChars(name: string) {
  const words = name.trim().split(" ");

  if (words.length > 1) {
    return words[0][0] + words[1][0];
  }

  if (words[0].length > 0) {
    return words[0][0] + words[0][1];
  }

  return words[0][0];
}

const Topbar = () => {
  const { session } = useSession();

  return (
    <header className="h-16 border-b border-border-light bg-white/80 backdrop-blur-md px-10 flex items-center justify-between z-30 flex-shrink-0">
      <div></div>

      <div className="flex items-center gap-5">
        <InputGroup>
          <InputGroupInput
            className="rounded-md w-90 py-2"
            placeholder="Search for gene IDs or phenotypes..."
          />
          <InputGroupAddon>
            <Icon name="search" className="text-lg" />
          </InputGroupAddon>
        </InputGroup>

        {session && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarFallback>
                      {getAvatarChars(
                        (session.user?.name || session.user?.email) ?? "",
                      )}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup className="p-5 bg-slate-50/50 rounded-t-xl -m-1">
                <p className="text-sm font-bold text-slate-900">
                  {session.user?.name}
                </p>
                <p className="text-xs text-slate-500">{session.user?.email}</p>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  render={<a href="/admin" />}
                  className="text-slate-600 gap-2 px-3 py-2"
                >
                  <Icon name="dashboard" className="text-lg" />
                  Review Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem className="text-slate-600 gap-2 px-3 py-2">
                  <Icon name="settings" className="text-lg" />
                  Site Configuration
                  <span className="flex-1 inline-flex justify-end">
                    <Icon
                      name="open_in_new"
                      className="text-base text-slate-400"
                    />
                  </span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  signOut().then(() => {
                    window.location.href = "/";
                  });
                }}
                className="text-slate-600 gap-2 px-3 py-2"
              >
                <Icon name="logout" className="text-lg" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Topbar;
