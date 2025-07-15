import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function PasswordInput(
  props: React.ComponentProps<typeof Input>,
) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative w-full">
      <Input {...props} type={show ? "text" : "password"} className="pr-10" />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => setShow(!show)}
            className="absolute right-0 top-0 h-full"
          >
            {show ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{show ? "Hide" : "Show"} password</TooltipContent>
      </Tooltip>
    </div>
  );
}
