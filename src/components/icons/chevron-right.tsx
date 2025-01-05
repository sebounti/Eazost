import { type IconProps, SvgIcon } from "@/components/icons/_iconShared";

export default function ChevronRight({ className, ...props }: IconProps) {
  return (
    <SvgIcon className={className} {...props}>
      <path d="m9 18 6-6-6-6" />
    </SvgIcon>
  );
}
