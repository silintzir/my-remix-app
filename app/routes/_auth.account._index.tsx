import { useMe } from "@/components/hooks/useMe";
import { Link } from "@remix-run/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function Index() {
  const me = useMe();

  return (
    <div className="mx-auto max-w-lg">
      <Alert>
        <AlertTitle>Got lost?</AlertTitle>
        <AlertDescription>
          You are already logged in as <strong>{me.email}</strong>. dashboard.
        </AlertDescription>
        <br />
        <Button size="sm" asChild>
          <Link to="/account/dashboard">
            <Home className="w-4 h-4 mr-2" />
            <span>Back to dashboard</span>
          </Link>
        </Button>
      </Alert>
    </div>
  );
}
