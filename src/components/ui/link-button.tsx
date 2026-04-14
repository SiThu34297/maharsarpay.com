import Link from "next/link";

import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";

type LinkButtonProps = Readonly<{
  href: string;
  label: string;
  external?: boolean;
}>;

export function LinkButton({ href, label, external }: LinkButtonProps) {
  return (
    <Button asChild variant="soft" size="3" className="justify-between">
      <Link
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {label}
        {external ? <ArrowTopRightIcon /> : null}
      </Link>
    </Button>
  );
}
