import { clx } from "@/lib/utils/clx/clx-merge";
import { cn } from "@/lib/utils/core/cn";
import {
  Bento6,
  CELLS_6,
  Cell,
  GRID_STYLES,
} from "@/components/ui/bento-grid-many";

export default function DemoBentoGrid6() {
  const DemoTitle = clx.p("text-xl font-bold");

  return (
    <div className="py-4 flex flex-col gap-6 w-full max-w-[800px]">
      <DemoTitle>Variant 1</DemoTitle>
      <Bento_6_v1 />
      <DemoTitle>Variant 2</DemoTitle>
      <Bento_6_v2 />
      <DemoTitle>Variant 3</DemoTitle>
      <Bento_6_v3 />
      <DemoTitle>Variant 4</DemoTitle>
      <Bento_6_v4 />
    </div>
  );
}

/*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
/*                     ✨ FUNCTIONS ✨                        */
/*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

// VARIANT 1
function Bento_6_v1() {
  return (
    <Bento6>
      {CELLS_6.map((n, i) => (
        <div
          key={n}
          className={cn(
            GRID_STYLES,
            i === 1 && "md:col-span-2 md:h-full md:row-span-2",
            i === 4 && "md:col-start-4",
            i === 5 && "md:col-span-4",
          )}
        >
          <Cell i={i + 1} />
        </div>
      ))}
    </Bento6>
  );
}

// VARIANT 2
function Bento_6_v2() {
  return (
    <Bento6>
      {CELLS_6.map((n, i) => (
        <div
          key={n}
          className={cn(
            GRID_STYLES,
            i === 0 && "row-span-2 h-full",
            i === 2 && "row-span-2 h-full",
          )}
        >
          <Cell i={i + 1} />
        </div>
      ))}
    </Bento6>
  );
}

// VARIANT 3
function Bento_6_v3() {
  return (
    <Bento6>
      {CELLS_6.map((n, i) => (
        <div
          key={n}
          className={cn(GRID_STYLES, i === 2 && "col-span-2", i === 3 && "col-span-2")}
        >
          <Cell i={i + 1} />
        </div>
      ))}
    </Bento6>
  );
}

// VARIANT 4
function Bento_6_v4() {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-6 gap-2">
      {CELLS_6.map((n, i) => (
        <div
          key={n}
          className={cn(
            GRID_STYLES,
            i < 2 && "md:col-span-3",
            i === 2 && "md:col-span-4",
            i === 3 && "md:col-span-2",
            i === 4 && "md:col-span-2",
            i === 5 && "md:col-span-4",
          )}
        >
          <Cell i={i + 1} />
        </div>
      ))}
    </div>
  );
}
