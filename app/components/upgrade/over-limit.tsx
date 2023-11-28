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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import logo from "@/images/flying_drone.svg";

export function OverResumeLimit() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="default">
          <PlusCircle className="w-4 h-4 mr-2" />
          Create new resume
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-lg w-full">
        <AlertDialogHeader>
          <AlertDialogTitle>You are over the resume limit</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="flex gap-8 items-center">
              <img src={logo} alt="Upgrade now" className="w-32" />
              <div>
                <p>
                  Only one resume is available on the free plan. Upgrade your
                  plan to create an unlimited number of resumes.
                </p>
                Also unlock:
                <ul>
                  <li>All templates</li>
                  <li>Unlimited cover letters</li>
                </ul>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Skip</AlertDialogCancel>
          <AlertDialogAction>Upgrade now</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
