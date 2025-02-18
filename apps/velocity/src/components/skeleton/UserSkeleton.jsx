import { Skeleton } from "@/components/ui/skeleton";

export const UserSkeleton = () => {
  return (
    <div className="w-full h-full py-12 flex flex-col justify-center ">
      <div className="w-full h-full">
        <div className="grid grid-cols-10 w-full rounded-t-xl h-1/2">
          <div className="flex flex-col justify-center col-span-4 p-2 space-y-2">
            <Skeleton className="h-full w-full rounded-none rounded-tl-xl  " />
          </div>
          <div className="col-span-3 text-slate-500 text-start p-2 space-y-2">
            <Skeleton className="h-full w-full rounded-none" />
          </div>
          <div className="relative flex col-span-3  text-center items-center justify-center p-2 ">
            <Skeleton className="h-full w-full rounded-none rounded-tr-lg" />
          </div>
        </div>
        <div className="w-full h-1/2 p-2 ">
          <Skeleton className="h-full w-full rounded-none rounded-b-xl " />
        </div>
      </div>
    </div>
  );
};
