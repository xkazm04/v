import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/app/components/ui/alert-dialog';
import { AuthButtons } from '@/app/components/auth/AuthButtons';
import { Link, Loader2, LogOut, Settings, User } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

type Props = {
    user: { email: string } | null;
    handleLogout: () => Promise<void>;
    logoutLoading: boolean;
}

const UserProfileDropdown = ({user, handleLogout, logoutLoading}: Props) => {
    if (!user) {
      return <AuthButtons variant="ghost" size="sm" />;
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <User className="h-5 w-5" />
            <span className="sr-only">User menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">{user.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem 
                onSelect={(e) => e.preventDefault()}
                className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sign Out Confirmation</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to sign out? You&apos;ll need to sign in again to access your account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {logoutLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Signing Out...
                    </>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </>
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

export default UserProfileDropdown;