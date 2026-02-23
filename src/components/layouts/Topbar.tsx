import { useRef } from "react";
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
import { SearchHelpModal } from "@/components/common/SearchHelpModal";
import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
import SearchAutocomplete from "@/components/common/SearchAutocomplete";
import { Spinner } from "@/components/ui/spinner";
import { navigate } from "astro:transitions/client";

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
  const { session, logout } = useSession();
  const inputGroupRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  return (
    <header className="h-16 border-b border-border-light bg-white/80 backdrop-blur-md px-10 flex items-center justify-between z-30 flex-shrink-0">
      <div></div>

      <div className="flex items-center gap-5">
        <InputGroup ref={inputGroupRef}>
          <InputGroupAddon align="inline-end">
            <SearchHelpModal>
              <Button
                variant="ghost"
                size="icon"
                title="Search instruction"
                className="text-neutral-400 hover:text-neutral-600 h-8 w-8 -ml-2"
              >
                <Icon name="help" className="text-xl" />
              </Button>
            </SearchHelpModal>
          </InputGroupAddon>
          <SearchAutocomplete
            anchor={inputGroupRef}
            container={portalRef}
            renderInput={({
              searchValue,
              setSearchValue,
              loading,
              fetchSuggestions,
            }) => (
              <>
                <AutocompletePrimitive.Input
                  render={
                    <InputGroupInput
                      className="rounded-md w-90 px-3 py-2"
                      placeholder="Search for gene IDs or phenotypes..."
                      value={searchValue}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSearchValue(val);
                        fetchSuggestions(val);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          if (searchValue.trim()) {
                            navigate(`/search/${searchValue.trim()}`);
                          }
                        }
                      }}
                    />
                  }
                />
                <InputGroupAddon>
                  {loading ? (
                    <Spinner className="size-4" />
                  ) : (
                    <Icon name="search" className="text-lg" />
                  )}
                </InputGroupAddon>
              </>
            )}
          />
          <div ref={portalRef} />
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
              <DropdownMenuGroup className="px-6 py-5 bg-slate-50/50 rounded-t-xl -m-1">
                <p className="text-sm font-bold text-slate-900">
                  {session.user?.name}
                </p>
                <p className="text-xs text-slate-500">{session.user?.email}</p>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup className="space-y-1 p-1">
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
              <DropdownMenuGroup className="p-1">
                <DropdownMenuItem
                  onClick={logout}
                  className="text-slate-600 gap-2 px-3 py-2"
                >
                  <Icon name="logout" className="text-lg" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Topbar;
